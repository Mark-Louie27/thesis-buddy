"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  BookMarked,
  CalendarClock,
  Settings,
  LogOut,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/chapters", label: "Chapters", icon: FileText },
  { href: "/dashboard/references", label: "References", icon: BookMarked },
  { href: "/dashboard/milestones", label: "Milestones", icon: CalendarClock },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ thesisTitle }: { thesisTitle?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-60 shrink-0 border-r border-ink/10 bg-cardstock min-h-screen py-8 px-4 flex flex-col">
      <div className="px-3 mb-10">
        <Logo size={22} wordmarkClassName="text-base" />
        <p className="text-xs text-ink/50 font-mono mt-1 ml-[34px] truncate">
          {thesisTitle ?? "Your thesis workspace"}
        </p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm transition-colors",
                active
                  ? "text-ink font-medium"
                  : "text-ink/55 hover:text-ink hover:bg-ink/5",
              )}
            >
              <Icon size={17} strokeWidth={1.75} />
              <span className={active ? "highlight-active" : ""}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm text-ink/50 hover:text-correction hover:bg-correction-light transition-colors"
      >
        <LogOut size={17} strokeWidth={1.75} />
        Sign out
      </button>
    </aside>
  );
}
