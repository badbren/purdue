// Customer reviews, localStorage-backed for the local demo.
// Becomes a Supabase `reviews` table later (row per review, FK to profiles).

export interface Review {
  id: string;
  userId: string | null;
  name: string;
  rating: number; // 1-5
  text: string;
  project: string;
  createdAt: string;
}

const STORAGE_KEY = "perdue_reviews";

const SEED_REVIEWS: Review[] = [
  {
    id: "rev-seed-1",
    userId: null,
    name: "Sarah M.",
    rating: 5,
    text: "The crown molding completely transformed our living room. Tight joints, clean caulk lines, and they left the place spotless. Couldn't recommend them more.",
    project: "Crown molding, whole first floor",
    createdAt: "2026-06-28T15:00:00.000Z",
  },
  {
    id: "rev-seed-2",
    userId: null,
    name: "James T.",
    rating: 5,
    text: "Ricky and his crew built us a wall of built-ins around the fireplace. It looks like it came with the house. Fair price, showed up when they said they would.",
    project: "Custom built-ins",
    createdAt: "2026-07-03T18:30:00.000Z",
  },
  {
    id: "rev-seed-3",
    userId: null,
    name: "Danielle R.",
    rating: 5,
    text: "We had board and batten done in the entryway and dining room. The attention to detail is unreal — every line is perfect. Already booked them for the bedrooms.",
    project: "Wainscoting & accent walls",
    createdAt: "2026-07-11T12:15:00.000Z",
  },
];

export function loadReviews(): Review[] {
  if (typeof window === "undefined") return SEED_REVIEWS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_REVIEWS;
    return JSON.parse(raw) as Review[];
  } catch {
    return SEED_REVIEWS;
  }
}

export function addReview(
  review: Omit<Review, "id" | "createdAt">
): Review[] {
  const reviews = [
    {
      ...review,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    },
    ...loadReviews(),
  ];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // storage full — review still shows this session
  }
  return reviews;
}

export function averageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}
