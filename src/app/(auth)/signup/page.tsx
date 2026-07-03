"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [thesisTitle, setThesisTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { thesis_title: thesisTitle } },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="p-7 text-center">
        <h1 className="font-display text-xl text-ink mb-2">Check your email</h1>
        <p className="text-sm text-ink/60">
          We sent a confirmation link to {email}. Click it to activate your
          workspace.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-7">
      <h1 className="font-display text-xl text-ink mb-1">
        Set up your workspace
      </h1>
      <p className="text-sm text-ink/50 mb-6">
        Free for chapter tracking and references. No credit card.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="text-xs text-ink/60 mb-1.5 block"
            htmlFor="thesisTitle"
          >
            Working thesis title
          </label>
          <input
            id="thesisTitle"
            type="text"
            required
            value={thesisTitle}
            onChange={(e) => setThesisTitle(e.target.value)}
            placeholder="e.g. Automated Class Scheduling System"
            className="w-full px-3 py-2 rounded-[8px] border border-ink/15 bg-cardstock text-sm focus:outline-none focus:border-ink/40"
          />
        </div>

        <div>
          <label className="text-xs text-ink/60 mb-1.5 block" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.edu.ph"
            className="w-full px-3 py-2 rounded-[8px] border border-ink/15 bg-cardstock text-sm focus:outline-none focus:border-ink/40"
          />
        </div>

        <div>
          <label
            className="text-xs text-ink/60 mb-1.5 block"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full px-3 py-2 rounded-[8px] border border-ink/15 bg-cardstock text-sm focus:outline-none focus:border-ink/40"
          />
        </div>

        {error && (
          <p className="text-xs text-correction bg-correction-light px-3 py-2 rounded-[8px]">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full justify-center py-2.5"
        >
          {loading ? "Creating workspace…" : "Create workspace"}
        </Button>
      </form>

      <p className="text-xs text-ink/50 text-center mt-5">
        Already have an account?{" "}
        <Link href="/login" className="text-ink underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
