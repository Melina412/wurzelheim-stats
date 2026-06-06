import raw from "./stats.json";
import type { Stats } from "@/domains/stats";

// Re-export the types so existing imports (`@/data/stats`) keep working.
export type {
  Monthly,
  EventEntry,
  EventType,
  Location,
  LoyaltyTier,
  Loyalty,
  Stats,
} from "@/domains/stats";

export const stats = raw as Stats;
