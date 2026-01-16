import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText, streamText } from "ai";

// Initialize AI providers
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface PolicyGenerationContext {
  organizationType: string;
  organizationName: string;
  employeeCount: string;
  state?: string;
  hasElectronicPhi: boolean;
  usesCloudServices: boolean;
  hasPatientPortal: boolean;
  additionalContext?: string;
}

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  category: "privacy" | "security" | "breach" | "administrative";
  sections: string[];
  requiredContext: string[];
  estimatedLength: string;
}

export const policyTemplates: PolicyTemplate[] = [
  {
    id: "privacy_policy",
    name: "Notice of Privacy Practices",
    description:
      "Required HIPAA document explaining how patient PHI is used and disclosed",
    category: "privacy",
    sections: [
      "How We Use Your Health Information",
      "Your Rights Regarding Your Health Information",
      "Our Responsibilities",
      "Changes to This Notice",
      "Complaints",
    ],
    requiredContext: ["organizationName", "organizationType", "state"],
    estimatedLength: "4-6 pages",
  },
  {
    id: "security_policy",
    name: "Security Policy",
    description:
      "Comprehensive policy covering administrative, physical, and technical safeguards",
    category: "security",
    sections: [
      "Security Management",
      "Access Controls",
      "Audit Controls",
      "Physical Safeguards",
      "Technical Safeguards",
      "Workforce Security",
    ],
    requiredContext: [
      "organizationName",
      "hasElectronicPhi",
      "usesCloudServices",
    ],
    estimatedLength: "8-12 pages",
  },
  {
    id: "breach_notification",
    name: "Breach Notification Policy",
    description:
      "Procedures for identifying, responding to, and reporting data breaches",
    category: "breach",
    sections: [
      "Breach Definition",
      "Detection and Identification",
      "Risk Assessment",
      "Notification Procedures",
      "Documentation Requirements",
    ],
    requiredContext: ["organizationName", "organizationType"],
    estimatedLength: "3-5 pages",
  },
  {
    id: "baa_template",
    name: "Business Associate Agreement",
    description: "Standard BAA template for vendors with access to PHI",
    category: "administrative",
    sections: [
      "Definitions",
      "Permitted Uses and Disclosures",
      "Obligations of Business Associate",
      "Obligations of Covered Entity",
      "Term and Termination",
    ],
    requiredContext: ["organizationName"],
    estimatedLength: "4-6 pages",
  },
  {
    id: "risk_assessment",
    name: "Risk Assessment Template",
    description: "Framework for conducting annual HIPAA risk assessments",
    category: "security",
    sections: [
      "Scope and Methodology",
      "Asset Inventory",
      "Threat Identification",
      "Vulnerability Assessment",
      "Risk Analysis",
      "Mitigation Recommendations",
    ],
    requiredContext: ["organizationName", "hasElectronicPhi"],
    estimatedLength: "6-10 pages",
  },
  {
    id: "incident_response",
    name: "Incident Response Plan",
    description: "Procedures for responding to security incidents",
    category: "security",
    sections: [
      "Incident Classification",
      "Response Team",
      "Detection and Analysis",
      "Containment and Eradication",
      "Recovery",
      "Post-Incident Review",
    ],
    requiredContext: ["organizationName", "employeeCount"],
    estimatedLength: "5-8 pages",
  },
  {
    id: "training_policy",
    name: "HIPAA Training Policy",
    description: "Policy for workforce HIPAA training requirements",
    category: "administrative",
    sections: [
      "Training Requirements",
      "Training Content",
      "Training Schedule",
      "Documentation",
      "Non-Compliance Consequences",
    ],
    requiredContext: ["organizationName", "employeeCount"],
    estimatedLength: "2-4 pages",
  },
  {
    id: "workstation_policy",
    name: "Workstation Use Policy",
    description: "Guidelines for secure use of workstations accessing PHI",
    category: "security",
    sections: [
      "Workstation Requirements",
      "Physical Security",
      "Access Controls",
      "Acceptable Use",
      "Remote Access",
    ],
    requiredContext: ["organizationName", "hasElectronicPhi"],
    estimatedLength: "2-4 pages",
  },
];

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

export async function generatePolicy(
  templateId: string,
  context: PolicyGenerationContext,
  useStreaming: boolean = false
): Promise<string | ReadableStream<string>> {
  const template = policyTemplates.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const practiceTypeDescriptions: Record<string, string> = {
    dental: "dental practice providing general dentistry and oral health services",
    chiropractic: "chiropractic office providing spinal adjustments and musculoskeletal care",
    med_spa: "medical spa providing aesthetic treatments and wellness services under medical supervision",
    physical_therapy: "physical therapy clinic providing rehabilitation and movement therapy",
    optometry: "optometry practice providing vision care and eye health services",
    mental_health: "mental health practice providing counseling and psychiatric services",
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

  // Use Claude for policy generation (better for long-form content)
  const model = anthropic("claude-sonnet-4-20250514");

  if (useStreaming) {
    const result = await streamText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
    });
    return result.textStream;
  } else {
    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: userPrompt,
    });
    return result.text;
  }
}

export function getPolicyTemplate(templateId: string): PolicyTemplate | undefined {
  return policyTemplates.find((t) => t.id === templateId);
}

export function getPolicyTemplatesByCategory(
  category: PolicyTemplate["category"]
): PolicyTemplate[] {
  return policyTemplates.filter((t) => t.category === category);
}
