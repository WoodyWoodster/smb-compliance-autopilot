import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { RequirementsDashboard } from "@/components/requirements/requirements-dashboard";

export const dynamic = "force-dynamic";

export default async function RequirementsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // TODO: Fetch requirements from database based on organization
  // For now, using sample data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          HIPAA Requirements
        </h1>
        <p className="text-muted-foreground">
          Track and manage your compliance requirements based on your assessment
        </p>
      </div>

      <RequirementsDashboard />
    </div>
  );
}
