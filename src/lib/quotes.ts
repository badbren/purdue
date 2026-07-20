// Quote-request system. Stored in localStorage for now so the full
// customer -> Ricky loop is demoable end-to-end. When Supabase is wired up:
// photos -> Supabase Storage, requests -> `quote_requests` table,
// replies -> `quote_replies` + email/SMS notification to the customer.

export const MAX_PHOTOS = 20;

export interface QuotePhoto {
  id: string;
  name: string;
  dataUrl: string;
}

export type QuoteStatus = "new" | "quoted" | "archived";

export interface QuoteRequest {
  id: string;
  /** account id if the customer was signed in when submitting */
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

// Demo rows shown until real requests come in.
const SEED_QUOTES: QuoteRequest[] = [
  {
    id: "seed-1",
    service: "Wainscoting & Accent Walls",
    description:
      "Looking to do board and batten on the long wall in the dining room, maybe 12ft wide, and a picture-frame molding accent in the office.",
    area: "Dining room + home office",
    size: "Two walls, ~200 sq ft total",
    timeline: "Within a month",
    budget: "$1,500 - $3,000",
    photos: [],
    name: "Kayla Simmons",
    phone: "(555) 762-0148",
    email: "kayla.simmons@email.com",
    contactPref: "text",
    status: "new",
    createdAt: "2026-07-18T14:32:00.000Z",
  },
  {
    id: "seed-2",
    service: "Crown Molding",
    description:
      "New build, builder-grade everything. Want crown in the primary bedroom, living room, and hallway. 9ft ceilings.",
    area: "Bedroom, living room, hallway",
    size: "~140 linear ft",
    timeline: "Flexible",
    budget: "Not sure yet",
    photos: [],
    name: "Marcus Webb",
    phone: "(555) 391-8827",
    email: "mwebb@email.com",
    contactPref: "call",
    status: "quoted",
    createdAt: "2026-07-15T09:10:00.000Z",
    reply: {
      amount: "$2,400",
      message:
        "Thanks Marcus — based on your photos, figure $2,400 for all three areas including material (5.25in primed MDF crown), caulked and ready for paint. Can start week after next.",
      sentAt: "2026-07-16T11:05:00.000Z",
    },
  },
];

export function loadQuotes(): QuoteRequest[] {
  if (typeof window === "undefined") return SEED_QUOTES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_QUOTES;
    return JSON.parse(raw) as QuoteRequest[];
  } catch {
    return SEED_QUOTES;
  }
}

function persist(quotes: QuoteRequest[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    return true;
  } catch {
    // Likely QuotaExceededError from photo data — caller shows a message.
    return false;
  }
}

export function addQuote(quote: QuoteRequest): boolean {
  const quotes = loadQuotes();
  return persist([quote, ...quotes]);
}

export function updateQuote(
  id: string,
  patch: Partial<QuoteRequest>
): QuoteRequest[] {
  const quotes = loadQuotes().map((q) => (q.id === id ? { ...q, ...patch } : q));
  persist(quotes);
  return quotes;
}

/**
 * Downscale + JPEG-compress an image in the browser so 20 photos stay
 * well under localStorage limits and uploads to Supabase later are fast.
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
