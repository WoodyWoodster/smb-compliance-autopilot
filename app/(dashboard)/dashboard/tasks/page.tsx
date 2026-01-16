import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { TaskManager } from "@/components/tasks/task-manager";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance Tasks</h1>
        <p className="text-muted-foreground">
          Track and manage your ongoing compliance tasks and deadlines
        </p>
      </div>

      <TaskManager />
    </div>
  );
}
