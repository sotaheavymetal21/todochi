import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListIcon, KanbanIcon } from "@/components/icons";
import ProjectDetailActions from "@/components/projects/ProjectDetailActions";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import TaskList from "@/components/tasks/TaskList";
import type { Project, Task } from "@/types";

export const dynamic = "force-dynamic";

interface Props {
  params: { projectId: string };
}

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

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  const typedTasks = (tasks ?? []) as Task[];

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
          <CreateTaskModal projectId={projectId} />
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

      <TaskList tasks={typedTasks} projectId={projectId} />
    </div>
  );
}
