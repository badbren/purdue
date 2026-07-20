"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  Hammer,
  ImagePlus,
  Loader2,
  PartyPopper,
  Ruler,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { SERVICES } from "@/lib/data";
import {
  MAX_PHOTOS,
  submitQuote,
  compressImage,
  type QuotePhoto,
} from "@/lib/quotes";
import { getCurrentUser } from "@/lib/auth";

const STEPS = ["Service", "Details", "Photos", "Contact", "Review"] as const;

const TIMELINES = [
  "As soon as possible",
  "Within 2 weeks",
  "Within a month",
  "Flexible",
];

const BUDGETS = [
  "Under $1,500",
  "$1,500 - $3,000",
  "$3,000 - $7,500",
  "$7,500+",
  "Not sure yet",
];

const inputClass =
  "w-full rounded-lg border border-line bg-raised px-4 py-3 text-sm text-foreground placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted";

export default function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [size, setSize] = useState("");
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [budget, setBudget] = useState(BUDGETS[BUDGETS.length - 1]);
  const [photos, setPhotos] = useState<QuotePhoto[]>([]);
  const [processing, setProcessing] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contactPref, setContactPref] = useState<"call" | "text" | "email">("call");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Signed-in customers get their contact info prefilled
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setName((n) => n || user.username);
      setEmail((e) => e || user.email);
    }
  }, []);

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      const images = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (images.length === 0) return;

      const room = MAX_PHOTOS - photos.length;
      if (room <= 0) {
        setError(`Max ${MAX_PHOTOS} photos — remove one to add another.`);
        return;
      }
      const batch = images.slice(0, room);
      if (images.length > room) {
        setError(
          `Only ${room} more photo${room === 1 ? "" : "s"} allowed (max ${MAX_PHOTOS}) — added the first ${batch.length}.`
        );
      }

      setProcessing(batch.length);
      const results: QuotePhoto[] = [];
      for (const file of batch) {
        try {
          const dataUrl = await compressImage(file);
          results.push({ id: crypto.randomUUID(), name: file.name, dataUrl });
        } catch {
          setError(`Couldn't read ${file.name} — skipped it.`);
        }
        setProcessing((p) => Math.max(0, p - 1));
      }
      setPhotos((prev) => [...prev, ...results].slice(0, MAX_PHOTOS));
    },
    [photos.length]
  );

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setError(null);
  }

  const canNext =
    (step === 0 && service !== "") ||
    (step === 1 && description.trim() !== "") ||
    step === 2 ||
    (step === 3 && name.trim() !== "" && phone.trim() !== "" && email.trim() !== "") ||
    step === 4;

  async function submit() {
    setSubmitting(true);
    setError(null);
    const err = await submitQuote({
      id: crypto.randomUUID(),
      userId: getCurrentUser()?.id ?? null,
      service,
      description,
      area,
      size,
      timeline,
      budget,
      photos,
      name,
      phone,
      email,
      contactPref,
      status: "new",
      createdAt: new Date().toISOString(),
    });
    setSubmitting(false);
    if (err) {
      setError(
        "Couldn't reach the server — your request was saved on this device. Check your connection and try again."
      );
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="grain relative flex min-h-screen items-center justify-center overflow-hidden px-5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,160,91,0.12),transparent_55%)]" />
        <div className="card relative w-full max-w-lg p-10 text-center fade-up">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
            <PartyPopper size={30} />
          </span>
          <h1 className="mt-6 font-[family-name:var(--font-sora)] text-2xl font-bold">
            Quote request sent!
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Ricky just got your request{photos.length > 0 && ` with ${photos.length} photo${photos.length === 1 ? "" : "s"}`}.
            We&apos;ll get back to you by {contactPref} within one business day —
            often with a price, no site visit needed.
          </p>
          <Link href="/" className="btn-primary mt-8 justify-center">
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="grain relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(217,160,91,0.10),transparent_55%)]" />
      <div className="relative mx-auto max-w-3xl px-5 pb-20 pt-10">
        {/* header */}
        <div className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent">
              <Hammer size={18} />
            </span>
            <span className="font-[family-name:var(--font-sora)] font-bold">
              Perdue <span className="text-accent">Construction</span>
            </span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
            <X size={16} /> Exit
          </Link>
        </div>

        {/* progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i < step
                        ? "bg-accent text-black"
                        : i === step
                          ? "border-2 border-accent text-accent"
                          : "border border-line text-muted"
                    }`}
                  >
                    {i < step ? <CheckCircle2 size={16} /> : i + 1}
                  </span>
                  <span
                    className={`hidden text-[11px] font-medium sm:block ${
                      i === step ? "text-accent" : "text-muted"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-px flex-1 sm:-mt-5 ${
                      i < step ? "bg-accent" : "bg-line"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 sm:p-10 fade-up" key={step}>
          {/* STEP 0 — service */}
          {step === 0 && (
            <div>
              <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold sm:text-3xl">
                What are we building for you?
              </h1>
              <p className="mt-2 text-sm text-muted">
                Pick the closest match — you can explain more in a second.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[...SERVICES.map((s) => s.title), "Something else"].map((title) => (
                  <button
                    key={title}
                    onClick={() => setService(title)}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm font-semibold transition-all ${
                      service === title
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-line bg-raised hover:border-accent/40"
                    }`}
                  >
                    <Ruler size={17} className={service === title ? "" : "text-muted"} />
                    {title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1 — details */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold sm:text-3xl">
                  Tell us about the project
                </h1>
                <p className="mt-2 text-sm text-muted">
                  The more detail, the better the price we can give without a visit.
                </p>
              </div>
              <div>
                <label className={labelClass}>What do you want done? *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Replace the trim around my fireplace — it's dated 90s oak and I want a clean modern white surround with a stained mantel..."
                  className={inputClass}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Which room(s)?</label>
                  <input
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Living room fireplace"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Rough size (if you know)</label>
                  <input
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="6ft wide, floor to ceiling"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>When do you want it done?</label>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeline(t)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        timeline === t
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-line text-muted hover:border-accent/40"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Ballpark budget (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                        budget === b
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-line text-muted hover:border-accent/40"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — photos */}
          {step === 2 && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold sm:text-3xl">
                    Show us the space
                  </h1>
                  <p className="mt-2 text-sm text-muted">
                    Photos help us quote without a site visit. A few angles of
                    the area, plus one from across the room, is perfect.
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${
                    photos.length >= MAX_PHOTOS
                      ? "border-red-400/30 bg-red-400/10 text-red-300"
                      : "border-accent/30 bg-accent/10 text-accent"
                  }`}
                >
                  {photos.length}/{MAX_PHOTOS}
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) addFiles(e.target.files);
                  e.target.value = "";
                }}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  addFiles(e.dataTransfer.files);
                }}
                disabled={photos.length >= MAX_PHOTOS}
                className={`mt-6 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  dragOver
                    ? "border-accent bg-accent/10"
                    : "border-line bg-raised hover:border-accent/50"
                }`}
              >
                <span className="flex h-13 w-13 items-center justify-center rounded-full bg-accent/12 p-3 text-accent">
                  {processing > 0 ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <ImagePlus size={24} />
                  )}
                </span>
                <span className="text-sm font-semibold">
                  {processing > 0
                    ? `Adding ${processing} photo${processing === 1 ? "" : "s"}...`
                    : "Tap to add photos or drag them here"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <Camera size={13} /> Phone camera photos work great
                </span>
              </button>

              {error && (
                <p className="mt-3 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
                  {error}
                </p>
              )}

              {photos.length > 0 && (
                <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {photos.map((p) => (
                    <div
                      key={p.id}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-line"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.dataUrl}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => removePhoto(p.id)}
                        aria-label={`Remove ${p.name}`}
                        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white opacity-90 backdrop-blur transition-colors hover:bg-red-500"
                      >
                        <Trash2 size={13} />
                      </button>
                      <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-4 text-[10px] text-white/90">
                        {p.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-5 text-center text-xs text-muted">
                No photos handy? No problem — you can skip this step.
              </p>
            </div>
          )}

          {/* STEP 3 — contact */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold sm:text-3xl">
                  How do we reach you?
                </h1>
                <p className="mt-2 text-sm text-muted">
                  We&apos;ll only use this to talk about your project. No spam, ever.
                </p>
              </div>
              <div>
                <label className={labelClass}>Name *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Best way to reach you</label>
                <div className="flex gap-2">
                  {(["call", "text", "email"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setContactPref(c)}
                      className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                        contactPref === c
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-line bg-raised text-muted hover:border-accent/40"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 — review */}
          {step === 4 && (
            <div>
              <h1 className="font-[family-name:var(--font-sora)] text-2xl font-bold sm:text-3xl">
                Look good?
              </h1>
              <p className="mt-2 text-sm text-muted">
                This goes straight to Ricky&apos;s dashboard.
              </p>
              <dl className="mt-7 space-y-4 text-sm">
                {[
                  ["Service", service],
                  ["Project", description],
                  ["Room(s)", area || "—"],
                  ["Size", size || "—"],
                  ["Timeline", timeline],
                  ["Budget", budget],
                  ["Contact", `${name} · ${phone} · ${email} (prefers ${contactPref})`],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-line bg-raised p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                      {k}
                    </dt>
                    <dd className="mt-1 leading-relaxed">{v}</dd>
                  </div>
                ))}
                <div className="rounded-xl border border-line bg-raised p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Photos ({photos.length})
                  </dt>
                  {photos.length > 0 ? (
                    <dd className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-8">
                      {photos.map((p) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={p.id}
                          src={p.dataUrl}
                          alt={p.name}
                          className="aspect-square rounded-lg border border-line object-cover"
                        />
                      ))}
                    </dd>
                  ) : (
                    <dd className="mt-1 text-muted">None attached</dd>
                  )}
                </div>
              </dl>
              {error && (
                <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
                  {error}
                </p>
              )}
            </div>
          )}

          {/* nav buttons */}
          <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="btn-ghost !px-5 !py-2.5 text-sm disabled:invisible"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => canNext && setStep((s) => s + 1)}
                disabled={!canNext}
                className="btn-primary !px-6 !py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step === 2 && photos.length === 0 ? "Skip for now" : "Next"}
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                className="btn-primary !px-6 !py-2.5 text-sm disabled:opacity-70"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
                {submitting ? "Sending..." : "Send to Ricky"}
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          Free, no pressure — we&apos;ll get back to you within one business day.
        </p>
      </div>
    </main>
  );
}
