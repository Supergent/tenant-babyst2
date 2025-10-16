# Ultraminimal Todo - Implementation Summary

## 🎯 Project Overview

A production-ready, ultraminimal to-do list application built with:
- **Backend**: Convex (four-layer architecture)
- **Authentication**: Better Auth
- **Frontend**: Next.js 15 App Router
- **UI**: shadcn/ui with custom design system
- **AI**: Optional AI assistant (OpenAI/Anthropic)

## 📐 Architecture Pattern: The Cleargent Pattern

This project strictly follows the **four-layer Convex architecture**:

### Layer 1: Database Layer (`convex/db/`)
**Only place where `ctx.db` is used!**

```typescript
// convex/db/tasks.ts
export async function getActiveTasksByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db.query("tasks")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", "active")
    )
    .collect();
}
```

Files:
- `tasks.ts` - Task CRUD operations
- `threads.ts` - AI thread operations
- `messages.ts` - Message operations
- `dashboard.ts` - Aggregation queries with type assertions
- `index.ts` - Barrel export

### Layer 2: Endpoint Layer (`convex/endpoints/`)
**Business logic - composes database operations, never uses `ctx.db` directly!**

```typescript
// convex/endpoints/tasks.ts
import * as Tasks from "../db/tasks";

export const listActive = query({
  handler: async (ctx) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await Tasks.getActiveTasksByUser(ctx, user._id);
  },
});
```

Files:
- `tasks.ts` - Task management (create, list, complete, delete)
- `assistant.ts` - AI assistant (threads, messages)
- `dashboard.ts` - Dashboard metrics and recent data

### Layer 3: Helper Layer (`convex/helpers/`)
**Pure utilities - no database, no `ctx` parameter!**

```typescript
// convex/helpers/validation.ts
export function isValidTaskTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 200;
}
```

Files:
- `validation.ts` - Input validation and sanitization
- `constants.ts` - Application constants

### Layer 4: Configuration Layer
**Component setup and configuration**

Files:
- `auth.ts` - Better Auth with Convex adapter
- `http.ts` - HTTP routes for authentication
- `rateLimiter.ts` - Token bucket rate limiting
- `agent.ts` - AI agent configuration
- `schema.ts` - Database schema with indexes

## 🔐 Key Implementation Patterns

### Authentication Pattern
```typescript
// Every endpoint starts with this
const user = await authComponent.getAuthUser(ctx);
if (!user) throw new Error("Not authenticated");

// IMPORTANT: Use user._id (not user.id) for operations
const tasks = await Tasks.getTasksByUser(ctx, user._id);
```

### Rate Limiting Pattern (Mutations Only!)
```typescript
// In mutations (NOT queries - they can't call mutations)
const status = await rateLimiter.limit(ctx, "createTask", { key: user._id });
if (!status.ok) {
  throw new Error(`Rate limit exceeded. Retry after ${status.retryAfter}ms`);
}
```

### Authorization Pattern
```typescript
// Always verify ownership before modification
const task = await Tasks.getTaskById(ctx, args.id);
if (!task) throw new Error("Task not found");
if (task.userId !== user._id) {
  throw new Error("Not authorized");
}
```

### Dynamic Table Queries (Dashboard)
```typescript
// Use type assertion when iterating over table names
const records = await ctx.db.query(table as keyof DataModel).collect();
```

## 🗄️ Database Schema

### Tasks Table
```typescript
tasks: defineTable({
  userId: v.string(),              // User scoping
  title: v.string(),               // Task title
  description: v.optional(v.string()),
  status: v.union(                 // Status literals
    v.literal("active"),
    v.literal("completed"),
    v.literal("deleted")
  ),
  completedAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_and_status", ["userId", "status"])
  .index("by_created", ["createdAt"])
```

### Threads Table (AI Assistant)
```typescript
threads: defineTable({
  userId: v.string(),
  title: v.optional(v.string()),
  status: v.union(v.literal("active"), v.literal("archived")),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_user", ["userId"])
  .index("by_user_and_status", ["userId", "status"])
```

### Messages Table
```typescript
messages: defineTable({
  threadId: v.id("threads"),
  userId: v.string(),
  role: v.union(v.literal("user"), v.literal("assistant")),
  content: v.string(),
  createdAt: v.number(),
})
  .index("by_thread", ["threadId"])
```

## 🎨 Frontend Architecture

### Provider Structure
```typescript
// apps/web/app/layout.tsx
<ConvexClientProvider>  {/* Convex + Better Auth */}
  <AppProviders>        {/* Theme + Toast */}
    {children}
  </AppProviders>
</ConvexClientProvider>
```

