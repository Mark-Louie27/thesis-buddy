import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TableOfContents,
  AlignmentType,
} from "docx";

interface ChapterInput {
  number: number;
  title: string;
  content: string;
}

export async function POST(req: NextRequest) {
  const { thesisTitle, chapters } = (await req.json()) as {
    thesisTitle: string;
    chapters: ChapterInput[];
  };

  if (!thesisTitle || !Array.isArray(chapters)) {
    return NextResponse.json(
      { error: "Provide a thesisTitle and an array of chapters." },
      { status: 400 },
    );
  }

  const children: Paragraph[] = [
    new Paragraph({
      text: thesisTitle,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: "Table of Contents",
      heading: HeadingLevel.HEADING_1,
      pageBreakBefore: true,
    }),
  ];

  // TableOfContents auto-populates from Heading1/2 styles when opened in Word
  // (field codes require "update fields" — noted for the user).
  const tocParagraphs = [
    new TableOfContents("Table of Contents", {
      hyperlink: true,
      headingStyleRange: "1-3",
    }),
  ];

  const bodyParagraphs: Paragraph[] = [];
  for (const chapter of chapters) {
    bodyParagraphs.push(
      new Paragraph({
        text: `Chapter ${chapter.number}: ${chapter.title}`,
        heading: HeadingLevel.HEADING_1,
        pageBreakBefore: true,
        spacing: { after: 240 },
      }),
    );
    const paras = chapter.content
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map(
        (line) =>
          new Paragraph({
            text: line,
            spacing: { after: 200, line: 480 }, // double-spaced
          }),
      );
    bodyParagraphs.push(...paras);
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1800, right: 1440 }, // 1" / 1.25" left for binding
          },
        },
        children: [...children, ...tocParagraphs, ...bodyParagraphs],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${thesisTitle.replace(/\s+/g, "_")}.docx"`,
    },
  });
}
