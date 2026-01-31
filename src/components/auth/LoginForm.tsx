"use client";

import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { login, type LoginState } from "@/app/(auth)/login/actions";
import { FormInput, SubmitButton, Alert } from "@/components/ui";

const initialState: LoginState = {};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "";
  const [state, formAction] = useFormState(login, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

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
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password?.[0]}
      />

      {state.error && <Alert variant="error">{state.error}</Alert>}

      <SubmitButton className="w-full" pendingText="ログイン中...">
        ログイン
      </SubmitButton>

      <p className="text-center text-sm text-gray-600">
        アカウントをお持ちでない方は{" "}
        <Link
          href={`/signup${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
          className="text-indigo-600 hover:underline"
        >
          新規登録
        </Link>
      </p>
    </form>
  );
}