### Component Organization
```
apps/web/
├── app/
│   ├── layout.tsx      # Root with providers
│   └── page.tsx        # Main page
├── components/
│   ├── task-list.tsx   # Task CRUD interface
│   ├── auth-form.tsx   # Sign in/up
│   └── dashboard-hero.tsx # Dashboard metrics
├── lib/
│   ├── auth-client.ts  # Better Auth setup
│   └── convex.ts       # Convex client
└── providers/
    └── convex-provider.tsx # Combined provider
```

### Hooks Usage
```typescript
// Authentication
const { data: session, isPending } = useSession();
const { signIn, signUp, signOut } = authClient;

// Convex queries/mutations
const tasks = useQuery(api.endpoints.tasks.listActive);
const createTask = useMutation(api.endpoints.tasks.create);
```

## 🚦 Rate Limiting Configuration

```typescript
rateLimiter = new RateLimiter(components.rateLimiter, {
  // Task operations
  createTask: { kind: "token bucket", rate: 20, period: MINUTE, capacity: 5 },
  updateTask: { kind: "token bucket", rate: 50, period: MINUTE, capacity: 10 },
  deleteTask: { kind: "token bucket", rate: 30, period: MINUTE, capacity: 5 },

  // AI operations (more conservative)
  sendMessage: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 3 },
  createThread: { kind: "token bucket", rate: 5, period: MINUTE, capacity: 2 },
});
```

## 🎨 Design System

### Theme Configuration
- **Tone**: Neutral
- **Density**: Balanced
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #0ea5e9 (Sky Blue)
- **Accent**: #f97316 (Orange)
- **Font**: Inter

### Shared Packages
- `@jn78bp632rvzbm5y1dw8ewfbzd7sj714/design-tokens` - Theme tokens + Tailwind preset
- `@jn78bp632rvzbm5y1dw8ewfbzd7sj714/components` - shadcn/ui components

### Components Available
Button, Card, Input, Badge, Skeleton, Toast, Dialog, Table, Alert, Tabs

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start Convex backend
npm run convex:dev

# Start Next.js frontend (in another terminal)
npm run web:dev

# Build for production
npm run build

# Run Storybook (component library)
npm run storybook
```

## 📋 Environment Variables

Create `.env.local` from `.env.local.example`:

```bash
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Better Auth
BETTER_AUTH_SECRET=         # openssl rand -base64 32
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# AI (Optional)
OPENAI_API_KEY=            # For AI assistant
# OR
ANTHROPIC_API_KEY=         # Alternative AI provider
```

## ✅ Implementation Checklist

### Backend (Convex)
- ✅ Database layer with all CRUD operations
- ✅ Endpoint layer with business logic
- ✅ Helper layer with pure utilities
- ✅ Better Auth integration
- ✅ Rate limiting on all mutations
- ✅ User-scoped queries with proper indexes
- ✅ Input validation and sanitization
- ✅ Authorization checks
- ✅ Dashboard aggregations

### Frontend (Next.js)
- ✅ Authentication UI (sign in/sign up)
- ✅ Task creation with validation
- ✅ Active task list with real-time updates
- ✅ Complete/reactivate tasks
- ✅ Delete tasks (soft delete)
- ✅ Completed tasks list
- ✅ Loading states
- ✅ Error handling with toast notifications
- ✅ Responsive design
- ✅ Design system integration

### AI Features (Optional)
- ✅ Thread management (database + endpoints)
- ✅ Message sending (database + endpoints)
- ⚠️ AI integration requires API key configuration

## 🔒 Security Features

1. **Authentication**: Every endpoint verifies user session
2. **Authorization**: Users can only access their own data
3. **Rate Limiting**: All mutations are rate-limited per user
4. **Input Validation**: All user input is validated and sanitized
5. **Type Safety**: Full TypeScript coverage
6. **User Scoping**: All queries filter by userId

## 🚀 Performance Optimizations

1. **Proper Indexes**: All queries use database indexes
2. **User-Scoped Queries**: Efficient data filtering
3. **Real-time Updates**: Convex reactive queries
4. **Optimistic Updates**: Immediate UI feedback
5. **Loading States**: Skeleton loaders for better UX
6. **Dynamic Imports**: Code splitting for faster initial load

## 📖 Learning Resources

- [Convex Docs](https://docs.convex.dev/)
- [Better Auth Docs](https://better-auth.com/)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Implementation Status**: ✅ **PRODUCTION READY**

The application is fully functional with authentication, task management, real-time updates, rate limiting, and comprehensive error handling. All code follows the Cleargent Pattern with strict layer separation.
