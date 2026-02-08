"use client";

import { useRef } from "react";
import { useFormState } from "react-dom";
import {
  updateTask,
  type UpdateTaskState,
} from "@/app/(dashboard)/projects/[projectId]/actions";
import type { Task, TaskPriority } from "@/types";

const initialState: UpdateTaskState = {};

const priorityColors: Record<TaskPriority, string> = {
  low: "border-green-500 text-green-600",
  medium: "border-yellow-500 text-yellow-600",
  high: "border-red-500 text-red-600",
};

interface TaskPrioritySelectProps {
  task: Task;
  projectId: string;
}

export default function TaskPrioritySelect({
  task,
  projectId,
}: TaskPrioritySelectProps) {
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
      <input type="hidden" name="status" value={task.status} />
      <select
        name="priority"
        defaultValue={task.priority}
        onChange={handleChange}
        className={`rounded-full border px-3 py-1 text-sm font-medium ${priorityColors[task.priority]} cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      >
        <option value="low">低</option>
        <option value="medium">中</option>
        <option value="high">高</option>
      </select>
    </form>
  );
}
