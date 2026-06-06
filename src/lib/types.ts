// Shared types for the aggregation pipeline (used by the build script, the
// serverless function, and the frontend).

// --- Raw input (shape of the cmpf-tools API) — only the fields we use ---
export type RawMember = {
  id: string;
  rsvp_status: "ACCEPTED" | "CHECKED_IN" | "DECLINED" | "PENDING" | string;
};

export type RawEvent = {
  id: string;
  name: string;
  address?: string;
  time: string;
  members?: RawMember[];
  club?: { name?: string };
};

// --- Aggregated output ---
export type Monthly = {
  month: string;
  events: number;
  checkIns: number;
  rsvps: number;
  newParticipants: number;
  cumulativeParticipants: number;
};

export type EventEntry = {
  id: string;
  name: string;
  date: string;
  address: string;
  rsvps: number;
  checkIns: number;
  accepted: number;
  declined: number;
  type: string;
};

export type EventType = {
  type: string;
  count: number;
  checkIns: number;
  avgCheckIns: number;
};

export type Location = { address: string; count: number; checkIns: number };

export type LoyaltyTier = {
  label: string;
  range: string;
  casual: boolean;
  people: number;
};

export type Loyalty = {
  everCheckedIn: number;
  activeThreshold: number;
  activeMembers: number;
  medianActive: number;
  avgActive: number;
  tiers: LoyaltyTier[];
  elite: { atLeast50: number; atLeast100: number; atLeast150: number };
};

export type ColorScheme = "green" | "blue" | "red" | "amber" | "purple";

// What we store per club in Redis (anonymous — stats contain no usernames).
export type ClubRecord = {
  displayName: string;
  colorScheme: ColorScheme;
  stats: Stats;
  generatedAt: string; // ISO timestamp of last aggregation
};

export type Stats = {
  generatedFrom: string;
  dataAsOf: string;
  club: { name: string };
  totals: {
    events: number;
    uniqueParticipants: number;
    totalRsvps: number;
    totalCheckIns: number;
    totalAccepted: number;
    totalDeclined: number;
    avgCheckInsPerEvent: number;
    checkInRate: number;
    firstEventDate: string;
    lastEventDate: string;
    biggestEvent: EventEntry;
    firstEvent: EventEntry;
  };
  monthly: Monthly[];
  topEvents: EventEntry[];
  eventTypes: EventType[];
  loyalty: Loyalty;
  topLocations: Location[];
};
