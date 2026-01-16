# SMB Compliance Autopilot

AI-powered HIPAA compliance management platform for small healthcare practices. "TurboTax for HIPAA compliance."

## Features

- **Compliance Assessment** - Interactive quiz to identify your specific HIPAA requirements
- **AI Policy Generator** - Generate customized compliance policies using AI
- **Requirements Dashboard** - Track all HIPAA requirements and your compliance status
- **Task Management** - Never miss a compliance deadline with automated reminders
- **Document Storage** - Securely store policies, BAAs, training records, and more

## Target Market

- Dental practices
- Chiropractic offices
- Medical spas
- Physical therapy clinics
- Optometry practices
- Mental health practices
- Other small healthcare providers

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Vercel Postgres + Drizzle ORM
- **Storage:** Vercel Blob
- **Auth:** Clerk
- **Payments:** Stripe
- **AI:** Anthropic Claude via Vercel AI SDK

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account (for database, blob storage)
- Clerk account (for authentication)
- Stripe account (for payments)
- Anthropic API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smb-compliance-autopilot.git
cd smb-compliance-autopilot
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Set up the database:
```bash
npm run db:push
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

See `.env.example` for all required variables:

- `POSTGRES_URL` - Vercel Postgres connection string
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob access token
- `CLERK_SECRET_KEY` - Clerk authentication
- `STRIPE_SECRET_KEY` - Stripe payments
- `ANTHROPIC_API_KEY` - Claude AI for policy generation

## Project Structure

```
app/                    # Next.js App Router pages
├── (auth)/            # Authentication pages
├── (dashboard)/       # Protected dashboard pages
├── api/               # API routes
└── page.tsx           # Landing page

components/            # React components
├── ui/               # shadcn/ui components
├── dashboard/        # Dashboard components
├── assessment/       # Assessment wizard
├── policies/         # Policy generator
├── tasks/            # Task manager
└── documents/        # Document manager

lib/                   # Shared utilities
├── db/               # Database schema & connection
├── ai/               # AI integration
├── compliance/       # HIPAA requirements data
└── stripe.ts         # Stripe configuration
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## Deployment

Deploy to Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy

## License

Proprietary - All rights reserved

## Support

For support, email support@complianceautopilot.com
