import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_CHAPTERS = [
  "Introduction",
  "Review of Related Literature",
  "Methodology",
  "Results and Discussion",
  "Summary, Conclusions, Recommendations",
];

const DEFAULT_MILESTONES = [
  "Chapter 1 — Introduction",
  "Chapter 2 — RRL",
  "Chapter 3 — Methodology",
  "Chapter 4 — Results",
  "Chapter 5 — Conclusion",
  "Final defense",
];

export interface ThesisRow {
  id: string;
  user_id: string;
  title: string;
  university_template: string;
  created_at: string;
  updated_at: string;
}

async function seedDefaultChapters(supabase: SupabaseClient, thesisId: string) {
  const rows = DEFAULT_CHAPTERS.map((title, i) => ({
    thesis_id: thesisId,
    number: i + 1,
    title,
    status: "draft" as const,
    word_count: 0,
  }));
  await supabase.from("chapters").insert(rows);
}

async function seedDefaultMilestones(
  supabase: SupabaseClient,
  thesisId: string,
) {
  const rows = DEFAULT_MILESTONES.map((title) => ({
    thesis_id: thesisId,
    title,
    status: "upcoming" as const,
  }));
  await supabase.from("milestones").insert(rows);
}

export const getCurrentThesis = cache(async (): Promise<ThesisRow | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: existing } = await supabase
    .from("theses")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (existing) return existing as ThesisRow;

  const defaultTitle =
    (user.user_metadata?.thesis_title as string | undefined) ||
    "Untitled thesis";

  const { data: created, error } = await supabase
    .from("theses")
    .insert({ user_id: user.id, title: defaultTitle })
    .select("*")
    .single();

  if (error || !created) return null;

  await seedDefaultChapters(supabase, created.id);
  await seedDefaultMilestones(supabase, created.id);

  return created as ThesisRow;
});
