function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 flex-shrink-0 rounded bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-3 w-1/4 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export default function ProjectsLoading() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}
