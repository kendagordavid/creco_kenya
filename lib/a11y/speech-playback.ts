const CHARS_PER_SECOND_AT_RATE_1 = 14;
const MAX_CHUNK_CHARS = 120;

export type SpeechChunk = {
  sentenceIndex: number;
  charOffset: number;
  text: string;
};

export type PlaybackPosition = {
  sentenceIndex: number;
  charOffset: number;
};

export function splitSentences(text: string): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const sentences = normalized
    .split(/(?<=[.!?;:])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const source = sentences.length > 0 ? sentences : [normalized];
  const chunks: string[] = [];

  for (const sentence of source) {
    if (sentence.length <= MAX_CHUNK_CHARS) {
      chunks.push(sentence);
      continue;
    }

    let remaining = sentence;
    while (remaining.length > MAX_CHUNK_CHARS) {
      let breakAt = remaining.lastIndexOf(" ", MAX_CHUNK_CHARS);
      if (breakAt <= 0) breakAt = MAX_CHUNK_CHARS;
      chunks.push(remaining.slice(0, breakAt).trim());
      remaining = remaining.slice(breakAt).trim();
    }

    if (remaining) chunks.push(remaining);
  }

  return chunks;
}

export function estimateDurationSeconds(text: string, rate: number): number {
  if (!text) return 0;
  return text.length / (CHARS_PER_SECOND_AT_RATE_1 * rate);
}

export function buildChunk(sentences: string[], sentenceIndex: number, charOffset = 0): SpeechChunk | null {
  if (sentenceIndex < 0 || sentenceIndex >= sentences.length) return null;

  const sentence = sentences[sentenceIndex];
  const safeOffset = Math.min(Math.max(charOffset, 0), sentence.length);
  const raw = sentence.slice(safeOffset);
  const leadingTrim = raw.length - raw.trimStart().length;
  const text = raw.trimStart();

  if (!text) {
    return buildChunk(sentences, sentenceIndex + 1, 0);
  }

  return {
    sentenceIndex,
    charOffset: safeOffset + leadingTrim,
    text,
  };
}

export function positionAfterChunk(chunk: SpeechChunk, sentences: string[]): PlaybackPosition {
  const sentence = sentences[chunk.sentenceIndex] ?? "";
  const endOffset = chunk.charOffset + chunk.text.length;

  if (endOffset >= sentence.length) {
    return { sentenceIndex: chunk.sentenceIndex + 1, charOffset: 0 };
  }

  return { sentenceIndex: chunk.sentenceIndex, charOffset: endOffset };
}

export function skipBackPosition(
  sentences: string[],
  position: PlaybackPosition,
  seconds: number,
  rate: number,
): PlaybackPosition {
  if (sentences.length === 0) {
    return { sentenceIndex: 0, charOffset: 0 };
  }

  let remaining = seconds;
  let { sentenceIndex, charOffset } = position;

  const currentSentence = sentences[sentenceIndex] ?? "";
  if (charOffset > 0 && currentSentence) {
    const currentText = currentSentence.slice(charOffset);
    const currentDuration = estimateDurationSeconds(currentText, rate);

    if (currentDuration <= remaining) {
      remaining -= currentDuration;
      charOffset = 0;
    } else {
      const charsToSkip = Math.floor(remaining * CHARS_PER_SECOND_AT_RATE_1 * rate);
      return {
        sentenceIndex,
        charOffset: Math.max(0, charOffset - charsToSkip),
      };
    }
  }

  while (sentenceIndex > 0 && remaining > 0) {
    sentenceIndex -= 1;
    const sentence = sentences[sentenceIndex];
    const duration = estimateDurationSeconds(sentence, rate);

    if (duration <= remaining) {
      remaining -= duration;
      charOffset = 0;
      continue;
    }

    const charsToSkip = Math.floor(remaining * CHARS_PER_SECOND_AT_RATE_1 * rate);
    return {
      sentenceIndex,
      charOffset: Math.max(0, sentence.length - charsToSkip),
    };
  }

  return { sentenceIndex: 0, charOffset: 0 };
}

