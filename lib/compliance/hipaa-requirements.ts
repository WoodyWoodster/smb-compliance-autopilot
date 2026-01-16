export interface HIPAARequirement {
  code: string;
  title: string;
  description: string;
  category: "administrative" | "physical" | "technical" | "privacy" | "breach";
  subcategory: string;
  priority: 1 | 2 | 3; // 1 = High, 2 = Medium, 3 = Low
  applicableTo: string[]; // Organization types this applies to
  evidenceRequired: string;
  tasks: {
    title: string;
    description: string;
    frequency: "one_time" | "daily" | "weekly" | "monthly" | "quarterly" | "annually";
  }[];
}

export const hipaaRequirements: HIPAARequirement[] = [
  // Administrative Safeguards (164.308)
  {
    code: "164.308(a)(1)(i)",
    title: "Security Management Process",
    description:
      "Implement policies and procedures to prevent, detect, contain, and correct security violations.",
    category: "administrative",
    subcategory: "Security Management",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Written security policies and procedures",
    tasks: [
      {
        title: "Develop Security Policies",
        description: "Create comprehensive security policies covering all aspects of PHI protection",
        frequency: "one_time",
      },
      {
        title: "Review Security Policies",
        description: "Annual review and update of security policies",
        frequency: "annually",
      },
    ],
  },
  {
    code: "164.308(a)(1)(ii)(A)",
    title: "Risk Analysis",
    description:
      "Conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of ePHI.",
    category: "administrative",
    subcategory: "Security Management",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Completed risk assessment documentation",
    tasks: [
      {
        title: "Conduct Risk Assessment",
        description: "Perform comprehensive HIPAA risk assessment",
        frequency: "annually",
      },
      {
        title: "Document Risk Assessment Results",
        description: "Document all identified risks and vulnerabilities",
        frequency: "annually",
      },
    ],
  },
  {
    code: "164.308(a)(1)(ii)(B)",
    title: "Risk Management",
    description:
      "Implement security measures sufficient to reduce risks and vulnerabilities to a reasonable and appropriate level.",
    category: "administrative",
    subcategory: "Security Management",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Risk management plan with remediation actions",
    tasks: [
      {
        title: "Create Risk Management Plan",
        description: "Develop plan to address identified risks",
        frequency: "annually",
      },
      {
        title: "Review Risk Mitigation Progress",
        description: "Review progress on risk remediation quarterly",
        frequency: "quarterly",
      },
    ],
  },
  {
    code: "164.308(a)(2)",
    title: "Assigned Security Responsibility",
    description:
      "Identify the security official who is responsible for the development and implementation of security policies.",
    category: "administrative",
    subcategory: "Security Management",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Written designation of Security Officer",
    tasks: [
      {
        title: "Designate Security Officer",
        description: "Formally designate a HIPAA Security Officer",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.308(a)(3)",
    title: "Workforce Security",
    description:
      "Implement policies and procedures to ensure that all members of workforce have appropriate access to ePHI and to prevent unauthorized access.",
    category: "administrative",
    subcategory: "Workforce Security",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Workforce authorization policies and access logs",
    tasks: [
      {
        title: "Review Workforce Access",
        description: "Review and verify workforce access levels",
        frequency: "quarterly",
      },
      {
        title: "Conduct Background Checks",
        description: "Perform background checks for new employees with PHI access",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.308(a)(4)",
    title: "Information Access Management",
    description:
      "Implement policies and procedures for authorizing access to ePHI that are consistent with the Privacy Rule.",
    category: "administrative",
    subcategory: "Information Access",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Access authorization policies and access logs",
    tasks: [
      {
        title: "Define Access Authorization Process",
        description: "Document process for granting access to PHI",
        frequency: "one_time",
      },
      {
        title: "Review Access Authorizations",
        description: "Review all access authorizations",
        frequency: "quarterly",
      },
    ],
  },
  {
    code: "164.308(a)(5)",
    title: "Security Awareness and Training",
    description:
      "Implement a security awareness and training program for all members of the workforce.",
    category: "administrative",
    subcategory: "Training",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Training records for all employees",
    tasks: [
      {
        title: "Conduct HIPAA Training",
        description: "Provide HIPAA security awareness training to all staff",
        frequency: "annually",
      },
      {
        title: "Train New Employees",
        description: "Provide HIPAA training to new employees within 30 days",
        frequency: "one_time",
      },
      {
        title: "Security Reminders",
        description: "Send periodic security reminders to staff",
        frequency: "monthly",
      },
    ],
  },
  {
    code: "164.308(a)(6)",
    title: "Security Incident Procedures",
    description:
      "Implement policies and procedures to address security incidents.",
    category: "administrative",
    subcategory: "Incident Response",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Incident response plan and incident log",
    tasks: [
      {
        title: "Develop Incident Response Plan",
        description: "Create procedures for responding to security incidents",
        frequency: "one_time",
      },
      {
        title: "Test Incident Response",
        description: "Conduct incident response drill",
        frequency: "annually",
      },
    ],
  },
  {
    code: "164.308(a)(7)",
    title: "Contingency Plan",
    description:
      "Establish policies and procedures for responding to emergencies that damage systems containing ePHI.",
    category: "administrative",
    subcategory: "Contingency Planning",
    priority: 2,
    applicableTo: ["all"],
    evidenceRequired: "Contingency plan documentation and test results",
    tasks: [
      {
        title: "Develop Contingency Plan",
        description: "Create data backup, disaster recovery, and emergency mode plans",
        frequency: "one_time",
      },
      {
        title: "Test Data Backup",
        description: "Verify backup systems are working correctly",
        frequency: "monthly",
      },
      {
        title: "Test Contingency Plan",
        description: "Conduct disaster recovery drill",
        frequency: "annually",
      },
    ],
  },
  {
    code: "164.308(b)",
    title: "Business Associate Contracts",
    description:
      "Obtain satisfactory assurances from business associates that they will safeguard ePHI.",
    category: "administrative",
    subcategory: "Business Associates",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Signed Business Associate Agreements",
    tasks: [
      {
        title: "Identify Business Associates",
        description: "List all vendors with access to PHI",
        frequency: "one_time",
      },
      {
        title: "Obtain BAAs",
        description: "Ensure signed BAAs are in place for all business associates",
        frequency: "one_time",
      },
      {
        title: "Review BAAs",
        description: "Annual review of business associate relationships and BAAs",
        frequency: "annually",
      },
    ],
  },

  // Physical Safeguards (164.310)
  {
    code: "164.310(a)(1)",
    title: "Facility Access Controls",
    description:
      "Implement policies and procedures to limit physical access to electronic information systems.",
    category: "physical",
    subcategory: "Facility Security",
    priority: 2,
    applicableTo: ["all"],
    evidenceRequired: "Facility security policies and access logs",
    tasks: [
      {
        title: "Document Facility Access Procedures",
        description: "Create policies for controlling physical access to areas with PHI",
        frequency: "one_time",
      },
      {
        title: "Review Physical Access",
        description: "Review who has physical access to PHI areas",
        frequency: "quarterly",
      },
    ],
  },
  {
    code: "164.310(b)",
    title: "Workstation Use",
    description:
      "Implement policies and procedures that specify the proper functions and physical attributes of workstations with access to ePHI.",
    category: "physical",
    subcategory: "Workstation Security",
    priority: 2,
    applicableTo: ["all"],
    evidenceRequired: "Workstation use policies",
    tasks: [
      {
        title: "Create Workstation Policies",
        description: "Document appropriate workstation use for accessing PHI",
        frequency: "one_time",
      },
      {
        title: "Workstation Security Audit",
        description: "Audit workstations for compliance with security policies",
        frequency: "quarterly",
      },
    ],
  },
  {
    code: "164.310(c)",
    title: "Workstation Security",
    description:
      "Implement physical safeguards for all workstations that access ePHI to restrict access to authorized users.",
    category: "physical",
    subcategory: "Workstation Security",
    priority: 2,
    applicableTo: ["all"],
    evidenceRequired: "Physical security measures documentation",
    tasks: [
      {
        title: "Implement Workstation Physical Security",
        description: "Install locks, privacy screens, and position monitors appropriately",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.310(d)",
    title: "Device and Media Controls",
    description:
      "Implement policies and procedures for the receipt, removal, and disposal of hardware and electronic media containing ePHI.",
    category: "physical",
    subcategory: "Device Management",
    priority: 2,
    applicableTo: ["all"],
    evidenceRequired: "Media disposal policies and disposal logs",
    tasks: [
      {
        title: "Create Media Disposal Policy",
        description: "Document procedures for securely disposing of media with PHI",
        frequency: "one_time",
      },
      {
        title: "Inventory Electronic Media",
        description: "Maintain inventory of all devices containing PHI",
        frequency: "quarterly",
      },
    ],
  },

  // Technical Safeguards (164.312)
  {
    code: "164.312(a)(1)",
    title: "Access Control",
    description:
      "Implement technical policies and procedures for systems with ePHI to allow access only to authorized persons or software programs.",
    category: "technical",
    subcategory: "Access Control",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Access control configurations and user access lists",
    tasks: [
      {
        title: "Implement Unique User IDs",
        description: "Ensure each user has unique login credentials",
        frequency: "one_time",
      },
      {
        title: "Review User Access",
        description: "Review and update user access levels",
        frequency: "quarterly",
      },
      {
        title: "Implement Auto-logoff",
        description: "Configure automatic session timeouts",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.312(b)",
    title: "Audit Controls",
    description:
      "Implement hardware, software, and/or procedural mechanisms that record and examine activity in systems with ePHI.",
    category: "technical",
    subcategory: "Audit Controls",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Audit logs and review documentation",
    tasks: [
      {
        title: "Enable System Logging",
        description: "Enable audit logging on all systems with PHI",
        frequency: "one_time",
      },
      {
        title: "Review Audit Logs",
        description: "Review system audit logs for suspicious activity",
        frequency: "monthly",
      },
    ],
  },
  {
    code: "164.312(c)",
    title: "Integrity Controls",
    description:
      "Implement policies and procedures to protect ePHI from improper alteration or destruction.",
    category: "technical",
    subcategory: "Data Integrity",
    priority: 2,
    applicableTo: ["all"],
    evidenceRequired: "Data integrity policies and verification procedures",
    tasks: [
      {
        title: "Implement Integrity Controls",
        description: "Configure systems to verify data hasn't been altered",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.312(d)",
    title: "Person or Entity Authentication",
    description:
      "Implement procedures to verify that a person or entity seeking access to ePHI is who they claim to be.",
    category: "technical",
    subcategory: "Authentication",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Authentication policies and system configurations",
    tasks: [
      {
        title: "Implement Strong Authentication",
        description: "Configure strong password policies and consider MFA",
        frequency: "one_time",
      },
      {
        title: "Review Authentication Methods",
        description: "Review and update authentication requirements",
        frequency: "annually",
      },
    ],
  },
  {
    code: "164.312(e)",
    title: "Transmission Security",
    description:
      "Implement technical security measures to guard against unauthorized access to ePHI being transmitted over a network.",
    category: "technical",
    subcategory: "Transmission Security",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Encryption configurations and transmission policies",
    tasks: [
      {
        title: "Implement Email Encryption",
        description: "Enable encryption for emails containing PHI",
        frequency: "one_time",
      },
      {
        title: "Verify HTTPS/TLS",
        description: "Ensure all web applications use HTTPS",
        frequency: "quarterly",
      },
    ],
  },

  // Privacy Rule (164.5xx)
  {
    code: "164.520",
    title: "Notice of Privacy Practices",
    description:
      "Provide patients with a notice of privacy practices describing how PHI may be used and disclosed.",
    category: "privacy",
    subcategory: "Patient Rights",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Current Notice of Privacy Practices",
    tasks: [
      {
        title: "Create Privacy Notice",
        description: "Develop Notice of Privacy Practices",
        frequency: "one_time",
      },
      {
        title: "Review Privacy Notice",
        description: "Annual review and update of privacy notice",
        frequency: "annually",
      },
      {
        title: "Distribute Privacy Notice",
        description: "Provide privacy notice to all new patients",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.522",
    title: "Patient Rights - Restrictions",
    description:
      "Permit patients to request restrictions on uses and disclosures of their PHI.",
    category: "privacy",
    subcategory: "Patient Rights",
    priority: 2,
    applicableTo: ["all"],
    evidenceRequired: "Restriction request procedures and log",
    tasks: [
      {
        title: "Create Restriction Request Process",
        description: "Document process for handling patient restriction requests",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.524",
    title: "Patient Access to PHI",
    description:
      "Provide patients with access to inspect and obtain a copy of their PHI.",
    category: "privacy",
    subcategory: "Patient Rights",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Access request procedures and fulfillment log",
    tasks: [
      {
        title: "Create Access Request Process",
        description: "Document process for handling patient access requests",
        frequency: "one_time",
      },
      {
        title: "Track Access Requests",
        description: "Maintain log of patient access requests and responses",
        frequency: "monthly",
      },
    ],
  },
  {
    code: "164.526",
    title: "Amendment of PHI",
    description:
      "Permit patients to request amendment of their PHI.",
    category: "privacy",
    subcategory: "Patient Rights",
    priority: 2,
    applicableTo: ["all"],
    evidenceRequired: "Amendment request procedures and log",
    tasks: [
      {
        title: "Create Amendment Request Process",
        description: "Document process for handling patient amendment requests",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.528",
    title: "Accounting of Disclosures",
    description:
      "Provide patients with an accounting of disclosures of their PHI.",
    category: "privacy",
    subcategory: "Patient Rights",
    priority: 2,
    applicableTo: ["all"],
    evidenceRequired: "Disclosure tracking system",
    tasks: [
      {
        title: "Implement Disclosure Tracking",
        description: "Set up system to track PHI disclosures",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.530(a)",
    title: "Privacy Officer Designation",
    description:
      "Designate a privacy official responsible for developing and implementing privacy policies.",
    category: "privacy",
    subcategory: "Administrative",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Written designation of Privacy Officer",
    tasks: [
      {
        title: "Designate Privacy Officer",
        description: "Formally designate a HIPAA Privacy Officer",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.530(b)",
    title: "Privacy Training",
    description:
      "Train all workforce members on privacy policies and procedures.",
    category: "privacy",
    subcategory: "Training",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Training records for all employees",
    tasks: [
      {
        title: "Conduct Privacy Training",
        description: "Provide HIPAA privacy training to all staff",
        frequency: "annually",
      },
    ],
  },
  {
    code: "164.530(i)",
    title: "Privacy Policies and Procedures",
    description:
      "Implement policies and procedures to comply with the Privacy Rule.",
    category: "privacy",
    subcategory: "Administrative",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Written privacy policies and procedures",
    tasks: [
      {
        title: "Develop Privacy Policies",
        description: "Create comprehensive privacy policies",
        frequency: "one_time",
      },
      {
        title: "Review Privacy Policies",
        description: "Annual review and update of privacy policies",
        frequency: "annually",
      },
    ],
  },

  // Breach Notification (164.4xx)
  {
    code: "164.402",
    title: "Breach Definition and Discovery",
    description:
      "Understand what constitutes a breach and when it is discovered.",
    category: "breach",
    subcategory: "Breach Notification",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Breach identification procedures",
    tasks: [
      {
        title: "Train Staff on Breach Identification",
        description: "Ensure staff can identify potential breaches",
        frequency: "annually",
      },
    ],
  },
  {
    code: "164.404",
    title: "Notification to Individuals",
    description:
      "Notify affected individuals following a breach of unsecured PHI.",
    category: "breach",
    subcategory: "Breach Notification",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "Breach notification procedures and templates",
    tasks: [
      {
        title: "Create Breach Notification Procedures",
        description: "Document process for notifying individuals of breaches",
        frequency: "one_time",
      },
      {
        title: "Prepare Notification Templates",
        description: "Create templates for breach notification letters",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.406",
    title: "Notification to Media",
    description:
      "Notify prominent media outlets if a breach affects more than 500 residents of a State.",
    category: "breach",
    subcategory: "Breach Notification",
    priority: 3,
    applicableTo: ["all"],
    evidenceRequired: "Media notification procedures",
    tasks: [
      {
        title: "Document Media Notification Process",
        description: "Create procedures for media notification if required",
        frequency: "one_time",
      },
    ],
  },
  {
    code: "164.408",
    title: "Notification to Secretary",
    description:
      "Notify the Secretary of HHS following a breach of unsecured PHI.",
    category: "breach",
    subcategory: "Breach Notification",
    priority: 1,
    applicableTo: ["all"],
    evidenceRequired: "HHS notification procedures",
    tasks: [
      {
        title: "Document HHS Notification Process",
        description: "Create procedures for notifying HHS of breaches",
        frequency: "one_time",
      },
    ],
  },
];

export function getRequirementsByCategory(category: string): HIPAARequirement[] {
  return hipaaRequirements.filter((r) => r.category === category);
}

export function getRequirementByCode(code: string): HIPAARequirement | undefined {
  return hipaaRequirements.find((r) => r.code === code);
}

export function getAllCategories(): string[] {
  return [...new Set(hipaaRequirements.map((r) => r.category))];
}
