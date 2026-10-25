import { parseAnswer, stripSourceMarkers } from "@/lib/answer-format";

type Props = {
  content: string;
};

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
  // Also cleans answers saved before markers were removed at the source.
  const blocks = parseAnswer(stripSourceMarkers(content));

  return (
    <div className="creco-prose text-[1.02rem]">
      {blocks.map((block, index) => {
        if (block.type === "note") {
          return (
            <p key={index} className="border-l-2 border-creco-sand pl-4 text-sm italic text-creco-muted">
              {renderInline(block.text)}
            </p>
          );
        }

        if (block.type === "ordered") {
          return (
            <ol key={index} className="list-decimal space-y-2 pl-6">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} value={itemIndex + 1}>
                  {renderInline(item)}
                </li>
              ))}
            </ol>
          );
        }

        if (block.type === "unordered") {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
