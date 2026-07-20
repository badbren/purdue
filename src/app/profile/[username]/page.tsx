"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  Camera,
  Check,
  ClipboardList,
  Crown,
  Lock,
  Pencil,
  Repeat,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import {
  AUTH_EVENT,
  getAccountByUsername,
  getCurrentUser,
  updateAccount,
  type Account,
} from "@/lib/auth";
import { getBadges, type Badge } from "@/lib/badges";
import { loadReviews, type Review } from "@/lib/reviews";

const BADGE_ICONS = {
  sparkles: Sparkles,
  clipboard: ClipboardList,
  camera: Camera,
  star: Star,
  trophy: Trophy,
  award: Award,
  crown: Crown,
  repeat: Repeat,
} as const;

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          className={i < Math.round(rating) ? "" : "opacity-30"}
        />
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username ?? "");

  const [profile, setProfile] = useState<Account | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isOwn, setIsOwn] = useState(false);
  const [checked, setChecked] = useState(false);

  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");

  useEffect(() => {
    const sync = () => {
      const acct = getAccountByUsername(username);
      setProfile(acct);
      setChecked(true);
      if (acct) {
        setBadges(getBadges(acct));
        setReviews(loadReviews().filter((r) => r.userId === acct.id));
        setIsOwn(getCurrentUser()?.id === acct.id);
        setBioDraft(acct.bio);
      }
    };
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    return () => window.removeEventListener(AUTH_EVENT, sync);
  }, [username]);

  function saveBio() {
    if (!profile) return;
    const updated = updateAccount(profile.id, { bio: bioDraft.trim() });
    if (updated) setProfile(updated);
    setEditingBio(false);
  }

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-20 pt-28">
        {!checked ? null : !profile ? (
          <div className="card mx-auto max-w-md p-10 text-center">
            <p className="font-[family-name:var(--font-sora)] text-xl font-bold">
              Profile not found
            </p>
            <p className="mt-2 text-sm text-muted">
              No customer goes by &ldquo;{username}&rdquo; around here.
            </p>
            <Link href="/" className="btn-primary mt-6 justify-center">
              Back to home
            </Link>
          </div>
        ) : (
          <>
            {/* header card */}
            <div className="card grain relative overflow-hidden p-8">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,160,91,0.14),transparent_55%)]" />
              <div className="relative flex flex-wrap items-start justify-between gap-6">
                <div className="flex items-center gap-5">
                  <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent font-[family-name:var(--font-sora)] text-2xl font-bold text-black shadow-lg shadow-accent/25">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold sm:text-3xl">
                        {profile.username}
                      </h1>
                      <BadgeCheck size={20} className="text-accent" />
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                      <CalendarDays size={13} /> Member since{" "}
                      {new Date(profile.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <RatingStars rating={profile.rating} />
                      <span className="text-sm font-semibold">
                        {profile.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted">customer rating</span>
                    </div>
                  </div>
                </div>
                {isOwn && (
                  <Link href="/account" className="btn-ghost !px-5 !py-2.5 text-sm">
                    Account settings
                  </Link>
                )}
              </div>

              {/* bio */}
              <div className="relative mt-6">
                {editingBio ? (
                  <div className="space-y-3">
                    <textarea
                      rows={3}
                      value={bioDraft}
                      onChange={(e) => setBioDraft(e.target.value)}
                      maxLength={280}
                      placeholder="Tell folks a little about yourself and your projects..."
                      className="w-full rounded-lg border border-line bg-raised px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent"
                    />
                    <div className="flex gap-2">
                      <button onClick={saveBio} className="btn-primary !px-4 !py-2 text-xs">
                        <Check size={13} /> Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingBio(false);
                          setBioDraft(profile.bio);
                        }}
                        className="btn-ghost !px-4 !py-2 text-xs"
                      >
                        <X size={13} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm leading-relaxed text-foreground/85">
                      {profile.bio ||
                        (isOwn
                          ? "No bio yet — tell folks a little about yourself."
                          : "This customer hasn't written a bio yet.")}
                    </p>
                    {isOwn && (
                      <button
                        onClick={() => setEditingBio(true)}
                        className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
                      >
                        <Pencil size={12} /> {profile.bio ? "Edit" : "Add bio"}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* stat strip */}
              <div className="relative mt-7 grid grid-cols-3 gap-3">
                {[
                  { k: profile.points.toLocaleString(), v: "Loyalty points" },
                  { k: String(earnedCount), v: "Badges earned" },
                  { k: String(reviews.length), v: "Reviews written" },
                ].map((s) => (
                  <div
                    key={s.v}
                    className="rounded-xl border border-line bg-raised/70 px-4 py-3 text-center"
                  >
                    <p className="font-[family-name:var(--font-sora)] text-xl font-bold text-accent">
                      {s.k}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* badges */}
            <div className="card mt-6 p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold">
                  Badges
                </h2>
                <span className="text-sm text-muted">
                  {earnedCount} of {badges.length} earned
                </span>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {badges.map((b) => {
                  const Icon = BADGE_ICONS[b.icon];
                  return (
                    <div
                      key={b.id}
                      title={b.earned ? b.description : `Locked — ${b.hint}`}
                      className={`flex flex-col items-center rounded-2xl border p-5 text-center transition-all ${
                        b.earned
                          ? "border-accent/30 bg-accent/8 hover:-translate-y-0.5"
                          : "border-line bg-raised/50 opacity-60"
                      }`}
                    >
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          b.earned
                            ? "bg-accent/15 text-accent shadow-md shadow-accent/10"
                            : "bg-raised text-muted"
                        }`}
                      >
                        {b.earned ? <Icon size={22} /> : <Lock size={18} />}
                      </span>
                      <p className="mt-3 text-sm font-bold">{b.name}</p>
                      <p className="mt-1 text-[11px] leading-snug text-muted">
                        {b.earned ? b.description : b.hint}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* reviews by this customer */}
            <div className="card mt-6 p-8">
              <h2 className="font-[family-name:var(--font-sora)] text-lg font-bold">
                Reviews by {profile.username}
              </h2>
              {reviews.length > 0 ? (
                <div className="mt-5 space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="rounded-xl border border-line bg-raised p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <RatingStars rating={r.rating} />
                        <p className="text-xs text-muted">
                          {new Date(r.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed">{r.text}</p>
                      {r.project && (
                        <p className="mt-2 text-xs text-muted">{r.project}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  No reviews yet{isOwn ? " — leave one after your project!" : "."}
                </p>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
