import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Complify | AI-Powered Compliance for Modern Businesses",
  description:
    "Automate HIPAA, SOC 2, PCI-DSS, GDPR, and ISO 27001 compliance. AI-powered policy generation, requirement tracking, and audit preparation for SMBs.",
  keywords: [
    "compliance automation",
    "HIPAA compliance",
    "SOC 2 compliance",
    "PCI-DSS compliance",
    "GDPR compliance",
    "ISO 27001",
    "compliance software",
    "audit preparation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );

  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
