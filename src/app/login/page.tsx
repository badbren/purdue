"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { HardHat, Hammer, Loader2, LogIn, User } from "lucide-react";
import { login } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full rounded-lg border border-line bg-raised px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"customer" | "team">("customer");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamPin, setTeamPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const result = login(identifier, password);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.push("/account");
  }

  async function handleTeam(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: rpcError } = await supabase.rpc("team_login", {
      p_name: teamName,
      p_pin: teamPin,
    });
    setLoading(false);
    if (rpcError || !data?.ok) {
      setError(
        rpcError ? "Couldn't reach the server — try again." : "Wrong name or PIN."
      );
      return;
    }
    window.localStorage.setItem(
      "perdue_team",
      JSON.stringify({ name: data.name, role: data.role })
    );
    router.push("/dashboard");
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

        <div className="card p-8">
          {/* tabs */}
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl border border-line bg-raised p-1">
            <button
              onClick={() => {
                setTab("customer");
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === "customer" ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              <User size={15} /> Customer
            </button>
            <button
              onClick={() => {
                setTab("team");
                setError(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === "team" ? "bg-accent/15 text-accent" : "text-muted hover:text-foreground"
              }`}
            >
              <HardHat size={15} /> Team
            </button>
          </div>

          {tab === "customer" ? (
            <form onSubmit={handleCustomer} className="space-y-5">
              <div>
                <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold">
                  Welcome back
                </h1>
                <p className="mt-1 text-sm text-muted">Sign in to your account.</p>
              </div>
              <div>
                <label className={labelClass}>Username or email</label>
                <input
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Your username or email"
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
                  placeholder="••••••••"
                  className={inputClass}
                  autoComplete="current-password"
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
                {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <p className="text-center text-sm text-muted">
                No account yet?{" "}
                <Link href="/register" className="font-semibold text-accent hover:underline">
                  Create one in 30 seconds
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleTeam} className="space-y-5">
              <div>
                <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold">
                  Team login
                </h1>
                <p className="mt-1 text-sm text-muted">
                  Dashboard access for the Perdue crew.
                </p>
              </div>
              <div>
                <label className={labelClass}>Name</label>
                <input
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Your first name"
                  className={inputClass}
                  autoComplete="username"
                />
              </div>
              <div>
                <label className={labelClass}>PIN</label>
                <input
                  required
                  type="password"
                  inputMode="numeric"
                  value={teamPin}
                  onChange={(e) => setTeamPin(e.target.value)}
                  placeholder="••••"
                  className={inputClass}
                  autoComplete="current-password"
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
                {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
