export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  category: string;
  targetRoles: ("front_desk" | "clinical" | "admin" | "all")[];
  relatedRequirements: string[];
  estimatedMinutes: number;
  difficultyLevel: 1 | 2 | 3;
  learningObjectives: string[];
}

export const trainingModules: TrainingModule[] = [
  {
    id: "hipaa-privacy-basics",
    title: "HIPAA Privacy Basics",
    description:
      "Learn the fundamentals of protecting patient health information (PHI) and understanding patient privacy rights.",
    category: "Privacy Rule",
    targetRoles: ["all"],
    relatedRequirements: ["164.502", "164.514"],
    estimatedMinutes: 20,
    difficultyLevel: 1,
    learningObjectives: [
      "Define Protected Health Information (PHI)",
      "Identify the 18 PHI identifiers",
      "Understand patient rights under HIPAA",
      "Recognize when PHI can be disclosed without authorization",
    ],
  },
  {
    id: "minimum-necessary-rule",
    title: "Minimum Necessary Rule",
    description:
      "Understand how to limit PHI access and disclosure to only what is needed for a specific purpose.",
    category: "Privacy Rule",
    targetRoles: ["all"],
    relatedRequirements: ["164.502(b)", "164.514(d)"],
    estimatedMinutes: 15,
    difficultyLevel: 1,
    learningObjectives: [
      "Explain the minimum necessary standard",
      "Apply minimum necessary to daily tasks",
      "Determine when minimum necessary applies",
      "Handle requests for patient information appropriately",
    ],
  },
  {
    id: "front-desk-phi-handling",
    title: "Front Desk PHI Handling",
    description:
      "Best practices for handling patient information at the front desk, including phone calls, check-ins, and visitor management.",
    category: "Privacy Rule",
    targetRoles: ["front_desk"],
    relatedRequirements: ["164.502", "164.530(c)"],
    estimatedMinutes: 25,
    difficultyLevel: 1,
    learningObjectives: [
      "Verify patient identity before sharing information",
      "Handle phone inquiries about patients appropriately",
      "Manage sign-in sheets and waiting room privacy",
      "Respond to family member requests for information",
    ],
  },
  {
    id: "security-awareness",
    title: "Security Awareness Training",
    description:
      "Learn to identify and prevent common security threats including phishing, social engineering, and unauthorized access.",
    category: "Security Rule",
    targetRoles: ["all"],
    relatedRequirements: ["164.308(a)(5)", "164.312(a)(1)"],
    estimatedMinutes: 30,
    difficultyLevel: 2,
    learningObjectives: [
      "Identify phishing emails and social engineering attempts",
      "Create and manage strong passwords",
      "Recognize suspicious system behavior",
      "Report security incidents properly",
    ],
  },
  {
    id: "workstation-security",
    title: "Workstation Security",
    description:
      "Proper use and security of computers and devices that access patient information.",
    category: "Security Rule",
    targetRoles: ["all"],
    relatedRequirements: ["164.310(b)", "164.310(c)"],
    estimatedMinutes: 15,
    difficultyLevel: 1,
    learningObjectives: [
      "Lock workstations when stepping away",
      "Position screens to prevent unauthorized viewing",
      "Properly log out of systems",
      "Handle portable devices securely",
    ],
  },
  {
    id: "breach-notification",
    title: "Breach Identification & Reporting",
    description:
      "Learn to identify potential breaches and understand the proper reporting procedures.",
    category: "Breach Notification",
    targetRoles: ["all"],
    relatedRequirements: ["164.400", "164.402", "164.404"],
    estimatedMinutes: 20,
    difficultyLevel: 2,
    learningObjectives: [
      "Define what constitutes a breach",
      "Identify potential breach scenarios",
      "Know the internal reporting process",
      "Understand breach notification requirements",
    ],
  },
  {
    id: "clinical-documentation",
    title: "Clinical Documentation & Access",
    description:
      "Proper documentation practices and accessing patient records for clinical staff.",
    category: "Privacy Rule",
    targetRoles: ["clinical"],
    relatedRequirements: ["164.524", "164.526", "164.528"],
    estimatedMinutes: 25,
    difficultyLevel: 2,
    learningObjectives: [
      "Document patient encounters appropriately",
      "Access only records needed for treatment",
      "Handle patient requests for record access",
      "Manage amendments to medical records",
    ],
  },
  {
    id: "business-associates",
    title: "Working with Business Associates",
    description:
      "Understanding Business Associate relationships and your responsibilities when sharing PHI with vendors.",
    category: "Administrative",
    targetRoles: ["admin"],
    relatedRequirements: ["164.308(b)", "164.502(e)"],
    estimatedMinutes: 20,
    difficultyLevel: 3,
    learningObjectives: [
      "Identify when a vendor is a Business Associate",
      "Understand BAA requirements",
      "Monitor BA compliance",
      "Handle BA breaches appropriately",
    ],
  },
];

