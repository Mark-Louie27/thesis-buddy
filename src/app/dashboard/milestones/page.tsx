"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";

type Status = "draft" | "review" | "revisions" | "approved";

interface MilestoneRow {
  id: string;
  title: string;
  due_date: string | null;
  status: Status;
}

const COLUMNS: { key: Status; label: string }[] = [
  { key: "draft", label: "Draft" },
  { key: "review", label: "Adviser review" },
  { key: "revisions", label: "Revisions" },
  { key: "approved", label: "Approved" },
];

function formatDue(dueDate: string | null, status: Status) {
  if (status === "approved") return "Done";
  if (!dueDate) return "No date";
  return new Date(dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function MilestonesPage() {
  const [thesisId, setThesisId] = useState<string | null>(null);
  const [items, setItems] = useState<MilestoneRow[]>([]);
  const [dragId, setDragId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: thesis } = await supabase
        .from("theses")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!thesis) {
        setLoading(false);
        return;
      }

      setThesisId(thesis.id);

      const { data: rows } = await supabase
        .from("milestones")
        .select("*")
        .eq("thesis_id", thesis.id)
        .order("created_at");

      setItems(rows ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function moveTo(status: Status) {
    if (!dragId) return;

    const prev = items;
    setItems((cur) => cur.map((i) => (i.id === dragId ? { ...i, status } : i)));
    setDragId(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("milestones")
      .update({ status })
      .eq("id", dragId);

    if (error) setItems(prev); // roll back on failure
  }

  if (!thesisId && !loading) {
    return (
      <p className="text-sm text-ink/40">Sign in to see your milestones.</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Milestones</h1>
        <p className="text-sm text-ink/50 mt-1">
          Drag a card to update its status
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-ink/40">Loading milestones…</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map((col) => (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => moveTo(col.key)}
              className="min-h-[200px]"
            >
              <p className="text-xs font-medium text-ink/50 mb-2 px-1">
                {col.label}
              </p>
              <div className="space-y-2">
                {items
                  .filter((i) => i.status === col.key)
                  .map((item) => (
                    <Card
                      key={item.id}
                      draggable
                      onDragStart={() => setDragId(item.id)}
                      className={clsx(
                        "p-3 cursor-grab active:cursor-grabbing",
                        dragId === item.id && "opacity-50",
                      )}
                    >
                      <p className="text-sm text-ink font-medium">
                        {item.title}
                      </p>
                      <p
                        className={clsx(
                          "text-xs font-mono mt-1",
                          item.status === "approved"
                            ? "text-sage"
                            : "text-ink/45",
                        )}
                      >
                        {formatDue(item.due_date, item.status)}
                      </p>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
