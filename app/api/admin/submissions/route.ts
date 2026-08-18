import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { canViewAllReports } from "@/lib/authz";
import { findUserById, listAllSubmissions } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const submissions = listAllSubmissions().map((submission) => {
    const reporter = findUserById(submission.userId);
    return {
      ...submission,
      reporter: reporter
        ? {
            id: reporter.id,
            name: reporter.name,
            email: reporter.email,
            orgName: reporter.orgName,
            county: reporter.county,
          }
        : null,
    };
  });

  return NextResponse.json({ submissions });
}
