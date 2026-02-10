
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
- [x] Fix package json versions (It generates errors...)
- [ ] Add oRPC integration
- [ ] Add error handling
- [ ] Unit tests (Vitest)

---

## Architecture

This project follows a **Feature-Based Architecture** where each feature is self-contained with its own data models, services, queries, and components.

This choice has been made to embrace TanStack Start's full-stack philosophy while keeping code organized and maintainable.

### Why this Architecture Feature-Based?

| Reason          | Benefit                                                          |
| --------------- | ---------------------------------------------------------------- |
| **Colocation**  | All related code lives together (easier to find)                 |
| **Scalability** | Add features without touching other parts                        |
| **Type Safety** | End-to-end types from DB to UI                                   |
| **Caching**     | React Query handles client-side cache automatically              |
| **Pragmatic**   | No over-engineering. Simple structure with 3-4 files per feature |

> **Note**: Unlike the [Next.js sister project](https://github.com/...) which uses a full Layered Architecture (DAL/BLL/Actions), this project uses a lighter approach that fits TanStack Start's "full-stack by default" philosophy.

### Representation of the architecture
