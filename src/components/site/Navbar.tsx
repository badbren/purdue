"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Hammer, Menu, User, X } from "lucide-react";
import { AUTH_EVENT, getCurrentUser, type Account } from "@/lib/auth";

const LINKS = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Our Work" },
  { href: "/#process", label: "Process" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/quote", label: "Get a Quote" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<Account | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sync = () => setUser(getCurrentUser());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(AUTH_EVENT, sync);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "glass-solid shadow-lg shadow-black/30" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5">
        {/* Row 1 — big centered wordmark */}
        <div
          className={`relative flex items-center justify-center transition-all ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          <Link href="/" className="flex items-center gap-3">
            <span
              className={`flex items-center justify-center rounded-xl bg-accent/15 text-accent transition-all ${
                scrolled ? "h-9 w-9" : "h-11 w-11"
              }`}
            >
              <Hammer size={scrolled ? 18 : 22} />
            </span>
            <span
              className={`font-[family-name:var(--font-sora)] font-bold tracking-tight transition-all ${
                scrolled ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"
              }`}
            >
              Perdue <span className="text-accent">Construction</span>
            </span>
          </Link>

          {/* right-side actions (desktop) */}
          <div className="absolute right-0 hidden items-center gap-3 lg:flex">
            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 py-1.5 pl-2 pr-4 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-black">
                  {user.username.slice(0, 2).toUpperCase()}
                </span>
                {user.username}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                <User size={15} /> Sign in
              </Link>
            )}
            <Link href="/quote" className="btn-primary !px-5 !py-2.5 text-sm">
              Get a Quote
            </Link>
          </div>

          {/* mobile hamburger */}
          <button
            className="absolute right-0 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Row 2 — centered nav links */}
        <nav
          className={`hidden items-center justify-center gap-9 border-t border-line/60 transition-all lg:flex ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium uppercase tracking-widest text-muted transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* mobile dropdown */}
      {open && (
        <div className="glass border-t border-line px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium uppercase tracking-widest text-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-accent"
              >
                <User size={15} /> {user.username}&apos;s account
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
              >
                <User size={15} /> Sign in
              </Link>
            )}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="btn-primary w-fit !px-5 !py-2.5 text-sm"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