export class SpeechPlaybackEngine {
  private sentences: string[] = [];
  private rate = 1;
  private position: PlaybackPosition = { sentenceIndex: 0, charOffset: 0 };
  private resumePosition: PlaybackPosition = { sentenceIndex: 0, charOffset: 0 };
  private paused = false;
  private playing = false;
  private stopped = true;
  private utteranceId = 0;
  private activeChunk: SpeechChunk | null = null;
  private resumeTimer: number | null = null;
  private keepAliveTimer: number | null = null;
  private onStateChange: ((state: "idle" | "playing" | "paused") => void) | null = null;
  private onPositionChange: ((position: PlaybackPosition) => void) | null = null;
  private onComplete: (() => void) | null = null;

  setCallbacks(callbacks: {
    onStateChange?: (state: "idle" | "playing" | "paused") => void;
    onPositionChange?: (position: PlaybackPosition) => void;
    onComplete?: () => void;
  }) {
    this.onStateChange = callbacks.onStateChange ?? null;
    this.onPositionChange = callbacks.onPositionChange ?? null;
    this.onComplete = callbacks.onComplete ?? null;
  }

  setText(text: string) {
    this.hardStop();
    this.sentences = splitSentences(text);
    this.position = { sentenceIndex: 0, charOffset: 0 };
    this.resumePosition = { sentenceIndex: 0, charOffset: 0 };
    this.emitPosition();
  }

  setRate(rate: number) {
    this.rate = rate;
  }

  getPosition(): PlaybackPosition {
    return { ...this.position };
  }

  isPlaying() {
    return this.playing;
  }

  isPaused() {
    return this.paused;
  }

  play(from?: PlaybackPosition) {
    if (typeof window === "undefined" || !window.speechSynthesis || this.sentences.length === 0) {
      return;
    }

    const start = from ?? this.resumePosition;
    this.position = { ...start };
    this.resumePosition = { ...start };
    this.paused = false;
    this.stopped = false;
    this.playing = true;
    this.onStateChange?.("playing");
    this.emitPosition();
    this.scheduleSpeak(80);
  }

  pause() {
    if (!this.playing && !this.paused) return;

    this.paused = true;
    this.playing = false;
    this.stopped = false;
    this.resumePosition = { ...this.position };
    this.invalidateUtterance();
    this.cancelSynth();
    this.stopKeepAlive();
    this.onStateChange?.("paused");
  }

  stop() {
    this.hardStop();
    this.onStateChange?.("idle");
    this.emitPosition();
  }

  skipBack(seconds: number) {
    if (this.sentences.length === 0) return;

    const wasActive = this.playing || this.paused;
    const next = skipBackPosition(this.sentences, this.position, seconds, this.rate);

    this.invalidateUtterance();
    this.cancelSynth();
    this.stopKeepAlive();
    this.position = next;
    this.resumePosition = next;
    this.paused = false;
    this.emitPosition();

    if (wasActive) {
      this.stopped = false;
      this.playing = true;
      this.onStateChange?.("playing");
      this.scheduleSpeak(60);
    }
  }

  changeRate(rate: number) {
    this.rate = rate;
    if (!this.playing && !this.paused) return;

    const resumeFrom = { ...this.position };
    this.invalidateUtterance();
    this.cancelSynth();
    this.stopKeepAlive();
    this.paused = false;
    this.stopped = false;
    this.playing = true;
    this.position = resumeFrom;
    this.resumePosition = resumeFrom;
    this.onStateChange?.("playing");
    this.scheduleSpeak(60);
  }

  destroy() {
    this.hardStop();
    this.onStateChange = null;
    this.onPositionChange = null;
    this.onComplete = null;
  }

