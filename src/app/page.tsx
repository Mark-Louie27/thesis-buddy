import { createClient } from "@/lib/supabase/server";
import { getCurrentThesis } from "@/lib/data/theses";
import { ChapterCard } from "@/components/dashboard/chapter-card";
import { MarginNote } from "@/components/dashboard/margin-note";
import { Card } from "@/components/ui/card";

export default async function DashboardOverview() {
  const thesis = await getCurrentThesis();
  const supabase = await createClient();

  const { data: chapters } = await supabase
    .from("chapters")
    .select("*")
    .eq("thesis_id", thesis!.id)
    .order("number");

  const { data: feedback } = await supabase
    .from("adviser_feedback")
    .select("*, chapters(number, title)")
    .in(
      "chapter_id",
      (chapters ?? []).map((c) => c.id),
    )
    .eq("resolved", false)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: nextMilestone } = await supabase
    .from("milestones")
    .select("*")
    .eq("thesis_id", thesis!.id)
    .neq("status", "done")
    .order("due_date", { ascending: true })
    .limit(1)
    .maybeSingle();

  const list = chapters ?? [];
  const totalWords = list.reduce((sum, c) => sum + c.word_count, 0);
  const approved = list.filter((c) => c.status === "approved").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Overview</h1>
        <p className="text-sm text-ink/50 mt-1">
          {approved} of {list.length} chapters approved &middot;{" "}
          {totalWords.toLocaleString()} words so far
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Chapters approved</p>
          <p className="font-display text-2xl text-ink">
            {approved}/{list.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Open adviser notes</p>
          <p className="font-display text-2xl text-correction">
            {feedback?.length ?? 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Next deadline</p>
          <p className="font-display text-2xl text-ink">
            {nextMilestone?.due_date
              ? new Date(nextMilestone.due_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "—"}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div>
          <h2 className="text-sm font-medium text-ink/60 mb-3">Chapters</h2>
          <div className="space-y-2">
            {list.map((c) => (
              <ChapterCard
                key={c.id}
                chapter={{
                  number: c.number,
                  title: c.title,
                  status: c.status,
                  wordCount: c.word_count,
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-ink/60 mb-3">
            Adviser feedback
          </h2>
          <Card className="p-4 space-y-4">
            {feedback && feedback.length > 0 ? (
              feedback.map((f) => (
                <MarginNote
                  key={f.id}
                  note={{
                    chapter: `Chapter ${f.chapters?.number ?? "?"}`,
                    note: f.note,
                    date: new Date(f.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    }),
                  }}
                />
              ))
            ) : (
              <p className="text-sm text-ink/40">No open feedback yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
