'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AnimeCard from '@/components/AnimeCard';
import { AnimeMedia } from '@/lib/types';

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Mecha', 'Music', 'Mystery', 'Psychological',
  'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural', 'Thriller',
];

const formats = [
  { value: '', label: 'All Formats' },
  { value: 'TV', label: 'TV' },
  { value: 'MOVIE', label: 'Movie' },
  { value: 'OVA', label: 'OVA' },
  { value: 'ONA', label: 'ONA' },
  { value: 'SPECIAL', label: 'Special' },
];

const sortOptions = [
  { value: 'POPULARITY_DESC', label: 'Popularity' },
  { value: 'SCORE_DESC', label: 'Score' },
  { value: 'TRENDING_DESC', label: 'Trending' },
  { value: 'START_DATE_DESC', label: 'Newest' },
];

function SeasonalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [anime, setAnime] = useState<AnimeMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [format, setFormat] = useState(searchParams.get('format') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'POPULARITY_DESC');

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();
      let season: string;
      if (month >= 1 && month <= 3) season = 'WINTER';
      else if (month >= 4 && month <= 6) season = 'SPRING';
      else if (month >= 7 && month <= 9) season = 'SUMMER';
      else season = 'FALL';

      const variables: Record<string, unknown> = {
        season,
        seasonYear: year,
        page: 1,
        perPage: 30,
        sort: [sort],
      };
      if (format) variables.format = format;
      if (genre) variables.genre = genre;

      const query = `
        query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int, $sort: [MediaSort], $format: MediaFormat, $genre: String) {
          Page(page: $page, perPage: $perPage) {
            media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: $sort, format: $format, genre: $genre, isAdult: false) {
              id
              title { romaji english }
              coverImage { large extraLarge }
              episodes
              status
              genres
              averageScore
              format
            }
          }
        }
      `;

      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });

      const json = await res.json();
      setAnime(json.data?.Page?.media || []);
    } catch (error) {
      console.error('Failed to fetch seasonal anime:', error);
      setAnime([]);
    } finally {
      setLoading(false);
    }
  }, [sort, format, genre]);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (format) params.set('format', format);
    if (genre) params.set('genre', genre);
    if (sort !== 'POPULARITY_DESC') params.set('sort', sort);
    const qs = params.toString();
    router.replace(`/seasonal${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [format, genre, sort, router]);

  const now = new Date();
  const month = now.getMonth() + 1;
  let seasonLabel: string;
  if (month >= 1 && month <= 3) seasonLabel = 'Winter';
  else if (month >= 4 && month <= 6) seasonLabel = 'Spring';
  else if (month >= 7 && month <= 9) seasonLabel = 'Summer';
  else seasonLabel = 'Fall';

  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-b from-accent-purple/5 to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {seasonLabel} {now.getFullYear()} Anime
          </h1>
          <p className="text-sm text-muted mt-1">
            Browse all anime airing this season
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex flex-wrap gap-3">
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg bg-surface border border-border px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Format */}
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="rounded-lg bg-surface border border-border px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 cursor-pointer"
          >
            {formats.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          {/* Genre */}
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded-lg bg-surface border border-border px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 cursor-pointer"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {(format || genre || sort !== 'POPULARITY_DESC') && (
            <button
              onClick={() => {
                setFormat('');
                setGenre('');
                setSort('POPULARITY_DESC');
              }}
              className="rounded-lg bg-accent-purple/10 px-3 py-2 text-sm font-medium text-accent-purple hover:bg-accent-purple/20 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] rounded-xl bg-surface-hover" />
                <div className="mt-2 h-4 w-3/4 rounded bg-surface-hover" />
                <div className="mt-1 h-3 w-1/2 rounded bg-surface-hover" />
              </div>
            ))}
          </div>
        ) : anime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {anime.map((a) => (
              <AnimeCard key={a.id} anime={a} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl mb-2">🍃</p>
            <p className="text-muted font-medium">No anime found with those filters</p>
            <p className="text-sm text-muted mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SeasonalPage() {
  return (
    <Suspense fallback={
      <div className="pb-20 md:pb-0">
        <div className="bg-gradient-to-b from-accent-purple/5 to-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="h-8 w-64 rounded bg-surface-hover animate-pulse" />
            <div className="h-4 w-48 rounded bg-surface-hover animate-pulse mt-2" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] rounded-xl bg-surface-hover" />
                <div className="mt-2 h-4 w-3/4 rounded bg-surface-hover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    }>
      <SeasonalContent />
    </Suspense>
  );
}
