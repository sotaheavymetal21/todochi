"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { XMarkIcon } from "@/components/icons";
import { FormInput, SubmitButton, Alert } from "@/components/ui";
import {
  updateTask,
  type UpdateTaskState,
} from "@/app/(dashboard)/projects/[projectId]/actions";
import type { Task } from "@/types";

const initialState: UpdateTaskState = {};

interface EditTaskModalProps {
  task: Task;
  projectId: string;
  onClose: () => void;
}

export default function EditTaskModal({
  task,
  projectId,
  onClose,
}: EditTaskModalProps) {
  const [state, formAction] = useFormState(updateTask, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">タスクを編集</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="projectId" value={projectId} />

          <FormInput
            label="タイトル"
            name="title"
            required
            defaultValue={task.title}
            placeholder="例: デザインレビュー"
            error={state.fieldErrors?.title?.[0]}
          />

          <div>
            <label
              htmlFor="edit-task-description"
              className="block text-sm font-medium text-gray-700"
            >
              説明（任意）
            </label>
            <textarea
              id="edit-task-description"
              name="description"
              rows={3}
              defaultValue={task.description ?? ""}
              placeholder="タスクの説明を入力..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {state.fieldErrors?.description?.[0] && (
              <p className="mt-1 text-sm text-red-600">
                {state.fieldErrors.description[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="edit-task-status"
                className="block text-sm font-medium text-gray-700"
              >
                ステータス
              </label>
              <select
                id="edit-task-status"
                name="status"
                defaultValue={task.status}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="todo">未着手</option>
                <option value="in_progress">進行中</option>
                <option value="done">完了</option>
              </select>
              {state.fieldErrors?.status?.[0] && (
                <p className="mt-1 text-sm text-red-600">
                  {state.fieldErrors.status[0]}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-task-priority"
                className="block text-sm font-medium text-gray-700"
              >
                優先度
              </label>
              <select
                id="edit-task-priority"
                name="priority"
                defaultValue={task.priority}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
              {state.fieldErrors?.priority?.[0] && (
                <p className="mt-1 text-sm text-red-600">
                  {state.fieldErrors.priority[0]}
                </p>
              )}
            </div>
          </div>

          {state.error && <Alert variant="error">{state.error}</Alert>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              キャンセル
            </button>
            <SubmitButton size="sm" pendingText="更新中...">
              更新
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
