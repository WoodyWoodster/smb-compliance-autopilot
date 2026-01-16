"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GraduationCap,
  Clock,
  Users,
  Play,
  CheckCircle2,
  ArrowRight,
  Shield,
  Brain,
  MessageCircle,
} from "lucide-react";
import {
  trainingModules,
  difficultyLabels,
  categoryColors,
  type TrainingModule,
} from "@/lib/ai/training-generator";

interface TrainingProgressData {
  courseId: string;
  status: "not_started" | "in_progress" | "completed" | "expired";
  score?: number;
  completedAt?: string;
}

// Mock progress data - in production, this would come from the database
const mockProgress: TrainingProgressData[] = [
  { courseId: "hipaa-privacy-basics", status: "completed", score: 92, completedAt: "2026-01-10" },
  { courseId: "security-awareness", status: "in_progress" },
];

function getProgressForCourse(courseId: string): TrainingProgressData | undefined {
  return mockProgress.find((p) => p.courseId === courseId);
}

function TrainingCard({ module }: { module: TrainingModule }) {
  const progress = getProgressForCourse(module.id);
  const categoryColor = categoryColors[module.category] || "bg-gray-100 text-gray-800";

  return (
    <Card className="flex flex-col h-full hover:shadow-warm transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${categoryColor}`}>
            <Brain className="h-5 w-5" />
          </div>
          {progress?.status === "completed" && (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </Badge>
          )}
          {progress?.status === "in_progress" && (
            <Badge variant="warning" className="gap-1">
              <Play className="h-3 w-3" />
              In Progress
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-3">{module.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {module.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className={categoryColor}>
            {module.category}
          </Badge>
          <Badge variant="secondary">
            {difficultyLabels[module.difficultyLevel]}
          </Badge>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{module.estimatedMinutes} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {module.targetRoles.includes("all")
                ? "All staff"
                : module.targetRoles
                    .map((r) => r.replace("_", " "))
                    .join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Interactive AI conversation</span>
          </div>
        </div>
        {progress?.score && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Score</span>
              <span className="font-medium">{progress.score}%</span>
            </div>
            <Progress value={progress.score} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href={`/dashboard/training/${module.id}`}>
            {progress?.status === "completed" ? (
              <>
                Review Training
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : progress?.status === "in_progress" ? (
              <>
                Continue Training
                <Play className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Start Training
                <Play className="ml-2 h-4 w-4" />
              </>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function TrainingCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...new Set(trainingModules.map((m) => m.category))];

  const filteredModules =
    selectedCategory === "all"
      ? trainingModules
      : trainingModules.filter((m) => m.category === selectedCategory);

  const completedCount = mockProgress.filter((p) => p.status === "completed").length;
  const totalCount = trainingModules.length;
  const overallProgress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <Card className="relative overflow-hidden border-primary/20">
        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32" />
        <CardContent className="relative pt-6 pb-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Training Progress</h2>
                <p className="text-muted-foreground">
                  {completedCount} of {totalCount} modules completed
                </p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Training Feature Highlight */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-teal-600 flex items-center justify-center shrink-0">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI-Powered Interactive Training</h3>
              <p className="text-muted-foreground mt-1">
                Unlike generic compliance videos, our AI trainer engages you in realistic
                conversations. Each scenario is unique and tailored to your role at your practice.
                The AI adapts to your understanding and ensures you truly grasp the concepts.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Badge variant="teal-outline" className="gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  Conversational Learning
                </Badge>
                <Badge variant="teal-outline" className="gap-1.5">
                  <Shield className="h-3.5 w-3.5" />
                  Practice-Specific Scenarios
                </Badge>
                <Badge variant="teal-outline" className="gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Certificate on Completion
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category === "all" ? "All Modules" : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredModules.map((module) => (
              <TrainingCard key={module.id} module={module} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
