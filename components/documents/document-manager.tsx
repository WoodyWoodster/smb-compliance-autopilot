"use client";

import { useState, useRef } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  MoreHorizontal,
  FolderOpen,
  FileCheck,
  FileWarning,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  type: "policy" | "training_record" | "certificate" | "audit_report" | "incident_report" | "baa" | "other";
  fileName: string;
  fileSize: number;
  mimeType: string;
  blobUrl: string;
  uploadedAt: string;
  expiresAt?: string;
  requirementCode?: string;
}

const documentTypes = {
  policy: { label: "Policy Document", icon: FileText, color: "bg-blue-100 text-blue-700" },
  training_record: { label: "Training Record", icon: FileCheck, color: "bg-green-100 text-green-700" },
  certificate: { label: "Certificate", icon: FileCheck, color: "bg-purple-100 text-purple-700" },
  audit_report: { label: "Audit Report", icon: FileText, color: "bg-yellow-100 text-yellow-700" },
  incident_report: { label: "Incident Report", icon: FileWarning, color: "bg-red-100 text-red-700" },
  baa: { label: "Business Associate Agreement", icon: FileText, color: "bg-orange-100 text-orange-700" },
  other: { label: "Other", icon: FileText, color: "bg-gray-100 text-gray-700" },
};

// Mock data
const mockDocuments: Document[] = [
  {
    id: "1",
    title: "Notice of Privacy Practices 2026",
    type: "policy",
    fileName: "privacy-notice-2026.pdf",
    fileSize: 245000,
    mimeType: "application/pdf",
    blobUrl: "#",
    uploadedAt: "2026-01-10T10:30:00Z",
  },
  {
    id: "2",
    title: "HIPAA Security Policy",
    type: "policy",
    fileName: "security-policy.pdf",
    fileSize: 512000,
    mimeType: "application/pdf",
    blobUrl: "#",
    uploadedAt: "2026-01-08T14:00:00Z",
  },
  {
    id: "3",
    title: "Staff Training Completion - Q4 2025",
    type: "training_record",
    fileName: "training-q4-2025.pdf",
    fileSize: 156000,
    mimeType: "application/pdf",
    blobUrl: "#",
    uploadedAt: "2025-12-15T09:00:00Z",
  },
  {
    id: "4",
    title: "BAA - CloudEHR Provider",
    type: "baa",
    fileName: "baa-cloudehr.pdf",
    fileSize: 89000,
    mimeType: "application/pdf",
    blobUrl: "#",
    uploadedAt: "2025-06-01T11:00:00Z",
    expiresAt: "2026-06-01",
  },
  {
    id: "5",
    title: "Risk Assessment 2025",
    type: "audit_report",
    fileName: "risk-assessment-2025.pdf",
    fileSize: 1200000,
    mimeType: "application/pdf",
    blobUrl: "#",
    uploadedAt: "2025-03-15T10:00:00Z",
  },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    type: "other" as Document["type"],
    file: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and search
  const filteredDocuments = documents.filter((doc) => {
    const matchesType = filter === "all" || doc.type === filter;
    const matchesSearch =
      searchQuery === "" ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Stats
  const stats = {
    total: documents.length,
    policies: documents.filter((d) => d.type === "policy").length,
    training: documents.filter((d) => d.type === "training_record").length,
    baas: documents.filter((d) => d.type === "baa").length,
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm((prev) => ({
        ...prev,
        file,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
      }));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file) {
      toast.error("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", uploadForm.file);
      formData.append("type", uploadForm.type);
      formData.append("title", uploadForm.title);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const result = await response.json();
      setDocuments((prev) => [result.document, ...prev]);
      setShowUploadDialog(false);
      setUploadForm({ title: "", type: "other", file: null });
      toast.success("Document uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    toast.success("Document deleted");
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.policies}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Training Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.training}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">BAAs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.baas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-9 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(documentTypes).map(([value, config]) => (
                <SelectItem key={value} value={value}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a compliance document to your secure storage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Select
                  value={uploadForm.type}
                  onValueChange={(value) =>
                    setUploadForm((prev) => ({
                      ...prev,
                      type: value as Document["type"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(documentTypes).map(([value, config]) => (
                      <SelectItem key={value} value={value}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Document Title</Label>
                <Input
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter document title"
                />
              </div>

              <div className="space-y-2">
                <Label>File</Label>
                <div
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 cursor-pointer hover:border-primary/50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadForm.file ? (
                    <div className="text-center">
                      <FileText className="mx-auto h-8 w-8 text-primary" />
                      <p className="mt-2 font-medium">{uploadForm.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(uploadForm.file.size)}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Click to select a file
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX, JPG, PNG (max 10MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowUploadDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!uploadForm.file || isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>
            {filteredDocuments.length} document{filteredDocuments.length !== 1 && "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No documents</h3>
              <p className="text-muted-foreground">
                {searchQuery || filter !== "all"
                  ? "No documents match your search criteria"
                  : "Upload your first compliance document"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Document</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => {
                  const typeConfig = documentTypes[doc.type];
                  const TypeIcon = typeConfig.icon;

                  return (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <TypeIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{doc.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.fileName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeConfig.color}>
                          {typeConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                      <TableCell>
                        {format(new Date(doc.uploadedAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(doc.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
