"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUnconfirmed(false);
    setResent(false);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      // Supabase returns this specific message when Confirm Email is
      // enabled and the account hasn't verified yet — sign-in silently
      // fails, which otherwise looks like the app "looping" on login.
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setUnconfirmed(true);
      } else {
        setError(error.message);
      }
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleResend() {
    if (!email || resending) return;
    setResending(true);
    setResent(false);

    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    setResending(false);

    if (!error) setResent(true);
    else setError(error.message);
  }

  return (
    <Card className="p-7">
      <h1 className="font-display text-xl text-ink mb-1">Welcome back</h1>
      <p className="text-sm text-ink/50 mb-6">
        Log in to your thesis workspace.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 rounded-[8px] border border-ink/15 bg-cardstock text-sm focus:outline-none focus:border-ink/40"
          />
        </div>

        {error && (
          <p className="text-xs text-correction bg-correction-light px-3 py-2 rounded-[8px]">
            {error}
          </p>
        )}

        {unconfirmed && (
          <div className="text-xs bg-correction-light px-3 py-2.5 rounded-[8px] space-y-2">
            <p className="text-correction">
              This email hasn&rsquo;t been confirmed yet. Check your inbox, or
              resend the link.
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-ink underline font-medium disabled:opacity-50"
            >
              {resending
                ? "Sending…"
                : resent
                  ? "Sent — check your inbox"
                  : "Resend confirmation email"}
            </button>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full justify-center py-2.5"
        >
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="text-xs text-ink/50 text-center mt-5">
        No account yet?{" "}
        <Link href="/signup" className="text-ink underline">
          Sign up
        </Link>
      </p>
    </Card>
  );
}
