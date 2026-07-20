"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Clock,
  DollarSign,
  Inbox,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/quotes", label: "Quote Requests", icon: Inbox },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard/finances", label: "Finances", icon: DollarSign },
  { href: "/dashboard/hours", label: "Employee Hours", icon: Clock },
];

export default function DashboardNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="glass sticky top-0 z-40 flex items-center gap-1 overflow-x-auto border-b border-line px-3 py-2">
        {LINKS.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              <l.icon size={16} />
              {l.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 pt-2">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              active
                ? "bg-accent/15 text-accent"
                : "text-muted hover:bg-raised hover:text-foreground"
            }`}
          >
            <l.icon size={18} />
            {l.label}
          </Link>
        );
      })}
      <Link
        href="/login"
        className="mt-auto mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-raised hover:text-foreground"
      >
        <LogOut size={18} />
        Sign out
      </Link>
    </nav>
  );
}
