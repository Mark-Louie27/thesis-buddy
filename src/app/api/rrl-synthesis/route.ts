import { NextRequest, NextResponse } from "next/server";
import { groq, DEFAULT_MODEL } from "@/lib/ai/groq";

const SYSTEM_PROMPT = `You are a research assistant helping a thesis student draft their Review of Related Literature. Given a list of sources (each with a citation and abstract or summary), group them by shared theme or variable, then draft one synthesis paragraph per theme that discusses the sources together rather than one-by-one, with in-text APA 7th citations woven in.

This is a FIRST DRAFT for the student to revise in their own words — do not present it as final, and do not fabricate findings not present in the provided summaries.

Return ONLY a JSON object, no preamble, no markdown fences, with this shape:
{
  "themes": [
    { "theme": "string", "synthesis": "string with (Author, Year) citations inline", "sourcesUsed": ["Author, Year", ...] }
  ]
}`;

export async function POST(req: NextRequest) {
  const { sources } = await req.json();

  if (!Array.isArray(sources) || sources.length === 0) {
    return NextResponse.json(
      { error: "Provide at least one source with a citation and summary." },
      { status: 400 },
    );
  }

  const sourcesText = sources
    .map(
      (s: { citation: string; summary: string }, i: number) =>
        `Source ${i + 1}: ${s.citation}\nSummary: ${s.summary}`,
    )
    .join("\n\n");

  const completion = await groq.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: sourcesText },
    ],
    temperature: 0.4,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      {
        error:
          "Couldn't synthesize those sources. Try again with shorter summaries.",
      },
      { status: 422 },
    );
  }
}
