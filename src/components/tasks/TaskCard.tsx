"use client";

import { useState } from "react";
import { PencilIcon, TrashIcon } from "@/components/icons";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";
import type { Task, TaskStatus, TaskPriority } from "@/types";

const statusLabels: Record<TaskStatus, string> = {
  todo: "未着手",
  in_progress: "進行中",
  done: "完了",
};

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const priorityColors: Record<TaskPriority, string> = {
  low: "border-green-500 text-green-600",
  medium: "border-yellow-500 text-yellow-600",
  high: "border-red-500 text-red-600",
};

interface TaskCardProps {
  task: Task;
  projectId: string;
}

export default function TaskCard({ task, projectId }: TaskCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-gray-900">{task.title}</p>
          {task.description && (
            <p className="mt-1 truncate text-sm text-gray-500">
              {task.description}
            </p>
          )}
        </div>

        <span
          className={`whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ${statusColors[task.status]}`}
        >
          {statusLabels[task.status]}
        </span>

        <span
          className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium ${priorityColors[task.priority]}`}
        >
          {priorityLabels[task.priority]}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowEdit(true)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            title="編集"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-600"
            title="削除"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showEdit && (
        <EditTaskModal
          task={task}
          projectId={projectId}
          onClose={() => setShowEdit(false)}
        />
      )}

      {showDelete && (
        <DeleteTaskDialog
          task={task}
          projectId={projectId}
          onClose={() => setShowDelete(false)}
        />
      )}
    </>
  );
}
