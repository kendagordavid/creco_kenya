type Props = {
  body: string;
  className?: string;
};

export function NewsArticleBody({ body, className }: Props) {
  const paragraphs = body
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className={className}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="leading-relaxed text-creco-muted">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
