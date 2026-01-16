import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { EvidenceDashboard } from "@/components/verification/evidence-dashboard";

export const dynamic = "force-dynamic";

export default async function VerificationPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verification</h1>
        <p className="text-muted-foreground mt-1">
          Evidence collection and audit readiness for compliance requirements
        </p>
      </div>

      <EvidenceDashboard />
    </div>
  );
}
