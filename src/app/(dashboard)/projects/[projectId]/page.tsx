import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListIcon, KanbanIcon } from "@/components/icons";
import ProjectDetailActions from "@/components/projects/ProjectDetailActions";
import type { Project } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  params: { projectId: string };
}

const mockTasks = [
  { id: "1", title: "タスク1", status: "todo", priority: "high" },
  { id: "2", title: "タスク2", status: "in_progress", priority: "medium" },
  { id: "3", title: "タスク3", status: "done", priority: "low" },
];

const statusLabels: Record<string, string> = {
  todo: "未着手",
  in_progress: "進行中",
  done: "完了",
};

const priorityColors: Record<string, string> = {
  high: "border-red-500 text-red-600",
  medium: "border-yellow-500 text-yellow-600",
  low: "border-green-500 text-green-600",
};

export default async function ProjectDetailPage({ params }: Props) {
  const { projectId } = params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("owner_id", user.id)
    .single();

  if (error || !project) {
    notFound();
  }

  const typedProject = project as Project;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{typedProject.name}</h1>
          {typedProject.description && (
            <p className="mt-1 text-gray-600">{typedProject.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ProjectDetailActions project={typedProject} />
          <button
            disabled
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            <ListIcon className="h-4 w-4" />
            リスト
          </button>
          <Link
            href={`/projects/${projectId}/board`}
            className="flex items-center gap-2 rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
          >
            <KanbanIcon className="h-4 w-4" />
            ボード
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm"
          >
            <span className="flex-1">{task.title}</span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {statusLabels[task.status]}
            </span>
            <span
              className={`rounded-full border px-3 py-1 text-sm ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
