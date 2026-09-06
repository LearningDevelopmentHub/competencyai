# packages/db README

Instructions for running prisma migrate and seed.

1) Ensure DATABASE_URL is set in env (see root .env.example)
2) Install dependencies: pnpm install
3) Generate prisma client: pnpm --filter packages/db run prisma:generate
4) Run migration: pnpm --filter packages/db run prisma:migrate:dev
5) Run seed: pnpm --filter packages/db run prisma:seed

