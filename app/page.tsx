import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ArrowRight,
  Check,
  Sparkles,
  ArrowUpRight,
  Play,
  Quote,
} from "lucide-react";
import { PLANS } from "@/lib/stripe";

const FRAMEWORKS = [
  { name: "HIPAA", color: "bg-teal-500" },
  { name: "SOC 2", color: "bg-coral-500" },
  { name: "PCI-DSS", color: "bg-violet-500" },
  { name: "GDPR", color: "bg-blue-500" },
  { name: "ISO 27001", color: "bg-emerald-500" },
];

const STATS = [
  { value: "2,400+", label: "Businesses protected" },
  { value: "98%", label: "Audit pass rate" },
  { value: "15min", label: "Average setup time" },
];

export default async function LandingPage() {
  const { userId } = await auth();
  const isAuthenticated = !!userId;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Complify</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#frameworks" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
              Frameworks
            </Link>
            <Link href="#pricing" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
              Pricing
            </Link>
            <Link href="#stories" className="text-sm text-stone-600 hover:text-stone-900 transition-colors">
              Stories
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button variant="coral" size="sm" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button variant="coral" size="sm" asChild>
                  <Link href="/sign-up">Start free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Editorial Style */}
      <section className="pt-32 pb-24 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-[5%] w-96 h-96 bg-coral-500/10 rounded-full blur-3xl" />

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Framework badges */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {FRAMEWORKS.map((fw) => (
                <span
                  key={fw.name}
                  className={`${fw.color} text-white text-xs font-medium px-3 py-1 rounded-full`}
                >
                  {fw.name}
                </span>
              ))}
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
              Compliance,{" "}
              <span className="italic text-teal-600">
                finally
              </span>{" "}
              on autopilot
            </h1>

            <p className="mt-8 text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Stop drowning in spreadsheets and consultant fees. Our AI maps your business
              to the exact requirements you need—whether that&apos;s HIPAA, SOC 2, PCI-DSS, or GDPR.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="coral" size="xl" asChild>
                <Link href="/sign-up">
                  Start your assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="#demo" className="group">
                  <Play className="mr-2 h-4 w-4 text-teal-600" />
                  Watch demo
                  <span className="text-stone-400 ml-1">2:30</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 flex items-center justify-center gap-12 md:gap-20">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold text-teal-600">{stat.value}</div>
                <div className="text-sm text-stone-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks Section - Asymmetric grid */}
      <section id="frameworks" className="py-24 bg-stone-50">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-teal-600 text-sm font-semibold uppercase tracking-wider">
                Multi-framework
              </span>
              <h2 className="font-display text-4xl md:text-5xl mt-4 leading-tight">
                One platform,<br />
                <span className="italic text-stone-500">every framework</span>
              </h2>
              <p className="mt-6 text-lg text-stone-600 leading-relaxed">
                Whether you&apos;re a healthcare startup needing HIPAA, a SaaS company pursuing
                SOC 2, or an e-commerce business handling PCI-DSS—we&apos;ve mapped the requirements
                so you don&apos;t have to.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "AI analyzes your business and suggests applicable frameworks",
                  "Generate policies customized to your industry and size",
                  "Track requirements across multiple frameworks simultaneously",
                  "Evidence collection and audit preparation in one place",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-100">
                      <Check className="h-3 w-3 text-teal-600" />
                    </div>
                    <span className="text-stone-700">{item}</span>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="lg" className="mt-8" asChild>
                <Link href="/sign-up">
                  See which frameworks apply to you
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Visual framework cards - staggered */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <FrameworkCard
                    name="HIPAA"
                    desc="Healthcare data protection"
                    color="teal"
                    requirements={164}
                  />
                  <FrameworkCard
                    name="PCI-DSS"
                    desc="Payment card security"
                    color="violet"
                    requirements={78}
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <FrameworkCard
                    name="SOC 2"
                    desc="Service organization controls"
                    color="coral"
                    requirements={116}
                  />
                  <FrameworkCard
                    name="GDPR"
                    desc="EU data privacy"
                    color="blue"
                    requirements={99}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Visual flow instead of 1-2-3 */}
      <section className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-coral-500 text-sm font-semibold uppercase tracking-wider">
              How it works
            </span>
            <h2 className="font-display text-4xl md:text-5xl mt-4">
              From zero to audit-ready
            </h2>
          </div>

          {/* Visual flow cards */}
          <div className="relative max-w-5xl mx-auto">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />

            <div className="grid md:grid-cols-3 gap-8">
              <FlowCard
                icon={<Sparkles className="h-6 w-6" />}
                title="Tell us about your business"
                description="Answer a few questions about what you do, what data you handle, and where you operate. Our AI figures out the rest."
                accent="teal"
              />
              <FlowCard
                icon={<Shield className="h-6 w-6" />}
                title="Get your roadmap"
                description="We map your answers to specific compliance requirements and generate policies tailored to your business—not generic templates."
                accent="coral"
              />
              <FlowCard
                icon={<Check className="h-6 w-6" />}
                title="Stay compliant"
                description="Track progress, collect evidence, and get reminders. When auditors come knocking, you&apos;ll be ready."
                accent="emerald"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social proof - Editorial testimonial */}
      <section id="stories" className="py-24 bg-teal-600 text-white overflow-hidden">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="h-12 w-12 mx-auto mb-8 opacity-40" />
            <blockquote className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight italic">
              &ldquo;We went from dreading our SOC 2 audit to actually feeling confident.
              The AI-generated policies were better than what our $15k consultant produced.&rdquo;
            </blockquote>
            <div className="mt-10">
              <div className="font-semibold text-lg">Marcus Chen</div>
              <div className="text-teal-200">CTO, Streamline Analytics</div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                  SOC 2 Type II
                </span>
                <span className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Series A Startup
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Premium feel */}
      <section id="pricing" className="py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-teal-600 text-sm font-semibold uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="font-display text-4xl md:text-5xl mt-4">
              Invest in peace of mind
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              Compare to $10k+ consultants or $50k+ enterprise tools.
              All plans include a 14-day free trial.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {(Object.entries(PLANS) as [keyof typeof PLANS, (typeof PLANS)[keyof typeof PLANS]][]).map(
                ([planId, plan]) => {
                  const isPopular = planId === "professional";

                  return (
                    <div
                      key={planId}
                      className={`relative rounded-2xl p-8 transition-all duration-300 hover-lift ${
                        isPopular
                          ? "bg-teal-600 text-white shadow-glow-teal"
                          : "bg-white border border-stone-200 shadow-soft"
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coral-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                          Most popular
                        </div>
                      )}

                      <div className="mb-6">
                        <h3 className={`text-lg font-semibold ${isPopular ? "text-white" : "text-stone-900"}`}>
                          {plan.name}
                        </h3>
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className={`text-4xl font-bold ${isPopular ? "text-white" : "text-stone-900"}`}>
                            ${plan.price}
                          </span>
                          <span className={isPopular ? "text-teal-200" : "text-stone-500"}>
                            /month
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <Check className={`h-5 w-5 mt-0.5 shrink-0 ${isPopular ? "text-teal-200" : "text-teal-600"}`} />
                            <span className={`text-sm ${isPopular ? "text-teal-50" : "text-stone-600"}`}>
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant={isPopular ? "secondary" : "outline"}
                        className={`w-full ${isPopular ? "bg-white text-teal-600 hover:bg-teal-50" : ""}`}
                        asChild
                      >
                        <Link href="/sign-up">Start free trial</Link>
                      </Button>
                    </div>
                  );
                }
              )}
            </div>

            <p className="text-center mt-8 text-sm text-stone-500">
              Need enterprise features?{" "}
              <Link href="#" className="text-teal-600 hover:underline">
                Talk to sales
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
              Ready to stop<br />
              <span className="italic text-teal-400">dreading</span> compliance?
            </h2>
            <p className="mt-6 text-lg text-stone-400 max-w-xl mx-auto">
              Join 2,400+ businesses who&apos;ve automated their compliance journey.
              Start your free assessment today.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="coral" size="xl" asChild>
                <Link href="/sign-up">
                  Start free assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-stone-500">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-stone-200">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-lg">Complify</span>
              </Link>
              <p className="mt-4 text-sm text-stone-500 max-w-xs">
                AI-powered compliance for modern businesses.
                HIPAA, SOC 2, PCI-DSS, GDPR, and beyond.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-stone-500">
                <li><Link href="#" className="hover:text-stone-900 transition-colors">Frameworks</Link></li>
                <li><Link href="#" className="hover:text-stone-900 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-stone-900 transition-colors">Security</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-stone-500">
                <li><Link href="#" className="hover:text-stone-900 transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-stone-900 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-stone-900 transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-stone-500">
                <li><Link href="#" className="hover:text-stone-900 transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-stone-900 transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-stone-900 transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-500">
            <p>© {new Date().getFullYear()} Complify. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FrameworkCard({
  name,
  desc,
  color,
  requirements
}: {
  name: string;
  desc: string;
  color: string;
  requirements: number;
}) {
  const colorClasses = {
    teal: "border-teal-200 bg-teal-50",
    coral: "border-coral-200 bg-coral-50",
    violet: "border-violet-200 bg-violet-50",
    blue: "border-blue-200 bg-blue-50",
  };

  const accentClasses = {
    teal: "bg-teal-600",
    coral: "bg-coral-500",
    violet: "bg-violet-600",
    blue: "bg-blue-600",
  };

  return (
    <div className={`rounded-2xl border p-6 hover-lift ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className={`w-10 h-10 rounded-xl ${accentClasses[color as keyof typeof accentClasses]} flex items-center justify-center mb-4`}>
        <Shield className="h-5 w-5 text-white" />
      </div>
      <h3 className="font-semibold text-stone-900">{name}</h3>
      <p className="text-sm text-stone-600 mt-1">{desc}</p>
      <div className="mt-4 text-xs text-stone-500">
        {requirements} requirements mapped
      </div>
    </div>
  );
}

function FlowCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}) {
  const accentClasses = {
    teal: "bg-teal-100 text-teal-600",
    coral: "bg-coral-100 text-coral-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div className="relative bg-white rounded-2xl p-8 shadow-soft hover-lift">
      <div className={`w-12 h-12 rounded-xl ${accentClasses[accent as keyof typeof accentClasses]} flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-stone-900 mb-3">{title}</h3>
      <p className="text-stone-600 leading-relaxed">{description}</p>
    </div>
  );
}
