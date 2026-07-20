"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import {
  Award,
  BadgeCheck,
  ClipboardList,
  LogOut,
  Mail,
  PartyPopper,
  Star,
  User,
} from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { getCurrentUser, logout, type Account } from "@/lib/auth";
import { loadReviews, type Review } from "@/lib/reviews";

function AccountContent() {
  const router = useRouter();
  const params = useSearchParams();
  const justRegistered = params.get("welcome") === "1";
  const [user, setUser] = useState<Account | null>(null);
  const [checked, setChecked] = useState(false);
  const [myReviews, setMyReviews] = useState<Review[]>([]);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setChecked(true);
    if (u) {
      setMyReviews(loadReviews().filter((r) => r.userId === u.id));
    }
  }, []);

  if (!checked) return null;

  if (!user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-5 pt-24">
        <div className="card max-w-md p-10 text-center">
          <p className="font-[family-name:var(--font-sora)] text-xl font-bold">
            You&apos;re not signed in
          </p>
          <p className="mt-2 text-sm text-muted">
            Sign in or create an account to see your loyalty points and reviews.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/login" className="btn-ghost !px-5 !py-2.5 text-sm">
              Sign in
            </Link>
            <Link href="/register" className="btn-primary !px-5 !py-2.5 text-sm">
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-5 pb-20 pt-28">
      {justRegistered && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 fade-up">
          <PartyPopper size={20} className="shrink-0 text-emerald-300" />
          <p className="text-sm">
            <span className="font-semibold">Welcome, {user.username}!</span>{" "}
            Your account is ready and verified — that was it. No email hoops.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent font-[family-name:var(--font-sora)] text-xl font-bold text-black">
            {user.username.slice(0, 2).toUpperCase()}
          </span>
          <div>
            <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold">
              {user.username}
            </h1>
            <p className="flex items-center gap-1.5 text-sm text-muted">
              <Mail size={13} /> {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="btn-ghost !px-5 !py-2.5 text-sm"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {/* loyalty points */}
        <div className="card relative overflow-hidden p-7">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,160,91,0.12),transparent_60%)]" />
          <div className="relative">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Award size={20} />
            </span>
            <p className="mt-5 font-[family-name:var(--font-sora)] text-4xl font-bold text-accent">
              {user.points.toLocaleString()}
            </p>
            <p className="mt-1 font-semibold">Loyalty points</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Earn points on every dollar you spend with us. Redemption perks
              are coming soon — your points are already stacking.
            </p>
          </div>
        </div>

        {/* quick actions */}
        <div className="card flex flex-col gap-3 p-7">
          <p className="font-[family-name:var(--font-sora)] font-bold">Quick actions</p>
          <Link
            href={`/profile/${encodeURIComponent(user.username)}`}
            className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/8 px-4 py-3.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/15"
          >
            <BadgeCheck size={17} /> View my profile & badges
          </Link>
          <Link
            href="/quote"
            className="flex items-center gap-3 rounded-xl border border-line bg-raised px-4 py-3.5 text-sm font-medium transition-colors hover:border-accent/40"
          >
            <ClipboardList size={17} className="text-accent" /> Start a new quote request
          </Link>
          <Link
            href="/#reviews"
            className="flex items-center gap-3 rounded-xl border border-line bg-raised px-4 py-3.5 text-sm font-medium transition-colors hover:border-accent/40"
          >
            <Star size={17} className="text-accent" /> Leave us a review
          </Link>
          <Link
            href="/#services"
            className="flex items-center gap-3 rounded-xl border border-line bg-raised px-4 py-3.5 text-sm font-medium transition-colors hover:border-accent/40"
          >
            <User size={17} className="text-accent" /> Browse our services
          </Link>
        </div>
      </div>

      {/* my reviews */}
      <div className="card mt-5 p-7">
        <p className="font-[family-name:var(--font-sora)] font-bold">Your reviews</p>
        {myReviews.length > 0 ? (
          <div className="mt-4 space-y-4">
            {myReviews.map((r) => (
              <div key={r.id} className="rounded-xl border border-line bg-raised p-4">
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-2 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted">
            You haven&apos;t left a review yet — once we finish your project,
            we&apos;d love to hear how it went.
          </p>
        )}
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={null}>
          <AccountContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
