import { Metadata } from 'next';
import Link from 'next/link';
import { getAnimeDetails } from '@/lib/anilist';
import { notFound } from 'next/navigation';
import ReactionBar from '@/components/ReactionBar';
import CommentSection from '@/components/CommentSection';

interface Props {
  params: Promise<{ id: string; ep: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, ep } = await params;
  try {
    const anime = await getAnimeDetails(parseInt(id, 10));
    const title = anime.title.english || anime.title.romaji;
    return {
      title: `${title} Episode ${ep} Discussion`,
      description: `Join the spoiler-free discussion for ${title} Episode ${ep} on AniTalk. Share your reactions and theories.`,
      openGraph: {
        title: `${title} EP ${ep} Discussion — AniTalk`,
        description: `Spoiler-free discussion for ${title} Episode ${ep}`,
        images: anime.coverImage.extraLarge ? [{ url: anime.coverImage.extraLarge }] : [],
      },
    };
  } catch {
    return { title: `Episode ${ep} Discussion — AniTalk` };
  }
}

export default async function EpisodeDiscussionPage({ params }: Props) {
  const { id, ep } = await params;
  const animeId = parseInt(id, 10);
  const episodeNum = parseInt(ep, 10);

  let anime;
  try {
    anime = await getAnimeDetails(animeId);
  } catch (error) {
    console.error('Failed to fetch anime details:', error);
    notFound();
  }

  const title = anime.title.english || anime.title.romaji;

  return (
    <div className="pb-20 md:pb-0">
      {/* Header with Banner */}
      <div className="relative h-32 sm:h-44 overflow-hidden">
        {anime.bannerImage ? (
          <img src={anime.bannerImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-accent-purple/30 to-accent-blue/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted mb-4">
          <Link href="/" className="hover:text-accent-purple transition-colors">Home</Link>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <Link href={`/anime/${animeId}`} className="hover:text-accent-purple transition-colors truncate max-w-[200px]">
            {title}
          </Link>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-foreground font-medium">Episode {episodeNum}</span>
        </nav>

        {/* Episode Header */}
        <div className="flex items-start gap-4 mb-8">
          <img
            src={anime.coverImage.large}
            alt={title}
            className="h-24 w-16 rounded-lg object-cover shadow-lg shrink-0 hidden sm:block"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center justify-center h-7 rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue px-3 text-xs font-bold text-white">
                EP {episodeNum}
              </span>
              {anime.status === 'RELEASING' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  AIRING
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {title} — Episode {episodeNum}
            </h1>
            <p className="text-sm text-muted mt-1">
              Episode discussion · {anime.genres?.slice(0, 3).join(', ')}
            </p>
          </div>
        </div>

        {/* Crunchyroll Link */}
        <div className="rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/20 p-4 mb-6">
          <a
            href="https://crunchyroll.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white text-xs font-bold">CR</span>
              <div>
                <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 group-hover:text-orange-500 transition-colors">
                  Watch Episode {episodeNum} on Crunchyroll
                </p>
                <p className="text-[10px] text-muted">Stream with subtitles or dub</p>
              </div>
            </div>
            <svg className="h-4 w-4 text-orange-500 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* Reactions */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-3 text-muted uppercase tracking-wider">Quick Reactions</h2>
          <ReactionBar animeId={animeId} episode={episodeNum} />
        </div>

        {/* Discussion Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <svg className="h-5 w-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              Discussion
            </h2>
            <span className="text-xs text-muted bg-surface-hover rounded-full px-3 py-1">
              6 comments
            </span>
          </div>
          <CommentSection animeId={animeId} episode={episodeNum} />
        </div>

        {/* Episode Navigation */}
        <div className="flex items-center justify-between py-6 border-t border-border">
          {episodeNum > 1 ? (
            <Link
              href={`/anime/${animeId}/episode/${episodeNum - 1}`}
              className="flex items-center gap-2 text-sm font-medium text-muted hover:text-accent-purple transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Episode {episodeNum - 1}
            </Link>
          ) : (
            <div />
          )}
          <Link
            href={`/anime/${animeId}`}
            className="text-sm font-medium text-muted hover:text-accent-purple transition-colors"
          >
            All Episodes
          </Link>
          {(!anime.episodes || episodeNum < anime.episodes) ? (
            <Link
              href={`/anime/${animeId}/episode/${episodeNum + 1}`}
              className="flex items-center gap-2 text-sm font-medium text-muted hover:text-accent-purple transition-colors"
            >
              Episode {episodeNum + 1}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
