import raw from "./stats.json";
import type { Stats } from "@/lib/types";

// Re-export the types so existing imports (`@/data/stats`) keep working.
export type {
  Monthly,
  EventEntry,
  EventType,
  Location,
  LoyaltyTier,
  Loyalty,
  Stats,
} from "@/lib/types";

export const stats = raw as Stats;
