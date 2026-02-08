"use client";

import { CheckIcon } from "@/components/icons";

export const PRESET_COLORS = [
  { name: "gray", value: "#6b7280" },
  { name: "red", value: "#ef4444" },
  { name: "orange", value: "#f97316" },
  { name: "amber", value: "#f59e0b" },
  { name: "green", value: "#22c55e" },
  { name: "teal", value: "#14b8a6" },
  { name: "blue", value: "#3b82f6" },
  { name: "indigo", value: "#6366f1" },
  { name: "purple", value: "#a855f7" },
  { name: "pink", value: "#ec4899" },
] as const;

export const DEFAULT_TAG_COLOR = "#6366f1";

interface TagColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

export default function TagColorPicker({
  selectedColor,
  onColorSelect,
}: TagColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRESET_COLORS.map((color) => (
        <button
          key={color.name}
          type="button"
          onClick={() => onColorSelect(color.value)}
          className="flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110"
          style={{ backgroundColor: color.value }}
          title={color.name}
        >
          {selectedColor === color.value && (
            <CheckIcon className="h-3.5 w-3.5 text-white" />
          )}
        </button>
      ))}
    </div>
  );
}
