export type ChatRole = "user" | "assistant";

export type ChatRecommendation = {
  slug: string;
  name: string;
  reason: string;
};

export type ChatMessageVariant = "normal" | "gold";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  recommendation?: ChatRecommendation;
  /** "gold" = render with the gold-to-normal color-fade treatment (see the
   * post-"Ver más" choreography in OctanoChatPanel). Defaults to "normal". */
  variant?: ChatMessageVariant;
};

export type FollowUpState = {
  /** id of the chat message this Sí/No row is anchored under. */
  messageId: string;
  slug: string;
  name: string;
  resolved: boolean;
  /** Whether this follow-up was shown with the gold/animated treatment
   * (false when prefers-reduced-motion was active at trigger time). */
  animated: boolean;
};

export type BookingTopic = {
  slug: string;
  name: string;
};

export type AvailabilitySlot = {
  id: string;
  startsAt: string;
  durationMinutes: number;
};
