# Spendwise — Smart Expense Tracker

AI-powered expense tracker for students and young professionals. Upload receipts, auto-categorize spending, set budgets, and get AI insights.

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Auth & DB**: Supabase (PostgreSQL + RLS)
- **AI / OCR**: Tesseract.js (client-side OCR) + Claude AI (parsing & insights)
- **Charts**: Recharts
- **Deployment**: Vercel

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd spendwise
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) → New project
2. In **SQL Editor**, paste and run the contents of `supabase-schema.sql`
3. In **Authentication > Providers**, enable **Google** (add OAuth credentials)
4. Copy your project URL and anon key from **Settings > API**

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: for direct AI features in browser (receipt OCR parsing, insights)
# You can also use Supabase Edge Functions to keep the key server-side
VITE_ANTHROPIC_KEY=your-anthropic-api-key
```

> **Security note**: `VITE_ANTHROPIC_KEY` is exposed in the browser bundle. For production, use the Supabase Edge Functions instead (see below) and remove this variable.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Supabase Edge Functions (Production AI)

Deploy Edge Functions to keep your Anthropic API key server-side:

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link project
supabase login
supabase link --project-ref your-project-ref

# Set secret
supabase secrets set ANTHROPIC_API_KEY=your-anthropic-api-key

# Deploy functions
supabase functions deploy parse-receipt
supabase functions deploy spending-analysis
```

---

## Features

| Feature | Description |
|---|---|
| 📷 Receipt OCR | Upload bill → Tesseract reads text → Claude extracts merchant, amount, date, category |
| 🏷 Auto-categorize | Food, Travel, Shopping, Entertainment, Education, Health, Utilities |
| 📊 Dashboard | Today/monthly spend, category charts, budget progress, AI insights |
| 💰 Budgets | Set per-category monthly limits with real-time alerts at 90% and 100% |
| 📈 Reports | Monthly trend (area chart), category pie, daily bar chart, top merchants |
| 🔔 Budget alerts | Visual warnings when approaching/exceeding budget |
| 📺 Subscription detection | Auto-detects Netflix, Spotify, Prime, etc. from transaction history |
| ➗ Split expense | Calculator for splitting bills among friends |
| 🔐 Auth | Email/password + Google OAuth via Supabase |

---

## Project Structure

```
src/
├── components/
│   ├── layout/       Layout.jsx (sidebar nav)
│   └── upload/       UploadModal.jsx (OCR + AI)
├── context/
│   └── AuthContext.jsx
├── hooks/
│   ├── useTransactions.js
│   └── useBudgets.js
├── lib/
│   ├── supabase.js
│   ├── ai.js          (AI service + category helpers)
│   └── utils.js       (formatters, date helpers)
└── pages/
    ├── Dashboard.jsx
    ├── Transactions.jsx
    ├── Budgets.jsx
    ├── Reports.jsx
    ├── SignIn.jsx
    └── SignUp.jsx

supabase/
└── functions/
    ├── parse-receipt/     Edge Function for image OCR
    └── spending-analysis/ Edge Function for AI insights
```

---

## Deploy to Vercel

```bash
npm run build
vercel --prod
```

Add env vars in Vercel dashboard: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ANTHROPIC_KEY`.

---

## Database Schema

**transactions**
- `id`, `user_id`, `merchant`, `amount`, `date`, `category`, `payment_method`, `notes`, `created_at`

**budgets**
- `id`, `user_id`, `category`, `amount`, `created_at`

Both tables have Row Level Security — users can only access their own data.
