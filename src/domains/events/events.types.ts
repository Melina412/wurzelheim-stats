// Events domain — the raw input shape from the cmpf-tools API (only fields we use).

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
