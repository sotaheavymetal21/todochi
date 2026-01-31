import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-6xl font-bold text-indigo-600">404</h1>
      <p className="mb-6 text-xl text-gray-600">ページが見つかりませんでした</p>
      <Link
        href="/"
        className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
