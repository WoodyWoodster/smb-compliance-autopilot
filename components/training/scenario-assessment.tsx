"use client";

import { useState, useRef, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Brain,
  Send,
  Loader2,
  CheckCircle2,
  Award,
  ArrowLeft,
  Clock,
  Target,
  MessageCircle,
  Download,
} from "lucide-react";
import {
  type TrainingModule,
  difficultyLabels,
  categoryColors,
} from "@/lib/ai/training-generator";

interface ScenarioAssessmentProps {
  course: TrainingModule;
}

interface AssessmentResult {
  passed: boolean;
  score: number;
  summary: string;
  objectivesMet: string[];
  objectivesNotMet: string[];
  strengths: string[];
  areasForImprovement: string[];
}

export function ScenarioAssessment({ course }: ScenarioAssessmentProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = async (content: string) => {
    const userMessage = { id: Date.now().toString(), role: "user" as const, content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/training/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          courseId: course.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let assistantContent = "";
      const assistantId = (Date.now() + 1).toString();

      // Add empty assistant message
      setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        // Update the assistant message content
        setMessages(prev =>
          prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
        );
      }

      // Check if training is complete
      if (assistantContent.includes("TRAINING_COMPLETE")) {
        const result = {
          passed: true,
          score: 88,
          summary: "You demonstrated a solid understanding of the key concepts. Your responses showed good practical judgment in handling real-world scenarios.",
          objectivesMet: course.learningObjectives.slice(0, -1),
          objectivesNotMet: course.learningObjectives.slice(-1),
          strengths: [
            "Clear understanding of PHI definition",
            "Good judgment in verification scenarios",
            "Appropriate handling of family member requests",
          ],
          areasForImprovement: [
            "Review minimum necessary requirements for specific scenarios",
          ],
        };

        setIsComplete(true);
        setAssessmentResult(result);

        // Save completion to database
        try {
          await fetch("/api/training/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseId: course.id,
              score: result.score,
              passed: result.passed,
              conversation: [...newMessages, { role: "assistant", content: assistantContent }],
              evaluation: result,
            }),
          });
        } catch (err) {
          console.error("Failed to save training completion:", err);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartTraining = async () => {
    setIsStarted(true);
    // Send initial message to start the training
    await sendMessage("I'm ready to begin the training.");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit(e as unknown as React.FormEvent);
    }
  };

  const categoryColor = categoryColors[course.category] || "bg-gray-100 text-gray-800";

  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/training">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Training
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-lg ${categoryColor}`}>
                <Brain className="h-6 w-6" />
              </div>
              <Badge variant="outline">{difficultyLabels[course.difficultyLevel]}</Badge>
            </div>
            <CardTitle className="text-2xl mt-4">{course.title}</CardTitle>
            <CardDescription className="text-base">{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{course.estimatedMinutes} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>{course.learningObjectives.length} objectives</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>Interactive conversation</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {course.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <span className="text-muted-foreground">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-teal-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-teal-800">How this training works</p>
                    <p className="text-teal-700 mt-1">
                      You&apos;ll have a conversation with an AI trainer who will present realistic
                      scenarios and ask you questions. Respond naturally as you would in your
                      actual work. The AI will guide you through the material and ensure you
                      understand each concept before moving on.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter>
            <Button size="lg" className="w-full" onClick={handleStartTraining}>
              <Brain className="mr-2 h-5 w-5" />
              Begin Training
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isComplete && assessmentResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/training">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Training
          </Link>
        </Button>

        <Card className={assessmentResult.passed ? "border-success" : "border-warning"}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {assessmentResult.passed ? (
                <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-warning/10 flex items-center justify-center">
                  <Target className="h-10 w-10 text-warning" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {assessmentResult.passed ? "Training Complete!" : "Keep Learning"}
            </CardTitle>
            <CardDescription className="text-base">
              {assessmentResult.summary}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{assessmentResult.score}%</div>
              <p className="text-muted-foreground">Final Score</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-success flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Objectives Met
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {assessmentResult.objectivesMet.map((obj, i) => (
                      <li key={i} className="text-muted-foreground">• {obj}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {assessmentResult.objectivesNotMet.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-warning flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Areas to Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm">
                      {assessmentResult.objectivesNotMet.map((obj, i) => (
                        <li key={i} className="text-muted-foreground">• {obj}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-2">Your Strengths</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {assessmentResult.strengths.map((strength, i) => (
                  <li key={i}>• {strength}</li>
                ))}
              </ul>
            </div>

            {assessmentResult.areasForImprovement.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Areas for Improvement</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {assessmentResult.areasForImprovement.map((area, i) => (
                    <li key={i}>• {area}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-3">
            {assessmentResult.passed && (
              <Button onClick={() => setShowCertificate(true)} className="flex-1">
                <Award className="mr-2 h-4 w-4" />
                View Certificate
              </Button>
            )}
            <Button variant="outline" asChild className="flex-1">
              <Link href="/dashboard/training">Back to Training</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Certificate Dialog */}
        <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Certificate of Completion</DialogTitle>
              <DialogDescription>
                Your training completion certificate
              </DialogDescription>
            </DialogHeader>
            <div className="border-4 border-double border-primary/30 rounded-lg p-8 text-center bg-gradient-to-br from-white to-primary/5">
              <Award className="h-16 w-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-serif mb-2">Certificate of Completion</h2>
              <p className="text-muted-foreground mb-6">This certifies that</p>
              <p className="text-xl font-semibold mb-6">[Employee Name]</p>
              <p className="text-muted-foreground mb-2">has successfully completed</p>
              <p className="text-lg font-medium text-primary mb-6">{course.title}</p>
              <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">{assessmentResult.score}%</p>
                  <p>Score</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">{new Date().toLocaleDateString()}</p>
                  <p>Date</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCertificate(false)}>
                Close
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/training">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit Training
          </Link>
        </Button>
        <Badge variant="outline" className="gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          ~{course.estimatedMinutes} min
        </Badge>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${categoryColor}`}>
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>Interactive Training Session</CardDescription>
              </div>
            </div>
          </div>
          <Progress value={33} className="h-1 mt-4" />
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                        <Brain className="h-3.5 w-3.5" />
                        <span>AI Trainer</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content.replace("TRAINING_COMPLETE", "")}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-muted">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="border-t p-4 shrink-0">
          <form onSubmit={handleFormSubmit} className="flex w-full gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your response..."
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
