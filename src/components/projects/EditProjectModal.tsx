"use client";

import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { XMarkIcon } from "@/components/icons";
import { FormInput, SubmitButton, Alert } from "@/components/ui";
import {
  updateProject,
  type UpdateProjectState,
} from "@/app/(dashboard)/projects/actions";
import type { Project } from "@/types";

const initialState: UpdateProjectState = {};

interface EditProjectModalProps {
  project: Project;
  onClose: () => void;
}

export default function EditProjectModal({
  project,
  onClose,
}: EditProjectModalProps) {
  const [state, formAction] = useFormState(updateProject, initialState);
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
          <h2 className="text-lg font-semibold">プロジェクトを編集</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="projectId" value={project.id} />

          <FormInput
            label="プロジェクト名"
            name="name"
            required
            defaultValue={project.name}
            placeholder="例: マイプロジェクト"
            error={state.fieldErrors?.name?.[0]}
          />

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              説明（任意）
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={project.description ?? ""}
              placeholder="プロジェクトの説明を入力..."
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {state.fieldErrors?.description?.[0] && (
              <p className="mt-1 text-sm text-red-600">
                {state.fieldErrors.description[0]}
              </p>
            )}
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
