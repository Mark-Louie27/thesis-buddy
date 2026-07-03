import { NextRequest, NextResponse } from "next/server";
import { groq, DEFAULT_MODEL } from "@/lib/ai/groq";

const SYSTEM_PROMPT = `You extract bibliographic metadata from a source and return ONLY a JSON object, no preamble, no markdown fences, with these fields: authors (array of "Last, F. M." strings), year, title, source (journal/publisher/website), url, apaInText (e.g. "(Cruz, 2023)"), apaReference (full APA 7th reference list entry). If a field is unknown, use null.`;

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  if (!input || typeof input !== "string") {
    return NextResponse.json(
      { error: "Provide a DOI, URL, or pasted citation text." },
      { status: 400 }
    );
  }

  const completion = await groq.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: input },
    ],
    temperature: 0.2,
  });

  const raw = completion.choices[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Could not parse metadata. Try pasting the full citation instead." },
      { status: 422 }
    );
  }
}
