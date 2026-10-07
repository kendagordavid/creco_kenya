"use client";

import { narrationChunks } from "@/lib/a11y/narration-chunks";

type Locale = "en" | "sw";
type PlaybackState = "idle" | "playing" | "paused";
type PlayResult = "ok" | "unavailable" | "cancelled" | "error";

type Callbacks = {
  onStateChange?: (state: PlaybackState) => void;
  onComplete?: () => void;
  onError?: () => void;
  onPreparing?: (preparing: boolean) => void;
};

const SKIP_FALLBACK_SECONDS = 15;

export class CloudNarration {
  private chunks: string[] = [];
  private urls = new Map<number, string>();
  private inflight = new Map<number, Promise<string | null>>();
  private index = 0;
  private audio: HTMLAudioElement | null = null;
  private rate = 1;
  private locale: Locale = "en";
  private stopped = true;
  private generation = 0;
  private unavailable = false;
  private availability: Promise<boolean> | null = null;
  private callbacks: Callbacks = {};

  constructor() {
    if (typeof window === "undefined") return;
    this.audio = new Audio();
    this.audio.preload = "auto";
  }

  setCallbacks(callbacks: Callbacks) {
    this.callbacks = callbacks;
  }

  setText(text: string) {
    this.stop();
    this.revokeAll();
    this.chunks = narrationChunks(text);
    this.index = 0;
  }

  setRate(rate: number) {
    this.rate = rate;
    if (this.audio) this.audio.playbackRate = rate;
  }

  setLocale(locale: Locale) {
    if (this.locale === locale) return;
    this.locale = locale;
    this.stop();
    this.revokeAll();
    this.index = 0;
    this.unavailable = false;
    this.availability = null;
  }

  isUnavailable() {
    return this.unavailable;
  }

  pause() {
    this.audio?.pause();
    this.callbacks.onPreparing?.(false);
    this.callbacks.onStateChange?.("paused");
  }

  stop() {
    this.stopped = true;
    this.generation += 1;
    if (this.audio) {
      this.audio.onended = null;
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
    }
    this.callbacks.onPreparing?.(false);
    this.callbacks.onStateChange?.("idle");
  }

  async play(): Promise<PlayResult> {
    if (!this.audio || this.chunks.length === 0 || this.unavailable) {
      return this.unavailable ? "unavailable" : "error";
    }

    if (!(await this.cloudConfigured())) {
      this.unavailable = true;
      return "unavailable";
    }

    if (!this.stopped && this.audio.src && this.audio.paused && !this.audio.ended) {
      this.audio.playbackRate = this.rate;
      try {
        await this.audio.play();
      } catch {
        return "error";
      }
      this.callbacks.onStateChange?.("playing");
      return "ok";
    }

    this.stopped = false;
    const generation = ++this.generation;
    this.callbacks.onPreparing?.(true);
    const result = await this.playIndex(this.index, generation);
    if (generation === this.generation) this.callbacks.onPreparing?.(false);
    return result;
  }

  skipBack(seconds = SKIP_FALLBACK_SECONDS) {
    const audio = this.audio;
    if (!audio || this.stopped || !audio.src) return;

    if (audio.currentTime > seconds) {
      audio.currentTime -= seconds;
      return;
    }

    const leftover = Math.max(0, seconds - audio.currentTime);
    if (this.index <= 0) {
      audio.currentTime = 0;
      return;
    }

    this.index -= 1;
    const generation = ++this.generation;
    void this.playIndex(this.index, generation, leftover);
  }

  destroy() {
    this.stop();
    this.revokeAll();
    this.audio = null;
  }

  private async playIndex(index: number, generation: number, seekFromEnd = 0): Promise<PlayResult> {
    const audio = this.audio;
    if (!audio) return "error";
    if (this.stopped || generation !== this.generation) return "cancelled";

    const url = await this.urlFor(index);
    if (this.stopped || generation !== this.generation) return "cancelled";
    if (!url) {
      if (index === 0 && this.urls.size === 0) {
        this.unavailable = true;
        this.stopped = true;
        return "unavailable";
      }
      this.callbacks.onError?.();
      return "error";
    }

    this.index = index;
    audio.src = url;
    audio.playbackRate = this.rate;

    if (seekFromEnd > 0) {
      const placeNearEnd = () => {
        audio.removeEventListener("loadedmetadata", placeNearEnd);
        if (!Number.isFinite(audio.duration)) return;
        audio.currentTime = Math.max(0, audio.duration - seekFromEnd);
      };
      audio.addEventListener("loadedmetadata", placeNearEnd);
    }

    audio.onended = () => {
      if (this.stopped || generation !== this.generation) return;
      if (this.index + 1 < this.chunks.length) {
        void this.playIndex(this.index + 1, generation);
        return;
      }
      this.stopped = true;
      this.index = 0;
      this.callbacks.onStateChange?.("idle");
      this.callbacks.onComplete?.();
    };

    try {
      await audio.play();
    } catch {
      if (generation !== this.generation) return "cancelled";
      return "error";
    }

    if (this.stopped || generation !== this.generation) {
      audio.pause();
      return "cancelled";
    }

    this.callbacks.onStateChange?.("playing");
    void this.urlFor(index + 1);
    return "ok";
  }

  private cloudConfigured(): Promise<boolean> {
    if (!this.availability) {
      this.availability = fetch("/api/tts", { method: "GET" })
        .then(async (response) => {
          if (!response.ok) return false;
          const body = (await response.json()) as { configured?: unknown };
          return body.configured === true;
        })
        .catch(() => false);
    }
    return this.availability;
  }

  private urlFor(index: number): Promise<string | null> {
    if (index < 0 || index >= this.chunks.length) return Promise.resolve(null);
    const cached = this.urls.get(index);
    if (cached) return Promise.resolve(cached);
    const existing = this.inflight.get(index);
    if (existing) return existing;

    const request = fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: this.chunks[index], locale: this.locale }),
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const blob = await response.blob();
        const type = blob.type.toLowerCase();
        if (!blob.size || type.includes("json") || type.startsWith("text/")) return null;
        const url = URL.createObjectURL(blob);
        this.urls.set(index, url);
        return url;
      })
      .catch(() => null)
      .finally(() => {
        this.inflight.delete(index);
      });

    this.inflight.set(index, request);
    return request;
  }

  private revokeAll() {
    for (const url of this.urls.values()) URL.revokeObjectURL(url);
    this.urls.clear();
    this.inflight.clear();
  }
}
