"use client";

import { Gauge, Pause, Play, Rewind } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CloudNarration } from "@/lib/a11y/cloud-narration";
import { useCurrentLocale, useFormat, useTranslations } from "@/lib/i18n/client";
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
  const locale = useCurrentLocale();
  const regionId = useId();
  const engineRef = useRef<SpeechPlaybackEngine | null>(null);
  const cloudRef = useRef<CloudNarration | null>(null);
  const modeRef = useRef<"cloud" | "device">("cloud");
  const playRequestRef = useRef(0);
  const [preparing, setPreparing] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [speedIndex, setSpeedIndex] = useState(1);
  const [position, setPosition] = useState<PlaybackPosition>({ sentenceIndex: 0, charOffset: 0 });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const cloud = new CloudNarration();
    cloud.setLocale(locale === "sw" ? "sw" : "en");
    cloud.setCallbacks({
      onPreparing: setPreparing,
      onStateChange: (state) => {
        if (modeRef.current !== "cloud") return;
        setPlaybackState(state);
        if (state === "playing") setStatusMessage(t.a11y.audio.playing);
        if (state === "paused") setStatusMessage(t.a11y.audio.paused);
      },
      onComplete: () => {
        if (modeRef.current !== "cloud") return;
        setStatusMessage(t.a11y.audio.finished);
      },
      onError: () => {
        if (modeRef.current !== "cloud") return;
        setStatusMessage(t.a11y.audio.error);
      },
    });
    cloudRef.current = cloud;

    let engine: SpeechPlaybackEngine | null = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      primeSpeechVoices();
      engine = new SpeechPlaybackEngine();
      engine.setLang(locale === "sw" ? "sw-KE" : "en-KE");
      engine.setCallbacks({
        onStateChange: (state) => {
          if (modeRef.current !== "device") return;
          setPlaybackState(state);
          if (state === "playing") setStatusMessage(t.a11y.audio.playing);
          if (state === "paused") setStatusMessage(t.a11y.audio.paused);
        },
        onComplete: () => {
          if (modeRef.current !== "device") return;
          setStatusMessage(t.a11y.audio.finished);
        },
        onError: () => {
          if (modeRef.current !== "device") return;
          setStatusMessage(t.a11y.audio.error);
        },
        onPositionChange: (nextPosition) => {
          if (modeRef.current !== "device") return;
          setPosition(nextPosition);
        },
      });
      engineRef.current = engine;
    }

    return () => {
      cloud.destroy();
      engine?.destroy();
      cloudRef.current = null;
      engineRef.current = null;
    };
    // Engines live for the component mount. Locale and copy are applied below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    playRequestRef.current += 1;
    cloudRef.current?.setText(text);
    engineRef.current?.setText(text);
  }, [text]);

  useEffect(() => {
    const rate = SPEEDS[speedIndex];
    cloudRef.current?.setRate(rate);
    engineRef.current?.setRate(rate);
  }, [speedIndex]);

  useEffect(() => {
    cloudRef.current?.setLocale(locale === "sw" ? "sw" : "en");
    engineRef.current?.setLang(locale === "sw" ? "sw-KE" : "en-KE");
  }, [locale]);

  const playOnDevice = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return false;
    modeRef.current = "device";
    setPlaybackState("playing");
    engine.play();
    return true;
  }, []);

  const togglePlay = useCallback(() => {
    const cloud = cloudRef.current;
    const engine = engineRef.current;
    if (!cloud) return;

    if (preparing) {
      playRequestRef.current += 1;
      cloud.stop();
      setPreparing(false);
      setPlaybackState("idle");
      setStatusMessage("");
      return;
    }

    if (playbackState === "playing") {
      playRequestRef.current += 1;
      setPreparing(false);
      if (modeRef.current === "device") engine?.pause();
      else cloud.pause();
      setPlaybackState("paused");
      return;
    }

    if (playbackState === "paused") {
      if (modeRef.current === "device") {
        setPlaybackState("playing");
        engine?.play();
        setStatusMessage(t.a11y.audio.resumed);
        return;
      }
      void cloud.play().then((result) => {
        if (result === "ok") setStatusMessage(t.a11y.audio.resumed);
      });
      return;
    }

    if (modeRef.current === "device") {
      playOnDevice();
      return;
    }

    const request = ++playRequestRef.current;
    setPreparing(true);
    setStatusMessage(t.a11y.audio.preparing);
    void cloud.play().then((result) => {
      if (request !== playRequestRef.current) return;
      setPreparing(false);
      if (result === "ok") {
        modeRef.current = "cloud";
        return;
      }
      if (result === "cancelled") return;
      if (playOnDevice()) {
        setStatusMessage(t.a11y.audio.deviceFallback);
        return;
      }
      setPlaybackState("idle");
      setStatusMessage(t.a11y.audio.error);
    });
  }, [playOnDevice, playbackState, preparing, t.a11y.audio.deviceFallback, t.a11y.audio.error, t.a11y.audio.preparing, t.a11y.audio.resumed]);

  const skipBack = useCallback(() => {
    if (modeRef.current === "device") engineRef.current?.skipBack(SKIP_SECONDS);
    else cloudRef.current?.skipBack(SKIP_SECONDS);
    setStatusMessage(t.a11y.audio.skippedBack);
  }, [t.a11y.audio.skippedBack]);

  const cycleSpeed = useCallback(() => {
    const nextIndex = (speedIndex + 1) % SPEEDS.length;
    const nextSpeed = SPEEDS[nextIndex];
    setSpeedIndex(nextIndex);
    if (modeRef.current === "device") engineRef.current?.changeRate(nextSpeed);
    else cloudRef.current?.setRate(nextSpeed);
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

      <div
        className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3"
        role="toolbar"
        aria-label={t.a11y.audio.controlsLabel}
      >
        <AudioControlButton
          onClick={togglePlay}
          label={preparing ? t.a11y.audio.preparing : playLabel}
          pressed={isPlaying}
          variant="primary"
        >
          {isPlaying ? (
            <Pause className="size-4 shrink-0" aria-hidden />
          ) : (
            <Play className="size-4 shrink-0 fill-current" aria-hidden />
          )}
          <span>{preparing ? t.a11y.audio.preparing : playLabel}</span>
        </AudioControlButton>

        <AudioControlButton
          onClick={skipBack}
          label={t.a11y.audio.skipBackLabel}
          disabled={atStart || preparing}
        >
          <Rewind className="size-4 shrink-0" aria-hidden />
          <span>{t.a11y.audio.skipBack}</span>
        </AudioControlButton>

        <AudioControlButton
          onClick={cycleSpeed}
          label={format(t.a11y.audio.speedLabel, { speed: String(currentSpeed) })}
          disabled={preparing}
        >
          <Gauge className="size-4 shrink-0" aria-hidden />
          <span>
            {t.a11y.audio.speed}: {currentSpeed}×
          </span>
        </AudioControlButton>
      </div>

      {statusMessage ? (
        <p className="mt-3 text-sm text-creco-muted" role="status" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </p>
      ) : null}
    </section>
  );
}
