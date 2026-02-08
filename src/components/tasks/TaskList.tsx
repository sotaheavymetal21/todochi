import TaskCard from "@/components/tasks/TaskCard";
import type { Task } from "@/types";

interface TaskListProps {
  tasks: Task[];
  projectId: string;
}

export default function TaskList({ tasks, projectId }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
        <p className="text-gray-500">まだタスクがありません</p>
        <p className="mt-1 text-sm text-gray-400">
          「新規タスク」ボタンからタスクを作成してください
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} projectId={projectId} />
      ))}
    </div>
  );
}
