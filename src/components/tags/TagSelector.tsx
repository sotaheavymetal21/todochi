"use client";

import { useState, useRef, useEffect, useTransition, useCallback } from "react";
import { PlusIcon, TagIcon } from "@/components/icons";
import TagBadge from "@/components/tags/TagBadge";
import TagColorPicker, {
  DEFAULT_TAG_COLOR,
} from "@/components/tags/TagColorPicker";
import { createTag } from "@/app/(dashboard)/projects/[projectId]/actions";
import type { Tag } from "@/types";

interface TagSelectorProps {
  projectId: string;
  availableTags: Tag[];
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  onTagCreated: (tag: Tag) => void;
}

export default function TagSelector({
  projectId,
  availableTags,
  selectedTagIds,
  onTagsChange,
  onTagCreated,
}: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newTagColor, setNewTagColor] = useState(DEFAULT_TAG_COLOR);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsCreating(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // 検索フィルタリング
  const filteredTags = availableTags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase()),
  );

  const showCreateOption =
    search.trim() !== "" &&
    !availableTags.some(
      (tag) => tag.name.toLowerCase() === search.trim().toLowerCase(),
    );

  // キーボードナビ用の選択可能アイテム数（タグ + 作成オプション）
  const totalItems =
    filteredTags.length + (showCreateOption && !isCreating ? 1 : 0);

  // 検索テキスト変更時にハイライトをリセット
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [search]);

  function handleToggleTag(tagId: string) {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  }

  function handleRemoveTag(tagId: string) {
    onTagsChange(selectedTagIds.filter((id) => id !== tagId));
  }

  function handleStartCreate() {
    setIsCreating(true);
    setNewTagColor(DEFAULT_TAG_COLOR);
    setError(null);
    setHighlightedIndex(-1);
  }

  const handleCreateTag = useCallback(() => {
    const tagName = search.trim();
    if (!tagName) return;

    const formData = new FormData();
    formData.set("name", tagName);
    formData.set("color", newTagColor);
    formData.set("projectId", projectId);

    startTransition(async () => {
      const result = await createTag({}, formData);
      if (result.success && result.tag) {
        onTagCreated(result.tag);
        onTagsChange([...selectedTagIds, result.tag.id]);
        setSearch("");
        setIsCreating(false);
        setError(null);
        setHighlightedIndex(-1);
      } else if (result.error) {
        setError(result.error);
      } else if (result.fieldErrors?.name) {
        setError(result.fieldErrors.name[0]);
      }
    });
  }, [
    search,
    newTagColor,
    projectId,
    selectedTagIds,
    onTagCreated,
    onTagsChange,
    startTransition,
  ]);

  // キーボードナビゲーション
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;

    // 作成フォーム表示中はナビ無効（フォーム内操作を優先）
    if (isCreating) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredTags.length) {
          handleToggleTag(filteredTags[highlightedIndex].id);
        } else if (
          highlightedIndex === filteredTags.length &&
          showCreateOption
        ) {
          handleStartCreate();
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
        break;
    }
  }

  // ハイライト項目を自動スクロール
  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-tag-item]");
    const item = items[highlightedIndex];
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  const selectedTags = availableTags.filter((tag) =>
    selectedTagIds.includes(tag.id),
  );

  return (
    <div ref={dropdownRef} className="relative">
      <label className="block text-sm font-medium text-gray-700">タグ</label>

      {/* 選択済みタグ + 開閉ボタン */}
      <div
        className="mt-1 flex min-h-[38px] cursor-pointer flex-wrap items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 shadow-sm transition-colors hover:border-gray-400"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
      >
        {selectedTags.length > 0 ? (
          selectedTags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              size="sm"
              onRemove={() => handleRemoveTag(tag.id)}
            />
          ))
        ) : (
          <span className="flex items-center gap-1 text-sm text-gray-400">
            <TagIcon className="h-4 w-4" />
            タグを選択...
          </span>
        )}
      </div>

      {/* ドロップダウン */}
      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg"
          role="listbox"
          aria-label="タグを選択"
        >
          {/* 検索入力 */}
          <div className="border-b border-gray-100 p-2">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsCreating(false);
                setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="タグを検索または作成..."
              className="w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              role="combobox"
              aria-controls="tag-listbox"
              aria-expanded={isOpen}
              aria-activedescendant={
                highlightedIndex >= 0 && highlightedIndex < filteredTags.length
                  ? `tag-option-${filteredTags[highlightedIndex].id}`
                  : undefined
              }
            />
          </div>

          {/* タグリスト */}
          <div
            ref={listRef}
            id="tag-listbox"
            className="max-h-48 overflow-y-auto p-1"
          >
            {filteredTags.map((tag, index) => {
              const isSelected = selectedTagIds.includes(tag.id);
              const isHighlighted = index === highlightedIndex;
              return (
                <button
                  key={tag.id}
                  id={`tag-option-${tag.id}`}
                  data-tag-item
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleToggleTag(tag.id)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                    isHighlighted
                      ? "bg-indigo-50 text-indigo-700"
                      : isSelected
                        ? "bg-indigo-50/50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 truncate">{tag.name}</span>
                  {isSelected && (
                    <span className="text-xs text-indigo-500">✓</span>
                  )}
                </button>
              );
            })}

            {filteredTags.length === 0 && !showCreateOption && (
              <p className="px-2.5 py-2 text-center text-sm text-gray-400">
                タグが見つかりません
              </p>
            )}

            {/* 新規作成オプション */}
            {showCreateOption && !isCreating && (
              <button
                data-tag-item
                type="button"
                onClick={handleStartCreate}
                onMouseEnter={() => setHighlightedIndex(filteredTags.length)}
                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm transition-colors ${
                  highlightedIndex === filteredTags.length
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                <PlusIcon className="h-4 w-4" />
                <span>&ldquo;{search.trim()}&rdquo; を作成</span>
              </button>
            )}
          </div>

          {/* インライン作成フォーム */}
          {isCreating && (
            <div className="border-t border-gray-100 p-3">
              <p className="mb-2 text-xs font-medium text-gray-500">
                &ldquo;{search.trim()}&rdquo; のカラーを選択
              </p>
              <TagColorPicker
                selectedColor={newTagColor}
                onColorSelect={setNewTagColor}
              />
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setError(null);
                  }}
                  className="rounded-md px-2.5 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleCreateTag}
                  disabled={isPending}
                  className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isPending ? "作成中..." : "追加"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
