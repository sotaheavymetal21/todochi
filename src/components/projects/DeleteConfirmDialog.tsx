"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { SubmitButton, Alert } from "@/components/ui";
import {
  deleteProject,
  type DeleteProjectState,
} from "@/app/(dashboard)/projects/actions";
import type { Project } from "@/types";

const initialState: DeleteProjectState = {};

interface DeleteConfirmDialogProps {
  project: Project;
  onClose: () => void;
  redirectOnSuccess?: boolean;
}

export default function DeleteConfirmDialog({
  project,
  onClose,
  redirectOnSuccess,
}: DeleteConfirmDialogProps) {
  const [state, formAction] = useFormState(deleteProject, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      onClose();
      if (redirectOnSuccess) {
        router.push("/projects");
      }
    }
  }, [state.success, onClose, redirectOnSuccess, router]);

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
        <h2 className="text-lg font-semibold">プロジェクトを削除</h2>
        <p className="mt-2 text-sm text-gray-600">
          「{project.name}」を削除しますか？この操作は取り消せません。
          プロジェクト内のすべてのタスクも削除されます。
        </p>

        {state.error && (
          <div className="mt-3">
            <Alert variant="error">{state.error}</Alert>
          </div>
        )}

        <form action={formAction}>
          <input type="hidden" name="projectId" value={project.id} />
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
