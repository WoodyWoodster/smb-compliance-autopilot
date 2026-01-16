import { hipaaRequirements, type HIPAARequirement } from "./hipaa-requirements";

export interface AssessmentAnswers {
  org_type: string;
  employee_count: string;
  has_electronic_phi: boolean;
  has_paper_records: boolean;
  phi_transmission: string[];
  uses_ehr: boolean;
  uses_cloud_services: boolean;
  has_patient_portal: boolean;
  remote_access: boolean;
  has_business_associates: boolean;
  business_associate_types?: string[];
  processes_payments: boolean;
  files_insurance: boolean;
  has_security_officer: boolean;
  has_privacy_officer: boolean;
  staff_training: boolean;
  has_policies: boolean;
  risk_assessment: boolean;
  had_breach: boolean;
  has_incident_plan: boolean;
}

export interface AssessmentResult {
  applicableRequirements: HIPAARequirement[];
  complianceGaps: {
    requirement: HIPAARequirement;
    gap: string;
    priority: number;
  }[];
  initialScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  recommendedActions: string[];
}

export function analyzeAssessment(answers: AssessmentAnswers): AssessmentResult {
  const applicableRequirements: HIPAARequirement[] = [];
  const complianceGaps: AssessmentResult["complianceGaps"] = [];
  const recommendedActions: string[] = [];

  // All HIPAA requirements apply to covered entities, but we can prioritize
  // based on the organization's specific situation

  // Start with all requirements
  hipaaRequirements.forEach((req) => {
    // All requirements are applicable, but we adjust priority based on answers
    const adjustedReq = { ...req };

    // Increase priority for requirements related to ePHI if they have electronic records
    if (answers.has_electronic_phi && req.category === "technical") {
      adjustedReq.priority = Math.max(1, req.priority - 1) as 1 | 2 | 3;
    }

    // Increase priority for BAA requirements if they use cloud services
    if (answers.uses_cloud_services && req.code === "164.308(b)") {
      adjustedReq.priority = 1;
    }

    // Increase priority for transmission security if they transmit PHI
    if (
      answers.phi_transmission &&
      answers.phi_transmission.length > 0 &&
      req.code === "164.312(e)"
    ) {
      adjustedReq.priority = 1;
    }

    applicableRequirements.push(adjustedReq);
  });

  // Identify compliance gaps based on current practices
  if (!answers.has_security_officer) {
    const req = hipaaRequirements.find((r) => r.code === "164.308(a)(2)");
    if (req) {
      complianceGaps.push({
        requirement: req,
        gap: "No Security Officer has been designated",
        priority: 1,
      });
      recommendedActions.push("Designate a HIPAA Security Officer immediately");
    }
  }

  if (!answers.has_privacy_officer) {
    const req = hipaaRequirements.find((r) => r.code === "164.530(a)");
    if (req) {
      complianceGaps.push({
        requirement: req,
        gap: "No Privacy Officer has been designated",
        priority: 1,
      });
      recommendedActions.push("Designate a HIPAA Privacy Officer immediately");
    }
  }

  if (!answers.risk_assessment) {
    const req = hipaaRequirements.find((r) => r.code === "164.308(a)(1)(ii)(A)");
    if (req) {
      complianceGaps.push({
        requirement: req,
        gap: "No risk assessment conducted in the past year",
        priority: 1,
      });
      recommendedActions.push("Conduct a comprehensive HIPAA risk assessment");
    }
  }

  if (!answers.staff_training) {
    const req = hipaaRequirements.find((r) => r.code === "164.308(a)(5)");
    if (req) {
      complianceGaps.push({
        requirement: req,
        gap: "Staff have not received regular HIPAA training",
        priority: 1,
      });
      recommendedActions.push("Implement HIPAA training program for all staff");
    }
  }

  if (!answers.has_policies) {
    const req = hipaaRequirements.find((r) => r.code === "164.316");
    if (req) {
      complianceGaps.push({
        requirement: req,
        gap: "No written HIPAA policies and procedures",
        priority: 1,
      });
      recommendedActions.push("Develop comprehensive HIPAA policies and procedures");
    }
  }

  if (!answers.has_incident_plan) {
    const req = hipaaRequirements.find((r) => r.code === "164.308(a)(6)");
    if (req) {
      complianceGaps.push({
        requirement: req,
        gap: "No incident response plan in place",
        priority: 1,
      });
      recommendedActions.push("Develop and document an incident response plan");
    }
  }

  if (answers.uses_cloud_services && answers.has_business_associates) {
    const req = hipaaRequirements.find((r) => r.code === "164.308(b)");
    if (req) {
      complianceGaps.push({
        requirement: req,
        gap: "Business Associate Agreements may be needed for cloud vendors",
        priority: 1,
      });
      recommendedActions.push("Review and obtain BAAs from all business associates");
    }
  }

  if (answers.had_breach && !answers.has_incident_plan) {
    recommendedActions.unshift(
      "URGENT: Previous breach detected without incident plan - prioritize breach notification compliance"
    );
  }

  // Calculate initial score based on current practices
  let score = 0;
  const scoreFactors = [
    { condition: answers.has_security_officer, weight: 10 },
    { condition: answers.has_privacy_officer, weight: 10 },
    { condition: answers.risk_assessment, weight: 15 },
    { condition: answers.staff_training, weight: 15 },
    { condition: answers.has_policies, weight: 15 },
    { condition: answers.has_incident_plan, weight: 10 },
    { condition: !answers.had_breach, weight: 10 },
    {
      condition: !answers.uses_cloud_services || answers.has_business_associates,
      weight: 10,
    },
  ];

  scoreFactors.forEach((factor) => {
    if (factor.condition) {
      score += factor.weight;
    }
  });

  // Determine risk level
  let riskLevel: AssessmentResult["riskLevel"] = "low";
  if (complianceGaps.length >= 5 || score < 30) {
    riskLevel = "critical";
  } else if (complianceGaps.length >= 3 || score < 50) {
    riskLevel = "high";
  } else if (complianceGaps.length >= 1 || score < 70) {
    riskLevel = "medium";
  }

  // Boost score if they had prior breach exposure (higher awareness)
  if (answers.had_breach && answers.has_incident_plan) {
    score = Math.min(100, score + 5);
  }

  return {
    applicableRequirements: applicableRequirements.sort(
      (a, b) => a.priority - b.priority
    ),
    complianceGaps: complianceGaps.sort((a, b) => a.priority - b.priority),
    initialScore: Math.round(score),
    riskLevel,
    recommendedActions,
  };
}

export function getComplianceScore(
  totalRequirements: number,
  completedRequirements: number
): number {
  if (totalRequirements === 0) return 0;
  return Math.round((completedRequirements / totalRequirements) * 100);
}
