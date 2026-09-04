type Props = {
  href?: string;
  label: string;
};

export function SkipLink({ href = "#main-content", label }: Props) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-foreground focus:shadow-lg focus:ring-2 focus:ring-ring"
    >
      {label}
    </a>
  );
}
