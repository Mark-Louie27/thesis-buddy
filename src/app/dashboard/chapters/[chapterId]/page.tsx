"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { MarginNote } from "@/components/dashboard/margin-note";

const CHAPTERS: Record
  string,
  { number: number; title: string; status: "draft" | "review" | "revisions" | "approved"; wordCount: number }
> = {
  "1": { number: 1, title: "Introduction", status: "approved", wordCount: 2140 },
  "2": { number: 2, title: "Review of Related Literature", status: "revisions", wordCount: 5320 },
  "3": { number: 3, title: "Methodology", status: "review", wordCount: 3010 },
  "4": { number: 4, title: "Results and Discussion", status: "draft", wordCount: 640 },
  "5": { number: 5, title: "Summary, Conclusions, Recommendations", status: "draft", wordCount: 0 },
};

const INITIAL_NOTES = [
  { chapter: "From adviser", note: "Synthesize the last three sources instead of summarizing each separately.", date: "Jun 28" },
  { chapter: "From adviser", note: "The gap statement needs to tie back to your problem statement more directly.", date: "Jun 22" },
];

export default function ChapterDetailPage() {
  const params = useParams<{ chapterId: string }>();
  const chapter = CHAPTERS[params.chapterId] ?? CHAPTERS["1"];
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [draft, setDraft] = useState("");

  function addNote() {
    if (!draft.trim()) return;
    setNotes([
      { chapter: "Your note", note: draft.trim(), date: "Today" },
      ...notes,
    ]);
    setDraft("");
  }

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
            {chapter.wordCount.toLocaleString()} words
          </p>
        </div>
        <StatusBadge status={chapter.status} />
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        <Card className="p-6">
          <h2 className="text-sm font-medium text-ink/60 mb-3">Draft</h2>
          <div className="border border-dashed border-ink/15 rounded-[8px] p-8 text-center">
            <p className="text-sm text-ink/40">
              Connect your editor or paste your draft here to track word
              count and formatting automatically.
            </p>
          </div>
        </Card>

        <div>
          <h2 className="text-sm font-medium text-ink/60 mb-3">
            Feedback thread
          </h2>
          <Card className="p-4">
            <div className="flex gap-2 mb-4">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                placeholder="Add a note to yourself…"
                className="flex-1 px-3 py-2 rounded-[8px] border border-ink/15 bg-cardstock text-sm focus:outline-none focus:border-ink/40"
              />
              <Button variant="secondary" onClick={addNote} aria-label="Add note">
                <Send size={14} />
              </Button>
            </div>
            <div className="space-y-4">
              {notes.map((n, i) => (
                <MarginNote key={i} note={n} />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}