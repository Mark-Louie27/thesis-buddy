"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReferenceItem } from "@/components/dashboard/reference-item";
import { createClient } from "@/lib/supabase/client";
import type { ReferenceEntry } from "@/types";

interface ReferenceRow {
  id: string;
  authors: string[];
  year: number | null;
  title: string;
  source: string | null;
  url: string | null;
  apa_in_text: string;
  apa_reference: string;
}

function toEntry(row: ReferenceRow, thesisId: string): ReferenceEntry {
  return {
    id: row.id,
    thesisId,
    authors: row.authors,
    year: row.year,
    title: row.title,
    source: row.source,
    url: row.url,
    apaInText: row.apa_in_text,
    apaReference: row.apa_reference,
  };
}

export default function ReferencesPage() {
  const [thesisId, setThesisId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [references, setReferences] = useState<ReferenceEntry[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setInitialLoading(false);
        return;
      }

      const { data: thesis } = await supabase
        .from("theses")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!thesis) {
        setInitialLoading(false);
        return;
      }

      setThesisId(thesis.id);

      const { data: rows } = await supabase
        .from("reference_entries")
        .select("*")
        .eq("thesis_id", thesis.id)
        .order("created_at", { ascending: false });

      setReferences((rows ?? []).map((r) => toEntry(r, thesis.id)));
      setInitialLoading(false);
    }
    load();
  }, []);

  async function handleAdd() {
    if (!input.trim() || !thesisId) return;
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

      const supabase = createClient();
      const { data: saved, error: insertError } = await supabase
        .from("reference_entries")
        .insert({
          thesis_id: thesisId,
          authors: data.authors ?? [],
          year: data.year ?? null,
          title: data.title ?? "",
          source: data.source ?? null,
          url: data.url ?? null,
          apa_in_text: data.apaInText ?? "",
          apa_reference: data.apaReference ?? "",
        })
        .select("*")
        .single();

      if (insertError || !saved) {
        setError("Extracted the citation but couldn't save it. Try again.");
        return;
      }

      setReferences((prev) => [toEntry(saved, thesisId), ...prev]);
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
          <Button
            variant="primary"
            onClick={handleAdd}
            disabled={loading || !thesisId}
          >
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

      {initialLoading ? (
        <p className="text-sm text-ink/40">Loading references…</p>
      ) : references.length === 0 ? (
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
