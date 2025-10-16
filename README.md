# Ultraminimal To-Do List

An ultraminimal to-do list application focused on simplicity and essential task management. Users can create, complete, and delete tasks with a clean, distraction-free interface.

## Architecture

This project follows the **four-layer Convex architecture pattern**:

1. **Database Layer** (`convex/db/`) - Pure CRUD operations, only place where `ctx.db` is used
2. **Endpoint Layer** (`convex/endpoints/`) - Business logic that composes database operations
3. **Workflow Layer** (`convex/workflows/`) - Durable external service integrations
4. **Helper Layer** (`convex/helpers/`) - Pure utility functions

## Tech Stack

- **Backend**: Convex
- **Frontend**: Next.js 15 App Router
- **Authentication**: Better Auth with Convex adapter
- **UI**: shadcn/ui components + Tailwind CSS
- **Design System**: Based on theme profile with Inter font family

## Detected Components

This project uses the following Convex Components:

- **Better Auth** (`@convex-dev/better-auth`) - Authentication & session management
- **Rate Limiter** (`@convex-dev/rate-limiter`) - API rate limiting to prevent abuse
- **Agent** (`@convex-dev/agent`) - AI agent orchestration for task assistance
- **Text Streaming** (`@convex-dev/persistent-text-streaming`) - Real-time text streaming for AI responses

## Prerequisites

- Node.js 18+ and pnpm
- Convex account (sign up at https://convex.dev)
- OpenAI or Anthropic API key (for AI features)

## Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up Convex**:
   ```bash
   npx convex dev
   ```

   This will:
   - Create a new Convex project (or link to existing)
   - Generate your `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`

3. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```

   Then edit `.env.local` and fill in:
   - `CONVEX_DEPLOYMENT` (from step 2)
   - `NEXT_PUBLIC_CONVEX_URL` (from step 2)
   - `BETTER_AUTH_SECRET` (generate with: `openssl rand -base64 32`)
   - `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` (for AI features)
   - `SITE_URL` and `NEXT_PUBLIC_SITE_URL` (default: http://localhost:3000)

4. **Install Convex Components**:
   ```bash
   npx convex components install @convex-dev/better-auth --save
   npx convex components install @convex-dev/rate-limiter --save
   npx convex components install @convex-dev/agent --save
   npx convex components install @convex-dev/persistent-text-streaming --save
   ```

5. **Start development servers**:
   ```bash
   pnpm dev
   ```

   This runs:
   - Convex backend (with live schema updates)
   - Next.js frontend at http://localhost:3000

## Component-Specific Setup

### Better Auth
- Provides email/password authentication
- Sessions stored in Convex
- JWT tokens with 30-day expiration
- No email verification required (for simplicity)

### Rate Limiter
- Protects API endpoints from abuse
- Token bucket algorithm allows bursts
- User-scoped rate limits

### Agent
- AI-powered task assistance
- Multi-step reasoning
- Conversation history stored in Convex
- Supports OpenAI or Anthropic models

### Text Streaming
- Real-time streaming of AI responses
- Persistent storage of streams
- Automatic cleanup of completed streams

## Project Structure

```
ultraminimal-todo/
├── convex/
│   ├── schema.ts           # Database schema
│   ├── convex.config.ts    # Component configuration
│   ├── auth.ts             # Better Auth setup
│   ├── http.ts             # HTTP routes for auth
│   ├── db/                 # Database layer (Phase 2)
│   ├── endpoints/          # Business logic (Phase 2)
│   ├── workflows/          # External services (Phase 2)
│   └── helpers/            # Utilities (Phase 2)
├── apps/
│   └── web/                # Next.js frontend (Phase 2)
└── package.json
```

## Next Steps

Phase 2 will generate:
- Database layer (`convex/db/tasks.ts`, etc.)
- Endpoint layer (`convex/endpoints/tasks.ts`, etc.)
- Frontend application (`apps/web/`)
- Authentication utilities
- UI components

## Development Tips

- **Schema changes**: Convex auto-migrates on save
- **Type safety**: Convex generates TypeScript types automatically
- **Hot reload**: Both frontend and backend support live updates
- **Debugging**: Use `console.log()` in Convex functions - logs appear in terminal

## Learn More

- [Convex Documentation](https://docs.convex.dev)
- [Better Auth Docs](https://better-auth.com)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
