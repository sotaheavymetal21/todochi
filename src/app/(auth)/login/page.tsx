import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-indigo-600">
          Todochi
        </h1>
        <h2 className="mb-6 text-center text-xl text-gray-700">ログイン</h2>
        <Suspense fallback={<div className="text-center">読み込み中...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
