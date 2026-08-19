import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { canViewAllReports } from "@/lib/authz";
import { computeAssessmentProgress, computeChecklistProgress } from "@/lib/compliance-progress";
import { countSubmissionsByUsers, listComplianceSnapshots } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const snapshots = await listComplianceSnapshots();
  const reportCounts = await countSubmissionsByUsers(snapshots.map((snapshot) => snapshot.user.id));

  const organisations = snapshots.map((snapshot) => {
    const checklist = computeChecklistProgress(
      snapshot.checklist as Record<string, boolean> | null,
    );
    const assessment = computeAssessmentProgress(
      snapshot.assessment as Record<string, number> | null,
    );

    return {
      user: snapshot.user,
      reportCount: reportCounts[snapshot.user.id] ?? 0,
      checklist: {
        ...checklist,
        items: (snapshot.checklist as Record<string, boolean> | null) ?? {},
        updatedAt: snapshot.checklistUpdatedAt,
      },
      assessment: assessment
        ? {
            ...assessment,
            answers: (snapshot.assessment as Record<string, number> | null) ?? {},
            updatedAt: snapshot.assessmentUpdatedAt,
          }
        : null,
    };
  });

  const summary = {
    organisations: organisations.length,
    checklistStarted: organisations.filter((o) => o.checklist.started).length,
    assessmentStarted: organisations.filter((o) => o.assessment?.started).length,
    avgChecklistPercent:
      organisations.length === 0
        ? 0
        : Math.round(
            organisations.reduce((sum, o) => sum + o.checklist.percent, 0) / organisations.length,
          ),
    avgAssessmentPercent:
      organisations.filter((o) => o.assessment).length === 0
        ? 0
        : Math.round(
            organisations
              .filter((o) => o.assessment)
              .reduce((sum, o) => sum + (o.assessment?.percent ?? 0), 0) /
              organisations.filter((o) => o.assessment).length,
          ),
    atRisk: organisations.filter(
      (o) => o.checklist.started && o.checklist.percent < 25,
    ).length,
  };

  return NextResponse.json(
    { summary, organisations },
    {
      headers: {
        "Cache-Control": "private, max-age=60, stale-while-revalidate=120",
      },
    },
  );
}
