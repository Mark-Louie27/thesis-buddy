import { ChapterCard } from "@/components/dashboard/chapter-card";
import { MarginNote } from "@/components/dashboard/margin-note";
import { Card } from "@/components/ui/card";

const CHAPTERS = [
  { number: 1, title: "Introduction", status: "approved" as const, wordCount: 2140 },
  { number: 2, title: "Review of Related Literature", status: "revisions" as const, wordCount: 5320 },
  { number: 3, title: "Methodology", status: "review" as const, wordCount: 3010 },
  { number: 4, title: "Results and Discussion", status: "draft" as const, wordCount: 640 },
  { number: 5, title: "Summary, Conclusions, Recommendations", status: "draft" as const, wordCount: 0 },
];

const FEEDBACK = [
  {
    chapter: "Chapter 2",
    note: "Synthesize the last three sources instead of summarizing each separately.",
    date: "Jun 28",
  },
  {
    chapter: "Chapter 3",
    note: "Add a citation for the sampling method you're using.",
    date: "Jun 24",
  },
];

export default function DashboardOverview() {
  const totalWords = CHAPTERS.reduce((sum, c) => sum + c.wordCount, 0);
  const approved = CHAPTERS.filter((c) => c.status === "approved").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-ink">Overview</h1>
        <p className="text-sm text-ink/50 mt-1">
          {approved} of {CHAPTERS.length} chapters approved &middot;{" "}
          {totalWords.toLocaleString()} words so far
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Chapters approved</p>
          <p className="font-display text-2xl text-ink">
            {approved}/{CHAPTERS.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Open adviser notes</p>
          <p className="font-display text-2xl text-correction">
            {FEEDBACK.length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink/50 mb-1">Next deadline</p>
          <p className="font-display text-2xl text-ink">Jul 14</p>
        </Card>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <div>
          <h2 className="text-sm font-medium text-ink/60 mb-3">Chapters</h2>
          <div className="space-y-2">
            {CHAPTERS.map((c) => (
              <ChapterCard key={c.number} chapter={c} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-ink/60 mb-3">
            Adviser feedback
          </h2>
          <Card className="p-4 space-y-4">
            {FEEDBACK.map((note, i) => (
              <MarginNote key={i} note={note} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
