"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";
import {
  updateTask,
  type UpdateTaskState,
} from "@/app/(dashboard)/projects/[projectId]/actions";
import type { Task, TaskStatus } from "@/types";

const initialState: UpdateTaskState = {};

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

interface TaskStatusSelectProps {
  task: Task;
  projectId: string;
}

export default function TaskStatusSelect({
  task,
  projectId,
}: TaskStatusSelectProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [, formAction] = useFormState(updateTask, initialState);

  function handleChange() {
    formRef.current?.requestSubmit();
  }

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="taskId" value={task.id} />
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="title" value={task.title} />
      <input type="hidden" name="description" value={task.description ?? ""} />
      <input type="hidden" name="priority" value={task.priority} />
      <select
        name="status"
        defaultValue={task.status}
        onChange={handleChange}
        className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[task.status]} cursor-pointer border-none focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        <option value="todo">未着手</option>
        <option value="in_progress">進行中</option>
        <option value="done">完了</option>
      </select>
    </form>
  );
}
