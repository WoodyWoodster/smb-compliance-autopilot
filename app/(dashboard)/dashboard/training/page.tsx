import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TrainingCatalog } from "@/components/training/training-catalog";

export const dynamic = "force-dynamic";

export default async function TrainingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Training</h1>
        <p className="text-muted-foreground mt-1">
          Interactive AI-powered training modules for HIPAA compliance
        </p>
      </div>

      <TrainingCatalog />
    </div>
  );
}
