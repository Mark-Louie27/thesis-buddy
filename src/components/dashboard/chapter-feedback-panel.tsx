"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarginNote } from "@/components/dashboard/margin-note";
import { createClient } from "@/lib/supabase/client";

interface FeedbackRow {
  id: string;
  note: string;
  created_at: string;
  resolved: boolean;
}

export function ChapterFeedbackPanel({
  chapterId,
  initialFeedback,
}: {
  chapterId: string;
  initialFeedback: FeedbackRow[];
}) {
  const [notes, setNotes] = useState(initialFeedback);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  async function addNote() {
    if (!draft.trim() || saving) return;
    setSaving(true);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("adviser_feedback")
      .insert({ chapter_id: chapterId, note: draft.trim() })
      .select("*")
      .single();

    setSaving(false);

    if (!error && data) {
      setNotes([data, ...notes]);
      setDraft("");
    }
  }

  return (
    <Card className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Add a note…"
          className="flex-1 px-3 py-2 rounded-[8px] border border-ink/15 bg-cardstock text-sm focus:outline-none focus:border-ink/40"
        />
        <Button
          variant="secondary"
          onClick={addNote}
          disabled={saving}
          aria-label="Add note"
        >
          <Send size={14} />
        </Button>
      </div>

      <div className="space-y-4">
        {notes.length === 0 ? (
          <p className="text-sm text-ink/40">No notes yet on this chapter.</p>
        ) : (
          notes.map((n) => (
            <MarginNote
              key={n.id}
              note={{
                chapter: "Note",
                note: n.note,
                date: new Date(n.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                }),
              }}
            />
          ))
        )}
      </div>
    </Card>
  );
}
