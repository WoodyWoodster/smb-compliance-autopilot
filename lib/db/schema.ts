import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const organizationTypeEnum = pgEnum("organization_type", [
  "dental",
  "chiropractic",
  "med_spa",
  "physical_therapy",
  "optometry",
  "mental_health",
  "other",
]);

export const regulationTypeEnum = pgEnum("regulation_type", [
  "hipaa",
  "osha",
  "state_privacy",
  "pci_dss",
]);

export const requirementStatusEnum = pgEnum("requirement_status", [
  "not_started",
  "in_progress",
  "compliant",
  "non_compliant",
  "not_applicable",
]);

export const taskFrequencyEnum = pgEnum("task_frequency", [
  "one_time",
  "daily",
  "weekly",
  "monthly",
  "quarterly",
  "annually",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "in_progress",
  "completed",
  "overdue",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "policy",
  "training_record",
  "certificate",
  "audit_report",
  "incident_report",
  "baa",
  "other",
]);

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "starter",
  "professional",
  "business",
]);

// Tables
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  organizationId: uuid("organization_id").references(() => organizations.id),
  role: text("role").default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: organizationTypeEnum("type").notNull(),
  employeeCount: integer("employee_count").default(1),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  phone: text("phone"),
  website: text("website"),
  // Assessment data
  hasElectronicPhi: boolean("has_electronic_phi").default(true),
  hasPaperRecords: boolean("has_paper_records").default(true),
  usesCloudServices: boolean("uses_cloud_services").default(true),
  processesCreditCards: boolean("processes_credit_cards").default(false),
  assessmentCompleted: boolean("assessment_completed").default(false),
  assessmentCompletedAt: timestamp("assessment_completed_at"),
  // Subscription
  subscriptionTier: subscriptionTierEnum("subscription_tier").default("starter"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("active"),
  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const requirements = pgTable("requirements", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  regulationType: regulationTypeEnum("regulation_type").notNull(),
  requirementCode: text("requirement_code").notNull(), // e.g., "164.308(a)(1)"
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"), // e.g., "Administrative Safeguards"
  status: requirementStatusEnum("status").default("not_started").notNull(),
  priority: integer("priority").default(2), // 1=high, 2=medium, 3=low
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  evidenceRequired: text("evidence_required"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const policies = pgTable("policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  policyType: text("policy_type").notNull(), // e.g., "privacy_policy", "security_policy"
  title: text("title").notNull(),
  content: text("content").notNull(),
  version: integer("version").default(1).notNull(),
  status: text("status").default("draft"), // draft, active, archived
  aiModel: text("ai_model"), // Model used for generation
  aiPromptVersion: text("ai_prompt_version"),
  customizations: jsonb("customizations"), // User customizations applied
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  effectiveDate: timestamp("effective_date"),
  reviewDate: timestamp("review_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  requirementId: uuid("requirement_id").references(() => requirements.id),
  title: text("title").notNull(),
  description: text("description"),
  frequency: taskFrequencyEnum("frequency").default("one_time").notNull(),
  status: taskStatusEnum("status").default("pending").notNull(),
  priority: integer("priority").default(2),
  dueDate: timestamp("due_date"),
  nextDueDate: timestamp("next_due_date"),
  completedAt: timestamp("completed_at"),
  completedBy: uuid("completed_by").references(() => users.id),
  reminderDays: integer("reminder_days").default(7), // Days before due date to remind
  assignedTo: uuid("assigned_to").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  type: documentTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size"),
  mimeType: text("mime_type"),
  blobUrl: text("blob_url").notNull(),
  policyId: uuid("policy_id").references(() => policies.id), // Link to generated policy
  requirementId: uuid("requirement_id").references(() => requirements.id), // Link to requirement as evidence
  uploadedBy: uuid("uploaded_by").references(() => users.id),
  expiresAt: timestamp("expires_at"), // For certificates, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(), // e.g., "policy_generated", "task_completed"
  entityType: text("entity_type"), // e.g., "policy", "task", "requirement"
  entityId: uuid("entity_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  requirements: many(requirements),
  policies: many(policies),
  tasks: many(tasks),
  documents: many(documents),
  auditLogs: many(auditLogs),
}));

export const requirementsRelations = relations(requirements, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [requirements.organizationId],
    references: [organizations.id],
  }),
  tasks: many(tasks),
  documents: many(documents),
}));

export const policiesRelations = relations(policies, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [policies.organizationId],
    references: [organizations.id],
  }),
  approver: one(users, {
    fields: [policies.approvedBy],
    references: [users.id],
  }),
  documents: many(documents),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  organization: one(organizations, {
    fields: [tasks.organizationId],
    references: [organizations.id],
  }),
  requirement: one(requirements, {
    fields: [tasks.requirementId],
    references: [requirements.id],
  }),
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
  }),
  completer: one(users, {
    fields: [tasks.completedBy],
    references: [users.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  organization: one(organizations, {
    fields: [documents.organizationId],
    references: [organizations.id],
  }),
  policy: one(policies, {
    fields: [documents.policyId],
    references: [policies.id],
  }),
  requirement: one(requirements, {
    fields: [documents.requirementId],
    references: [requirements.id],
  }),
  uploader: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  organization: one(organizations, {
    fields: [auditLogs.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type Requirement = typeof requirements.$inferSelect;
export type NewRequirement = typeof requirements.$inferInsert;
export type Policy = typeof policies.$inferSelect;
export type NewPolicy = typeof policies.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;
