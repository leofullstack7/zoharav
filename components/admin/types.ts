export type BookingOutcome = "effective" | "not_realized";

export type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string | null;
  source: string;
  status: string;
  createdAt: string;
  outcome: BookingOutcome | null;
  summary: string | null;
  keyPoints: string | null;
  dealsConsolidated: string | null;
  dealValue: number | null;
  reviewedAt: string | null;
  slot: { id: string; startsAt: string; durationMinutes: number | null } | null;
};
