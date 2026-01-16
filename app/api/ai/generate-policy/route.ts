import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import {
  policyTemplates,
  type PolicyGenerationContext,
} from "@/lib/ai/policy-generator";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  checkAIUsageLimit,
  incrementAIUsage,
} from "@/lib/ai/usage-limits";

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const systemPrompt = `You are a HIPAA compliance expert and policy writer for small healthcare practices.
Your role is to generate professional, legally-sound HIPAA policies that are:
1. Compliant with current HIPAA regulations (Privacy Rule, Security Rule, Breach Notification Rule)
2. Appropriate for the size and type of healthcare practice
3. Clear, practical, and easy for small practices to implement
4. Written in professional but accessible language

Important guidelines:
- Always include the date the policy was created/revised
- Include placeholder fields like [PRACTICE NAME] and [EFFECTIVE DATE] where appropriate
- Reference specific HIPAA regulation sections (e.g., 45 CFR 164.530)
- Include both the regulatory requirement and practical implementation steps
- Tailor language to the specific type of healthcare practice (dental, chiropractic, med spa, etc.)
- For small practices, keep procedures simple and achievable
- Always include a section about employee training and acknowledgment
- Include a review/update schedule

DISCLAIMER: Always include a disclaimer that this policy template should be reviewed by a qualified healthcare attorney before implementation.`;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization
    const [user] = await db
      .select({
        organizationId: users.organizationId,
      })
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (!user?.organizationId) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 400 }
      );
    }

    // Check AI usage limit
    const usageLimit = await checkAIUsageLimit(user.organizationId);
    if (!usageLimit.allowed) {
      return NextResponse.json(
        {
          error: "AI generation limit reached",
          limit: usageLimit.limit,
          remaining: usageLimit.remaining,
          resetAt: usageLimit.resetAt.toISOString(),
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { templateId, context } = body as {
      templateId: string;
      context: PolicyGenerationContext;
    };

    const template = policyTemplates.find((t) => t.id === templateId);
    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 400 }
      );
    }

    const practiceTypeDescriptions: Record<string, string> = {
      dental:
        "dental practice providing general dentistry and oral health services",
      chiropractic:
        "chiropractic office providing spinal adjustments and musculoskeletal care",
      med_spa:
        "medical spa providing aesthetic treatments and wellness services under medical supervision",
      physical_therapy:
        "physical therapy clinic providing rehabilitation and movement therapy",
      optometry:
        "optometry practice providing vision care and eye health services",
      mental_health:
        "mental health practice providing counseling and psychiatric services",
      other: "healthcare practice",
    };

    const userPrompt = `Generate a complete ${template.name} for the following healthcare organization:

Organization Details:
- Name: ${context.organizationName || "[PRACTICE NAME]"}
- Type: ${practiceTypeDescriptions[context.organizationType] || context.organizationType}
- Number of Employees: ${context.employeeCount}
- State: ${context.state || "[STATE]"}
- Uses Electronic PHI: ${context.hasElectronicPhi ? "Yes" : "No"}
- Uses Cloud Services: ${context.usesCloudServices ? "Yes" : "No"}
- Has Patient Portal: ${context.hasPatientPortal ? "Yes" : "No"}
${context.additionalContext ? `- Additional Context: ${context.additionalContext}` : ""}

Policy Requirements:
${template.description}

Required Sections:
${template.sections.map((s, i) => `${i + 1}. ${s}`).join("\n")}

Please generate a comprehensive, professionally-formatted policy document that covers all required sections.
Use clear headers, numbered sections, and bullet points where appropriate.
The policy should be approximately ${template.estimatedLength}.`;

    // Increment usage before streaming
    await incrementAIUsage(user.organizationId);

    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      system: systemPrompt,
      prompt: userPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Policy generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate policy" },
      { status: 500 }
    );
  }
}
