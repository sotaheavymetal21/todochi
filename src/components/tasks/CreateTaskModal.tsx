"use client";

import { useEffect, useRef, useState, useCallback, useTransition } from "react";
import { useFormState } from "react-dom";
import { PlusIcon, XMarkIcon } from "@/components/icons";
import { FormInput, SubmitButton, Alert } from "@/components/ui";
import TagSelector from "@/components/tags/TagSelector";
import {
  createTask,
  updateTaskTags,
  type CreateTaskState,
} from "@/app/(dashboard)/projects/[projectId]/actions";
import type { Tag } from "@/types";

const initialState: CreateTaskState = {};

interface CreateTaskModalProps {
  projectId: string;
  availableTags: Tag[];
}

export default function CreateTaskModal({
  projectId,
  availableTags: initialTags,
}: CreateTaskModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useFormState(createTask, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [localTags, setLocalTags] = useState<Tag[]>(initialTags);
  const [, startTransition] = useTransition();

  // 親から渡されるタグリストが更新されたら同期
  useEffect(() => {
    setLocalTags(initialTags);
  }, [initialTags]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedTagIds([]);
  }, []);

  // 成功時にタグを紐付けてからモーダルを閉じる
  useEffect(() => {
    if (state.success && state.taskId) {
      if (selectedTagIds.length > 0) {
        const formData = new FormData();
        formData.set("taskId", state.taskId);
        formData.set("projectId", projectId);
        formData.set("tagIds", JSON.stringify(selectedTagIds));
        startTransition(async () => {
          await updateTaskTags({}, formData);
        });
      }
      closeModal();
      formRef.current?.reset();
    }
  }, [
    state.success,
    state.taskId,
    selectedTagIds,
    projectId,
    closeModal,
    startTransition,
  ]);

  // Escape キーでモーダルを閉じる
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, closeModal]);

  function handleTagCreated(tag: Tag) {
    setLocalTags((prev) => [...prev, tag]);
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
      >
        <PlusIcon className="h-4 w-4" />
        新規タスク
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* オーバーレイ */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* モーダルカード */}
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            {/* ヘッダー */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">新規タスク</h2>
              <button
                onClick={closeModal}
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* フォーム */}
            <form ref={formRef} action={formAction} className="space-y-4">
              <input type="hidden" name="projectId" value={projectId} />

              <FormInput
                label="タイトル"
                name="title"
                required
                placeholder="例: デザインレビュー"
                error={state.fieldErrors?.title?.[0]}
              />

              <div>
                <label
                  htmlFor="create-task-description"
                  className="block text-sm font-medium text-gray-700"
                >
                  説明（任意）
                </label>
                <textarea
                  id="create-task-description"
                  name="description"
                  rows={3}
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
                    htmlFor="create-task-status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ステータス
                  </label>
                  <select
                    id="create-task-status"
                    name="status"
                    defaultValue="todo"
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
                    htmlFor="create-task-priority"
                    className="block text-sm font-medium text-gray-700"
                  >
                    優先度
                  </label>
                  <select
                    id="create-task-priority"
                    name="priority"
                    defaultValue="medium"
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

              <div>
                <label
                  htmlFor="create-task-due-date"
                  className="block text-sm font-medium text-gray-700"
                >
                  期限日（任意）
                </label>
                <input
                  type="date"
                  id="create-task-due-date"
                  name="due_date"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {state.fieldErrors?.due_date?.[0] && (
                  <p className="mt-1 text-sm text-red-600">
                    {state.fieldErrors.due_date[0]}
                  </p>
                )}
              </div>

              <TagSelector
                projectId={projectId}
                availableTags={localTags}
                selectedTagIds={selectedTagIds}
                onTagsChange={setSelectedTagIds}
                onTagCreated={handleTagCreated}
              />

              {state.error && <Alert variant="error">{state.error}</Alert>}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  キャンセル
                </button>
                <SubmitButton size="sm" pendingText="作成中...">
                  作成
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
