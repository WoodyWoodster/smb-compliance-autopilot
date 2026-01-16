import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("type") as string;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(`documents/${userId}/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    // TODO: Save document metadata to database
    // For now, return the blob URL

    return NextResponse.json({
      success: true,
      document: {
        id: Date.now().toString(),
        title: title || file.name,
        type: documentType || "other",
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        blobUrl: blob.url,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Document upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
