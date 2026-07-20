// Quote-request system, backed by Supabase (quote_requests table +
// quote-photos storage bucket). localStorage is kept as an offline fallback.

import { supabase } from "./supabase";

export const MAX_PHOTOS = 20;

export interface QuotePhoto {
  id: string;
  name: string;
  /** data URL while composing; public storage URL once submitted */
  dataUrl: string;
}

export type QuoteStatus = "new" | "quoted" | "archived";

export interface QuoteRequest {
  id: string;
  userId?: string | null;
  service: string;
  description: string;
  area: string;
  size: string;
  timeline: string;
  budget: string;
  photos: QuotePhoto[];
  name: string;
  phone: string;
  email: string;
  contactPref: "call" | "text" | "email";
  status: QuoteStatus;
  createdAt: string;
  reply?: {
    amount: string;
    message: string;
    sentAt: string;
  };
}

const STORAGE_KEY = "perdue_quotes";

/* ---------------- Supabase-backed API ---------------- */

interface QuoteRow {
  id: string;
  user_key: string | null;
  service: string;
  description: string;
  area: string;
  size: string;
  timeline: string;
  budget: string;
  name: string;
  phone: string;
  email: string;
  contact_pref: string;
  photos: { id: string; name: string; url: string }[];
  status: QuoteStatus;
  reply: QuoteRequest["reply"] | null;
  created_at: string;
}

function rowToQuote(r: QuoteRow): QuoteRequest {
  return {
    id: r.id,
    userId: r.user_key,
    service: r.service,
    description: r.description,
    area: r.area ?? "",
    size: r.size ?? "",
    timeline: r.timeline ?? "",
    budget: r.budget ?? "",
    photos: (r.photos ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      dataUrl: p.url,
    })),
    name: r.name,
    phone: r.phone,
    email: r.email,
    contactPref: (r.contact_pref as QuoteRequest["contactPref"]) ?? "call",
    status: r.status,
    createdAt: r.created_at,
    reply: r.reply ?? undefined,
  };
}

/** Upload photos to storage + insert the request. Returns null on success, error message on failure. */
export async function submitQuote(quote: QuoteRequest): Promise<string | null> {
  try {
    const uploaded: { id: string; name: string; url: string }[] = [];
    for (const [i, photo] of quote.photos.entries()) {
      const blob = await fetch(photo.dataUrl).then((r) => r.blob());
      const path = `${quote.id}/${i + 1}.jpg`;
      const { error: upErr } = await supabase.storage
        .from("quote-photos")
        .upload(path, blob, { contentType: "image/jpeg", upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("quote-photos").getPublicUrl(path);
      uploaded.push({ id: photo.id, name: photo.name, url: data.publicUrl });
    }

    const { error } = await supabase.from("quote_requests").insert({
      id: quote.id,
      user_key: quote.userId ?? null,
      service: quote.service,
      description: quote.description,
      area: quote.area,
      size: quote.size,
      timeline: quote.timeline,
      budget: quote.budget,
      name: quote.name,
      phone: quote.phone,
      email: quote.email,
      contact_pref: quote.contactPref,
      photos: uploaded,
      status: "new",
    });
    if (error) throw error;
    return null;
  } catch (e) {
    console.error("submitQuote failed", e);
    // offline fallback so the request isn't lost
    addQuoteLocal(quote);
    return e instanceof Error ? e.message : "Something went wrong";
  }
}

export async function fetchQuotes(): Promise<QuoteRequest[]> {
  try {
    const { data, error } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as QuoteRow[]).map(rowToQuote);
  } catch (e) {
    console.error("fetchQuotes failed, using local fallback", e);
    return loadQuotesLocal();
  }
}

export async function updateQuoteRemote(
  id: string,
  patch: { status?: QuoteStatus; reply?: QuoteRequest["reply"] }
): Promise<boolean> {
  const { error } = await supabase
    .from("quote_requests")
    .update({
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.reply ? { reply: patch.reply } : {}),
    })
    .eq("id", id);
  if (error) console.error("updateQuote failed", error);
  return !error;
}

/* ---------------- localStorage fallback ---------------- */

export function loadQuotesLocal(): QuoteRequest[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addQuoteLocal(quote: QuoteRequest): boolean {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([quote, ...loadQuotesLocal()])
    );
    return true;
  } catch {
    return false;
  }
}

/* ---------------- helpers ---------------- */

/**
 * Downscale + JPEG-compress an image in the browser so uploads are fast
 * and 20 photos stay small.
 */
export function compressImage(
  file: File,
  maxDim = 1280,
  quality = 0.72
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas unsupported"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Couldn't read ${file.name}`));
    };
    img.src = url;
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
