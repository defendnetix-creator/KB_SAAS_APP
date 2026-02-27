# KB Enterprise SaaS

Production-ready Multi-tenant Knowledge Base Platform.

## Features
- Multi-tenant architecture (Organizations)
- JWT Authentication with Refresh Tokens
- Role-Based Access Control (RBAC)
- Admin Dashboard with Real-time Stats
- Article & Category Management
- Responsive Enterprise UI

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: SQLite (Dev) / PostgreSQL (Prod)
- **Security**: JWT, Bcrypt, Helmet, Rate Limiting

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and update the secrets.

### 2. Database Migration
```bash
npx prisma migrate dev --name init
```

### 3. Seed Initial Data
Run the application and call the seed endpoint:
`POST http://localhost:3000/api/auth/seed`
This creates:
- Organization: `KB Enterprise`
- Admin: `admin@kb.com` / `password123`
- User: `user@kb.com` / `password123`

### 4. Run Development Server
```bash
npm run dev
```

## Production Deployment
1. Build the frontend: `npm run build`
2. Set `NODE_ENV=production`
3. Run the server: `node server.ts` (or use PM2)

## GitHub Push
```bash
git init
git add .
git commit -m "feat: initial enterprise saas architecture"
git remote add origin <your-repo-url>
git push -u origin main
```
