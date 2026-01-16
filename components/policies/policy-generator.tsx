"use client";

import { useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import {
  policyTemplates,
  type PolicyGenerationContext,
} from "@/lib/ai/policy-generator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

interface PolicyGeneratorProps {
  initialContext?: Partial<PolicyGenerationContext>;
}

export function PolicyGenerator({ initialContext = {} }: PolicyGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [context, setContext] = useState<PolicyGenerationContext>({
    organizationType: initialContext.organizationType || "",
    organizationName: initialContext.organizationName || "",
    employeeCount: initialContext.employeeCount || "",
    state: initialContext.state || "",
    hasElectronicPhi: initialContext.hasElectronicPhi ?? true,
    usesCloudServices: initialContext.usesCloudServices ?? true,
    hasPatientPortal: initialContext.hasPatientPortal ?? false,
    additionalContext: "",
  });
  const [copied, setCopied] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/ai/generate-policy",
  });

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a policy template");
      return;
    }

    try {
      await complete("", {
        body: {
          templateId: selectedTemplate,
          context,
        },
      });
      toast.success("Policy generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate policy. Please try again.");
    }
  };

  const handleCopy = async () => {
    if (completion) {
      await navigator.clipboard.writeText(completion);
      setCopied(true);
      toast.success("Policy copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (completion) {
      const template = policyTemplates.find((t) => t.id === selectedTemplate);
      const blob = new Blob([completion], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${template?.name.toLowerCase().replace(/\s+/g, "-") || "policy"}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Policy downloaded");
    }
  };

  const template = policyTemplates.find((t) => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {policyTemplates.map((tpl) => (
          <Card
            key={tpl.id}
            className={`cursor-pointer transition-all hover:border-primary ${
              selectedTemplate === tpl.id
                ? "border-2 border-primary bg-primary/5"
                : ""
            }`}
            onClick={() => setSelectedTemplate(tpl.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <FileText className="h-8 w-8 text-primary" />
                {selectedTemplate === tpl.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <CardTitle className="text-lg">{tpl.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {tpl.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-wrap gap-2">
              <Badge variant="outline">{tpl.category}</Badge>
              <Badge variant="secondary">{tpl.estimatedLength}</Badge>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Generation Form */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Generate: {template?.name}
            </CardTitle>
            <CardDescription>
              Customize the policy for your practice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="orgName">Practice Name</Label>
                <Input
                  id="orgName"
                  placeholder="Enter your practice name"
                  value={context.organizationName}
                  onChange={(e) =>
                    setContext((prev) => ({
                      ...prev,
                      organizationName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orgType">Practice Type</Label>
                <Select
                  value={context.organizationType}
                  onValueChange={(value) =>
                    setContext((prev) => ({ ...prev, organizationType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select practice type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dental">Dental Practice</SelectItem>
                    <SelectItem value="chiropractic">
                      Chiropractic Office
                    </SelectItem>
                    <SelectItem value="med_spa">Medical Spa</SelectItem>
                    <SelectItem value="physical_therapy">
                      Physical Therapy
                    </SelectItem>
                    <SelectItem value="optometry">Optometry</SelectItem>
                    <SelectItem value="mental_health">Mental Health</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employees">Number of Employees</Label>
                <Select
                  value={context.employeeCount}
                  onValueChange={(value) =>
                    setContext((prev) => ({ ...prev, employeeCount: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 employees</SelectItem>
                    <SelectItem value="6-15">6-15 employees</SelectItem>
                    <SelectItem value="16-50">16-50 employees</SelectItem>
                    <SelectItem value="51+">51+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={context.state}
                  onValueChange={(value) =>
                    setContext((prev) => ({ ...prev, state: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Practice Features</Label>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="electronicPhi"
                    checked={context.hasElectronicPhi}
                    onCheckedChange={(checked) =>
                      setContext((prev) => ({
                        ...prev,
                        hasElectronicPhi: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="electronicPhi" className="font-normal">
                    Uses Electronic PHI
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cloudServices"
                    checked={context.usesCloudServices}
                    onCheckedChange={(checked) =>
                      setContext((prev) => ({
                        ...prev,
                        usesCloudServices: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="cloudServices" className="font-normal">
                    Uses Cloud Services
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="patientPortal"
                    checked={context.hasPatientPortal}
                    onCheckedChange={(checked) =>
                      setContext((prev) => ({
                        ...prev,
                        hasPatientPortal: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor="patientPortal" className="font-normal">
                    Has Patient Portal
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalContext">
                Additional Context (Optional)
              </Label>
              <Textarea
                id="additionalContext"
                placeholder="Any specific requirements or context for your policy..."
                value={context.additionalContext}
                onChange={(e) =>
                  setContext((prev) => ({
                    ...prev,
                    additionalContext: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Policy...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Policy
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Generated Policy Output */}
      {(completion || isLoading) && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Policy</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!completion || isLoading}
                >
                  {copied ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Copy className="mr-2 h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!completion || isLoading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] w-full rounded-md border p-4">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap">
                {completion || (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating your policy...
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
              <DialogTrigger asChild>
                <Button disabled={!completion || isLoading}>
                  Save Policy
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Policy</DialogTitle>
                  <DialogDescription>
                    Save this policy to your documents for future reference
                  </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  This will save the generated policy to your practice&apos;s
                  document storage. You can edit and update it at any time.
                </p>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowGenerateDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // TODO: Save to database
                      toast.success("Policy saved successfully!");
                      setShowGenerateDialog(false);
                    }}
                  >
                    Save Policy
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              onClick={() => handleGenerate()}
              disabled={isLoading}
            >
              Regenerate
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
