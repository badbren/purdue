"use client";

import { useEffect, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Clock,
  DollarSign,
  Inbox,
  Mail,
  MessageSquareQuote,
  Phone,
  Send,
  X,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import {
  loadQuotes,
  timeAgo,
  updateQuote,
  type QuoteRequest,
} from "@/lib/quotes";

const inputClass =
  "w-full rounded-lg border border-line bg-raised px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

export default function QuotesInbox() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [replyAmount, setReplyAmount] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [justSent, setJustSent] = useState(false);

  useEffect(() => {
    const loaded = loadQuotes();
    setQuotes(loaded);
    if (loaded.length > 0) setSelectedId(loaded[0].id);
  }, []);

  const selected = quotes.find((q) => q.id === selectedId) ?? null;

  function selectQuote(id: string) {
    setSelectedId(id);
    setReplyAmount("");
    setReplyMessage("");
    setJustSent(false);
  }

  function sendReply() {
    if (!selected || !replyMessage.trim()) return;
    // TODO Supabase: insert reply + trigger email/SMS to customer
    const updated = updateQuote(selected.id, {
      status: "quoted",
      reply: {
        amount: replyAmount,
        message: replyMessage,
        sentAt: new Date().toISOString(),
      },
    });
    setQuotes(updated);
    setJustSent(true);
  }

  function archive(id: string) {
    setQuotes(updateQuote(id, { status: "archived" }));
  }

  const newCount = quotes.filter((q) => q.status === "new").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-sora)] text-3xl font-bold">
          Quote requests
        </h1>
        <p className="mt-1 text-sm text-muted">
          {newCount > 0
            ? `${newCount} new request${newCount === 1 ? "" : "s"} waiting on you.`
            : "All caught up."}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        {/* list */}
        <div className="card h-fit overflow-hidden xl:col-span-2">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <Inbox size={16} className="text-accent" />
            <h2 className="font-[family-name:var(--font-sora)] font-bold">Inbox</h2>
          </div>
          <div className="divide-y divide-line/50">
            {quotes.length === 0 && (
              <p className="px-5 py-8 text-center text-sm text-muted">
                No quote requests yet.
              </p>
            )}
            {quotes.map((q) => (
              <button
                key={q.id}
                onClick={() => selectQuote(q.id)}
                className={`block w-full px-5 py-4 text-left transition-colors ${
                  selectedId === q.id ? "bg-accent/8" : "hover:bg-raised/60"
                } ${q.status === "archived" ? "opacity-50" : ""}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{q.name}</p>
                  <StatusBadge status={q.status} />
                </div>
                <p className="mt-0.5 text-sm text-muted">{q.service}</p>
                <div className="mt-1.5 flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {timeAgo(q.createdAt)}
                  </span>
                  {q.photos.length > 0 && (
                    <span>
                      {q.photos.length} photo{q.photos.length === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* detail */}
        <div className="xl:col-span-3">
          {selected ? (
            <div className="card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-[family-name:var(--font-sora)] text-xl font-bold">
                    {selected.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted">
                    {selected.service} ·{" "}
                    {new Date(selected.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={selected.status} />
                  {selected.status !== "archived" && (
                    <button
                      onClick={() => archive(selected.id)}
                      title="Archive"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                    >
                      <Archive size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* contact row */}
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={`tel:${selected.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 rounded-lg border border-line bg-raised px-3.5 py-2 text-sm font-medium transition-colors hover:border-accent/40"
                >
                  <Phone size={14} className="text-accent" /> {selected.phone}
                </a>
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-2 rounded-lg border border-line bg-raised px-3.5 py-2 text-sm font-medium transition-colors hover:border-accent/40"
                >
                  <Mail size={14} className="text-accent" /> {selected.email}
                </a>
                <span className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3.5 py-2 text-sm font-medium text-accent">
                  Prefers {selected.contactPref}
                </span>
              </div>

              {/* details */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Room(s)", selected.area || "—"],
                  ["Size", selected.size || "—"],
                  ["Timeline", selected.timeline],
                  ["Budget", selected.budget],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-line bg-raised p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                      {k}
                    </p>
                    <p className="mt-0.5 text-sm font-medium">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-xl border border-line bg-raised p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Project description
                </p>
                <p className="mt-1.5 text-sm leading-relaxed">{selected.description}</p>
              </div>

              {/* photos */}
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  Photos ({selected.photos.length})
                </p>
                {selected.photos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
                    {selected.photos.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setLightbox(p.dataUrl)}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-line transition-all hover:border-accent/50"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.dataUrl}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
                    No photos attached — probably worth a site visit.
                  </p>
                )}
              </div>

              {/* reply */}
              <div className="mt-8 border-t border-line pt-6">
                <h3 className="flex items-center gap-2 font-[family-name:var(--font-sora)] font-bold">
                  <MessageSquareQuote size={17} className="text-accent" />
                  {selected.reply ? "Your quote" : "Send a quote"}
                </h3>
                {selected.reply && !justSent ? (
                  <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-[family-name:var(--font-sora)] text-xl font-bold text-emerald-300">
                        {selected.reply.amount || "No price given"}
                      </p>
                      <p className="text-xs text-muted">
                        Sent {timeAgo(selected.reply.sentAt)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                      {selected.reply.message}
                    </p>
                  </div>
                ) : justSent ? (
                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                    <CheckCircle2 size={20} className="text-emerald-300" />
                    <p className="text-sm">
                      Quote saved! Once Supabase is hooked up this will email/text{" "}
                      {selected.name.split(" ")[0]} automatically.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="relative w-40">
                        <DollarSign
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                        />
                        <input
                          value={replyAmount}
                          onChange={(e) => setReplyAmount(e.target.value)}
                          placeholder="2,400"
                          className={`${inputClass} !pl-9`}
                        />
                      </div>
                      <p className="self-center text-xs text-muted">
                        Leave blank if you need a site visit first
                      </p>
                    </div>
                    <textarea
                      rows={3}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder={`Thanks ${selected.name.split(" ")[0]} — based on your photos...`}
                      className={inputClass}
                    />
                    <button
                      onClick={sendReply}
                      disabled={!replyMessage.trim()}
                      className="btn-primary !px-5 !py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Send size={15} /> Send quote
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card flex min-h-64 items-center justify-center p-10 text-center">
              <p className="text-sm text-muted">
                Select a request from the inbox to view it.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt="Quote request photo"
            className="max-h-full max-w-full rounded-xl object-contain"
          />
        </div>
      )}
    </div>
  );
}
