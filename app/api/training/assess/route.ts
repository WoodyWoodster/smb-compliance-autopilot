import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  trainingModules,
  generateTrainingSystemPrompt,
  type TrainingContext,
} from "@/lib/ai/training-generator";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { messages, courseId } = await req.json();

    const course = trainingModules.find((m) => m.id === courseId);
    if (!course) {
      return new Response("Course not found", { status: 404 });
    }

    // TODO: Fetch organization context from database
    const context: TrainingContext = {
      organizationType: "dental",
      organizationName: "Sample Dental Practice",
      userRole: course.targetRoles.includes("all") ? "all" : course.targetRoles[0],
      moduleId: courseId,
    };

    const systemPrompt = generateTrainingSystemPrompt(course, context);

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Training assessment error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
