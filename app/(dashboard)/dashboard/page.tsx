import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  TrendingUp,
  Sparkles,
} from "lucide-react";

export const dynamic = "force-dynamic";

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

function getScoreStrokeColor(score: number): string {
  if (score >= 80) return "stroke-success";
  if (score >= 60) return "stroke-primary";
  if (score >= 40) return "stroke-warning";
  return "stroke-destructive";
}

function getScoreMessage(score: number): string {
  if (score >= 80) return "Great job! You're well protected.";
  if (score >= 60) return "Good progress. Keep going!";
  if (score >= 40) return "On your way. Let's improve together.";
  return "Let's get you started on compliance.";
}

function CircularProgress({ value, size = 160, strokeWidth = 12 }: { value: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getScoreStrokeColor(value)} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${getScoreColor(value)}`}>
          {value}%
        </span>
        <span className="text-sm text-muted-foreground">Compliant</span>
      </div>
    </div>
  );
}

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Your compliance overview and key metrics
        </p>
      </div>

      {/* Compliance Score Card - Hero Section */}
      <Card className="relative overflow-hidden border-primary/20">
        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 h-48 w-48 bg-primary/5 rounded-full translate-y-24 -translate-x-24" />
        <CardContent className="relative pt-8 pb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <CircularProgress value={complianceScore} />
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold flex items-center justify-center md:justify-start gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Overall Compliance Score
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                {getScoreMessage(complianceScore)}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <Badge variant="teal-outline" className="gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {completedRequirements} Compliant
                </Badge>
                <Badge variant="coral-outline" className="gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {totalRequirements - completedRequirements} Remaining
                </Badge>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground justify-center md:justify-start">
                <TrendingUp className="h-4 w-4 text-success" />
                <span>You&apos;re ahead of 32% of practices your size</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Requirements</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {completedRequirements}<span className="text-muted-foreground text-lg font-normal">/{totalRequirements}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              HIPAA requirements tracked
            </p>
            <Button variant="link" className="mt-3 h-auto p-0 text-primary" asChild>
              <Link href="/dashboard/requirements">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-coral/10 flex items-center justify-center">
              <ListTodo className="h-5 w-5 text-coral" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingTasks}</div>
            {overdueTasks > 0 && (
              <p className="flex items-center gap-1.5 text-sm text-destructive mt-1">
                <AlertCircle className="h-4 w-4" />
                {overdueTasks} overdue
              </p>
            )}
            <Button variant="link" className="mt-3 h-auto p-0 text-primary" asChild>
              <Link href="/dashboard/tasks">
                View tasks <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Policies</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPolicies}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Generated & active
            </p>
            <Button variant="link" className="mt-3 h-auto p-0 text-primary" asChild>
              <Link href="/dashboard/policies">
                Manage policies <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assessment</CardTitle>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: Jan 10, 2026
            </p>
            <Button variant="link" className="mt-3 h-auto p-0 text-primary" asChild>
              <Link href="/dashboard/assessment">
                Update assessment <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              Priority Actions
            </CardTitle>
            <CardDescription>
              Items requiring your immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border p-4 bg-card hover:shadow-warm transition-shadow">
              <div>
                <p className="font-medium">Complete Risk Assessment</p>
                <p className="text-sm text-muted-foreground">
                  Required for HIPAA compliance
                </p>
              </div>
              <Badge variant="destructive">Overdue</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border p-4 bg-card hover:shadow-warm transition-shadow">
              <div>
                <p className="font-medium">Review Privacy Policy</p>
                <p className="text-sm text-muted-foreground">
                  Annual review due
                </p>
              </div>
              <Badge variant="warning">Due in 5 days</Badge>
            </div>
            <div className="flex items-center justify-between rounded-xl border p-4 bg-card hover:shadow-warm transition-shadow">
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
              <div className="h-8 w-8 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription>Latest compliance updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-success shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  Privacy Policy generated
                </p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-success shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  BAA uploaded for Cloud Provider
                </p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-success shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  Completed: Access Control Review
                </p>
                <p className="text-xs text-muted-foreground">3 days ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
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
