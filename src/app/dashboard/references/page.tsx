"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReferenceItem } from "@/components/dashboard/reference-item";
import type { ReferenceEntry } from "@/types";

export default function ReferencesPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [references, setReferences] = useState<ReferenceEntry[]>([]);

  async function handleAdd() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/extract-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ??
            "Couldn't extract that source. Try pasting the full citation.",
        );
        return;
      }

      setReferences((prev) => [
        {
          id: crypto.randomUUID(),
          thesisId: "current",
          authors: data.authors ?? [],
          year: data.year ?? null,
          title: data.title ?? "",
          source: data.source ?? null,
          url: data.url ?? null,
          apaInText: data.apaInText ?? "",
          apaReference: data.apaReference ?? "",
        },
        ...prev,
      ]);
      setInput("");
    } catch {
      setError("Something went wrong reaching the extractor. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-ink">References</h1>
        <p className="text-sm text-ink/50 mt-1">
          {references.length} sources &middot; paste a DOI, URL, or full
          citation
        </p>
      </div>

      <Card className="p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="https://doi.org/… or paste a citation"
            className="flex-1 px-3 py-2 rounded-[8px] border border-ink/15 bg-cardstock text-sm focus:outline-none focus:border-ink/40"
          />
          <Button variant="primary" onClick={handleAdd} disabled={loading}>
            <Plus size={15} />
            {loading ? "Adding…" : "Add source"}
          </Button>
        </div>
        {error && (
          <p className="text-xs text-correction bg-correction-light px-3 py-2 rounded-[8px] mt-3">
            {error}
          </p>
        )}
      </Card>

      {references.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-ink/40">
            No sources yet. Add your first one above.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {references.map((r) => (
            <ReferenceItem key={r.id} reference={r} />
          ))}
        </div>
      )}
    </div>
  );
}
