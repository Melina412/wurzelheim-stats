import raw from "./stats.json";

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

export type Stats = {
  dataAsOf: string;
  club: { name: string; avatarUrl: string };
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

export const stats = raw as Stats;
