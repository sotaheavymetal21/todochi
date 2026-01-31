import Link from "next/link";
import { FolderIcon, KanbanIcon, CheckCircleIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold text-indigo-600">Todochi</h1>
          <p className="mb-8 text-xl text-gray-600">
            シンプルで使いやすいタスク管理アプリ
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/projects"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
            >
              始める
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-indigo-600 px-6 py-3 font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
            >
              ログイン
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <FolderIcon className="mx-auto mb-4 h-10 w-10 text-indigo-500" />
            <h3 className="mb-2 text-lg font-semibold">プロジェクト管理</h3>
            <p className="text-sm text-gray-600">
              複数のプロジェクトでタスクを整理
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <KanbanIcon className="mx-auto mb-4 h-10 w-10 text-pink-500" />
            <h3 className="mb-2 text-lg font-semibold">Kanbanボード</h3>
            <p className="text-sm text-gray-600">
              ドラッグ&ドロップで直感的に操作
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <CheckCircleIcon className="mx-auto mb-4 h-10 w-10 text-green-500" />
            <h3 className="mb-2 text-lg font-semibold">タスク追跡</h3>
            <p className="text-sm text-gray-600">
              優先度・期限・タグで効率的に管理
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
