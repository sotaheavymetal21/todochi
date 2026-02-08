import Link from "next/link";
import { FolderIcon } from "@/components/icons";
import ProjectCardActions from "@/components/projects/ProjectCardActions";
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
    <div className="rounded-xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        <FolderIcon className="h-8 w-8 flex-shrink-0 text-indigo-500" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/projects/${project.id}`} className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold hover:text-indigo-600">
                {project.name}
              </h2>
            </Link>
            <ProjectCardActions project={project} />
          </div>
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
    </div>
  );
}
