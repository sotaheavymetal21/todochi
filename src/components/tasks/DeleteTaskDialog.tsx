"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { SubmitButton, Alert } from "@/components/ui";
import {
  deleteTask,
  type DeleteTaskState,
} from "@/app/(dashboard)/projects/[projectId]/actions";
import type { Task } from "@/types";

const initialState: DeleteTaskState = {};

interface DeleteTaskDialogProps {
  task: Task;
  projectId: string;
  onClose: () => void;
}

export default function DeleteTaskDialog({
  task,
  projectId,
  onClose,
}: DeleteTaskDialogProps) {
  const [state, formAction] = useFormState(deleteTask, initialState);

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

      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">タスクを削除</h2>
        <p className="mt-2 text-sm text-gray-600">
          タスク「{task.title}」を削除しますか？この操作は取り消せません。
        </p>

        {state.error && (
          <div className="mt-3">
            <Alert variant="error">{state.error}</Alert>
          </div>
        )}

        <form action={formAction}>
          <input type="hidden" name="taskId" value={task.id} />
          <input type="hidden" name="projectId" value={projectId} />
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              キャンセル
            </button>
            <SubmitButton size="sm" variant="danger" pendingText="削除中...">
              削除
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
