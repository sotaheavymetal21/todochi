"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const signupSchema = z.object({
  name: z.string().min(1, "名前を入力してください"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(/[a-zA-Z]/, "パスワードには英字を含めてください")
    .regex(/[0-9]/, "パスワードには数字を含めてください"),
});

export interface SignupState {
  error?: string;
  success?: boolean;
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
}

export async function signup(
  _prevState: SignupState,
  formData: FormData,
): Promise<SignupState> {
  const rawFormData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = signupSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      data: {
        name: validatedFields.data.name,
      },
      emailRedirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return {
        error: "このメールアドレスは既に登録されています",
      };
    }
    return {
      error: "登録に失敗しました。もう一度お試しください。",
    };
  }

  // If email confirmation is disabled, redirect to projects
  // Otherwise, show success message
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email_confirmed_at) {
    redirect("/projects");
  }

  return {
    success: true,
  };
}
