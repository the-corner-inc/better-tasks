# Better Tasks - TanStack Start

A task management application built with TanStack Start, featuring a pragmatic **Feature-First Colocation** architecture.

> Originally based on [this YouTube tutorial](https://www.youtube.com/watch?v=KsHbs5RMVYU), now evolved into a standalone project demonstrating modern full-stack patterns with TanStack.

Based on the tutorial, first a POC is build to understand the tech used, and then a alpha version will be released to serve two purposes:
- a standalone web application
- a partially packaged module to be distributed as an npm package and integrated into the up4it application
---

## Technical Stack

# TODO : UPDATE VERSIONS


| Technology                                     | Version | Purpose                   |
|------------------------------------------------|---------|---------------------------|
| [TanStack Start](https://tanstack.com/start)   | latest  | Fullstack React framework |
| [TanStack Router](https://tanstack.com/router) | latest  | Type-safe routing         |
| [TanStack Query](https://tanstack.com/query)   | latest  | Data fetching & caching   |
| [Better Auth](https://www.better-auth.com/)    | latest  | Authentication            |
| [PostgreSQL](https://www.postgresql.org/)      | 16      | Database (Docker)         |
| [Drizzle ORM](https://orm.drizzle.team/)       | latest  | Type-safe ORM             |
| [Zod](https://zod.dev/)                        | latest  | Schema validation         |
| [shadcn/ui](https://ui.shadcn.com/)            | latest  | UI Components             |
| [Tailwind CSS](https://tailwindcss.com/)       | 4       | Styling                   |

---


## Project Status / TODO
### Features (Product)
- [x] Authentication (Better Auth)
- [x] Task CRUD operations
- [x] Todo CRUD operations (nested under tasks)
- [x] Drag & drop reorder for todos
- [x] React Query caching
- [ ] Email verification
- [ ] User profile management

### Chore (Internally)
- [x] Follow the YouTube tutorial (TanStack Start basics)
- [x] Feature-based architecture
- [x] Implement Better Auth and plugins
- [x] Implement input validators
- [x] Type-safe server functions
- [x] Zod input validation with transforms
- [x] `satisfies` pattern for type safety
- [x] Implement caching
- [ ] Fix package json versions (It generates errors...)
- [ ] Add oRPC integration
- [ ] Add error handling
- [ ] Unit tests (Vitest)

---


## Architecture

This project follows a **Feature-Based Architecture** where each feature is self-contained with its own data models, services, queries, and components.

This choice has been made to embrace TanStack Start's full-stack philosophy while keeping code organized and maintainable.

### Why this Architecture Feature-Based?

| Reason              | Benefit                                                          |
|---------------------|------------------------------------------------------------------|
| **Colocation**      | All related code lives together (easier to find)                 |
| **Scalability**     | Add features without touching other parts                        |
| **Type Safety**     | End-to-end types from DB to UI                                   |
| **Caching**         | React Query handles client-side cache automatically              |
| **Pragmatic**       | No over-engineering. Simple structure with 3-4 files per feature |

> **Note**: Unlike the [Next.js sister project](https://github.com/...) which uses a full Layered Architecture (DAL/BLL/Actions), this project uses a lighter approach that fits TanStack Start's "full-stack by default" philosophy.

### Representation of the architecture
# TODO SCHEMA HERE

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
│   │       │   ├── tasks.dm.ts       # Data Models (Zod schemas + types)
│   │       │   ├── tasks.queries.ts  # Query Options (React Query cache)
│   │       │   ├── tasks.service.ts  # Server Functions (CRUD)
│   │       │   └── components/       # UI components
│   │       ├── $id/
│   │       │   ├── -feature/         # Todos feature (nested)
│   │       │   │   ├── todos.dm.ts
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

Each ```-feature/``` follows this pattern:

| File             | Layer           | Responsibility                                      |
|------------------|-----------------|-----------------------------------------------------|
| `xxx.dm.ts`      | **Data Models** | Zod schemas, TypeScript types, input validation     |
| `xxx.queries.ts` | **Queries**     | React Query options, cache keys, stale time         |
| `xxx.service.ts` | **Service**     | Server functions, DB operations, auth checks        |
| `components/`    | **Components**  | UI rendering, user interactions, cache invalidation |

There can be more file types. This is just a basic example.


### Data Flow (GET)

### Mutation Flow (POST)

# TODO INSERT FLOW HERE


 ---

### Server Functions Explained

| Type         | HTTP | Purpose    | Called by               | Cache                                         |
|--------------|------|------------|-------------------------|-----------------------------------------------|
| **Loader**   | GET  | Read data  | Route `loader`          | - Can be cached                               |
| **Mutation** | POST | Write data | UI `onClick`/`onSubmit` | - Never cached. <br/>- Invalidates the cache. |

---


## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables (no example for now)

```bash
cp .env.example .env
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Schemas for DB setup

```bash
npm run auth:generate
```
Then copy-paste the generated schema to replace the old schema

### 5. Database setup

```bash
# Generate the drizzle tables
npm run db:generate

# Quick setup (dev) : push to DB, you can loose the data's
npm run db:push

# With migrations (production) : verify the before & after to migrate the DB correctly
npm run db:migrate
```

### 6. Start dev server

```bash
npm run dev
```

Open http://localhost:3000

---

## Scripts

| Command                 | Description                    |
|-------------------------|--------------------------------|
| `npm run dev`           | Start development server       |
| `npm run build`         | Build for production           |
| `npm run start`         | Start production server        |
| `npm run db:generate`   | Generate Drizzle migrations    |
| `npm run db:migrate`    | Apply migrations               |
| `npm run db:studio`     | Open Drizzle Studio            |
| `npm run db:push`       | Push schema to DB (dev)        |
| `npm run auth:generate` | Regenerate Better Auth schemas |

---

## Docker

```bash
# Start database
docker compose up -d

# Stop database
docker compose down

# View logs
docker compose logs -f db

# Reset (delete all data)
docker compose down -v
```

---

## Resources

- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/docs)

---

<details>
<summary>
 Key Patterns to follow
</summary>


```typescript
// ═══════════════════════════════════════════════════════════════════════════
// 1. DATA MODEL (xxx.dm.ts)
// ═══════════════════════════════════════════════════════════════════════════

// Base schema from Drizzle (source of truth)
const taskSchema = createSelectSchema(TaskTable);

// Type for full DB row
export type TaskModel = z.infer;

// Input schema with validation + transform
export const createTaskSchema = z.object({
    title: z.string().min(1).max(255).transform(val => val.trim())
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. QUERY OPTIONS (xxx.queries.ts)
// ═══════════════════════════════════════════════════════════════════════════

export const tasksListQueryOptions = () =>
    queryOptions({
        queryKey: ["tasks"],
        queryFn: ({ signal }) => getTasksList({ signal }),
        staleTime: 1000 * 60 * 2,  // 2 minutes
    });

// ═══════════════════════════════════════════════════════════════════════════
// 3. SERVICE (xxx.service.ts)
// ═══════════════════════════════════════════════════════════════════════════

export const createTask = createServerFn({ method: "POST" })
    .inputValidator(createTaskSchema)
    .handler(async ({ data }) => {
        const userId = await $getCurrentUserId();
        
        const taskToInsert = {
            id: crypto.randomUUID(),
            userId,
            title: data.title,
            createdAt: new Date(),
            updatedAt: new Date(),
        } satisfies TaskModel;  // ← TypeScript verifies all fields
        
        const [newTask] = await db.insert(taskTable).values(taskToInsert).returning();
        return newTask;
    });

// ═══════════════════════════════════════════════════════════════════════════
// 4. ROUTE (index.tsx)
// ═══════════════════════════════════════════════════════════════════════════

export const Route = createFileRoute('/(app)/_auth/tasks/')({
    component: RouteComponent,
    loader: async ({ context }) => {
        // Prefetch into cache
        await context.queryClient.ensureQueryData(tasksListQueryOptions());
    }
});

function RouteComponent() {
    // Read from cache (already loaded by loader)
    const { data: tasks } = useSuspenseQuery(tasksListQueryOptions());
    return ;
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. COMPONENT (after mutation)
// ═══════════════════════════════════════════════════════════════════════════

const queryClient = useQueryClient();

async function handleCreate(title: string) {
    await createTaskFn({ data: { title } });
    // Invalidate cache to trigger refetch
    await queryClient.invalidateQueries({ queryKey: ["tasks"] });
}
```

---

</details>

<details>
<summary><strong> Tanstack Initial Boilerplate Documentation</strong></summary>

# Getting Started

To run this application:

```bash
npm install
npm run dev
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting


This project uses [eslint](https://eslint.org/) and [prettier](https://prettier.io/) for linting and formatting. Eslint is configured using [tanstack/eslint-config](https://tanstack.com/config/latest/docs/eslint). The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```


## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpm dlx shadcn@latest add button
```


## Setting up Better Auth

1. Generate and set the `BETTER_AUTH_SECRET` environment variable in your `.env.local`:

   ```bash
   npx @better-auth/cli secret
   ```

2. Visit the [Better Auth documentation](https://www.better-auth.com) to unlock the full potential of authentication in your app.

### Adding a Database (Optional)

Better Auth can work in stateless mode, but to persist user data, add a database:

```typescript
// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  // ... rest of config
});
```

Then run migrations:

```bash
npx @better-auth/cli migrate
```



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
</details>

