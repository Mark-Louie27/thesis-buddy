import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

type Chapter = {
  number: number;
  title: string;
  status: "draft" | "review" | "revisions" | "approved";
  wordCount: number;
};

export function ChapterCard({ chapter }: { chapter: Chapter }) {
  return (
    <Card className="p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <span className="font-display text-2xl text-ink/25 w-8 text-right">
          {chapter.number}
        </span>
        <div>
          <p className="font-medium text-sm text-ink">{chapter.title}</p>
          <p className="text-xs text-ink/45 font-mono mt-0.5">
            {chapter.wordCount.toLocaleString()} words
          </p>
        </div>
      </div>
      <StatusBadge status={chapter.status} />
    </Card>
  );
}
