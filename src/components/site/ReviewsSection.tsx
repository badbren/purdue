"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Quote, Send, Star } from "lucide-react";
import { getCurrentUser, AUTH_EVENT, type Account } from "@/lib/auth";
import {
  averageRating,
  fetchReviews,
  postReview,
  type Review,
} from "@/lib/reviews";

const inputClass =
  "w-full rounded-lg border border-line bg-raised px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1 text-accent">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < rating ? "currentColor" : "none"}
          className={i < rating ? "" : "opacity-30"}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<Account | null>(null);
  const [writing, setWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [project, setProject] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetchReviews().then(setReviews);
    const sync = () => setUser(getCurrentUser());
    sync();
    window.addEventListener(AUTH_EVENT, sync);
    return () => window.removeEventListener(AUTH_EVENT, sync);
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user || !text.trim()) return;
    setSending(true);
    const saved = await postReview({
      userId: user.id,
      name: user.username,
      rating,
      text: text.trim(),
      project: project.trim(),
    });
    setSending(false);
    if (!saved) return;
    setReviews((prev) => [saved, ...prev]);
    setSent(true);
    setWriting(false);
    setText("");
    setProject("");
  }

  const avg = averageRating(reviews);

  return (
    <section id="reviews" className="scroll-mt-24 border-y border-line bg-surface/50">
      <div className="mx-auto max-w-7xl px-5 py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">
              Reviews
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-sora)] text-3xl font-bold tracking-tight md:text-5xl">
              Homeowners talk. We let them.
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <Stars rating={Math.round(avg)} size={18} />
              <p className="text-sm text-muted">
                <span className="font-[family-name:var(--font-sora)] text-lg font-bold text-foreground">
                  {avg.toFixed(1)}
                </span>{" "}
                from {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          {!writing && (
            <div>
              {user ? (
                <button onClick={() => setWriting(true)} className="btn-primary">
                  <Star size={17} /> Write a review
                </button>
              ) : (
                <div className="text-right">
                  <Link href="/register" className="btn-primary">
                    <Star size={17} /> Write a review
                  </Link>
                  <p className="mt-2 text-xs text-muted">
                    Free account, takes 30 seconds —{" "}
                    <Link href="/login" className="text-accent hover:underline">
                      or sign in
                    </Link>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {sent && (
          <div className="mb-8 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm fade-up">
            Thanks for the review — it&apos;s live below! 🎉
          </div>
        )}

        {writing && user && (
          <form onSubmit={submit} className="card mb-10 space-y-4 p-6 sm:p-8 fade-up">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-[family-name:var(--font-sora)] text-lg font-bold">
                Reviewing as <span className="text-accent">{user.username}</span>
              </p>
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
                    className="text-accent transition-transform hover:scale-110"
                  >
                    <Star
                      size={26}
                      fill={i < (hoverRating || rating) ? "currentColor" : "none"}
                      className={i < (hoverRating || rating) ? "" : "opacity-30"}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={4}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="How'd we do? What did we build for you?"
              className={inputClass}
            />
            <input
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="What was the project? e.g. Crown molding, living room (optional)"
              className={inputClass}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="btn-primary !px-6 !py-2.5 text-sm disabled:opacity-40"
              >
                {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                Post review
              </button>
              <button
                type="button"
                onClick={() => setWriting(false)}
                className="btn-ghost !px-6 !py-2.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <figure key={r.id} className="card flex flex-col p-7">
              <Quote size={22} className="text-accent" />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{r.text}&rdquo;
              </blockquote>
              <figcaption className="mt-6 border-t border-line pt-4">
                <Stars rating={r.rating} />
                {r.userId ? (
                  <Link
                    href={`/profile/${encodeURIComponent(r.name)}`}
                    className="mt-2 block text-sm font-semibold text-accent hover:underline"
                  >
                    {r.name}
                  </Link>
                ) : (
                  <p className="mt-2 text-sm font-semibold">{r.name}</p>
                )}
                {r.project && <p className="text-xs text-muted">{r.project}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
