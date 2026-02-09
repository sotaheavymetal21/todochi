"use client";

import { useState } from "react";
import { PencilIcon, TrashIcon } from "@/components/icons";
import EditTaskModal from "@/components/tasks/EditTaskModal";
import DeleteTaskDialog from "@/components/tasks/DeleteTaskDialog";
import TagBadge from "@/components/tags/TagBadge";
import type { TaskWithTags, TaskStatus, TaskPriority, Tag } from "@/types";

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

type DueDateStatus = "overdue" | "today" | "upcoming";

function getDueDateStatus(dueDate: string | null): DueDateStatus | null {
  if (!dueDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");

  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "today";
  return "upcoming";
}

function formatDueDate(dueDate: string): string {
  const due = new Date(dueDate + "T00:00:00");
  return due.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

const dueDateStyles: Record<DueDateStatus, string> = {
  overdue: "bg-red-50 text-red-600 border border-red-200",
  today: "bg-yellow-50 text-yellow-600 border border-yellow-200",
  upcoming: "bg-gray-50 text-gray-600 border border-gray-200",
};

const dueDateLabels: Record<DueDateStatus, (formatted: string) => string> = {
  overdue: (d) => `期限切れ: ${d}`,
  today: () => "今日まで",
  upcoming: (d) => `${d}まで`,
};

interface TaskCardProps {
  task: TaskWithTags;
  projectId: string;
  availableTags: Tag[];
}

export default function TaskCard({
  task,
  projectId,
  availableTags,
}: TaskCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const dueDateStatus = getDueDateStatus(task.due_date);

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
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {dueDateStatus && task.due_date && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${dueDateStyles[dueDateStatus]}`}
              >
                {dueDateLabels[dueDateStatus](formatDueDate(task.due_date))}
              </span>
            )}
            {task.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag} size="sm" />
            ))}
          </div>
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
          availableTags={availableTags}
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
