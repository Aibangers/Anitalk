export default function AnimeLoading() {
  return (
    <div className="pb-20 md:pb-0 animate-pulse">
      {/* Banner skeleton */}
      <div className="h-48 sm:h-64 lg:h-80 bg-surface-hover" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cover skeleton */}
          <div className="lg:w-72 shrink-0">
            <div className="w-48 lg:w-full mx-auto lg:mx-0 aspect-[3/4] rounded-xl bg-surface-hover" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 min-w-0 pt-4 space-y-4">
            <div className="h-8 w-3/4 rounded-lg bg-surface-hover" />
            <div className="h-4 w-1/2 rounded bg-surface-hover" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-6 w-20 rounded-full bg-surface-hover" />
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-surface-hover" />
              <div className="h-4 w-5/6 rounded bg-surface-hover" />
              <div className="h-4 w-4/6 rounded bg-surface-hover" />
            </div>
            <div className="pt-8 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-surface-hover" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
