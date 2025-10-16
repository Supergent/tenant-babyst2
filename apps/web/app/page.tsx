import dynamic from "next/dynamic";

// Dynamic imports for client-side only components
const TaskList = dynamic(
  () => import("@/components/task-list").then((mod) => mod.TaskList),
  { ssr: false }
);
const AuthForm = dynamic(
  () => import("@/components/auth-form").then((mod) => mod.AuthForm),
  { ssr: false }
);

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-textPrimary mb-2">
            Ultraminimal Todo
          </h1>
          <p className="text-textSecondary">
            Simple, focused task management
          </p>
        </header>

        {/* Auth Check & Main Content */}
        <div className="space-y-6">
          {/* Auth form will only show if not authenticated */}
          <div className="flex justify-center">
            <AuthForm />
          </div>

          {/* Task list - will handle its own auth checks */}
          <TaskList />
        </div>
      </div>
    </main>
  );
}
