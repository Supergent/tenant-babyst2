/**
 * Task List Component
 *
 * Main task management interface showing active and completed tasks.
 */

"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSession } from "@/lib/auth-client";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Badge,
  Skeleton,
  useToast,
} from "@jn78bp632rvzbm5y1dw8ewfbzd7sj714/components";
import { CheckCircle2, Circle, Trash2, RotateCcw } from "lucide-react";

export function TaskList() {
  const { data: session, isPending } = useSession();
  const { toast } = useToast();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const activeTasks = useQuery(api.endpoints.tasks.listActive);
  const completedTasks = useQuery(api.endpoints.tasks.listCompleted);

  const createTask = useMutation(api.endpoints.tasks.create);
  const completeTask = useMutation(api.endpoints.tasks.complete);
  const reactivateTask = useMutation(api.endpoints.tasks.reactivate);
  const deleteTask = useMutation(api.endpoints.tasks.remove);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      await createTask({
        title: newTaskTitle.trim(),
      });

      setNewTaskTitle("");
      toast({
        title: "Success",
        description: "Task created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCompleteTask = async (taskId: Id<"tasks">) => {
    try {
      await completeTask({ id: taskId });
      toast({
        title: "Success",
        description: "Task completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete task",
        variant: "destructive",
      });
    }
  };

  const handleReactivateTask = async (taskId: Id<"tasks">) => {
    try {
      await reactivateTask({ id: taskId });
      toast({
        title: "Success",
        description: "Task reactivated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reactivate task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: Id<"tasks">) => {
    try {
      await deleteTask({ id: taskId });
      toast({
        title: "Success",
        description: "Task deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const loading = activeTasks === undefined || completedTasks === undefined;

  // Don't show task list if not authenticated
  if (isPending) {
    return null; // Loading state handled by auth form
  }

  if (!session) {
    return null; // Not authenticated, auth form will be shown instead
  }

  return (
    <div className="space-y-6">
      {/* Create Task Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateTask} className="flex gap-2">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={isCreating}
              className="flex-1"
            />
            <Button type="submit" disabled={isCreating || !newTaskTitle.trim()}>
              {isCreating ? "Adding..." : "Add Task"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Tasks</CardTitle>
          {!loading && (
            <Badge variant="subtle">
              {activeTasks?.length ?? 0} {activeTasks?.length === 1 ? "task" : "tasks"}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : activeTasks?.length === 0 ? (
            <p className="text-center text-sm text-textSecondary py-8">
              No active tasks. Add one above to get started!
            </p>
          ) : (
            <div className="space-y-2">
              {activeTasks?.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-muted bg-surface hover:bg-muted transition-colors"
                >
                  <button
                    onClick={() => handleCompleteTask(task._id)}
                    className="flex-shrink-0 text-textSecondary hover:text-success transition-colors"
                    aria-label="Complete task"
                  >
                    <Circle className="h-5 w-5" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-textPrimary truncate">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-textSecondary truncate">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="flex-shrink-0 text-textSecondary hover:text-danger transition-colors"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      {!loading && completedTasks && completedTasks.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Completed Tasks</CardTitle>
            <Badge variant="subtle">
              {completedTasks.length} {completedTasks.length === 1 ? "task" : "tasks"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-muted bg-surface hover:bg-muted transition-colors opacity-60"
                >
                  <button
                    onClick={() => handleReactivateTask(task._id)}
                    className="flex-shrink-0 text-success hover:text-textSecondary transition-colors"
                    aria-label="Reactivate task"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-textPrimary truncate line-through">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-xs text-textSecondary truncate">
                        {task.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleReactivateTask(task._id)}
                    className="flex-shrink-0 text-textSecondary hover:text-primary transition-colors"
                    aria-label="Restore task"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="flex-shrink-0 text-textSecondary hover:text-danger transition-colors"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
