import { XMarkIcon } from "@/components/icons";
import type { Tag } from "@/types";

interface TagBadgeProps {
  tag: Tag;
  size?: "sm" | "md";
  onRemove?: () => void;
}

export default function TagBadge({
  tag,
  size = "sm",
  onRemove,
}: TagBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClasses[size]}`}
      style={{
        backgroundColor: `${tag.color}1a`,
        color: tag.color,
      }}
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-0.5 transition-colors hover:bg-black/10"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
