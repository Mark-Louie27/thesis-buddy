import Link from "next/link";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

const CHAPTERS = [
  {
    id: "1",
    number: 1,
    title: "Introduction",
    status: "approved" as const,
    wordCount: 2140,
    updatedAt: "Jun 30",
  },
  {
    id: "2",
    number: 2,
    title: "Review of Related Literature",
    status: "revisions" as const,
    wordCount: 5320,
    updatedAt: "Jun 28",
  },
  {
    id: "3",
    number: 3,
    title: "Methodology",
    status: "review" as const,
    wordCount: 3010,
    updatedAt: "Jun 24",
  },
  {
    id: "4",
    number: 4,
    title: "Results and Discussion",
    status: "draft" as const,
    wordCount: 640,
    updatedAt: "Jun 20",
  },
  {
    id: "5",
    number: 5,
    title: "Summary, Conclusions, Recommendations",
    status: "draft" as const,
    wordCount: 0,
    updatedAt: "—",
  },
];

export default function ChaptersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Chapters</h1>
        <p className="text-sm text-ink/50 mt-1">
          {CHAPTERS.length} chapters &middot; open one to see adviser notes and
          history
        </p>
      </div>

      <div className="space-y-2">
        {CHAPTERS.map((c) => (
          <Link key={c.id} href={`/dashboard/chapters/${c.id}`}>
            <Card className="p-5 flex items-center justify-between gap-4 hover:border-ink/20 transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl text-ink/25 w-8 text-right">
                  {c.number}
                </span>
                <div>
                  <p className="font-medium text-sm text-ink">{c.title}</p>
                  <p className="text-xs text-ink/45 font-mono mt-0.5">
                    {c.wordCount.toLocaleString()} words &middot; updated{" "}
                    {c.updatedAt}
                  </p>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
