# LedgrNow Deployment Guide

## Recommended Architecture

- Frontend: Vercel, Netlify, or a Dockerized Node host.
- API: Render, Fly.io, Railway, ECS, or any Node 20 runtime.
- Database: Managed PostgreSQL 16.
- Assets and email: transactional SMTP provider.
- Payments: Razorpay live mode with webhook signing.

## Build Commands

Frontend:

```bash
npm install
npm run build --workspace apps/web
npm run start --workspace apps/web
```

Backend:

```bash
npm install
npm run prisma:generate --workspace apps/api
npm run build --workspace apps/api
npm run start --workspace apps/api
```

Database migration:

```bash
npm run prisma:migrate --workspace apps/api
```

## API Environment

Set the variables from `.env.example` in the API hosting environment. Use production URLs for `FRONTEND_URL`, `API_URL`, `GOOGLE_CALLBACK_URL`, and live payment credentials.

## Web Environment

Set:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

## Security Checklist

- Use HTTPS for web and API.
- Rotate JWT, Razorpay, SMTP, Google, and OpenAI secrets before production launch.
- Keep rate limiting enabled.
- Restrict CORS to the production frontend domain.
- Store database credentials in the platform secret manager.
- Enable database backups and point-in-time recovery.
- Create the first super admin through a one-time seed or direct migration script, then remove public access to seed commands.
