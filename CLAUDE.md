# SMB Compliance Autopilot

AI-powered HIPAA compliance management platform for small healthcare practices.

## Project Overview

**Product:** "TurboTax for HIPAA compliance" - a SaaS platform that helps dental practices, chiropractic offices, med spas, and other small healthcare practices achieve and maintain HIPAA compliance through AI-powered automation.

**Target Market:** 200K+ small healthcare practices in the US who need HIPAA compliance but are underserved by enterprise tools ($10K+/yr) and overwhelmed by manual processes.

**Pricing:**
- Starter: $49/mo (HIPAA only, 5 policies, 1 user)
- Professional: $149/mo (Multi-regulation, unlimited policies, 5 users)
- Business: $299/mo (Everything + priority support, unlimited users)

## Tech Stack

- **Framework:** Next.js 15+ with App Router, React 19+, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **Database:** Vercel Postgres with Drizzle ORM
- **Storage:** Vercel Blob for documents
- **Cache:** Vercel KV
- **Auth:** Clerk
- **Payments:** Stripe
- **AI:** Vercel AI SDK with Anthropic Claude

## Directory Structure

```
app/
├── (auth)/                 # Auth routes (sign-in, sign-up)
├── (dashboard)/
│   └── dashboard/
│       ├── page.tsx        # Main dashboard
│       ├── assessment/     # Compliance assessment quiz
│       ├── requirements/   # HIPAA requirements tracking
│       ├── policies/       # AI policy generator
│       ├── tasks/          # Task management
│       ├── documents/      # Document storage
│       └── settings/       # Org settings & billing
├── api/
│   ├── ai/generate-policy/ # Policy generation endpoint
│   ├── documents/upload/   # Document upload
│   ├── stripe/            # Checkout & portal
│   └── webhooks/stripe/   # Stripe webhooks
└── page.tsx               # Landing page

components/
├── ui/                    # shadcn/ui components
├── dashboard/             # Dashboard sidebar, etc.
├── assessment/            # Assessment wizard
├── requirements/          # Requirements dashboard
├── policies/              # Policy generator
├── tasks/                 # Task manager
├── documents/             # Document manager
└── settings/              # Settings components

lib/
├── db/
│   ├── schema.ts          # Drizzle schema
│   └── index.ts           # DB connection
├── ai/
│   └── policy-generator.ts # AI policy generation
├── compliance/
│   ├── hipaa-requirements.ts # HIPAA requirements data
│   ├── assessment-questions.ts # Assessment quiz
│   └── assessment-engine.ts # Assessment analysis
├── stripe.ts              # Stripe configuration
└── utils.ts               # Utilities
```

## Database Schema

Key tables:
- `users` - User accounts linked to Clerk
- `organizations` - Healthcare practices
- `requirements` - HIPAA requirements with status tracking
- `policies` - AI-generated policy documents
- `tasks` - Compliance tasks with reminders
- `documents` - Uploaded compliance documents
- `audit_logs` - Activity tracking

## Development Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:
- Database: `POSTGRES_URL` (Vercel Postgres)
- Blob: `BLOB_READ_WRITE_TOKEN`
- KV: `KV_URL`, `KV_REST_API_*`
- Clerk: `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs
- AI: `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`)

## Key Features

### 1. Compliance Assessment
Multi-step quiz (`components/assessment/assessment-wizard.tsx`) that:
- Gathers practice information
- Identifies applicable HIPAA requirements
- Calculates initial compliance score
- Generates personalized compliance roadmap

### 2. Requirements Dashboard
Tracks all HIPAA requirements (`lib/compliance/hipaa-requirements.ts`):
- Administrative Safeguards (164.308)
- Physical Safeguards (164.310)
- Technical Safeguards (164.312)
- Privacy Rule (164.5xx)
- Breach Notification (164.4xx)

### 3. AI Policy Generator
Uses Claude to generate customized policies:
- Notice of Privacy Practices
- Security Policy
- Breach Notification Policy
- Business Associate Agreements
- Risk Assessment Templates
- Incident Response Plans
- Training Policies

### 4. Task Manager
Compliance task tracking with:
- Recurring task support (daily/weekly/monthly/quarterly/annually)
- Due date tracking and reminders
- Priority levels
- Links to requirements

### 5. Document Storage
Secure document management via Vercel Blob:
- Policy documents
- Training records
- Certificates
- BAAs
- Audit reports

## Code Patterns

### Server Components
Most pages are Server Components that fetch data server-side:
```tsx
export default async function Page() {
  const { userId } = await auth();
  // Fetch data...
  return <ClientComponent data={data} />;
}
```

### Client Components
Interactive components use `"use client"`:
```tsx
"use client";
// Hooks, state, event handlers...
```

### API Routes
Using Next.js Route Handlers:
```tsx
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Handle request...
}
```

### AI Streaming
Policy generation uses streaming for better UX:
```tsx
const result = streamText({
  model: anthropic("claude-sonnet-4-20250514"),
  system: systemPrompt,
  prompt: userPrompt,
});
return result.toDataStreamResponse();
```

## Testing

TODO: Add testing infrastructure
- Unit tests for compliance logic
- Integration tests for API routes
- E2E tests for critical flows

## Deployment

Deployed on Vercel with:
- Automatic preview deployments on PRs
- Production deployment on main branch
- Vercel Postgres, Blob, and KV for data
- Edge functions where possible

## Contributing

1. Create feature branch
2. Make changes following existing patterns
3. Test locally
4. Submit PR with description of changes

## Notes for AI Assistants

- Always check auth with `await auth()` before database operations
- Use Server Components by default, Client Components when needed
- Follow shadcn/ui patterns for new components
- HIPAA requirements are in `lib/compliance/hipaa-requirements.ts`
- Policy templates are in `lib/ai/policy-generator.ts`
- Use Drizzle ORM for database operations
- Toast notifications via `sonner`
