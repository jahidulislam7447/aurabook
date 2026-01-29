# AuraTechIT SaaS Platform

An enterprise-level All-in-One SaaS platform similar to Odoo, but more modern, modular, cloud-native, and scalable.

## 🏗️ Architecture

This is a monorepo using Turborepo with the following structure:

```
├── apps/
│   ├── marketing-site/     # Next.js marketing website
│   ├── dashboard/          # Main user dashboard
│   └── admin-panel/        # Super admin panel
├── services/
│   ├── auth/              # Authentication microservice
│   ├── billing/           # Billing & subscriptions
│   ├── apps/              # App marketplace service
│   ├── notifications/     # Notification service
│   ├── analytics/         # Analytics service
│   └── api/               # Main API gateway
├── packages/
│   ├── ui/                # Shared UI components
│   ├── utils/             # Shared utilities
│   ├── permissions/       # RBAC system
│   └── types/             # TypeScript definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL
- Redis
- Docker (optional)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start development servers
npm run dev
```

## 📦 Available Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run start` - Start all production servers
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages
- `npm run test` - Run all tests
- `npm run clean` - Clean all build artifacts

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/auratechit

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🏢 Core Modules

1. **Marketing Website** - Public-facing site with pricing, features, and demo
2. **Authentication System** - Multi-provider auth with 2FA support
3. **Organization System** - Multi-tenant workspace management
4. **Subscription & Billing** - Stripe-powered billing with app-based pricing
5. **App Marketplace** - Internal app store for modules
6. **Admin Panel** - Super admin dashboard for platform management

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **Payments**: Stripe
- **Cache**: Redis
- **Queue**: Bull Queue
- **Deployment**: Docker, Kubernetes ready

## 📄 License

MIT © AuraTechIT
