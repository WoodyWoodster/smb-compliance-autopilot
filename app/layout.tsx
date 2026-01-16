import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SMB Compliance Autopilot | HIPAA Compliance Made Simple",
  description:
    "AI-powered compliance management for small healthcare practices. TurboTax for HIPAA compliance - simple, affordable, automated.",
  keywords: [
    "HIPAA compliance",
    "healthcare compliance",
    "dental practice compliance",
    "chiropractic compliance",
    "med spa compliance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );

  // Only wrap with ClerkProvider if the key is available
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
