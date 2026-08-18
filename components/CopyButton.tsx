"use client";

export function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="creco-btn creco-btn-primary"
      onClick={() => navigator.clipboard.writeText(text)}
    >
      Copy to clipboard
    </button>
  );
}
