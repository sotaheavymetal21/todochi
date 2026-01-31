"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-semibold text-gray-900">
        エラーが発生しました
      </h2>
      <p className="text-sm text-gray-600">
        予期しないエラーが発生しました。もう一度お試しください。
      </p>
      <Button onClick={reset}>再試行</Button>
    </div>
  );
}
