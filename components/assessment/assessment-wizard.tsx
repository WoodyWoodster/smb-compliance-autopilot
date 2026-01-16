"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  assessmentCategories,
  getQuestionsByCategory,
  type AssessmentQuestion,
} from "@/lib/compliance/assessment-questions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface AssessmentWizardProps {
  existingAnswers?: Record<string, unknown>;
  onComplete?: (answers: Record<string, unknown>) => void;
}

export function AssessmentWizard({
  existingAnswers = {},
  onComplete,
}: AssessmentWizardProps) {
  const router = useRouter();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>(existingAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCategory = assessmentCategories[currentCategoryIndex];
  const questions = getQuestionsByCategory(currentCategory);
  const totalCategories = assessmentCategories.length;
  const progress = ((currentCategoryIndex + 1) / totalCategories) * 100;

  const handleAnswer = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelectAnswer = (
    questionId: string,
    value: string,
    checked: boolean
  ) => {
    setAnswers((prev) => {
      const currentValues = (prev[questionId] as string[]) || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentValues, value] };
      } else {
        return {
          ...prev,
          [questionId]: currentValues.filter((v) => v !== value),
        };
      }
    });
  };

  const isCurrentCategoryComplete = () => {
    return questions.every((q) => {
      if (!q.required) return true;
      const answer = answers[q.id];
      if (answer === undefined || answer === null) return false;
      if (Array.isArray(answer)) return answer.length > 0;
      if (typeof answer === "string") return answer.length > 0;
      return true;
    });
  };

  const handleNext = () => {
    if (!isCurrentCategoryComplete()) {
      toast.error("Please answer all required questions before continuing");
      return;
    }

    if (currentCategoryIndex < totalCategories - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isCurrentCategoryComplete()) {
      toast.error("Please answer all required questions before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, this would save to the database
      // For now, we'll just simulate and store in localStorage for demo
      localStorage.setItem("assessmentAnswers", JSON.stringify(answers));

      if (onComplete) {
        onComplete(answers);
      }

      toast.success("Assessment completed successfully!");
      router.push("/dashboard/requirements");
    } catch (error) {
      console.error("Failed to submit assessment:", error);
      toast.error("Failed to submit assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: AssessmentQuestion) => {
    switch (question.type) {
      case "boolean":
        return (
          <RadioGroup
            value={answers[question.id]?.toString()}
            onValueChange={(value) =>
              handleAnswer(question.id, value === "true")
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-yes`} />
              <Label htmlFor={`${question.id}-yes`}>Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-no`} />
              <Label htmlFor={`${question.id}-no`}>No</Label>
            </div>
          </RadioGroup>
        );

      case "select":
        return (
          <Select
            value={answers[question.id] as string}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multi-select":
        const selectedValues = (answers[question.id] as string[]) || [];
        return (
          <div className="grid gap-3 sm:grid-cols-2">
            {question.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option.value}`}
                  checked={selectedValues.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleMultiSelectAnswer(
                      question.id,
                      option.value,
                      checked as boolean
                    )
                  }
                />
                <Label
                  htmlFor={`${question.id}-${option.value}`}
                  className="text-sm font-normal"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Section {currentCategoryIndex + 1} of {totalCategories}
          </span>
          <span className="font-medium">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Category indicators */}
      <div className="flex flex-wrap gap-2">
        {assessmentCategories.map((category, index) => {
          const categoryQuestions = getQuestionsByCategory(category);
          const isComplete = categoryQuestions.every((q) => {
            if (!q.required) return true;
            const answer = answers[q.id];
            return answer !== undefined && answer !== null;
          });

          return (
            <button
              key={category}
              onClick={() => setCurrentCategoryIndex(index)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                index === currentCategoryIndex
                  ? "bg-primary text-primary-foreground"
                  : isComplete
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {isComplete && <CheckCircle2 className="h-3 w-3" />}
              {category}
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <Card>
        <CardHeader>
          <CardTitle>{currentCategory}</CardTitle>
          <CardDescription>
            Please answer the following questions about your practice
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-base">
                  {index + 1}. {question.question}
                  {question.required && (
                    <span className="ml-1 text-red-500">*</span>
                  )}
                </Label>
                {question.description && (
                  <p className="text-sm text-muted-foreground">
                    {question.description}
                  </p>
                )}
              </div>
              {renderQuestion(question)}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCategoryIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          {currentCategoryIndex < totalCategories - 1 ? (
            <Button onClick={handleNext} disabled={!isCurrentCategoryComplete()}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isCurrentCategoryComplete() || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Complete Assessment"}
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
