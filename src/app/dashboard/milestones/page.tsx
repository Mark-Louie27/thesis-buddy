"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { clsx } from "clsx";

type Status = "draft" | "review" | "revisions" | "approved";

type MilestoneItem = {
  id: string;
  title: string;
  dueDate: string;
  status: Status;
};

const COLUMNS: { key: Status; label: string }[] = [
  { key: "draft", label: "Draft" },
  { key: "review", label: "Adviser review" },
  { key: "revisions", label: "Revisions" },
  { key: "approved", label: "Approved" },
];

const INITIAL: MilestoneItem[] = [
  {
    id: "1",
    title: "Chapter 1 — Introduction",
    dueDate: "Done",
    status: "approved",
  },
  { id: "2", title: "Chapter 2 — RRL", dueDate: "Jul 6", status: "revisions" },
  {
    id: "3",
    title: "Chapter 3 — Methodology",
    dueDate: "Jul 14",
    status: "review",
  },
  { id: "4", title: "Chapter 4 — Results", dueDate: "Jul 28", status: "draft" },
  {
    id: "5",
    title: "Chapter 5 — Conclusion",
    dueDate: "Aug 4",
    status: "draft",
  },
  { id: "6", title: "Final defense", dueDate: "Aug 18", status: "draft" },
];

export default function MilestonesPage() {
  const [items, setItems] = useState(INITIAL);
  const [dragId, setDragId] = useState<string | null>(null);

  function moveTo(status: Status) {
    if (!dragId) return;
    setItems((prev) =>
      prev.map((i) => (i.id === dragId ? { ...i, status } : i)),
    );
    setDragId(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">Milestones</h1>
        <p className="text-sm text-ink/50 mt-1">
          Drag a card to update its status
        </p>
      </div>

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
                    <p className="text-sm text-ink font-medium">{item.title}</p>
                    <p
                      className={clsx(
                        "text-xs font-mono mt-1",
                        item.status === "approved"
                          ? "text-sage"
                          : "text-ink/45",
                      )}
                    >
                      {item.dueDate}
                    </p>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
