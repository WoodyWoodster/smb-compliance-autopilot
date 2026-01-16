import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PolicyGenerator } from "@/components/policies/policy-generator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const dynamic = "force-dynamic";

// Mock data for existing policies
const existingPolicies = [
  {
    id: "1",
    title: "Notice of Privacy Practices",
    type: "privacy_policy",
    status: "active",
    version: 2,
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
  },
  {
    id: "2",
    title: "Security Policy",
    type: "security_policy",
    status: "active",
    version: 1,
    createdAt: "2026-01-08",
    updatedAt: "2026-01-08",
  },
  {
    id: "3",
    title: "Breach Notification Policy",
    type: "breach_notification",
    status: "draft",
    version: 1,
    createdAt: "2026-01-05",
    updatedAt: "2026-01-05",
  },
];

export default async function PoliciesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Policies</h1>
        <p className="text-muted-foreground">
          Generate and manage your HIPAA compliance policies
        </p>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate New</TabsTrigger>
          <TabsTrigger value="existing">
            My Policies ({existingPolicies.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <PolicyGenerator />
        </TabsContent>

        <TabsContent value="existing">
          <div className="grid gap-4">
            {existingPolicies.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No policies yet
                  </h3>
                  <p className="text-muted-foreground">
                    Generate your first policy using the AI policy generator
                  </p>
                </CardContent>
              </Card>
            ) : (
              existingPolicies.map((policy) => (
                <Card key={policy.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          {policy.title}
                        </CardTitle>
                        <CardDescription>
                          Last updated: {policy.updatedAt} • Version{" "}
                          {policy.version}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            policy.status === "active" ? "default" : "secondary"
                          }
                        >
                          {policy.status}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Create New Version</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
