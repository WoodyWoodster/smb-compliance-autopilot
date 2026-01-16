"use client";

import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  FileCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Camera,
  ClipboardCheck,
  Download,
  Eye,
  XCircle,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface EvidenceItem {
  id: string;
  requirementId: string;
  requirementCode: string;
  requirementTitle: string;
  evidenceType: "document" | "training_record" | "screenshot" | "attestation";
  title: string;
  status: "pending" | "verified" | "rejected";
  submittedAt: string;
  expiresAt?: string;
}

// Mock data - in production, this would come from the database
const mockEvidence: EvidenceItem[] = [
  {
    id: "1",
    requirementId: "req-1",
    requirementCode: "164.308(a)(1)",
    requirementTitle: "Security Management Process",
    evidenceType: "document",
    title: "Risk Assessment Report 2026",
    status: "verified",
    submittedAt: "2026-01-10",
    expiresAt: "2027-01-10",
  },
  {
    id: "2",
    requirementId: "req-2",
    requirementCode: "164.308(a)(5)",
    requirementTitle: "Security Awareness Training",
    evidenceType: "training_record",
    title: "Staff Training Completion",
    status: "pending",
    submittedAt: "2026-01-14",
    expiresAt: "2027-01-14",
  },
  {
    id: "3",
    requirementId: "req-3",
    requirementCode: "164.310(b)",
    requirementTitle: "Workstation Use",
    evidenceType: "screenshot",
    title: "Workstation Security Configuration",
    status: "rejected",
    submittedAt: "2026-01-12",
  },
];

const requirementsMissingEvidence = [
  { code: "164.308(a)(3)", title: "Workforce Security", category: "Administrative Safeguards" },
  { code: "164.312(a)(1)", title: "Access Control", category: "Technical Safeguards" },
  { code: "164.310(d)(1)", title: "Device and Media Controls", category: "Physical Safeguards" },
];

function EvidenceTypeIcon({ type }: { type: EvidenceItem["evidenceType"] }) {
  switch (type) {
    case "document":
      return <FileText className="h-4 w-4" />;
    case "training_record":
      return <GraduationCap className="h-4 w-4" />;
    case "screenshot":
      return <Camera className="h-4 w-4" />;
    case "attestation":
      return <ClipboardCheck className="h-4 w-4" />;
  }
}

function StatusBadge({ status }: { status: EvidenceItem["status"] }) {
  switch (status) {
    case "verified":
      return (
        <Badge variant="success" className="gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="warning" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending Review
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" />
          Rejected
        </Badge>
      );
  }
}

function EvidenceUploadDialog() {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Evidence submitted successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Evidence
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Evidence</DialogTitle>
          <DialogDescription>
            Submit documentation to verify compliance with a requirement
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requirement">Requirement</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a requirement" />
              </SelectTrigger>
              <SelectContent>
                {requirementsMissingEvidence.map((req) => (
                  <SelectItem key={req.code} value={req.code}>
                    {req.code} - {req.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="evidenceType">Evidence Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select evidence type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="training_record">Training Record</SelectItem>
                <SelectItem value="screenshot">Screenshot</SelectItem>
                <SelectItem value="attestation">Attestation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Brief title for this evidence" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this evidence demonstrates..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <Input id="file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" />
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX, PNG, JPG (max 10MB)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
            <Input id="expiresAt" type="date" />
            <p className="text-xs text-muted-foreground">
              Set if this evidence needs to be renewed (e.g., annual training)
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Evidence</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EvidenceDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const verifiedCount = mockEvidence.filter((e) => e.status === "verified").length;
  const pendingCount = mockEvidence.filter((e) => e.status === "pending").length;
  const rejectedCount = mockEvidence.filter((e) => e.status === "rejected").length;
  const totalRequirements = 42; // Mock total
  const evidenceProgress = Math.round((verifiedCount / totalRequirements) * 100);

  return (
    <div className="space-y-8">
      {/* Audit Readiness Score */}
      <Card className="relative overflow-hidden border-primary/20">
        <div className="absolute top-0 right-0 h-64 w-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32" />
        <CardContent className="relative pt-6 pb-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <FileCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Audit Readiness</h2>
                <p className="text-muted-foreground">
                  {verifiedCount} of {totalRequirements} requirements with verified evidence
                </p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Evidence Coverage</span>
                <span className="font-medium">{evidenceProgress}%</span>
              </div>
              <Progress value={evidenceProgress} className="h-3" />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-success" />
              <span>+5% from last month</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-success">{verifiedCount}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-warning/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Needs Attention</p>
                <p className="text-2xl font-bold text-destructive">{rejectedCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive/20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Missing Evidence</p>
                <p className="text-2xl font-bold">{requirementsMissingEvidence.length}</p>
              </div>
              <Shield className="h-8 w-8 text-muted/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="all">All Evidence</TabsTrigger>
            <TabsTrigger value="missing">Missing Evidence</TabsTrigger>
            <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          </TabsList>
          <EvidenceUploadDialog />
        </div>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Requirements Missing Evidence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                Requirements Missing Evidence
              </CardTitle>
              <CardDescription>
                These requirements need documentation to verify compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {requirementsMissingEvidence.map((req) => (
                <div
                  key={req.code}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">{req.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {req.code} · {req.category}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Add Evidence
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Evidence */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Evidence Submissions</CardTitle>
              <CardDescription>
                Latest evidence uploaded for compliance verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockEvidence.map((evidence) => (
                <div
                  key={evidence.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <EvidenceTypeIcon type={evidence.evidenceType} />
                    </div>
                    <div>
                      <p className="font-medium">{evidence.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {evidence.requirementCode} · Submitted {evidence.submittedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={evidence.status} />
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Evidence</CardTitle>
              <CardDescription>
                Complete list of submitted evidence for compliance requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockEvidence.map((evidence) => (
                <div
                  key={evidence.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <EvidenceTypeIcon type={evidence.evidenceType} />
                    </div>
                    <div>
                      <p className="font-medium">{evidence.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {evidence.requirementCode} - {evidence.requirementTitle}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={evidence.status} />
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="missing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Requirements Missing Evidence</CardTitle>
              <CardDescription>
                Upload evidence for these requirements to improve your audit readiness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {requirementsMissingEvidence.map((req) => (
                <div
                  key={req.code}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium">{req.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {req.code} · {req.category}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Add Evidence
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expiring Evidence</CardTitle>
              <CardDescription>
                Evidence that will expire soon and needs to be renewed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockEvidence
                .filter((e) => e.expiresAt)
                .map((evidence) => (
                  <div
                    key={evidence.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <EvidenceTypeIcon type={evidence.evidenceType} />
                      </div>
                      <div>
                        <p className="font-medium">{evidence.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {evidence.requirementCode} · Expires {evidence.expiresAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        {evidence.expiresAt}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Renew
                      </Button>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Report */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Compliance Report
          </CardTitle>
          <CardDescription>
            Generate an audit-ready report with all your evidence and compliance status
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Generate PDF Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
