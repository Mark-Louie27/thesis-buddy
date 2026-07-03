import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { BookMarked, FileText, CalendarClock, Highlighter } from "lucide-react";

const FEATURES = [
  {
    icon: BookMarked,
    title: "APA 7th, done for you",
    body: "Drop in a DOI, URL, or PDF. Get a properly formatted in-text citation and reference list entry — no manual comma-counting.",
  },
  {
    icon: Highlighter,
    title: "RRL synthesis, not summary",
    body: "Upload your sources and get a first-draft synthesis grouped by theme, with citations attached. You edit; it saves the blank-page hours.",
  },
  {
    icon: CalendarClock,
    title: "Every deadline in one place",
    body: "Chapter milestones, adviser meetings, defense dates. Track what's approved, what needs revision, and what's due next.",
  },
  {
    icon: FileText,
    title: "Formatting that survives review",
    body: "Table of Contents, List of Tables, List of Figures — fixed to your university's template before your adviser ever sees it.",
  },
];

export default function LandingPage() {
  return (
    <main className="bg-paper text-ink min-h-screen">
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo size={26} wordmarkClassName="text-lg" />
        <p className="font-display text-lg">Thesis Buddy</p>
        <nav className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-ink/60 hover:text-ink">
            Log in
          </Link>
          <Link href="/signup">
            <Button variant="primary">Start free</Button>
          </Link>
        </nav>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20 text-center">
        <p className="font-mono text-xs text-correction mb-4 tracking-wide">
          Chapter 2, page 14 — &ldquo;synthesize, don&rsquo;t summarize&rdquo;
        </p>
        <h1 className="font-display text-5xl leading-tight text-ink mb-6">
          Your capstone,
          <br />
          <span className="highlight-active">actually organized.</span>
        </h1>
        <p className="text-ink/60 text-lg max-w-xl mx-auto mb-8">
          Reference management, RRL synthesis, and deadline tracking built
          around how Filipino thesis and capstone defenses actually work.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/signup">
            <Button variant="primary" className="px-6 py-3 text-base">
              Start your thesis workspace
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="secondary" className="px-6 py-3 text-base">
              See how it works
            </Button>
          </Link>
        </div>
      </section>

      <section id="features" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 gap-5">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-cardstock border border-ink/8 rounded-[10px] p-6"
            >
              <Icon
                size={20}
                strokeWidth={1.75}
                className="text-correction mb-4"
              />
              <h3 className="font-display text-lg mb-2">{title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink/8">
        <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-ink/40 font-mono">
          Thesis Buddy — built for PH capstone and thesis students
        </div>
      </footer>
    </main>
  );
}
