import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ChapterFeedbackPanel } from "@/components/dashboard/chapter-feedback-panel";

export default async function ChapterDetailPage({
  params,
}: {
  params: Promise<{ chapterId: string }>;
}) {
  const { chapterId } = await params;
  const supabase = await createClient();

  const { data: chapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", chapterId)
    .maybeSingle();

  if (!chapter) notFound();

  const { data: feedback } = await supabase
    .from("adviser_feedback")
    .select("*")
    .eq("chapter_id", chapterId)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/chapters"
        className="inline-flex items-center gap-1.5 text-xs text-ink/50 hover:text-ink"
      >
        <ArrowLeft size={14} />
        All chapters
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs text-ink/40 mb-1">
            Chapter {chapter.number}
          </p>
          <h1 className="font-display text-2xl text-ink">{chapter.title}</h1>
          <p className="text-sm text-ink/50 mt-1">
            {chapter.word_count.toLocaleString()} words
          </p>
        </div>
        <StatusBadge status={chapter.status} />
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        <Card className="p-6">
          <h2 className="text-sm font-medium text-ink/60 mb-3">Draft</h2>
          <div className="border border-dashed border-ink/15 rounded-[8px] p-8 text-center">
            <p className="text-sm text-ink/40">
              Connect your editor or paste your draft here to track word count
              and formatting automatically.
            </p>
          </div>
        </Card>

        <div>
          <h2 className="text-sm font-medium text-ink/60 mb-3">
            Feedback thread
          </h2>
          <ChapterFeedbackPanel
            chapterId={chapter.id}
            initialFeedback={feedback ?? []}
          />
        </div>
      </div>
    </div>
  );
}
