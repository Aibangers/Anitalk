import { AnimeMedia } from './types';

const ANILIST_API = 'https://graphql.anilist.co';

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

function getCurrentSeason(): { season: string; year: number } {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  let season: string;
  if (month >= 1 && month <= 3) season = 'WINTER';
  else if (month >= 4 && month <= 6) season = 'SPRING';
  else if (month >= 7 && month <= 9) season = 'SUMMER';
  else season = 'FALL';

  return { season, year };
}

async function fetchAniList<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const cacheKey = JSON.stringify({ query, variables });
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }

  const res = await fetch(ANILIST_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`AniList API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  
  if (json.errors) {
    console.error('AniList GraphQL errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'GraphQL error');
  }

  cache.set(cacheKey, { data: json.data, timestamp: Date.now() });
  return json.data as T;
}

// --- Queries ---

const SEASONAL_ANIME_QUERY = `
query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int, $sort: [MediaSort], $format: MediaFormat, $genre: String) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
    }
    media(season: $season, seasonYear: $seasonYear, type: ANIME, sort: $sort, format: $format, genre: $genre, isAdult: false) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
        extraLarge
      }
      episodes
      status
      genres
      averageScore
      format
      season
      seasonYear
    }
  }
}
`;

const ANIME_DETAILS_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      romaji
      english
    }
    bannerImage
    coverImage {
      large
      extraLarge
    }
    description(asHtml: false)
    episodes
    genres
    status
    format
    season
    seasonYear
    averageScore
    studios(isMain: true) {
      nodes {
        name
      }
    }
    streamingEpisodes {
      title
      url
      site
    }
    nextAiringEpisode {
      episode
      airingAt
    }
  }
}
`;

const TRENDING_ANIME_QUERY = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
        extraLarge
      }
      episodes
      status
      genres
      averageScore
      format
    }
  }
}
`;

const SEARCH_ANIME_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: ANIME, sort: SEARCH_MATCH, isAdult: false) {
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      episodes
      status
      genres
      averageScore
      format
    }
  }
}
`;

// --- API Functions ---

export async function getSeasonalAnime(
  page = 1,
  perPage = 20,
  sort: string = 'POPULARITY_DESC',
  format?: string,
  genre?: string
): Promise<{ media: AnimeMedia[]; pageInfo: { total: number; hasNextPage: boolean } }> {
  const { season, year } = getCurrentSeason();

  const variables: Record<string, unknown> = {
    season,
    seasonYear: year,
    page,
    perPage,
    sort: [sort],
  };

  if (format) variables.format = format;
  if (genre) variables.genre = genre;

  const data = await fetchAniList<{
    Page: { media: AnimeMedia[]; pageInfo: { total: number; hasNextPage: boolean } };
  }>(SEASONAL_ANIME_QUERY, variables);

  return { media: data.Page.media, pageInfo: data.Page.pageInfo };
}

export async function getAnimeDetails(id: number): Promise<AnimeMedia> {
  const data = await fetchAniList<{ Media: AnimeMedia }>(ANIME_DETAILS_QUERY, { id });
  return data.Media;
}

export async function getTrendingAnime(page = 1, perPage = 10): Promise<AnimeMedia[]> {
  const data = await fetchAniList<{ Page: { media: AnimeMedia[] } }>(TRENDING_ANIME_QUERY, {
    page,
    perPage,
  });
  return data.Page.media;
}

export async function searchAnime(query: string, page = 1, perPage = 10): Promise<AnimeMedia[]> {
  const data = await fetchAniList<{ Page: { media: AnimeMedia[] } }>(SEARCH_ANIME_QUERY, {
    search: query,
    page,
    perPage,
  });
  return data.Page.media;
}

export { getCurrentSeason };
