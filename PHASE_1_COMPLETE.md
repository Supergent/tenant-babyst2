# Phase 1: Infrastructure Generation - COMPLETE ✅

## Project: Ultraminimal To-Do List

A distraction-free task management application with AI assistance capabilities.

## Generated Files (9 total)

### 0. `pnpm-workspace.yaml` ✅
- Monorepo configuration for pnpm
- Defines workspace packages: apps/*, packages/*

### 1. `package.json` ✅
- Root package configuration
- **Dependencies** (with explicit versions):
  - `convex@^1.27.0` - Backend framework
  - `@convex-dev/better-auth@^0.9.5` + `better-auth@^1.3.27` - Authentication
  - `@convex-dev/rate-limiter@^0.2.0` - API protection
  - `@convex-dev/agent@^0.2.0` - AI orchestration
  - `@convex-dev/persistent-text-streaming@^0.2.0` - Real-time streaming
  - shadcn/ui + Radix UI components
  - Tailwind utilities
- **Dev Dependencies**: TypeScript, Turbo, Vitest, Storybook, etc.
- **Scripts**: dev, build, setup

### 2. `convex/convex.config.ts` ✅
- Configured 4 Convex Components:
  1. Better Auth (authentication)
  2. Rate Limiter (API protection)
  3. Agent (AI orchestration)
  4. Text Streaming (real-time AI responses)

### 3. `convex/schema.ts` ✅
- **tasks** table:
  - User-scoped with `userId`
  - Status: active | completed | deleted
  - Indexes: by_user, by_user_and_status, by_created
- **threads** table (Agent component):
  - AI conversation history
  - Status: active | archived
- **messages** table (Agent component):
  - Chat messages within threads
  - Role: user | assistant

### 4. `.env.local.example` ✅
- Convex deployment variables
- Better Auth secret + site URLs
- AI provider keys (OpenAI or Anthropic)

### 5. `.gitignore` ✅
- Standard Node.js ignores
- Convex generated files
- Environment variables
- Build artifacts

### 6. `README.md` ✅
- Project overview
- Architecture explanation (four-layer pattern)
- Component descriptions
- Installation steps
- Development tips

### 7. `convex/auth.ts` ✅
- Better Auth configuration
- Email/password authentication
- 30-day JWT expiration
- No email verification (simplified)
- No organization plugin (single-user app)

### 8. `convex/http.ts` ✅
- HTTP router setup
- Auth endpoints (POST and GET /auth/*)
- Uses `httpAction()` wrapper for proper types

## Architecture Decisions

### Components Detected & Rationale

1. **Better Auth** - ALWAYS included for authentication
2. **Rate Limiter** - ALWAYS included for production apps
3. **Agent** - Detected "AI" capability in description → AI-powered task assistance
4. **Text Streaming** - Detected "AI" + listed explicitly → Real-time AI response streaming

### Schema Design

- **User-scoped**: All tables have `userId` field
- **No multi-tenancy**: This is a personal to-do list, no `organizationId`
- **Status-based**: Tasks use status enum (active/completed/deleted) instead of hard deletes
- **Proper indexes**: All tables indexed by user, with compound indexes for common queries
- **Timestamps**: createdAt/updatedAt on all tables

### Authentication Strategy

- Email/password only (simplified for minimal app)
- No email verification (reduces friction)
- 30-day sessions (good UX for personal app)
- Convex JWT adapter (seamless integration)

## Environment Variables Required

```bash
# Convex
CONVEX_DEPLOYMENT=        # From `convex dev`
NEXT_PUBLIC_CONVEX_URL=   # From `convex dev`

# Better Auth
BETTER_AUTH_SECRET=       # openssl rand -base64 32
SITE_URL=                 # http://localhost:3000
NEXT_PUBLIC_SITE_URL=     # http://localhost:3000

# AI (choose one)
OPENAI_API_KEY=           # For GPT models
# OR
ANTHROPIC_API_KEY=        # For Claude models
```

## Next Steps (Phase 2)

Phase 2 will generate implementation code:

1. **Database Layer** (`convex/db/`):
   - `tasks.ts` - CRUD operations for tasks
   - `threads.ts` - AI conversation management
   - `messages.ts` - Chat message operations
   - `index.ts` - Barrel exports

2. **Endpoint Layer** (`convex/endpoints/`):
   - `tasks.ts` - Task business logic with auth
   - `ai.ts` - AI assistant endpoints
   - Rate limiting integration

3. **Helper Layer** (`convex/helpers/`):
   - `validation.ts` - Input validation
   - `constants.ts` - App constants
   - `formatting.ts` - Data formatting

4. **Frontend** (`apps/web/`):
   - Next.js 15 App Router structure
   - Auth providers and utilities
   - shadcn/ui components
   - Tailwind configuration with theme
   - Task management UI
   - AI chat interface

## Validation Checklist

- ✅ All 9 files created
- ✅ `pnpm-workspace.yaml` exists (critical for monorepo)
- ✅ Explicit package versions (no "latest")
- ✅ All 4 components in convex.config.ts
- ✅ Complete schema with proper indexes
- ✅ All required env vars documented
- ✅ TypeScript syntax valid
- ✅ README has clear setup instructions
- ✅ Better Auth properly configured
- ✅ HTTP routes use httpAction() wrapper

## Installation Commands

```bash
# 1. Install dependencies
pnpm install

# 2. Initialize Convex
npx convex dev

# 3. Install Convex Components
npx convex components install @convex-dev/better-auth --save
npx convex components install @convex-dev/rate-limiter --save
npx convex components install @convex-dev/agent --save
npx convex components install @convex-dev/persistent-text-streaming --save

# 4. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your values

# 5. Start development
pnpm dev
```

---

**Status**: Phase 1 infrastructure generation complete. Ready for Phase 2 implementation.
