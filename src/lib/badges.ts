// Reward badges. Earned state is computed live from the user's activity,
// so there's nothing extra to store — when Supabase lands, this same logic
// runs over real rows (or becomes a DB view).

import type { Account } from "./auth";
import { fetchQuotes } from "./quotes";
import { fetchReviews } from "./reviews";

export interface Badge {
  id: string;
  name: string;
  description: string;
  /** lucide icon name, mapped in the UI */
  icon:
    | "sparkles"
    | "clipboard"
    | "camera"
    | "star"
    | "trophy"
    | "award"
    | "crown"
    | "repeat";
  earned: boolean;
  /** shown on locked badges */
  hint: string;
}

export async function getBadges(user: Account): Promise<Badge[]> {
  const [allQuotes, allReviews] = await Promise.all([
    fetchQuotes(),
    fetchReviews(),
  ]);
  const quotes = allQuotes.filter((q) => q.userId === user.id);
  const reviews = allReviews.filter((r) => r.userId === user.id);
  const photosSent = quotes.reduce((s, q) => s + q.photos.length, 0);

  return [
    {
      id: "new-member",
      name: "New Member",
      description: "Joined the Perdue Construction family.",
      icon: "sparkles",
      earned: true,
      hint: "Create an account",
    },
    {
      id: "first-quote",
      name: "First Quote",
      description: "Sent your first quote request.",
      icon: "clipboard",
      earned: quotes.length > 0,
      hint: "Request a quote",
    },
    {
      id: "shutterbug",
      name: "Shutterbug",
      description: "Attached 5+ photos to your quote requests.",
      icon: "camera",
      earned: photosSent >= 5,
      hint: "Add 5 photos to your quotes",
    },
    {
      id: "first-review",
      name: "First Review",
      description: "Left your first review.",
      icon: "star",
      earned: reviews.length > 0,
      hint: "Write a review",
    },
    {
      id: "local-legend",
      name: "Local Legend",
      description: "Left 3+ reviews. The neighborhood hears you.",
      icon: "trophy",
      earned: reviews.length >= 3,
      hint: "Write 3 reviews",
    },
    {
      id: "point-collector",
      name: "Point Collector",
      description: "Earned your first loyalty points.",
      icon: "award",
      earned: user.points > 0,
      hint: "Book your first job",
    },
    {
      id: "vip",
      name: "VIP",
      description: "Racked up 1,000+ loyalty points.",
      icon: "crown",
      earned: user.points >= 1000,
      hint: "Earn 1,000 points",
    },
    {
      id: "repeat-customer",
      name: "Repeat Customer",
      description: "Came back for a second project. Honored.",
      icon: "repeat",
      earned: false, // wired up when jobs are tracked in Supabase
      hint: "Book a second job",
    },
  ];
}
