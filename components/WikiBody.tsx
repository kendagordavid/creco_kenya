export function WikiBody({ body }: { body: string }) {
  const blocks = body.split("\n\n");

  return (
    <div className="creco-prose max-w-none">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="mt-8 text-xl font-bold text-creco-primary first:mt-0">
              {trimmed.slice(3)}
            </h2>
          );
        }

        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={index} className="mt-8 text-2xl font-bold first:mt-0">
              {trimmed.slice(2)}
            </h2>
          );
        }

        if (trimmed.startsWith("- ")) {
          return (
            <ul key={index} className="mt-3 list-disc space-y-1 pl-5">
              {trimmed.split("\n").map((line) => (
                <li key={line}>{line.replace(/^-\s*/, "")}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className={index > 0 ? "mt-4" : ""}>
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}
