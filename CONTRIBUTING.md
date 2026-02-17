# Contributing to Better Tasks

Welcome! This guide explains how to set up, develop, and contribute to Better Tasks. Please follow these steps and conventions to ensure smooth collaboration.

## Project Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```
2. **Environment variables:**
   Copy `.env.example` to `.env` and configure as needed.
   ```bash
   cp .env.example .env
   ```
3. Create the database

   ```bash
   createdb better_tasks
   ```

4. **Start PostgreSQL:**
   ```bash
   docker compose up -d
   ```
5. **Generate Auth Schema:**
   Note: should be done already
   ```bash
   pnpm auth:generate
   ```
   Replace the old schema with the generated one.
6. **Database setup:**
   - Generate tables: `pnpm db:generate`
   - Push schema (dev): `pnpm db:push`
   - Migrate (prod): `pnpm db:migrate`

-

7. **Start dev server:**
   ```bash
   pnpm dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## Common Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `pnpm dev`           | Start development server       |
| `pnpm build`         | Build for production           |
| `pnpm start`         | Start production server        |
| `pnpm db:generate`   | Generate Drizzle migrations    |
| `pnpm db:migrate`    | Apply migrations               |
| `pnpm db:studio`     | Open Drizzle Studio            |
| `pnpm db:push`       | Push schema to DB (dev)        |
| `pnpm auth:generate` | Regenerate Better Auth schemas |
| `pnpm test`          | Run tests (Vitest)             |
| `pnpm lint`          | Lint code                      |
| `pnpm format`        | Format code                    |
| `pnpm check`         | Type check                     |

## Docker Commands

- Start database: `docker compose up -d`
- Stop database: `docker compose down`
- View logs: `docker compose logs -f db`
- Reset database: `docker compose down -v`

## Testing & Quality

- **Testing:** Uses [Vitest](https://vitest.dev/). Run tests with `pnpm test`.
- **Linting & Formatting:** Uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/). Run `pnpm lint`, `pnpm format`, and `pnpm check`.

## UI & Styling

- **Tailwind CSS** for styling.
- **shadcn/ui** for base UI components. Add new components via:
  ```bash
  ppnpm dlx shadcn@latest add <component>
  ```

## Authentication

- Generate `BETTER_AUTH_SECRET` for Better Auth:
  ```bash
  npx @better-auth/cli secret
  ```
- See [Better Auth documentation](https://www.better-auth.com/docs) for details.

## Architecture Patterns

- **Feature-First Colocation:** Organize features under their own `-feature/` directories.
- **Layered Structure:**
  - `xxx.dm.ts`: Data models (Zod schemas, types)
  - `xxx.queries.ts`: Query options (React Query)
  - `xxx.service.ts`: Server functions (CRUD, DB, auth)
  - `components/`: UI components

## References

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Better Auth Docs](https://www.better-auth.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com/docs)

---

Please update this guide as the project evolves.
