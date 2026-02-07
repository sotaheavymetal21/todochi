import { FolderIcon } from "@/components/icons";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 py-16">
      <FolderIcon className="h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        プロジェクトがまだありません
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        最初のプロジェクトを作成して、タスク管理を始めましょう
      </p>
    </div>
  );
}
