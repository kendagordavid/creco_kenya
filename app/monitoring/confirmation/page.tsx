import Link from "next/link";
import { PlatformSubnav } from "@/components/PlatformSubnav";

export const metadata = {
  title: "Submission received",
};

type Props = {
  searchParams: Promise<{ id?: string }>;
};

export default async function MonitoringConfirmationPage({ searchParams }: Props) {
  const params = await searchParams;
  const ref = params.id?.slice(0, 8) ?? "—";

  return (
    <>
      <PlatformSubnav />
      <section className="creco-section">
        <div className="creco-container max-w-xl text-center">
          <div className="creco-card p-10">
            <span className="creco-check-icon mx-auto !h-12 !w-12 text-lg">✓</span>
            <h1 className="mt-4 text-2xl font-bold text-creco-primary">Report submitted</h1>
            <p className="mt-3 text-sm text-creco-muted">
              Reference <strong>{ref}</strong>. CRECO staff will review confidentially. You can
              track status in My submissions.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/monitoring/submissions" className="creco-btn creco-btn-primary">
                My submissions
              </Link>
              <Link href="/monitoring" className="creco-btn creco-btn-secondary">
                Monitoring hub
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
