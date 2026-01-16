export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  description?: string;
  type: "boolean" | "select" | "multi-select" | "number";
  options?: { value: string; label: string }[];
  required: boolean;
  hipaaTriggers?: string[]; // Requirement codes that are triggered if answered "yes"
}

export const assessmentQuestions: AssessmentQuestion[] = [
  // Organization Profile
  {
    id: "org_type",
    category: "Organization Profile",
    question: "What type of healthcare practice do you operate?",
    type: "select",
    options: [
      { value: "dental", label: "Dental Practice" },
      { value: "chiropractic", label: "Chiropractic Office" },
      { value: "med_spa", label: "Medical Spa" },
      { value: "physical_therapy", label: "Physical Therapy" },
      { value: "optometry", label: "Optometry" },
      { value: "mental_health", label: "Mental Health / Counseling" },
      { value: "other", label: "Other Healthcare Practice" },
    ],
    required: true,
  },
  {
    id: "employee_count",
    category: "Organization Profile",
    question: "How many employees work at your practice?",
    description: "Include all staff who may have access to patient information",
    type: "select",
    options: [
      { value: "1-5", label: "1-5 employees" },
      { value: "6-15", label: "6-15 employees" },
      { value: "16-50", label: "16-50 employees" },
      { value: "51+", label: "51+ employees" },
    ],
    required: true,
  },

  // PHI Handling
  {
    id: "has_electronic_phi",
    category: "Protected Health Information",
    question: "Do you create, receive, maintain, or transmit electronic Protected Health Information (ePHI)?",
    description: "This includes patient records in EHR systems, emails with patient info, digital X-rays, etc.",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.308", "164.310", "164.312"], // Administrative, Physical, Technical safeguards
  },
  {
    id: "has_paper_records",
    category: "Protected Health Information",
    question: "Do you maintain paper records containing patient health information?",
    description: "This includes paper charts, printed lab results, intake forms, etc.",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.530"], // Physical safeguards for paper
  },
  {
    id: "phi_transmission",
    category: "Protected Health Information",
    question: "How do you transmit patient information?",
    type: "multi-select",
    options: [
      { value: "email", label: "Email" },
      { value: "fax", label: "Fax" },
      { value: "portal", label: "Patient Portal" },
      { value: "phone", label: "Phone/Voicemail" },
      { value: "mail", label: "Physical Mail" },
      { value: "text", label: "Text/SMS" },
    ],
    required: true,
    hipaaTriggers: ["164.312(e)"], // Transmission security
  },

  // Technology & Systems
  {
    id: "uses_ehr",
    category: "Technology & Systems",
    question: "Do you use an Electronic Health Record (EHR) system?",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.312(a)", "164.312(b)"], // Access controls, audit controls
  },
  {
    id: "uses_cloud_services",
    category: "Technology & Systems",
    question: "Do you use cloud-based services to store or process patient data?",
    description: "This includes cloud EHR, email services, backup services, practice management software, etc.",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.308(b)"], // Business associate agreements
  },
  {
    id: "has_patient_portal",
    category: "Technology & Systems",
    question: "Do you provide patients with online access to their health records?",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.312(d)"], // Person or entity authentication
  },
  {
    id: "remote_access",
    category: "Technology & Systems",
    question: "Can staff access patient information remotely (from home, mobile devices)?",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.310(b)", "164.312(a)(2)"], // Workstation use, remote access
  },

  // Business Relationships
  {
    id: "has_business_associates",
    category: "Business Relationships",
    question: "Do you share patient information with any third-party vendors or services?",
    description: "Examples: billing services, IT support, transcription services, cloud providers, shredding companies",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.308(b)", "164.504(e)"], // BAA requirements
  },
  {
    id: "business_associate_types",
    category: "Business Relationships",
    question: "Which types of vendors have access to your patient information?",
    type: "multi-select",
    options: [
      { value: "billing", label: "Billing/Revenue Cycle" },
      { value: "it_support", label: "IT Support/MSP" },
      { value: "cloud_storage", label: "Cloud Storage/Backup" },
      { value: "ehr_vendor", label: "EHR Vendor" },
      { value: "transcription", label: "Transcription Services" },
      { value: "shredding", label: "Shredding/Disposal" },
      { value: "labs", label: "Laboratories" },
      { value: "clearinghouse", label: "Clearinghouse" },
      { value: "email", label: "Email Provider" },
      { value: "other", label: "Other" },
    ],
    required: false,
  },

  // Financial Information
  {
    id: "processes_payments",
    category: "Financial & Insurance",
    question: "Do you process credit/debit card payments at your practice?",
    type: "boolean",
    required: true,
    hipaaTriggers: [], // PCI-DSS, not HIPAA
  },
  {
    id: "files_insurance",
    category: "Financial & Insurance",
    question: "Do you file insurance claims electronically?",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.308(a)(4)"], // Information access management
  },

  // Security Practices
  {
    id: "has_security_officer",
    category: "Current Security Practices",
    question: "Have you designated a HIPAA Security Officer?",
    description: "This can be the practice owner, office manager, or another staff member",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.308(a)(2)"], // Assigned security responsibility
  },
  {
    id: "has_privacy_officer",
    category: "Current Security Practices",
    question: "Have you designated a HIPAA Privacy Officer?",
    description: "This can be the same person as the Security Officer",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.530(a)(1)"], // Privacy officer designation
  },
  {
    id: "staff_training",
    category: "Current Security Practices",
    question: "Do you conduct regular HIPAA training for all staff?",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.308(a)(5)", "164.530(b)"], // Security awareness training
  },
  {
    id: "has_policies",
    category: "Current Security Practices",
    question: "Do you have written HIPAA policies and procedures?",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.316", "164.530(i)"], // Policies and documentation
  },
  {
    id: "risk_assessment",
    category: "Current Security Practices",
    question: "Have you conducted a HIPAA risk assessment in the past year?",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.308(a)(1)(ii)(A)"], // Risk analysis
  },

  // Incident History
  {
    id: "had_breach",
    category: "Incident History",
    question: "Has your practice ever experienced a data breach or security incident?",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.308(a)(6)", "164.404"], // Incident procedures, breach notification
  },
  {
    id: "has_incident_plan",
    category: "Incident History",
    question: "Do you have an incident response plan for potential data breaches?",
    type: "boolean",
    required: true,
    hipaaTriggers: ["164.308(a)(6)"], // Security incident procedures
  },
];

export const assessmentCategories = [
  "Organization Profile",
  "Protected Health Information",
  "Technology & Systems",
  "Business Relationships",
  "Financial & Insurance",
  "Current Security Practices",
  "Incident History",
];

export function getQuestionsByCategory(category: string): AssessmentQuestion[] {
  return assessmentQuestions.filter((q) => q.category === category);
}
