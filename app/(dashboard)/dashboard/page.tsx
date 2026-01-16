import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  ListTodo,
  Shield,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // TODO: Fetch real data from database
  const complianceScore = 45;
  const totalRequirements = 42;
  const completedRequirements = 19;
  const pendingTasks = 8;
  const overdueTasks = 2;
  const totalPolicies = 3;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your compliance overview and key metrics
        </p>
      </div>

      {/* Compliance Score Card */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Overall Compliance Score
          </CardTitle>
          <CardDescription>
            Based on your assessment and completed requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <span className="text-5xl font-bold text-primary">
              {complianceScore}%
            </span>
            <div className="flex-1 pb-2">
              <Progress value={complianceScore} className="h-3" />
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              {completedRequirements} Compliant
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3 text-yellow-600" />
              {totalRequirements - completedRequirements} Remaining
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Requirements</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedRequirements}/{totalRequirements}
            </div>
            <p className="text-xs text-muted-foreground">
              HIPAA requirements tracked
            </p>
            <Button variant="link" className="mt-2 h-auto p-0" asChild>
              <Link href="/dashboard/requirements">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            {overdueTasks > 0 && (
              <p className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                {overdueTasks} overdue
              </p>
            )}
            <Button variant="link" className="mt-2 h-auto p-0" asChild>
              <Link href="/dashboard/tasks">
                View tasks <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Policies</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPolicies}</div>
            <p className="text-xs text-muted-foreground">
              Generated & active
            </p>
            <Button variant="link" className="mt-2 h-auto p-0" asChild>
              <Link href="/dashboard/policies">
                Manage policies <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assessment</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="secondary">Completed</Badge>
            <p className="mt-1 text-xs text-muted-foreground">
              Last updated: Jan 10, 2026
            </p>
            <Button variant="link" className="mt-2 h-auto p-0" asChild>
              <Link href="/dashboard/assessment">
                Update assessment <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Priority Actions
            </CardTitle>
            <CardDescription>
              Items requiring your immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Complete Risk Assessment</p>
                <p className="text-sm text-muted-foreground">
                  Required for HIPAA compliance
                </p>
              </div>
              <Badge variant="destructive">Overdue</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Review Privacy Policy</p>
                <p className="text-sm text-muted-foreground">
                  Annual review due
                </p>
              </div>
              <Badge variant="outline" className="text-yellow-600">
                Due in 5 days
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Staff Security Training</p>
                <p className="text-sm text-muted-foreground">
                  2 staff members pending
                </p>
              </div>
              <Badge variant="outline">Due in 14 days</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest compliance updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-green-600" />
              <div>
                <p className="text-sm font-medium">
                  Privacy Policy generated
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-green-600" />
              <div>
                <p className="text-sm font-medium">
                  BAA uploaded for Cloud Provider
                </p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-green-600" />
              <div>
                <p className="text-sm font-medium">
                  Completed: Access Control Review
                </p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
              <div>
                <p className="text-sm font-medium">Assessment completed</p>
                <p className="text-xs text-muted-foreground">Jan 10, 2026</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
