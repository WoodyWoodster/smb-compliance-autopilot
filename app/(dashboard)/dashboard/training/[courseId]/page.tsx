import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { ScenarioAssessment } from "@/components/training/scenario-assessment";
import { trainingModules } from "@/lib/ai/training-generator";

export const dynamic = "force-dynamic";

interface TrainingCoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default async function TrainingCoursePage({ params }: TrainingCoursePageProps) {
  const { userId } = await auth();
  const { courseId } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const course = trainingModules.find((m) => m.id === courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
        <p className="text-muted-foreground mt-1">{course.description}</p>
      </div>

      <ScenarioAssessment course={course} />
    </div>
  );
}