export interface TrainingContext {
  organizationType: string;
  organizationName: string;
  userRole: string;
  moduleId: string;
}

export function generateTrainingSystemPrompt(
  module: TrainingModule,
  context: TrainingContext
): string {
  const roleDescriptions: Record<string, string> = {
    front_desk: "a front desk staff member who handles patient check-ins, phone calls, and scheduling",
    clinical: "a clinical staff member who provides patient care and accesses medical records",
    admin: "an administrative staff member who handles operations, compliance, and vendor management",
    all: "a healthcare staff member",
  };

  const practiceDescriptions: Record<string, string> = {
    dental: "dental practice",
    chiropractic: "chiropractic office",
    med_spa: "medical spa",
    physical_therapy: "physical therapy clinic",
    optometry: "optometry practice",
    mental_health: "mental health practice",
    other: "healthcare practice",
  };

  const roleDesc = roleDescriptions[context.userRole] || roleDescriptions.all;
  const practiceDesc = practiceDescriptions[context.organizationType] || practiceDescriptions.other;

  return `You are an expert HIPAA compliance trainer conducting an interactive, conversational training session. You work for ${context.organizationName || "a healthcare practice"}, which is a ${practiceDesc}.

You are training ${roleDesc}.

## Training Module: ${module.title}
${module.description}

## Learning Objectives
${module.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}

## Your Teaching Approach
- Use the Socratic method: Ask questions, let the learner reason through scenarios
- Present realistic scenarios specific to a ${practiceDesc}
- Never lecture - engage in dialogue
- When the learner gives a correct answer, acknowledge it briefly and move on
- When the learner is wrong or confused, ask follow-up questions to guide them
- Use the learner's responses to gauge understanding and adjust difficulty
- Be encouraging but don't over-praise

## Conversation Structure
1. Start with a brief introduction (2-3 sentences) about what you'll cover
2. Present a realistic scenario and ask the learner what they would do
3. Based on their response, either:
   - If correct: Briefly confirm and present a more challenging scenario
   - If incorrect: Ask probing questions to help them think through it
4. Cover all learning objectives through scenarios, not lecture
5. After covering all objectives, summarize key takeaways
6. End with "TRAINING_COMPLETE" when you're confident they understand the material

## Response Format
- Keep responses concise (2-4 paragraphs max)
- Use a conversational, supportive tone
- Include one question at a time for the learner to respond to
- Use specific names and details in scenarios (e.g., "Mrs. Johnson" not "a patient")

## Important Rules
- Never provide a list of "correct answers" upfront
- Don't reveal whether an answer is correct until you've asked follow-up questions
- If the learner asks for the answer directly, redirect with "Let's think through this together..."
- Generate unique scenarios each time - never repeat the exact same scenario
- Keep track of which learning objectives have been demonstrated`;
}

export function generateAssessmentPrompt(
  conversation: Array<{ role: string; content: string }>,
  module: TrainingModule
): string {
  const conversationText = conversation
    .map((msg) => `${msg.role === "user" ? "Learner" : "Trainer"}: ${msg.content}`)
    .join("\n\n");

  return `Based on the following training conversation, evaluate the learner's understanding.

## Learning Objectives
${module.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}

## Conversation
${conversationText}

## Evaluation Instructions
Provide a JSON response with the following structure:
{
  "passed": boolean (true if learner demonstrated understanding of at least 80% of objectives),
  "score": number (0-100 percentage score),
  "summary": "Brief 2-3 sentence summary of performance",
  "objectivesMet": ["list of objectives the learner demonstrated understanding of"],
  "objectivesNotMet": ["list of objectives that need more work"],
  "strengths": ["specific things the learner did well"],
  "areasForImprovement": ["specific areas to focus on"]
}

Respond only with the JSON object, no other text.`;
}

export const difficultyLabels: Record<number, string> = {
  1: "Beginner",
  2: "Intermediate",
  3: "Advanced",
};

export const categoryColors: Record<string, string> = {
  "Privacy Rule": "bg-teal-100 text-teal-800",
  "Security Rule": "bg-blue-100 text-blue-800",
  "Breach Notification": "bg-coral-100 text-coral-800",
  Administrative: "bg-violet-100 text-violet-800",
};
