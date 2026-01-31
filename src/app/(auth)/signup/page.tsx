import { Suspense } from "react";
import SignupForm from "@/components/auth/SignupForm";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-indigo-600">
          Todochi
        </h1>
        <h2 className="mb-6 text-center text-xl text-gray-700">
          アカウント作成
        </h2>
        <Suspense fallback={<div className="text-center">読み込み中...</div>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
