import { Metadata } from 'next';
import Link from 'next/link';
import { searchAnime } from '@/lib/anilist';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : 'Search',
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q || '';
  const results = query.length >= 2 ? await searchAnime(query, 1, 20) : [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <h1 className="text-2xl font-bold mb-2">
        {query ? (
          <>Search results for &ldquo;<span className="gradient-text">{query}</span>&rdquo;</>
        ) : (
          'Search'
        )}
      </h1>
      {query && (
        <p className="text-sm text-muted mb-6">
          {results.length} result{results.length !== 1 ? 's' : ''} found
        </p>
      )}

      {!query && (
        <p className="text-sm text-muted">Enter a search query to find anime.</p>
      )}

      {query && results.length === 0 && (
        <div className="rounded-xl bg-surface border border-border p-8 text-center">
          <p className="text-muted">No anime found matching &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((anime) => {
            const title = anime.title.english || anime.title.romaji;
            return (
              <Link
                key={anime.id}
                href={`/anime/${anime.id}`}
                className="group rounded-xl bg-surface border border-border overflow-hidden hover:border-accent-purple/50 transition-all hover:shadow-lg"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={anime.coverImage.large}
                    alt={title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {anime.averageScore && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-xs font-bold text-white">
                      ⭐ {anime.averageScore}%
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-accent-purple transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    {anime.format?.replace(/_/g, ' ')} · {anime.status?.replace(/_/g, ' ')}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
