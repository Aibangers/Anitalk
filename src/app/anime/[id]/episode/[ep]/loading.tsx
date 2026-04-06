export default function EpisodeLoading() {
  return (
    <div className="pb-20 md:pb-0 animate-pulse">
      {/* Banner skeleton */}
      <div className="h-32 sm:h-44 bg-surface-hover" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-12 rounded bg-surface-hover" />
          <div className="h-3 w-32 rounded bg-surface-hover" />
          <div className="h-3 w-20 rounded bg-surface-hover" />
        </div>

        {/* Header skeleton */}
        <div className="flex items-start gap-4">
          <div className="h-24 w-16 rounded-lg bg-surface-hover hidden sm:block" />
          <div className="space-y-2 flex-1">
            <div className="h-7 w-16 rounded-lg bg-surface-hover" />
            <div className="h-7 w-3/4 rounded-lg bg-surface-hover" />
            <div className="h-4 w-1/3 rounded bg-surface-hover" />
          </div>
        </div>

        {/* CTA skeleton */}
        <div className="h-16 rounded-xl bg-surface-hover" />

        {/* Reactions skeleton */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-28 rounded-full bg-surface-hover" />
          ))}
        </div>

        {/* Comments skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-surface-hover" />
          ))}
        </div>
      </div>
    </div>
  );
}
