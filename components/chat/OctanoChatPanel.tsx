"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { prefersReducedMotion } from "@/lib/motion";
import { followUpMessage, genericErrorText, greeting, t, uiText } from "./copy";
import type { BookingTopic, ChatMessage, ChatRecommendation, FollowUpState } from "./types";

/**
 * The booking modal is its own lazy chunk: it is only needed once someone
 * answers "Sí" to the post-navigation follow-up, which is itself already
 * gated behind the chat panel being open. Keeping it split here means
 * opening the chat (and even chatting for a while) never pulls the
 * calendar/booking-form code into the loaded bundle.
 */
const BookingModal = dynamic(() => import("./BookingModal").then((m) => m.BookingModal), {
  ssr: false,
});

let idCounter = 0;
function makeId(): string {
  idCounter += 1;
  return `octano-${Date.now()}-${idCounter}`;
}

export function OctanoChatPanel({ locale, onClose }: { locale: string; onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const es = locale === "es";

  const [botName, setBotName] = useState("Octano");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [pendingNav, setPendingNav] = useState<BookingTopic | null>(null);
  const [followUp, setFollowUp] = useState<FollowUpState | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingTopic, setBookingTopic] = useState<BookingTopic | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);
  const greeted = useRef(false);

  // Fetch the admin-configurable bot name once; an admin rename takes
  // effect on the next chat open without a code change.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/bot-settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data && typeof data.botName === "string" && data.botName.trim()) {
          setBotName(data.botName.trim());
        }
      })
      .catch(() => {
        /* Keep the "Octano" default on failure. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Greet once, after the bot name is known (or on first paint if the
  // fetch is slow — the greeting re-renders with the right name regardless
  // since it reads the live `botName` state at the time it runs).
  useEffect(() => {
    if (greeted.current) return;
    greeted.current = true;
    setMessages([{ id: makeId(), role: "assistant", content: greeting(locale, botName) }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, followUp]);

  // Post-navigation choreography: once the pending "Ver más" target has
  // actually been reached (pathname matches — including the case where the
  // visitor was already on that page), wait 3s (0s if reduced motion) and
  // inject the gold follow-up message + Sí/No row.
  useEffect(() => {
    if (!pendingNav) return;
    const targetPath = `/services/${pendingNav.slug}`;
    if (pathname !== targetPath) return;

    const { slug, name } = pendingNav;
    setPendingNav(null);

    const reduced = prefersReducedMotion();
    const delayMs = reduced ? 0 : 3000;

    const timer = window.setTimeout(() => {
      const messageId = makeId();
      setMessages((prev) => [
        ...prev,
        {
          id: messageId,
          role: "assistant",
          content: followUpMessage(locale, name),
          variant: reduced ? "normal" : "gold",
        },
      ]);
      setFollowUp({ messageId, slug, name, resolved: false, animated: !reduced });
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [pendingNav, pathname, locale]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = { id: makeId(), role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          locale,
          botName,
        }),
      });
      const data: { message?: string; recommendation?: ChatRecommendation } = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: makeId(),
          role: "assistant",
          content: typeof data.message === "string" ? data.message : genericErrorText(locale),
          recommendation: data.recommendation,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: makeId(), role: "assistant", content: genericErrorText(locale) },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSeeMore(slug: string, name: string) {
    setPendingNav({ slug, name });
    router.push(`/services/${slug}`);
  }

  function handleFollowUpAnswer(answer: "yes" | "no") {
    if (!followUp) return;
    const current = followUp;
    setFollowUp({ ...current, resolved: true });
    if (answer === "yes") {
      setBookingTopic({ slug: current.slug, name: current.name });
      setBookingOpen(true);
    }
  }

  return (
    <div className="octano-panel" role="dialog" aria-label={es ? "Octano, asistente" : "Octano, assistant"}>
      <header className="octano-head">
        <span className="octano-head-name">{botName}</span>
        <button type="button" className="octano-close" aria-label={t(uiText.close, locale)} onClick={onClose}>
          ×
        </button>
      </header>

      <div className="octano-messages" ref={listRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`octano-row octano-row--${msg.role}`}>
            <div
              className={`octano-bubble octano-bubble--${msg.role}${
                msg.variant === "gold" ? " octano-bubble--gold" : ""
              }`}
            >
              {msg.role === "assistant" ? <span className="octano-bubble-name">{botName}</span> : null}
              <p>{msg.content}</p>
              {msg.recommendation ? (
                <div className="octano-rec-card">
                  <p className="octano-rec-name">{msg.recommendation.name}</p>
                  {msg.recommendation.reason ? (
                    <p className="octano-rec-reason">{msg.recommendation.reason}</p>
                  ) : null}
                  <button
                    type="button"
                    className="octano-rec-btn"
                    onClick={() => handleSeeMore(msg.recommendation!.slug, msg.recommendation!.name)}
                  >
                    {t(uiText.seeMore, locale)}
                  </button>
                </div>
              ) : null}
            </div>
            {followUp && followUp.messageId === msg.id && !followUp.resolved ? (
              <div className="octano-yn-row">
                <button
                  type="button"
                  className={`octano-yn-btn octano-yn-btn--yes${
                    followUp.animated ? " octano-yn-btn--gold" : ""
                  }`}
                  onClick={() => handleFollowUpAnswer("yes")}
                >
                  {t(uiText.yes, locale)}
                </button>
                <button type="button" className="octano-yn-btn octano-yn-btn--no" onClick={() => handleFollowUpAnswer("no")}>
                  {t(uiText.no, locale)}
                </button>
              </div>
            ) : null}
          </div>
        ))}
        {sending ? (
          <div className="octano-row octano-row--assistant">
            <div className="octano-bubble octano-bubble--assistant octano-bubble--typing">
              <span className="octano-bubble-name">{botName}</span>
              <span className="octano-typing" aria-label={t(uiText.sending, locale)}>
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <form className="octano-input-row" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={t(uiText.inputPlaceholder, locale)}
          aria-label={t(uiText.inputPlaceholder, locale)}
          disabled={sending}
        />
        <button type="submit" disabled={sending || !input.trim()}>
          {sending ? t(uiText.sending, locale) : t(uiText.send, locale)}
        </button>
      </form>

      <div className="octano-quick-row">
        <Link href="/booking">{t(uiText.bookSession, locale)}</Link>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <Link href="/global-presence">{t(uiText.theOffices, locale)}</Link>
      </div>

      {bookingOpen && bookingTopic ? (
        <BookingModal locale={locale} topic={bookingTopic} onClose={() => setBookingOpen(false)} />
      ) : null}
    </div>
  );
}
