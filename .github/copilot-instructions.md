# Copilot Instructions for Better Tasks

## Overview

Better Tasks is a fullstack task management app built with TanStack Start, using a **Feature-First Colocation** architecture. Key technologies: TanStack Start, TanStack Router/Query, Drizzle ORM, Better Auth, shadcn/ui, Tailwind CSS.

## Architecture & Patterns

- **Feature-First Colocation:** Each feature (e.g., tasks, todos) is organized under its own `-feature/` directory, containing data models, queries, services, and UI components.
- **Layered Feature Structure:**
  - `xxx.dm.ts`: Zod schemas, TypeScript types, input validation
  - `xxx.queries.ts`: React Query options, cache keys, stale time
  - `xxx.service.ts`: Server functions, DB ops, auth checks
  - `components/`: UI rendering, user interactions, cache invalidation
- **Data Flow:**
  - Loaders (GET): Route `loader` prefetches and caches data
  - Mutations (POST): UI triggers, never cached, always invalidates cache
- **Auth:** Uses Better Auth for authentication, with custom tables in `lib/auth/plugins/`.
- **Database:** PostgreSQL via Drizzle ORM, schemas in `lib/db/schema.ts`.

## Key Workflows

- **Install:** `npm install`
- **DB Setup:**
  - Generate schemas: `npm run auth:generate`
  - Generate migrations: `npm run db:generate`
  - Push schema (dev): `npm run db:push`
  - Migrate (prod): `npm run db:migrate`
- **Start DB:** `docker compose up -d`
- **Dev Server:** `npm run dev` (http://localhost:3000)
- **Build:** `npm run build`
- **Test:** `npm run test` (Vitest)
- **Lint/Format:** `npm run lint`, `npm run format`, `npm run check`

## Project Conventions

- **Type Safety:** All DB and API interactions use Zod schemas and Drizzle types.
- **React Query:** Query options are defined per feature for caching and invalidation.
- **UI:** Use shadcn/ui base components, add via `pnpm dlx shadcn@latest add <component>`.
- **Environment:** Set `BETTER_AUTH_SECRET` via `npx @better-auth/cli secret`.

## Integration Points

- **Auth:** See `lib/auth/auth.ts`, `lib/auth/auth.functions.ts`, and `lib/auth/plugins/todos.table.ts`.
- **DB:** See `lib/db/db.ts`, `lib/db/schema.ts`.
- **Feature Example:** See `routes/(app)/_auth/tasks/-feature/` for full feature pattern.

## References

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Better Auth Docs](https://www.better-auth.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)

---

**Review and update this file as the project evolves.**
