# Contributing to Better Tasks

Welcome! This guide explains how to set up, develop, and contribute to Better Tasks. Please follow these steps and conventions to ensure smooth collaboration.

## Project Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Environment variables:**
   Copy `.env.example` to `.env` and configure as needed.
   ```bash
   cp .env.example .env
   ```
3. **Start PostgreSQL:**
   ```bash
   docker compose up -d
   ```
4. **Generate Auth Schema:**
   ```bash
   npm run auth:generate
   ```
   Replace the old schema with the generated one.
5. **Database setup:**
   - Generate tables: `npm run db:generate`
   - Push schema (dev): `npm run db:push`
   - Migrate (prod): `npm run db:migrate`
6. **Start dev server:**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

## Common Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Build for production           |
| `npm run start`         | Start production server        |
| `npm run db:generate`   | Generate Drizzle migrations    |
| `npm run db:migrate`    | Apply migrations               |
| `npm run db:studio`     | Open Drizzle Studio            |
| `npm run db:push`       | Push schema to DB (dev)        |
| `npm run auth:generate` | Regenerate Better Auth schemas |
| `npm run test`          | Run tests (Vitest)             |
| `npm run lint`          | Lint code                      |
| `npm run format`        | Format code                    |
| `npm run check`         | Type check                     |

## Docker Commands

- Start database: `docker compose up -d`
- Stop database: `docker compose down`
- View logs: `docker compose logs -f db`
- Reset database: `docker compose down -v`

## Testing & Quality

- **Testing:** Uses [Vitest](https://vitest.dev/). Run tests with `npm run test`.
- **Linting & Formatting:** Uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/). Run `npm run lint`, `npm run format`, and `npm run check`.

## UI & Styling

- **Tailwind CSS** for styling.
- **shadcn/ui** for base UI components. Add new components via:
  ```bash
  pnpm dlx shadcn@latest add <component>
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
