# PrepVault V4 Clean
Clean deploy-ready Next.js project. No real secrets in repo.

## Setup
1. Copy `.env.example` to `.env.local`
2. Add real values in `.env.local`
3. Run `database/prepvault_complete_schema.sql` in Neon SQL editor
4. Run `npm install --legacy-peer-deps`
5. Run `npm run build`
6. Push to GitHub
7. Add the same environment variables in Vercel settings

## Env variables
DATABASE_URL, NEXTAUTH_SECRET, GROQ_API_KEY
