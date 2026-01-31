"use client";

import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signup, type SignupState } from "@/app/(auth)/signup/actions";
import { FormInput, SubmitButton, Alert } from "@/components/ui";

const initialState: SignupState = {};

export default function SignupForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";
  const [state, formAction] = useFormState(signup, initialState);

  if (state.success) {
    return (
      <div className="text-center">
        <Alert variant="success" className="mb-4 p-4">
          <h2 className="font-medium">確認メールを送信しました</h2>
          <p className="mt-1 text-sm">
            メールに記載されたリンクをクリックして、アカウントを有効化してください。
          </p>
        </Alert>
        <Link href="/login" className="text-indigo-600 hover:underline">
          ログインページへ
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <FormInput
        label="名前"
        name="name"
        type="text"
        autoComplete="name"
        required
        placeholder="山田 太郎"
        error={state.fieldErrors?.name?.[0]}
      />

      <FormInput
        label="メールアドレス"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="mail@example.com"
        error={state.fieldErrors?.email?.[0]}
      />

      <FormInput
        label="パスワード"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        hint="8文字以上、英字と数字を含めてください"
        error={state.fieldErrors?.password?.[0]}
      />

      {state.error && <Alert variant="error">{state.error}</Alert>}

      <SubmitButton className="w-full" pendingText="登録中...">
        アカウントを作成
      </SubmitButton>

      <p className="text-center text-sm text-gray-600">
        すでにアカウントをお持ちの方は{" "}
        <Link
          href={`/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
          className="text-indigo-600 hover:underline"
        >
          ログイン
        </Link>
      </p>
    </form>
  );
}
