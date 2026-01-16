"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  type: string;
  subscriptionTier: string;
  stripeCustomerId: string | null;
}

interface OrganizationSettingsProps {
  organization: Organization;
}

export function OrganizationSettings({
  organization,
}: OrganizationSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: organization.name,
    type: organization.type,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Save to database
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success("Organization settings saved");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageBilling = async () => {
    if (!organization.stripeCustomerId) {
      toast.error("No active subscription found");
      return;
    }

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: organization.stripeCustomerId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create portal session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error("Failed to open billing portal");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>
          Update your practice information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orgName">Practice Name</Label>
          <Input
            id="orgName"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgType">Practice Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dental">Dental Practice</SelectItem>
              <SelectItem value="chiropractic">Chiropractic Office</SelectItem>
              <SelectItem value="med_spa">Medical Spa</SelectItem>
              <SelectItem value="physical_therapy">Physical Therapy</SelectItem>
              <SelectItem value="optometry">Optometry</SelectItem>
              <SelectItem value="mental_health">Mental Health</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleManageBilling}>
          Manage Billing
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
}
