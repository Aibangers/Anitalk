import Link from 'next/link';
import { getSeasonalAnime, getTrendingAnime, getCurrentSeason } from '@/lib/anilist';
import AnimeCard from '@/components/AnimeCard';
import { mockTrendingDiscussions } from '@/lib/mockData';
import { AnimeMedia } from '@/lib/types';

export default async function HomePage() {
  const { season, year } = getCurrentSeason();
  let seasonalAnime: AnimeMedia[] = [];
  let trendingAnime: AnimeMedia[] = [];

  try {
    const [seasonalResult, trendingResult] = await Promise.all([
      getSeasonalAnime(1, 12),
      getTrendingAnime(1, 6),
    ]);
    seasonalAnime = seasonalResult.media;
    trendingAnime = trendingResult;
  } catch (error) {
    console.error('Failed to fetch anime data:', error);
  }

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 via-transparent to-accent-blue/5" />
        <div className="absolute top-20 left-1/4 h-64 w-64 rounded-full bg-accent-purple/10 blur-3xl" />
        <div className="absolute bottom-10 right-1/4 h-48 w-48 rounded-full bg-accent-blue/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-purple/10 px-4 py-1.5 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-purple animate-pulse" />
              <span className="text-xs font-medium text-accent-purple">Now in beta — join the conversation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Where anime fans discuss every episode —{' '}
              <span className="gradient-text">spoiler-free</span>.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
              Episode-by-episode discussions with built-in spoiler protection. 
              React, debate, and connect with fans who are exactly where you are in the story.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-accent-purple/25"
              >
                Start Discussing
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/seasonal"
                className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-border px-8 py-3 text-sm font-semibold hover:bg-surface-hover transition-colors"
              >
                Browse This Season
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Currently Airing Section */}
      {seasonalAnime && seasonalAnime.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Currently Airing</h2>
              <p className="text-sm text-muted mt-1">{season.charAt(0) + season.slice(1).toLowerCase()} {year} Season</p>
            </div>
            <Link
              href="/seasonal"
              className="text-sm font-medium text-accent-purple hover:text-accent-blue transition-colors flex items-center gap-1"
            >
              View All
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {seasonalAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* Trending Discussions Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Trending Discussions</h2>
            <p className="text-sm text-muted mt-1">What everyone&apos;s talking about</p>
          </div>
          <div className="flex items-center gap-1 text-sm text-accent-purple">
            <span className="h-2 w-2 rounded-full bg-accent-purple animate-pulse" />
            Live
          </div>
        </div>
        <div className="grid gap-3">
          {mockTrendingDiscussions.map((discussion, idx) => (
            <div
              key={discussion.id}
              className="group flex items-center gap-4 rounded-xl bg-surface border border-border p-4 hover:border-accent-purple/50 hover:bg-surface-hover transition-all cursor-pointer"
            >
              <span className="text-lg font-bold text-muted/50 w-6 text-center">
                {idx + 1}
              </span>
              <img
                src={discussion.coverImage}
                alt={discussion.animeTitle}
                className="h-14 w-10 rounded-lg object-cover shrink-0"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold truncate group-hover:text-accent-purple transition-colors">
                    {discussion.animeTitle}
                  </h3>
                  <span className="shrink-0 rounded bg-accent-purple/10 px-2 py-0.5 text-[10px] font-bold text-accent-purple">
                    EP {discussion.episodeNumber}
                  </span>
                </div>
                <p className="text-xs text-muted italic truncate">{discussion.hotTake}</p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
                <span className="text-xs font-medium">{discussion.commentCount.toLocaleString()} comments</span>
                <span className="text-[10px] text-muted">{discussion.lastActive}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Anime Section */}
      {trendingAnime && trendingAnime.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Trending Anime</h2>
            <p className="text-sm text-muted mt-1">Most popular right now across all seasons</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingAnime.map((anime) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">How AniTalk Works</h2>
          <p className="text-muted mt-2">Discuss anime without fear of spoilers</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="relative rounded-2xl bg-surface border border-border p-6 text-center group hover:border-accent-purple/50 transition-colors">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 text-2xl">
              🎯
            </div>
            <h3 className="text-base font-semibold mb-2">Set Your Progress</h3>
            <p className="text-sm text-muted leading-relaxed">
              Tell us which episode you&apos;re on. We&apos;ll only show discussions for episodes you&apos;ve watched — no accidental spoilers.
            </p>
          </div>
          <div className="relative rounded-2xl bg-surface border border-border p-6 text-center group hover:border-accent-purple/50 transition-colors">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 text-2xl">
              💬
            </div>
            <h3 className="text-base font-semibold mb-2">Join Discussions</h3>
            <p className="text-sm text-muted leading-relaxed">
              Dive into episode-specific threads. Share your reactions, theories, and hot takes with fans who are on the same page.
            </p>
          </div>
          <div className="relative rounded-2xl bg-surface border border-border p-6 text-center group hover:border-accent-purple/50 transition-colors">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 text-2xl">
              🔥
            </div>
            <h3 className="text-base font-semibold mb-2">React & Rate</h3>
            <p className="text-sm text-muted leading-relaxed">
              Was it peak fiction or mid? Use quick reactions to rate each episode and see what the community thinks.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent-purple to-accent-blue p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to join the conversation?
            </h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Thousands of anime fans are already discussing their favorite shows episode by episode.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-semibold text-accent-purple hover:bg-white/90 transition-colors shadow-lg"
            >
              Create Free Account
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