  private hardStop() {
    this.paused = false;
    this.playing = false;
    this.stopped = true;
    this.position = { sentenceIndex: 0, charOffset: 0 };
    this.resumePosition = { sentenceIndex: 0, charOffset: 0 };
    this.activeChunk = null;
    this.clearResumeTimer();
    this.stopKeepAlive();
    this.invalidateUtterance();
    this.cancelSynth();
  }

  private emitPosition() {
    this.onPositionChange?.({ ...this.position });
  }

  private invalidateUtterance() {
    this.utteranceId += 1;
    this.activeChunk = null;
  }

  private clearResumeTimer() {
    if (this.resumeTimer !== null) {
      window.clearTimeout(this.resumeTimer);
      this.resumeTimer = null;
    }
  }

  private scheduleSpeak(delayMs: number) {
    this.clearResumeTimer();
    this.resumeTimer = window.setTimeout(() => {
      this.resumeTimer = null;
      if (!this.paused && !this.stopped && this.playing) {
        this.speakNextChunk();
      }
    }, delayMs);
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    if (typeof window === "undefined") return;

    this.keepAliveTimer = window.setInterval(() => {
      const synth = window.speechSynthesis;
      if (!this.playing || this.paused) return;
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 8000);
  }

  private stopKeepAlive() {
    if (this.keepAliveTimer !== null) {
      window.clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  private cancelSynth() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
  }

  private speakNextChunk() {
    if (this.stopped || this.paused || typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const chunk = buildChunk(this.sentences, this.position.sentenceIndex, this.position.charOffset);
    if (!chunk) {
      this.finish();
      return;
    }

    this.activeChunk = chunk;
    this.position = { sentenceIndex: chunk.sentenceIndex, charOffset: chunk.charOffset };
    this.resumePosition = { ...this.position };
    this.emitPosition();

    const utteranceId = this.utteranceId + 1;
    this.utteranceId = utteranceId;

    const utterance = new SpeechSynthesisUtterance(chunk.text);
    utterance.rate = this.rate;

    utterance.onboundary = (event) => {
      if (utteranceId !== this.utteranceId || this.paused || this.stopped) return;
      if (event.name !== "word" && event.name !== "sentence") return;

      const nextOffset = chunk.charOffset + event.charIndex + (event.charLength ?? 1);
      this.position = {
        sentenceIndex: chunk.sentenceIndex,
        charOffset: Math.min(nextOffset, this.sentences[chunk.sentenceIndex]?.length ?? nextOffset),
      };
      this.resumePosition = { ...this.position };
    };

    utterance.onend = () => {
      if (utteranceId !== this.utteranceId || this.paused || this.stopped) return;

      this.position = positionAfterChunk(chunk, this.sentences);
      this.resumePosition = { ...this.position };
      this.emitPosition();
      this.scheduleSpeak(40);
    };

    utterance.onerror = () => {
      if (utteranceId !== this.utteranceId || this.paused || this.stopped) return;
      this.finishWithError();
    };

    synth.speak(utterance);
    this.startKeepAlive();
  }

  private finish() {
    this.playing = false;
    this.paused = false;
    this.stopped = true;
    this.activeChunk = null;
    this.position = { sentenceIndex: 0, charOffset: 0 };
    this.resumePosition = { sentenceIndex: 0, charOffset: 0 };
    this.stopKeepAlive();
    this.onStateChange?.("idle");
    this.onComplete?.();
    this.emitPosition();
  }

  private finishWithError() {
    this.playing = false;
    this.paused = false;
    this.stopped = true;
    this.activeChunk = null;
    this.stopKeepAlive();
    this.onStateChange?.("idle");
  }
}

export function primeSpeechVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const synth = window.speechSynthesis;
  synth.getVoices();

  function loadVoices() {
    synth.getVoices();
  }

  if (typeof synth.addEventListener === "function") {
    synth.addEventListener("voiceschanged", loadVoices);
  } else {
    synth.onvoiceschanged = loadVoices;
  }
}
