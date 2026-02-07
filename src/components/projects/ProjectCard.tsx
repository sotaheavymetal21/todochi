import Link from "next/link";
import { FolderIcon } from "@/components/icons";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return date.toLocaleDateString("ja-JP");
  }
  if (diffDays > 0) {
    return `${diffDays}日前`;
  }
  if (diffHours > 0) {
    return `${diffHours}時間前`;
  }
  if (diffMinutes > 0) {
    return `${diffMinutes}分前`;
  }
  return "たった今";
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <FolderIcon className="h-8 w-8 flex-shrink-0 text-indigo-500" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold">{project.name}</h2>
          {project.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">
              {project.description}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            {formatRelativeTime(project.created_at)}
          </p>
        </div>
      </div>
    </Link>
  );
}
