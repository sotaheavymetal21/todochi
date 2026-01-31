"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Auth error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900">
          エラーが発生しました
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          認証中にエラーが発生しました。
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button onClick={reset}>再試行</Button>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            ログインへ
          </Link>
        </div>
      </div>
    </div>
  );
}
