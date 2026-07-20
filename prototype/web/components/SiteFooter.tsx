import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-creco-primary-dark text-white/90">
      <div className="creco-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-display text-xl font-bold text-white">CRECO Kenya</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            Safeguarding civic space through legal awareness and monitoring of PBO Act
            implementation across Kenya.
          </p>
        </div>
        <div className="lg:col-span-3">
          <p className="text-sm font-semibold text-creco-sand">Platform</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/guidance" className="text-white/80 no-underline hover:text-white">
                PBO guidance
              </Link>
            </li>
            <li>
              <Link href="/topics" className="text-white/80 no-underline hover:text-white">
                Topic library
              </Link>
            </li>
            <li>
              <Link href="/sources" className="text-white/80 no-underline hover:text-white">
                Source documents
              </Link>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-4">
          <p className="text-sm font-semibold text-creco-sand">Partnership</p>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Developed with the International Center for Not-for-Profit Law (ICNL) as part of civic
            space safeguarding work in Kenya.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="creco-container flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} CRECO Kenya · Prototype</span>
          <span>Not legal advice · For demonstration purposes</span>
        </div>
      </div>
    </footer>
  );
}
