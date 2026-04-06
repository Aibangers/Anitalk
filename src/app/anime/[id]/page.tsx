import { Metadata } from 'next';
import { getAnimeDetails } from '@/lib/anilist';
import { notFound } from 'next/navigation';
import SpoilerGate from '@/components/SpoilerGate';
import StreamingLinks from '@/components/StreamingLinks';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const anime = await getAnimeDetails(parseInt(id, 10));
    const title = anime.title.english || anime.title.romaji;
    return {
      title: `${title} — Episode Discussions`,
      description: `Discuss every episode of ${title} spoiler-free on AniTalk. ${anime.genres?.slice(0, 3).join(', ')}`,
      openGraph: {
        title: `${title} — AniTalk`,
        description: `Spoiler-free episode discussions for ${title}`,
        images: anime.coverImage.extraLarge ? [{ url: anime.coverImage.extraLarge }] : [],
      },
    };
  } catch {
    return { title: 'Anime — AniTalk' };
  }
}

export default async function AnimeShowPage({ params }: Props) {
  const { id } = await params;
  const animeId = parseInt(id, 10);

  let anime;
  try {
    anime = await getAnimeDetails(animeId);
  } catch (error) {
    console.error('Failed to fetch anime details:', error);
    notFound();
  }

  const title = anime.title.english || anime.title.romaji;
  const cleanDescription = anime.description
    ?.replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n') || '';

  const statusLabel = {
    RELEASING: 'Currently Airing',
    FINISHED: 'Finished',
    NOT_YET_RELEASED: 'Not Yet Released',
    CANCELLED: 'Cancelled',
    HIATUS: 'On Hiatus',
  }[anime.status] || anime.status;

  const statusColor = {
    RELEASING: 'bg-green-500',
    FINISHED: 'bg-blue-500',
    NOT_YET_RELEASED: 'bg-yellow-500',
    CANCELLED: 'bg-red-500',
    HIATUS: 'bg-orange-500',
  }[anime.status] || 'bg-gray-500';

  return (
    <div className="pb-20 md:pb-0">
      {/* Banner */}
      <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
        {anime.bannerImage ? (
          <img
            src={anime.bannerImage}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-accent-purple/30 to-accent-blue/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Cover & Info */}
          <div className="lg:w-72 shrink-0">
            {/* Cover Image */}
            <div className="relative w-48 lg:w-full mx-auto lg:mx-0">
              <img
                src={anime.coverImage.extraLarge || anime.coverImage.large}
                alt={title}
                className="w-full rounded-xl shadow-2xl shadow-black/20"
                loading="eager"
              />
            </div>

            {/* Quick Info Cards */}
            <div className="mt-6 space-y-3 hidden lg:block">
              <StreamingLinks streamingEpisodes={anime.streamingEpisodes} />

              {/* Anime Info */}
              <div className="rounded-xl bg-surface border border-border p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Status</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <span className={`h-2 w-2 rounded-full ${statusColor}`} />
                    {statusLabel}
                  </span>
                </div>
                {anime.episodes && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Episodes</span>
                    <span className="font-medium">{anime.episodes}</span>
                  </div>
                )}
                {anime.format && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Format</span>
                    <span className="font-medium">{anime.format}</span>
                  </div>
                )}
                {anime.averageScore && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Score</span>
                    <span className="flex items-center gap-1 font-medium">
                      <svg className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {anime.averageScore}%
                    </span>
                  </div>
                )}
                {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Studio</span>
                    <span className="font-medium">{anime.studios.nodes[0].name}</span>
                  </div>
                )}
                {anime.nextAiringEpisode && (
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">Next Episode</span>
                      <span className="font-medium text-accent-purple">
                        EP {anime.nextAiringEpisode.episode}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted mt-0.5 text-right">
                      {new Date(anime.nextAiringEpisode.airingAt * 1000).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 pt-4">
            {/* Title & Meta */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{title}</h1>
              {anime.title.english && anime.title.romaji !== anime.title.english && (
                <p className="text-sm text-muted mt-1">{anime.title.romaji}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {anime.genres?.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full bg-surface-hover border border-border px-3 py-1 text-xs font-medium text-muted"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            {cleanDescription && (
              <div className="mb-8">
                <p className="text-sm leading-relaxed text-muted whitespace-pre-line line-clamp-4">
                  {cleanDescription}
                </p>
              </div>
            )}

            {/* Mobile: Streaming & Info */}
            <div className="lg:hidden space-y-3 mb-8">
              <StreamingLinks streamingEpisodes={anime.streamingEpisodes} />
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${statusColor}`} />
                  {statusLabel}
                </span>
                {anime.episodes && <span className="text-muted">{anime.episodes} episodes</span>}
                {anime.averageScore && (
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {anime.averageScore}%
                  </span>
                )}
              </div>
            </div>

            {/* Episode Discussions */}
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                Episode Discussions
              </h2>
              <SpoilerGate animeId={animeId} totalEpisodes={anime.episodes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
