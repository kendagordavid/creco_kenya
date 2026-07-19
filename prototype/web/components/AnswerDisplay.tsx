type Props = {
  content: string;
};

function formatContent(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-creco-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function AnswerDisplay({ content }: Props) {
  const blocks = formatContent(content);

  return (
    <div className="creco-prose text-[1.02rem]">
      {blocks.map((block, index) => {
        if (block.startsWith("*") && block.endsWith("*") && !block.startsWith("**")) {
          return (
            <p key={index} className="border-l-2 border-creco-sand pl-4 text-sm italic text-creco-muted">
              {renderInline(block.replace(/^\*|\*$/g, ""))}
            </p>
          );
        }

        if (/^\d+\./.test(block)) {
          const items = block.split(/\n(?=\d+\.)/);
          return (
            <ol key={index} className="list-decimal space-y-2 pl-5">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item.replace(/^\d+\.\s*/, ""))}</li>
              ))}
            </ol>
          );
        }

        if (block.startsWith("- ")) {
          const items = block.split(/\n- /);
          return (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item.replace(/^- /, ""))}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{renderInline(block)}</p>;
      })}
    </div>
  );
}
