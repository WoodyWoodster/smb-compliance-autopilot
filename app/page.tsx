import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";
import { PLANS } from "@/lib/stripe";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">Compliance Autopilot</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <Badge className="mb-4" variant="secondary">
            TurboTax for HIPAA Compliance
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            HIPAA Compliance{" "}
            <span className="text-primary">Made Simple</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground md:text-xl">
            AI-powered compliance management for dental practices, chiropractic
            offices, med spas, and small healthcare practices. Stop worrying
            about HIPAA and focus on your patients.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y bg-muted/50">
        <div className="container py-8">
          <p className="text-center text-sm text-muted-foreground">
            Trusted by 500+ healthcare practices across the US
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-8 opacity-50">
            {["Dental Group", "ChiroHealth", "MedSpa Pro", "PT Solutions", "VisionCare"].map(
              (name) => (
                <span key={name} className="text-lg font-semibold">
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for HIPAA compliance
          </h2>
          <p className="mt-4 text-muted-foreground">
            From assessment to documentation, we automate the tedious parts so
            you can focus on patient care.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Compliance Assessment</CardTitle>
              <CardDescription>
                Answer simple questions about your practice and get a
                personalized compliance roadmap based on your specific
                situation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">AI Policy Generator</CardTitle>
              <CardDescription>
                Generate professional, legally-compliant HIPAA policies
                customized for your practice type in minutes, not days.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Task Management</CardTitle>
              <CardDescription>
                Never miss a compliance deadline with automated reminders for
                training, reviews, and assessments.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Document Storage</CardTitle>
              <CardDescription>
                Securely store all your compliance documents - policies, BAAs,
                training records, and more - in one place.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Requirements Tracking</CardTitle>
              <CardDescription>
                Track all HIPAA requirements in one dashboard. See your
                compliance score and know exactly what needs attention.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="mt-4">Audit Ready</CardTitle>
              <CardDescription>
                Always be prepared for audits with organized documentation and
                evidence of your compliance efforts.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Get compliant in 3 simple steps
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mt-4 text-xl font-semibold">Take Assessment</h3>
              <p className="mt-2 text-muted-foreground">
                Answer questions about your practice to identify your specific
                compliance requirements.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mt-4 text-xl font-semibold">Generate Policies</h3>
              <p className="mt-2 text-muted-foreground">
                Use AI to create customized policies and procedures tailored to
                your practice.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mt-4 text-xl font-semibold">Stay Compliant</h3>
              <p className="mt-2 text-muted-foreground">
                Track tasks, store documents, and maintain ongoing compliance
                with automated reminders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose the plan that fits your practice. All plans include a 14-day
            free trial.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(
            ([planId, plan]) => {
              const isProfessional = planId === "professional";

              return (
                <Card
                  key={planId}
                  className={`relative ${isProfessional ? "border-primary shadow-lg scale-105" : ""}`}
                >
                  {isProfessional && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-4xl font-bold text-foreground">
                        ${plan.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      variant={isProfessional ? "default" : "outline"}
                      asChild
                    >
                      <Link href="/sign-up">Start Free Trial</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            }
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-muted/50 py-24">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by healthcare practices
            </h2>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "Finally, a HIPAA solution that doesn't require a law degree to understand. We went from stressed to compliant in a week.",
                author: "Dr. Sarah Chen",
                title: "Owner, Bright Smile Dental",
              },
              {
                quote:
                  "The AI policy generator saved us thousands compared to hiring a consultant. The policies are professional and actually tailored to our practice.",
                author: "Michael Torres",
                title: "Practice Manager, SpineWorks Chiro",
              },
              {
                quote:
                  "I used to dread HIPAA compliance. Now I just check my dashboard and know exactly where we stand. The task reminders are a lifesaver.",
                author: "Dr. Emily Park",
                title: "Medical Director, Glow MedSpa",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-muted-foreground">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="mx-auto max-w-3xl rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to simplify HIPAA compliance?
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Join hundreds of healthcare practices who have automated their
            compliance with Compliance Autopilot.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/sign-up">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-primary-foreground/60">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold">Compliance Autopilot</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                AI-powered HIPAA compliance for small healthcare practices.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Product</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    BAA
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Compliance Autopilot. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
