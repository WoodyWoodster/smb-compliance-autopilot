"use client";

import { useState } from "react";
import {
  hipaaRequirements,
  type HIPAARequirement,
} from "@/lib/compliance/hipaa-requirements";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ChevronRight,
} from "lucide-react";

type RequirementStatus =
  | "not_started"
  | "in_progress"
  | "compliant"
  | "non_compliant";

interface RequirementWithStatus extends HIPAARequirement {
  status: RequirementStatus;
  completedAt?: string;
}

// Mock data - in production this would come from the database
const getRequirementsWithStatus = (): RequirementWithStatus[] => {
  return hipaaRequirements.map((req, index) => ({
    ...req,
    status:
      index < 8
        ? "compliant"
        : index < 15
          ? "in_progress"
          : index < 20
            ? "non_compliant"
            : "not_started",
    completedAt: index < 8 ? "2026-01-10" : undefined,
  }));
};

const categoryLabels: Record<string, string> = {
  administrative: "Administrative Safeguards",
  physical: "Physical Safeguards",
  technical: "Technical Safeguards",
  privacy: "Privacy Rule",
  breach: "Breach Notification",
};

const statusConfig: Record<
  RequirementStatus,
  { label: string; color: string; icon: typeof CheckCircle2 }
> = {
  compliant: {
    label: "Compliant",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-700",
    icon: Clock,
  },
  non_compliant: {
    label: "Non-Compliant",
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
  },
  not_started: {
    label: "Not Started",
    color: "bg-gray-100 text-gray-700",
    icon: Clock,
  },
};

export function RequirementsDashboard() {
  const [requirements] = useState<RequirementWithStatus[]>(
    getRequirementsWithStatus()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Calculate stats
  const stats = {
    total: requirements.length,
    compliant: requirements.filter((r) => r.status === "compliant").length,
    inProgress: requirements.filter((r) => r.status === "in_progress").length,
    nonCompliant: requirements.filter((r) => r.status === "non_compliant")
      .length,
    notStarted: requirements.filter((r) => r.status === "not_started").length,
  };

  const compliancePercentage = Math.round(
    (stats.compliant / stats.total) * 100
  );

  // Filter requirements
  const filteredRequirements = requirements.filter((req) => {
    const categoryMatch =
      selectedCategory === "all" || req.category === selectedCategory;
    const statusMatch =
      selectedStatus === "all" || req.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  // Group by category
  const groupedRequirements = filteredRequirements.reduce(
    (acc, req) => {
      if (!acc[req.category]) {
        acc[req.category] = [];
      }
      acc[req.category].push(req);
      return acc;
    },
    {} as Record<string, RequirementWithStatus[]>
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" />
              Overall Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <span className="text-4xl font-bold text-primary">
                {compliancePercentage}%
              </span>
              <div className="flex-1 pb-2">
                <Progress value={compliancePercentage} className="h-2" />
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {stats.compliant} of {stats.total} requirements met
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Compliant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.compliant}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.nonCompliant + stats.notStarted}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.entries(statusConfig).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Requirements by Category */}
      <Tabs defaultValue="grouped" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grouped">By Category</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grouped" className="space-y-4">
          {Object.entries(groupedRequirements).map(([category, reqs]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{categoryLabels[category] || category}</span>
                  <Badge variant="outline">
                    {reqs.filter((r) => r.status === "compliant").length}/
                    {reqs.length} compliant
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {reqs.map((req) => {
                    const StatusIcon = statusConfig[req.status].icon;
                    return (
                      <AccordionItem key={req.code} value={req.code}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex flex-1 items-center gap-3 text-left">
                            <Badge
                              className={`${statusConfig[req.status].color} shrink-0`}
                            >
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {statusConfig[req.status].label}
                            </Badge>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">
                                {req.code} - {req.title}
                              </p>
                            </div>
                            {req.priority === 1 && (
                              <Badge variant="destructive" className="shrink-0">
                                High Priority
                              </Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 pt-2">
                            <p className="text-muted-foreground">
                              {req.description}
                            </p>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <h4 className="text-sm font-medium">
                                  Evidence Required
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {req.evidenceRequired}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">
                                  Related Tasks
                                </h4>
                                <ul className="mt-1 space-y-1">
                                  {req.tasks.slice(0, 3).map((task, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-muted-foreground"
                                    >
                                      • {task.title}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <RequirementDetailDialog requirement={req} />
                              <Button variant="outline" size="sm">
                                <FileText className="mr-2 h-4 w-4" />
                                Generate Policy
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Requirements</CardTitle>
              <CardDescription>
                {filteredRequirements.length} requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredRequirements.map((req) => {
                  const StatusIcon = statusConfig[req.status].icon;
                  return (
                    <div
                      key={req.code}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${statusConfig[req.status].color} shrink-0`}
                        >
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[req.status].label}
                        </Badge>
                        <div>
                          <p className="font-medium">
                            {req.code} - {req.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {categoryLabels[req.category]}
                          </p>
                        </div>
                      </div>
                      <RequirementDetailDialog requirement={req} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RequirementDetailDialog({
  requirement,
}: {
  requirement: RequirementWithStatus;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {requirement.code} - {requirement.title}
          </DialogTitle>
          <DialogDescription>
            {categoryLabels[requirement.category]} •{" "}
            {requirement.priority === 1
              ? "High"
              : requirement.priority === 2
                ? "Medium"
                : "Low"}{" "}
            Priority
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">
              {requirement.description}
            </p>
          </div>

          <div>
            <h4 className="font-medium">Evidence Required</h4>
            <p className="text-sm text-muted-foreground">
              {requirement.evidenceRequired}
            </p>
          </div>

          <div>
            <h4 className="font-medium">Related Tasks</h4>
            <ul className="mt-2 space-y-2">
              {requirement.tasks.map((task, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 rounded border p-2"
                >
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {task.frequency.replace("_", " ")}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button>Mark as Compliant</Button>
            <Button variant="outline">Add Evidence</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
