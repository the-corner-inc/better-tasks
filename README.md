# Better Tasks - TanStack Start

A task management application built with TanStack Start, featuring a pragmatic **Feature-First Colocation** architecture.

> Originally based on [this YouTube tutorial](https://www.youtube.com/watch?v=KsHbs5RMVYU), now evolved into a standalone project demonstrating modern full-stack patterns with TanStack.

Based on the tutorial, first a POC is build to understand the tech used, and then an alpha version will be released to serve two purposes:

- a standalone web application
- a partially packaged module to be distributed as a npm package and integrated into the up4it application

---

## Technical Stack

| Technology                                     | Version | Purpose                   |
| ---------------------------------------------- | ------- | ------------------------- |
| [TanStack Start](https://tanstack.com/start)   | 1.132.0 | Fullstack React framework |
| [TanStack Router](https://tanstack.com/router) | 1.132.0 | Type-safe routing         |
| [TanStack Query](https://tanstack.com/query)   | 5.84.2  | Data fetching & caching   |
| [Better Auth](https://www.better-auth.com/)    | 1.4.12  | Authentication            |
| [PostgreSQL](https://www.postgresql.org/)      | 16      | Database (Docker)         |
| [Drizzle ORM](https://orm.drizzle.team/)       | 0.45.0  | Type-safe ORM             |
| [Zod](https://zod.dev/)                        | 4.3.6   | Schema validation         |
| [shadcn/ui](https://ui.shadcn.com/)            | latest  | UI Components             |
| [Tailwind CSS](https://tailwindcss.com/)       | 4.1.18  | Styling                   |

---

### Project Structure

```
src/
├── lib/
│   ├── auth/                     # Authentication (Better Auth)
│   │   ├── auth.ts               # Auth configuration
│   │   ├── auth.functions.ts     # Server functions ($getUser, $getSession)
│   │   ├── auth.queries.ts       # Query options (authQueryOptions)
│   │   └── plugins/
│   │       └── todos.table.ts    # Custom tables for Better Auth
│   └── db/
│       ├── db.ts                 # Drizzle instance
│       └── schema.ts             # Database schemas
│
├── routes/
│   ├── (app)/_auth/              # Protected routes (requires auth)
│   │   ├── route.tsx             # Auth layout + beforeLoad guard
│   │   └── tasks/
│   │       ├── -feature/         # Tasks feature (co-located)
│   │       │   ├── tasks.d.ts       # Data Models (Zod schemas + types)
│   │       │   ├── tasks.queries.ts  # Query Options (React Query cache)
│   │       │   ├── tasks.service.ts  # Server Functions (CRUD)
│   │       │   └── components/       # UI components
│   │       ├── $id/
│   │       │   ├── -feature/         # Todos feature (nested)
│   │       │   │   ├── todos.d.ts
│   │       │   │   ├── todos.service.ts
│   │       │   │   └── components/
│   │       │   └── index.tsx         # Task detail page
│   │       └── index.tsx             # Tasks list page
│   │
│   └── (public)/                 # Public routes
│       └── auth/login/           # Login page
│
└── components/                   # Shared UI components
```

### Feature Structure & Layer Responsibilities

Each `-feature/` follows this pattern:

| File             | Layer           | Responsibility                                      |
| ---------------- | --------------- | --------------------------------------------------- |
| `xxx.dm.ts`      | **Data Models** | Zod schemas, TypeScript types, input validation     |
| `xxx.queries.ts` | **Queries**     | React Query options, cache keys, stale time         |
| `xxx.service.ts` | **Service**     | Server functions, DB operations, auth checks        |
| `components/`    | **Components**  | UI rendering, user interactions, cache invalidation |

There can be more file types. This is just a basic example.

### Data Flow (GET)

![Get Cache Data Flow](public/documentation/Up4It-Tasks_Data_Flow.drawio.png)

### Mutation Flow (POST)

![Get Cache Data Flow](public/documentation/Up4It-Tasks_Mutation_Flow.drawio.png)

---

### Server Functions Explained

| Type         | HTTP | Purpose    | Called by               | Cache                                         |
| ------------ | ---- | ---------- | ----------------------- | --------------------------------------------- |
| **Loader**   | GET  | Read data  | Route `loader`          | - Can be cached                               |
| **Mutation** | POST | Write data | UI `onClick`/`onSubmit` | - Never cached. <br/>- Invalidates the cache. |

---

---

## Contributor Guide

For setup, development, scripts, Docker, testing, UI, and authentication instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

---

<details>
<summary>
 Key Architecture Patterns to follow (click to expand)
</summary>

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// 1. DATA MODEL (xxx.dm.ts)
// ═══════════════════════════════════════════════════════════════════════════

// Base schema from Drizzle (source of truth)
const taskSchema = createSelectSchema(TaskTable)

// Type for full DB row
export type TaskModel = z.infer

// Input schema with validation + transform
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(255)
    .transform((val) => val.trim()),
})

// ═══════════════════════════════════════════════════════════════════════════
// 2. QUERY OPTIONS (xxx.queries.ts)
// ═══════════════════════════════════════════════════════════════════════════

export const tasksListQueryOptions = () =>
  queryOptions({
    queryKey: ["tasks"],
    queryFn: ({ signal }) => getTasksList({ signal }),
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

// ═══════════════════════════════════════════════════════════════════════════
// 3. SERVICE (xxx.service.ts)
// ═══════════════════════════════════════════════════════════════════════════

export const createTask = createServerFn({ method: "POST" })
  .inputValidator(createTaskSchema)
  .handler(async ({ data }) => {
    const userId = await $getCurrentUserId()

    const taskToInsert = {
      id: crypto.randomUUID(),
      userId,
      title: data.title,
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies TaskModel // ← TypeScript verifies all fields

    const [newTask] = await db.insert(taskTable).values(taskToInsert).returning()
    return newTask
  })

// ═══════════════════════════════════════════════════════════════════════════
// 4. ROUTE (index.tsx)
// ═══════════════════════════════════════════════════════════════════════════

export const Route = createFileRoute("/(app)/_auth/tasks/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    // Prefetch into cache
    await context.queryClient.ensureQueryData(tasksListQueryOptions())
  },
})

function RouteComponent() {
  // Read from cache (already loaded by loader)
  const { data: tasks } = useSuspenseQuery(tasksListQueryOptions())
  return
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. COMPONENT (after mutation)
// ═══════════════════════════════════════════════════════════════════════════

const queryClient = useQueryClient()

async function handleCreate(title: string) {
  await createTaskFn({ data: { title } })
  // Invalidate cache to trigger refetch
  await queryClient.invalidateQueries({ queryKey: ["tasks"] })
}
```

</details>
