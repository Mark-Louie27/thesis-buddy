import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentThesis } from "@/lib/data/theses";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

export default async function ChaptersPage() {
  const thesis = await getCurrentThesis();
  const supabase = await createClient();

  const { data: chapters } = await supabase
    .from("chapters")
    .select("*")
    .eq("thesis_id", thesis!.id)
    .order("number");

  const list = chapters ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Chapters</h1>
        <p className="text-sm text-ink/50 mt-1">
          {list.length} chapters &middot; open one to see adviser notes and
          history
        </p>
      </div>

      <div className="space-y-2">
        {list.map((c) => (
          <Link key={c.id} href={`/dashboard/chapters/${c.id}`}>
            <Card className="p-5 flex items-center justify-between gap-4 hover:border-ink/20 transition-colors">
              <div className="flex items-center gap-4">
                <span className="font-display text-2xl text-ink/25 w-8 text-right">
                  {c.number}
                </span>
                <div>
                  <p className="font-medium text-sm text-ink">{c.title}</p>
                  <p className="text-xs text-ink/45 font-mono mt-0.5">
                    {c.word_count.toLocaleString()} words &middot; updated{" "}
                    {new Date(c.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
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
