# LedgrNow

LedgrNow is a production-ready AI finance and business management SaaS. It includes a Next.js 15 frontend, Express API, PostgreSQL database, Prisma ORM, JWT authentication, Google login, password reset, OpenAI financial intelligence, Razorpay billing, admin tools, dark mode, and responsive fintech UI.

## Folder Structure

```text
.
├── apps
│   ├── api
│   │   ├── prisma
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── src
│   │       ├── config
│   │       ├── middleware
│   │       ├── routes
│   │       ├── services
│   │       └── utils
│   └── web
│       ├── app
│       │   ├── admin
│       │   ├── ai
│       │   ├── auth
│       │   ├── billing
│       │   ├── contact
│       │   ├── dashboard
│       │   ├── expenses
│       │   ├── loans
│       │   └── pricing
│       ├── components
│       └── lib
├── docs
├── docker-compose.yml
└── package.json
```

## Features

- Landing page with hero, features, pricing, FAQ, testimonials-style trust content, and contact page.
- Dashboard with balance, income, expenses, savings, loans, and category charts.
- Expense CRUD APIs with AI categorization, search, filters, and monthly reports.
- Loan tracking, EMI calculator, payment recording, reminders-ready due dates, and AI loan analytics.
- AI assistant, expense categorization, budget recommendations, loan analysis, report generation, and stored chat history.
- Admin panel APIs for users, subscriptions, analytics, roles, and audit logging.
- Razorpay checkout order creation, subscription activation, and signed webhook handling.
- JWT auth, Google login, email login, forgot password, rate limiting, validation, Helmet security, and environment-driven secrets.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Generate Prisma and migrate:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed --workspace apps/api
```

5. Run the platform:

```bash
npm run dev
```

Frontend: `http://localhost:3000`

API: `http://localhost:4000`

Seed accounts:

- `demo@ledgrnow.com` / `LedgrNow@123`
- `admin@ledgrnow.com` / `LedgrNow@123`

## Environment Variables

The full variable list is in `.env.example`. The API requires database, JWT, OpenAI, Google OAuth, Razorpay, and SMTP values. The web app requires `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_GOOGLE_CLIENT_ID`.

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/dashboard`
- `GET /api/expenses`
- `POST /api/expenses`
- `PUT /api/expenses/:id`
- `DELETE /api/expenses/:id`
- `GET /api/expenses/reports/monthly`
- `GET /api/loans`
- `POST /api/loans`
- `POST /api/loans/emi`
- `POST /api/loans/:id/payments`
- `GET /api/loans/analytics`
- `GET /api/transactions`
- `POST /api/transactions`
- `POST /api/ai/chat`
- `GET /api/ai/chats`
- `GET /api/ai/budget-recommendations`
- `GET /api/ai/financial-report`
- `POST /api/billing/checkout`
- `POST /api/billing/activate`
- `POST /api/billing/webhook`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/role`
- `GET /api/admin/subscriptions`
- `GET /api/admin/analytics`

## Production Notes

- Use managed PostgreSQL with SSL enabled.
- Set strong `JWT_SECRET` with at least 32 random characters.
- Configure Google OAuth origins and callback URLs for the deployed domains.
- Configure Razorpay webhook URL as `https://your-api-domain.com/api/billing/webhook`.
- Use a transactional SMTP provider for password reset email.
- Run Prisma migrations during release before starting the API.
