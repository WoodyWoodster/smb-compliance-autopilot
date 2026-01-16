import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DocumentManager } from "@/components/documents/document-manager";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-muted-foreground">
          Store and manage your compliance documents securely
        </p>
      </div>

      <DocumentManager />
    </div>
  );
}
