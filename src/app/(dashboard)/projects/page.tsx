import Link from "next/link";
import { FolderIcon } from "@/components/icons";

const mockProjects = [
  { id: "1", name: "サンプルプロジェクト", description: "これはサンプルです" },
  { id: "2", name: "開発タスク", description: "開発関連のタスク管理" },
];

export default function ProjectsPage() {
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">プロジェクト</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <FolderIcon className="h-8 w-8 text-indigo-500" />
              <div>
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
