import Link from "next/link";
import { ListIcon, KanbanIcon } from "@/components/icons";

interface Props {
  params: { projectId: string };
}

const columns = [
  { id: "todo", title: "未着手", tasks: ["タスク1"] },
  { id: "in_progress", title: "進行中", tasks: ["タスク2"] },
  { id: "done", title: "完了", tasks: ["タスク3"] },
];

export default function KanbanBoardPage({ params }: Props) {
  const { projectId } = params;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">プロジェクト詳細（ボード表示）</h1>
        <div className="flex gap-2">
          <Link
            href={`/projects/${projectId}`}
            className="flex items-center gap-2 rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            <ListIcon className="h-4 w-4" />
            リスト
          </Link>
          <button
            disabled
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            <KanbanIcon className="h-4 w-4" />
            ボード
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="min-w-[280px] flex-shrink-0">
            <h2 className="mb-3 text-sm font-semibold text-gray-700">
              {column.title} ({column.tasks.length})
            </h2>
            <div className="space-y-2 rounded-lg bg-gray-100 p-3">
              {column.tasks.map((task, index) => (
                <div
                  key={index}
                  className="cursor-pointer rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="text-sm">{task}</p>
                </div>
              ))}
              <p className="py-2 text-center text-sm text-gray-400">
                Phase 8でドラッグ&ドロップ実装予定
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
