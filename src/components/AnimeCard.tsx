import Link from 'next/link';
import { AnimeMedia } from '@/lib/types';

interface AnimeCardProps {
  anime: AnimeMedia;
  showScore?: boolean;
}

export default function AnimeCard({ anime, showScore = true }: AnimeCardProps) {
  const title = anime.title.english || anime.title.romaji;

  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-surface border border-border hover:border-accent-purple/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent-purple/5 hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={anime.coverImage.extraLarge || anime.coverImage.large}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Score Badge */}
        {showScore && anime.averageScore && (
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {anime.averageScore}%
          </div>
        )}

        {/* Status Badge */}
        {anime.status === 'RELEASING' && (
          <div className="absolute top-2 left-2 rounded-full bg-green-500/90 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
            Airing
          </div>
        )}

        {/* Episode count overlay on hover */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-xs text-white">
            {anime.episodes && (
              <span className="rounded bg-black/50 px-1.5 py-0.5 backdrop-blur-sm">
                {anime.episodes} eps
              </span>
            )}
            {anime.format && (
              <span className="rounded bg-black/50 px-1.5 py-0.5 backdrop-blur-sm">
                {anime.format}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-accent-purple transition-colors">
          {title}
        </h3>
        {anime.genres && anime.genres.length > 0 && (
          <p className="text-[11px] text-muted line-clamp-1">
            {anime.genres.slice(0, 3).join(' · ')}
          </p>
        )}
      </div>
    </Link>
  );
}
