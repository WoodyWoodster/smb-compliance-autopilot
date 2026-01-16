import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AssessmentWizard } from "@/components/assessment/assessment-wizard";

export const dynamic = "force-dynamic";

export default async function AssessmentPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // TODO: Fetch existing assessment answers from database
  const existingAnswers = {};

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Compliance Assessment
        </h1>
        <p className="text-muted-foreground">
          Answer these questions to determine your HIPAA compliance requirements
          and identify any gaps in your current practices.
        </p>
      </div>

      <AssessmentWizard existingAnswers={existingAnswers} />
    </div>
  );
}
