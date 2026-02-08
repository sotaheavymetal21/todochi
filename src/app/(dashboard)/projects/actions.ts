"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "プロジェクト名を入力してください")
    .max(100, "プロジェクト名は100文字以内で入力してください"),
  description: z
    .string()
    .max(500, "説明は500文字以内で入力してください")
    .optional()
    .transform((val) => val || null),
});

export interface CreateProjectState {
  error?: string;
  fieldErrors?: {
    name?: string[];
    description?: string[];
  };
  success?: boolean;
}

export async function createProject(
  _prevState: CreateProjectState,
  formData: FormData,
): Promise<CreateProjectState> {
  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
  };

  const validatedFields = createProjectSchema.safeParse(rawFormData);

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

    const { error } = await supabase.from("projects").insert({
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      owner_id: user.id,
    });

    if (error) {
      return {
        error: "プロジェクトの作成に失敗しました。もう一度お試しください。",
      };
    }

    revalidatePath("/projects");

    return {
      success: true,
    };
  } catch {
    return {
      error: "予期しないエラーが発生しました。もう一度お試しください。",
    };
  }
}

const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "プロジェクト名を入力してください")
    .max(100, "プロジェクト名は100文字以内で入力してください"),
  description: z
    .string()
    .max(500, "説明は500文字以内で入力してください")
    .optional()
    .transform((val) => val || null),
});

export interface UpdateProjectState {
  error?: string;
  fieldErrors?: {
    name?: string[];
    description?: string[];
  };
  success?: boolean;
}

export async function updateProject(
  _prevState: UpdateProjectState,
  formData: FormData,
): Promise<UpdateProjectState> {
  const projectId = formData.get("projectId") as string;
  const rawFormData = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
  };

  const validatedFields = updateProjectSchema.safeParse(rawFormData);

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
      .from("projects")
      .update({
        name: validatedFields.data.name,
        description: validatedFields.data.description,
      })
      .eq("id", projectId)
      .eq("owner_id", user.id);

    if (error) {
      return {
        error: "プロジェクトの更新に失敗しました。もう一度お試しください。",
      };
    }

    revalidatePath("/projects");
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

export interface DeleteProjectState {
  error?: string;
  success?: boolean;
}

export async function deleteProject(
  _prevState: DeleteProjectState,
  formData: FormData,
): Promise<DeleteProjectState> {
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

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId)
      .eq("owner_id", user.id);

    if (error) {
      return {
        error: "プロジェクトの削除に失敗しました。もう一度お試しください。",
      };
    }

    revalidatePath("/projects");

    return {
      success: true,
    };
  } catch {
    return {
      error: "予期しないエラーが発生しました。もう一度お試しください。",
    };
  }
}
