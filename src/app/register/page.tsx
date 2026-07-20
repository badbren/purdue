"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Hammer, Loader2, Sparkles, UserPlus } from "lucide-react";
import { register } from "@/lib/auth";

const inputClass =
  "w-full rounded-lg border border-line bg-raised px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = register({ username, password, email, emailConfirm });
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    // Account created + verified + signed in, all in one shot.
    router.push("/account?welcome=1");
  }

  return (
    <main className="grain relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,160,91,0.12),transparent_55%)]" />
      <div className="relative w-full max-w-md fade-up">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Hammer size={20} />
          </span>
          <span className="font-[family-name:var(--font-sora)] text-xl font-bold">
            Perdue <span className="text-accent">Construction</span>
          </span>
        </Link>

        <form onSubmit={handleSubmit} className="card space-y-5 p-8">
          <div>
            <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-muted">
              Takes 30 seconds. No email verification, no hoops — you&apos;re in
              instantly.
            </p>
          </div>

          <div>
            <label className={labelClass}>Username</label>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Pick a username"
              className={inputClass}
              autoComplete="username"
            />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={inputClass}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className={inputClass}
              autoComplete="email"
            />
          </div>
          <div>
            <label className={labelClass}>Type your email again</label>
            <input
              required
              type="email"
              value={emailConfirm}
              onChange={(e) => setEmailConfirm(e.target.value)}
              placeholder="Same email, no typos"
              className={inputClass}
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            {loading ? "Creating account..." : "Create account & sign in"}
          </button>

          <div className="flex items-start gap-2.5 rounded-xl border border-accent/20 bg-accent/5 p-3.5">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-accent" />
            <p className="text-xs leading-relaxed text-muted">
              Members earn <span className="font-semibold text-accent">loyalty points</span> on
              every job — details coming soon.
            </p>
          </div>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
