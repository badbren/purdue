// Customer reviews, backed by the Supabase `reviews` table.
// Seed reviews below are shown until real ones exist (remove before launch).

import { supabase } from "./supabase";

export interface Review {
  id: string;
  userId: string | null;
  name: string;
  rating: number; // 1-5
  text: string;
  project: string;
  createdAt: string;
}

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

interface ReviewRow {
  id: string;
  user_key: string | null;
  name: string;
  rating: number;
  text: string;
  project: string;
  created_at: string;
}

function rowToReview(r: ReviewRow): Review {
  return {
    id: r.id,
    userId: r.user_key,
    name: r.name,
    rating: r.rating,
    text: r.text,
    project: r.project ?? "",
    createdAt: r.created_at,
  };
}

/** Real reviews from the DB, padded with seeds while there are few. */
export async function fetchReviews(): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const real = (data as ReviewRow[]).map(rowToReview);
    return real.length >= 3 ? real : [...real, ...SEED_REVIEWS];
  } catch (e) {
    console.error("fetchReviews failed", e);
    return SEED_REVIEWS;
  }
}

export async function postReview(
  review: Omit<Review, "id" | "createdAt">
): Promise<Review | null> {
  const row = {
    id: crypto.randomUUID(),
    user_key: review.userId,
    name: review.name,
    rating: review.rating,
    text: review.text,
    project: review.project,
  };
  const { error } = await supabase.from("reviews").insert(row);
  if (error) {
    console.error("postReview failed", error);
    return null;
  }
  return {
    ...review,
    id: row.id,
    createdAt: new Date().toISOString(),
  };
}

/** Synchronous seed accessor, used by pages that only need a quick list. */
export function loadReviews(): Review[] {
  return SEED_REVIEWS;
}

export function averageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}
