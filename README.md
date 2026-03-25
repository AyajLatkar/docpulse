# DocPulse — Healthcare Management System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/docpulse&env=DATABASE_URL,NEXTAUTH_SECRET,NEXTAUTH_URL&envDescription=Required%20environment%20variables&project-name=docpulse)

A production-ready, full-stack healthcare management platform built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Database**: PostgreSQL via Prisma ORM (Supabase / Vercel Postgres)
- **Auth**: NextAuth.js (Credentials)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Plus Jakarta Sans

---

## Features

- Role-based dashboards: Admin, Doctor, Patient
- Appointment scheduling & management
- Medical records (EMR)
- Glassmorphism sidebar with dark theme
- Skeleton loaders for all data fetching
- Framer Motion page transitions
- HIPAA-ready security headers

---

## Go Live Guide

### Step 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/docpulse.git
cd docpulse
npm install
```

### Step 2 — Set Up Database (Supabase)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the **Connection String** (URI format) from Settings → Database
3. Paste it into `.env.local` as `DATABASE_URL`

### Step 3 — Configure Environment

```bash
cp .env.local.example .env.local
```

Fill in:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4 — Push Schema & Seed

```bash
npm run db:push
npm run db:seed
```

### Step 5 — Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Deploy to Vercel

### Option A — One-Click Deploy

Click the **Deploy with Vercel** button at the top of this README.

### Option B — Manual Deploy

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Add environment variables:
   - `DATABASE_URL` — your Supabase/Vercel Postgres connection string
   - `NEXTAUTH_SECRET` — run `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your Vercel deployment URL (e.g. `https://docpulse.vercel.app`)
4. Set **Build Command** to: `prisma generate && next build`
5. Click **Deploy**

### Option C — Vercel CLI

```bash
npm i -g vercel
vercel
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel --prod
```

---

## Demo Credentials

| Role    | Email                      | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@docpulse.com         | password123 |
| Doctor  | doctor@docpulse.com        | password123 |
| Patient | patient@docpulse.com       | password123 |

---

## Project Structure

```
docpulse/
├── prisma/
│   └── schema.prisma          # DB models
├── scripts/
│   └── seed.ts                # Demo data seeder
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login & Register pages
│   │   ├── (dashboard)/       # Admin, Doctor, Patient dashboards
│   │   ├── api/               # NextAuth + Register API routes
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── dashboard/         # Sidebar, StatCard, Skeletons
│   │   ├── landing/           # Navbar, Hero, Features, Stats, Footer
│   │   └── ui/                # Shadcn components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── utils.ts           # cn() helper
│   └── types/
│       └── index.ts           # Shared TypeScript types
├── vercel.json                # Vercel deployment config
└── README.md
```

---

## License

MIT © DocPulse
