"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Check, ThumbsDown, ThumbsUp } from "lucide-react";
import { joinWaitlist, submitFeedback } from "@/lib/supabase";

type SendState = "idle" | "sending" | "sent" | "error";

export function FeedbackPanel({ analysisId }: { analysisId: string }) {
  return (
    <div className="mt-12 grid gap-10 border-t border-line pt-10 lg:grid-cols-2 lg:gap-16">
      <Feedback analysisId={analysisId} />
      <Waitlist />
    </div>
  );
}

function Feedback({ analysisId }: { analysisId: string }) {
  const commentId = useId();
  const [helpful, setHelpful] = useState<boolean | null>(null);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<SendState>("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (helpful === null) return;
    setState("sending");
    try {
      await submitFeedback({ analysisId, helpful, comment });
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <section aria-labelledby={`${commentId}-title`}>
      <h2 id={`${commentId}-title`} className="text-[19px] font-semibold">
        Kas see aitas?
      </h2>

      {state === "sent" ? (
        <p className="mt-3 flex items-center gap-2 text-ink-muted">
          <Check aria-hidden className="size-4 text-good" strokeWidth={2.5} />
          Aitäh, tagasiside on saadetud.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div role="group" aria-label="Hinnang" className="mt-4 flex gap-2">
            <VoteButton
              label="Jah"
              icon={<ThumbsUp aria-hidden className="size-4" />}
              pressed={helpful === true}
              onClick={() => setHelpful(true)}
            />
            <VoteButton
              label="Ei"
              icon={<ThumbsDown aria-hidden className="size-4" />}
              pressed={helpful === false}
              onClick={() => setHelpful(false)}
            />
          </div>

          {/* Comment is offered only after a vote, so a single row is inserted. */}
          {helpful !== null && (
            <div className="mt-5">
              <label htmlFor={commentId} className="text-sm font-medium">
                {helpful ? "Mis oli kõige kasulikum?" : "Mis oleks võinud parem olla?"}{" "}
                <span className="font-normal text-ink-subtle">(valikuline)</span>
              </label>
              <textarea
                id={commentId}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={3}
                maxLength={1000}
                className="field mt-2 w-full resize-y px-4 py-3 leading-relaxed"
              />
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="button-dark"
                >
                  {state === "sending" ? "Saadan…" : "Saada tagasiside"}
                </button>
                {state === "error" && (
                  <p role="alert" className="text-sm text-critical">
                    Saatmine ebaõnnestus. Proovi uuesti.
                  </p>
                )}
              </div>
            </div>
          )}
        </form>
      )}
    </section>
  );
}

interface VoteButtonProps {
  label: string;
  icon: ReactNode;
  pressed: boolean;
  onClick: () => void;
}

function VoteButton({ label, icon, pressed, onClick }: VoteButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="inline-flex h-11 items-center gap-2 rounded-[10px] border border-line px-4 text-[15px] font-medium transition-colors hover:border-line-strong aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
    >
      {icon}
      {label}
    </button>
  );
}

function Waitlist() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SendState>("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setState("sending");
    try {
      await joinWaitlist(email);
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <section aria-labelledby={`${emailId}-title`}>
      <h2 id={`${emailId}-title`} className="text-[19px] font-semibold">
        Tulekul: PDF-i üleslaadimine ja CV ümberkirjutamine
      </h2>
      <p className="mt-2 max-w-[52ch] leading-relaxed text-ink-muted">
        Jäta e-post ja anname teada, kui need on valmis. Muuks me seda ei kasuta.
      </p>

      {state === "sent" ? (
        <p className="mt-4 flex items-center gap-2 text-ink-muted">
          <Check aria-hidden className="size-4 text-good" strokeWidth={2.5} />
          Lisasime {email.trim()} nimekirja.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4">
          <label htmlFor={emailId} className="sr-only">
            E-posti aadress
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id={emailId}
              type="email"
              required
              autoComplete="email"
              placeholder="nimi@email.ee"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field h-11 min-w-0 flex-1 px-4"
            />
            <button
              type="submit"
              disabled={state === "sending"}
              className="button-dark"
            >
              {state === "sending" ? "Salvestan…" : "Teavita mind"}
            </button>
          </div>
          {state === "error" && (
            <p role="alert" className="mt-2 text-sm text-critical">
              Salvestamine ebaõnnestus. Proovi uuesti.
            </p>
          )}
        </form>
      )}
    </section>
  );
}
