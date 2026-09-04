"use client";

import { Gauge, Pause, Play, Rewind } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useFormat, useTranslations } from "@/lib/i18n/client";
import {
  primeSpeechVoices,
  SpeechPlaybackEngine,
  type PlaybackPosition,
} from "@/lib/a11y/speech-playback";

const SPEEDS = [0.75, 1, 1.25, 1.5] as const;
const SKIP_SECONDS = 15;

type PlaybackState = "idle" | "playing" | "paused";

type Props = {
  text: string;
  title?: string;
  className?: string;
};

function AudioControlButton({
  onClick,
  label,
  pressed,
  variant = "secondary",
  disabled = false,
  children,
  className = "",
}: {
  onClick: () => void;
  label: string;
  pressed?: boolean;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      className={`creco-btn creco-btn-${variant} inline-flex min-h-11 w-full items-center justify-center gap-2 px-4 text-sm sm:w-auto sm:min-w-[9.5rem] disabled:cursor-not-allowed disabled:opacity-50 ${className}`.trim()}
    >
      {children}
    </button>
  );
}

export function AudioNarrationPlayer({ text, title, className = "" }: Props) {
  const t = useTranslations();
  const format = useFormat();
  const regionId = useId();
  const engineRef = useRef<SpeechPlaybackEngine | null>(null);
  const [supported, setSupported] = useState(true);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [speedIndex, setSpeedIndex] = useState(1);
  const [position, setPosition] = useState<PlaybackPosition>({ sentenceIndex: 0, charOffset: 0 });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    primeSpeechVoices();

    const engine = new SpeechPlaybackEngine();
    engine.setCallbacks({
      onStateChange: (state) => {
        setPlaybackState(state);
        if (state === "playing") setStatusMessage(t.a11y.audio.playing);
        if (state === "paused") setStatusMessage(t.a11y.audio.paused);
      },
      onComplete: () => setStatusMessage(t.a11y.audio.finished),
      onPositionChange: (nextPosition) => setPosition(nextPosition),
    });

    engineRef.current = engine;

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // Engine lifetime is tied to the component mount, not locale strings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    engineRef.current?.setText(text);
    setPosition({ sentenceIndex: 0, charOffset: 0 });
    setPlaybackState("idle");
  }, [text]);

  useEffect(() => {
    engineRef.current?.setRate(SPEEDS[speedIndex]);
  }, [speedIndex]);

  const togglePlay = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    if (engine.isPlaying()) {
      engine.pause();
      return;
    }

    if (engine.isPaused()) {
      engine.play();
      setStatusMessage(t.a11y.audio.resumed);
      return;
    }

    engine.play();
  }, [t.a11y.audio.resumed]);

  const skipBack = useCallback(() => {
    engineRef.current?.skipBack(SKIP_SECONDS);
    setStatusMessage(t.a11y.audio.skippedBack);
  }, [t.a11y.audio.skippedBack]);

  const cycleSpeed = useCallback(() => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    const nextSpeed = SPEEDS[nextIndex];
    setSpeedIndex(nextIndex);
    engineRef.current?.changeRate(nextSpeed);
    setStatusMessage(format(t.a11y.audio.speedChanged, { speed: String(nextSpeed) }));
  }, [format, speedIndex, t.a11y.audio.speedChanged]);

  if (!text.trim()) return null;

  const isPlaying = playbackState === "playing";
  const isPaused = playbackState === "paused";
  const playLabel = isPlaying
    ? t.a11y.audio.pause
    : isPaused
      ? t.a11y.audio.resume
      : t.a11y.audio.play;
  const currentSpeed = SPEEDS[speedIndex];
  const atStart = position.sentenceIndex === 0 && position.charOffset === 0 && !isPlaying && !isPaused;

  return (
    <section
      aria-labelledby={regionId}
      className={`creco-card border-l-4 border-l-creco-primary p-4 sm:p-5 ${className}`.trim()}
    >
      <h2 id={regionId} className="text-base font-bold text-creco-primary">
        {title ?? t.a11y.audio.title}
      </h2>
      <p className="mt-1 text-sm text-creco-muted">{t.a11y.audio.description}</p>

      {!supported ? (
        <p className="mt-3 text-sm text-creco-muted" role="status">
          {t.a11y.audio.unsupported}
        </p>
      ) : (
        <>
          <div
            className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3"
            role="toolbar"
            aria-label={t.a11y.audio.controlsLabel}
          >
            <AudioControlButton
              onClick={togglePlay}
              label={playLabel}
              pressed={isPlaying}
              variant="primary"
            >
              {isPlaying ? (
                <Pause className="size-4 shrink-0" aria-hidden />
              ) : (
                <Play className="size-4 shrink-0 fill-current" aria-hidden />
              )}
              <span>{playLabel}</span>
            </AudioControlButton>

            <AudioControlButton
              onClick={skipBack}
              label={t.a11y.audio.skipBackLabel}
              disabled={atStart}
            >
              <Rewind className="size-4 shrink-0" aria-hidden />
              <span>{t.a11y.audio.skipBack}</span>
            </AudioControlButton>

            <AudioControlButton
              onClick={cycleSpeed}
              label={format(t.a11y.audio.speedLabel, { speed: String(currentSpeed) })}
            >
              <Gauge className="size-4 shrink-0" aria-hidden />
              <span>
                {t.a11y.audio.speed}: {currentSpeed}×
              </span>
            </AudioControlButton>
          </div>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            {statusMessage}
          </p>
        </>
      )}
    </section>
  );
}
