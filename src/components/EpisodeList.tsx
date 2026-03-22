'use client';

import Link from 'next/link';
import { getEpisodeDiscussionCount } from '@/lib/mockData';

interface EpisodeListProps {
  animeId: number;
  totalEpisodes: number | null;
  maxEpisode: number;
}

export default function EpisodeList({ animeId, totalEpisodes, maxEpisode }: EpisodeListProps) {
  const epCount = totalEpisodes || 12; // Default to 12 if unknown
  const episodes = Array.from({ length: Math.min(epCount, maxEpisode) }, (_, i) => i + 1);

  if (episodes.length === 0) {
    return (
      <div className="rounded-xl bg-surface border border-border p-8 text-center">
        <p className="text-muted text-sm">Set your progress above to see episode discussions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {episodes.map((ep) => {
        const discussionCount = getEpisodeDiscussionCount(animeId, ep);
        return (
          <Link
            key={ep}
            href={`/anime/${animeId}/episode/${ep}`}
            className="group flex items-center justify-between rounded-xl bg-surface border border-border p-4 hover:border-accent-purple/50 hover:bg-surface-hover transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple font-bold text-sm group-hover:bg-accent-purple group-hover:text-white transition-colors">
                {ep}
              </div>
              <div>
                <p className="text-sm font-medium group-hover:text-accent-purple transition-colors">
                  Episode {ep}
                </p>
                <p className="text-xs text-muted">
                  {discussionCount} comments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 text-xs text-muted">
                <span>🔥</span>
                <span>{Math.floor(discussionCount * 0.6)}</span>
                <span className="mx-1">·</span>
                <span>😭</span>
                <span>{Math.floor(discussionCount * 0.3)}</span>
              </div>
              <svg className="h-4 w-4 text-muted group-hover:text-accent-purple transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
