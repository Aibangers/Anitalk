export interface AnimeTitle {
  romaji: string;
  english: string | null;
}

export interface CoverImage {
  large: string;
  extraLarge?: string;
}

export interface Studio {
  name: string;
}

export interface StreamingEpisode {
  title: string;
  url: string;
  site: string;
}

export interface NextAiringEpisode {
  episode: number;
  airingAt: number;
}

export interface AnimeMedia {
  id: number;
  title: AnimeTitle;
  coverImage: CoverImage;
  bannerImage?: string | null;
  description?: string | null;
  episodes: number | null;
  status: string;
  genres: string[];
  averageScore: number | null;
  season?: string;
  seasonYear?: number;
  format?: string;
  studios?: { nodes: Studio[] };
  streamingEpisodes?: StreamingEpisode[];
  nextAiringEpisode?: NextAiringEpisode | null;
}

export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: number;
}

export interface Reaction {
  emoji: string;
  label: string;
  count: number;
}

export interface TrendingDiscussion {
  id: string;
  animeTitle: string;
  episodeNumber: number;
  commentCount: number;
  lastActive: string;
  coverImage: string;
  hotTake: string;
  anilistId?: number;
}
