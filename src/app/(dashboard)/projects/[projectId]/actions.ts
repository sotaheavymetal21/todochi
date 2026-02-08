"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Tag } from "@/types";

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

const createTagSchema = z.object({
  name: z
    .string()
    .min(1, "タグ名を入力してください")
    .max(30, "タグ名は30文字以内で入力してください"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "無効なカラーコードです"),
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
  taskId?: string;
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

export interface CreateTagState {
  error?: string;
  fieldErrors?: {
    name?: string[];
    color?: string[];
  };
  success?: boolean;
  tag?: Tag;
}

export interface DeleteTagState {
  error?: string;
  success?: boolean;
}

export interface UpdateTaskTagsState {
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

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        title: validatedFields.data.title,
        description: validatedFields.data.description,
        status: validatedFields.data.status,
        priority: validatedFields.data.priority,
        project_id: projectId,
        created_by: user.id,
      })
      .select("id")
      .single();

    if (error) {
      return {
        error: "タスクの作成に失敗しました。もう一度お試しください。",
      };
    }

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      taskId: data.id,
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

// --- Tag Server Actions ---

export async function createTag(
  _prevState: CreateTagState,
  formData: FormData,
): Promise<CreateTagState> {
  const projectId = formData.get("projectId") as string;
  const rawFormData = {
    name: formData.get("name") as string,
    color: formData.get("color") as string,
  };

  const validatedFields = createTagSchema.safeParse(rawFormData);

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

    const { data, error } = await supabase
      .from("tags")
      .insert({
        name: validatedFields.data.name,
        color: validatedFields.data.color,
        project_id: projectId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return {
          error: "同名のタグが既に存在します。",
        };
      }
      return {
        error: "タグの作成に失敗しました。もう一度お試しください。",
      };
    }

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      tag: data as Tag,
    };
  } catch {
    return {
      error: "予期しないエラーが発生しました。もう一度お試しください。",
    };
  }
}

export async function deleteTag(
  _prevState: DeleteTagState,
  formData: FormData,
): Promise<DeleteTagState> {
  const tagId = formData.get("tagId") as string;
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

    const { error } = await supabase.from("tags").delete().eq("id", tagId);

    if (error) {
      return {
        error: "タグの削除に失敗しました。もう一度お試しください。",
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

export async function updateTaskTags(
  _prevState: UpdateTaskTagsState,
  formData: FormData,
): Promise<UpdateTaskTagsState> {
  const taskId = formData.get("taskId") as string;
  const projectId = formData.get("projectId") as string;
  const tagIdsJson = formData.get("tagIds") as string;

  let tagIds: string[];
  try {
    tagIds = JSON.parse(tagIdsJson);
  } catch {
    return {
      error: "タグ情報が不正です。",
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

    // 既存の紐付けを削除
    const { error: deleteError } = await supabase
      .from("task_tags")
      .delete()
      .eq("task_id", taskId);

    if (deleteError) {
      return {
        error: "タグの更新に失敗しました。もう一度お試しください。",
      };
    }

    // 新しい紐付けを挿入
    if (tagIds.length > 0) {
      const { error: insertError } = await supabase.from("task_tags").insert(
        tagIds.map((tagId) => ({
          task_id: taskId,
          tag_id: tagId,
        })),
      );

      if (insertError) {
        return {
          error: "タグの更新に失敗しました。もう一度お試しください。",
        };
      }
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
