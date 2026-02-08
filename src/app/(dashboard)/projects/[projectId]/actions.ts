"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// --- Zod Schemas ---

const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(200, "タイトルは200文字以内で入力してください"),
  description: z
    .string()
    .max(1000, "説明は1000文字以内で入力してください")
    .optional()
    .transform((val) => val || null),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(200, "タイトルは200文字以内で入力してください"),
  description: z
    .string()
    .max(1000, "説明は1000文字以内で入力してください")
    .optional()
    .transform((val) => val || null),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
});

// --- State Types ---

export interface CreateTaskState {
  error?: string;
  fieldErrors?: {
    title?: string[];
    description?: string[];
    status?: string[];
    priority?: string[];
  };
  success?: boolean;
}

export interface UpdateTaskState {
  error?: string;
  fieldErrors?: {
    title?: string[];
    description?: string[];
    status?: string[];
    priority?: string[];
  };
  success?: boolean;
}

export interface DeleteTaskState {
  error?: string;
  success?: boolean;
}

// --- Server Actions ---

export async function createTask(
  _prevState: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  const projectId = formData.get("projectId") as string;
  const rawFormData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
  };

  const validatedFields = createTaskSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: "認証が必要です。ログインしてください。",
      };
    }

    const { error } = await supabase.from("tasks").insert({
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      status: validatedFields.data.status,
      priority: validatedFields.data.priority,
      project_id: projectId,
      created_by: user.id,
    });

    if (error) {
      return {
        error: "タスクの作成に失敗しました。もう一度お試しください。",
      };
    }

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
    };
  } catch {
    return {
      error: "予期しないエラーが発生しました。もう一度お試しください。",
    };
  }
}

export async function updateTask(
  _prevState: UpdateTaskState,
  formData: FormData,
): Promise<UpdateTaskState> {
  const taskId = formData.get("taskId") as string;
  const projectId = formData.get("projectId") as string;
  const rawFormData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
  };

  const validatedFields = updateTaskSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: "認証が必要です。ログインしてください。",
      };
    }

    const { error } = await supabase
      .from("tasks")
      .update({
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        status: validatedFields.data.status,
        priority: validatedFields.data.priority,
      })
      .eq("id", taskId);

    if (error) {
      return {
        error: "タスクの更新に失敗しました。もう一度お試しください。",
      };
    }

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
    };
  } catch {
    return {
      error: "予期しないエラーが発生しました。もう一度お試しください。",
    };
  }
}

export async function deleteTask(
  _prevState: DeleteTaskState,
  formData: FormData,
): Promise<DeleteTaskState> {
  const taskId = formData.get("taskId") as string;
  const projectId = formData.get("projectId") as string;

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: "認証が必要です。ログインしてください。",
      };
    }

    const { error } = await supabase.from("tasks").delete().eq("id", taskId);

    if (error) {
      return {
        error: "タスクの削除に失敗しました。もう一度お試しください。",
      };
    }

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
    };
  } catch {
    return {
      error: "予期しないエラーが発生しました。もう一度お試しください。",
    };
  }
}
