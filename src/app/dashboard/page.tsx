"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [thesisId, setThesisId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [university, setUniversity] = useState("PRMSU");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
        .select("id, title, university_template")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (thesis) {
        setThesisId(thesis.id);
        setTitle(thesis.title);
        setUniversity(thesis.university_template);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!thesisId) return;
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("theses")
      .update({ title, university_template: university })
      .eq("id", thesisId);

    setSaving(false);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (loading) {
    return <p className="text-sm text-ink/40">Loading settings…</p>;
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="font-display text-2xl text-ink">Settings</h1>
        <p className="text-sm text-ink/50 mt-1">
          Thesis details used across formatting and exports
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-ink/60 mb-1.5 block" htmlFor="title">
              Thesis title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-[8px] border border-ink/15 bg-cardstock text-sm focus:outline-none focus:border-ink/40"
            />
          </div>

          <div>
            <label
              className="text-xs text-ink/60 mb-1.5 block"
              htmlFor="university"
            >
              University template
            </label>
            <select
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-3 py-2 rounded-[8px] border border-ink/15 bg-cardstock text-sm focus:outline-none focus:border-ink/40"
            >
              <option value="PRMSU">PRMSU</option>
              <option value="custom">Custom (upload template)</option>
            </select>
            <p className="text-xs text-ink/40 mt-1.5">
              Controls Table of Contents, List of Tables, and List of Figures
              formatting on export.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
            {saved && <span className="text-xs text-sage">Saved</span>}
          </div>
        </form>
      </Card>
    </div>
  );
}
