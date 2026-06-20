// Stats domain — the aggregated, anonymous output shape.

export type Monthly = {
  month: string;
  events: number;
  checkIns: number;
  rsvps: number;
  newParticipants: number;
  cumulativeParticipants: number;
};

// `type` is a stable i18n key (e.g. "raids", "communityDay") — translated in the UI.
export type EventTypeKey =
  | "communityDay"
  | "maxDynamax"
  | "raids"
  | "trade"
  | "spotlight"
  | "research"
  | "goFestTour"
  | "wildArea"
  | "other";

export type EventType = {
  type: EventTypeKey;
  count: number;
  checkIns: number;
  avgCheckIns: number;
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
  type: EventTypeKey;
};

export type Location = { address: string; count: number; checkIns: number };

// `key` is a stable i18n key (translated in the UI).
export type LoyaltyTierKey =
  | "intro"
  | "casual"
  | "regular"
  | "core"
  | "hardcore"
  | "legend";

export type LoyaltyTier = {
  key: LoyaltyTierKey;
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
