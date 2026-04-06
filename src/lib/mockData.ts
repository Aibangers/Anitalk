import { Comment, Reaction, TrendingDiscussion } from './types';

export const mockReactions: Reaction[] = [
  { emoji: '🔥', label: 'Peak Fiction', count: 247 },
  { emoji: '💀', label: 'Mid', count: 23 },
  { emoji: '😭', label: 'Emotional', count: 189 },
  { emoji: '🤯', label: 'Plot Twist', count: 156 },
  { emoji: '😂', label: 'Comedy Gold', count: 94 },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    author: 'SakuraBlade',
    avatar: 'S',
    content: 'The animation in this episode was absolutely INSANE. That fight choreography in the second half had me rewinding three times. Studio is going all out this season.',
    timestamp: '2 hours ago',
    likes: 142,
    replies: 12,
  },
  {
    id: '2',
    author: 'NarutoRunGuy',
    avatar: 'N',
    content: 'Can we talk about the OST during that final scene? The way it built up and then went completely silent right before the reveal... chills. Literally chills.',
    timestamp: '3 hours ago',
    likes: 98,
    replies: 7,
  },
  {
    id: '3',
    author: 'AnimeOnigiri',
    avatar: 'A',
    content: "Manga reader here (no spoilers, I promise). I just want to say they adapted this SO well. The pacing was perfect and they even added original scenes that enhanced the story.",
    timestamp: '4 hours ago',
    likes: 203,
    replies: 24,
  },
  {
    id: '4',
    author: 'MidnightOtaku',
    avatar: 'M',
    content: "Am I the only one who noticed the foreshadowing in the opening scene? Go back and watch it again after you finish the episode. The director is playing 4D chess with us.",
    timestamp: '5 hours ago',
    likes: 67,
    replies: 15,
  },
  {
    id: '5',
    author: 'KawaiiDesu42',
    avatar: 'K',
    content: 'The voice acting this episode deserves an award. You could feel every emotion in that monologue. The VA absolutely nailed the desperation and hope at the same time.',
    timestamp: '6 hours ago',
    likes: 156,
    replies: 9,
  },
  {
    id: '6',
    author: 'WeebPhilosopher',
    avatar: 'W',
    content: "This show keeps getting better every week and I'm genuinely scared they'll fumble the landing. But based on this episode, I trust the team completely. Best anime of the season, no debate.",
    timestamp: '8 hours ago',
    likes: 89,
    replies: 31,
  },
  {
    id: '7',
    author: 'SpicyRamen_',
    avatar: 'S',
    content: "That post-credits scene though!! I literally screamed. If you skipped the ED, go back right now. TRUST ME. This changes everything we thought about the story.",
    timestamp: '10 hours ago',
    likes: 312,
    replies: 45,
  },
  {
    id: '8',
    author: 'ChillVibesOnly',
    avatar: 'C',
    content: "Solid episode overall. The first half was a bit slow with the setup but the payoff in the second half made it worth it. The animation quality is still consistently top tier.",
    timestamp: '12 hours ago',
    likes: 45,
    replies: 3,
  },
];

export const mockTrendingDiscussions: TrendingDiscussion[] = [
  {
    id: '1',
    animeTitle: 'Solo Leveling Season 2',
    episodeNumber: 8,
    commentCount: 1247,
    lastActive: '5 min ago',
    coverImage: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-m1gX3iwfIsLu.png',
    hotTake: '"That entrance was the most hype moment in anime this year"',
    anilistId: 151807,
  },
  {
    id: '2',
    animeTitle: 'Jujutsu Kaisen',
    episodeNumber: 12,
    commentCount: 2341,
    lastActive: '12 min ago',
    coverImage: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx145064-5fa4ZBbW4dqA.jpg',
    hotTake: '"MAPPA absolutely cooked with this adaptation"',
    anilistId: 145064,
  },
  {
    id: '3',
    animeTitle: 'Frieren: Beyond Journey\'s End',
    episodeNumber: 16,
    commentCount: 987,
    lastActive: '23 min ago',
    coverImage: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-gHSraOSa0nBG.jpg',
    hotTake: '"Frieren just dropped the most emotionally devastating episode"',
    anilistId: 154587,
  },
  {
    id: '4',
    animeTitle: 'Dandadan',
    episodeNumber: 6,
    commentCount: 856,
    lastActive: '34 min ago',
    coverImage: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx171018-2ldCj6QywuOa.jpg',
    hotTake: '"Science SARU is carrying anime right now"',
    anilistId: 171018,
  },
  {
    id: '5',
    animeTitle: 'One Piece',
    episodeNumber: 1105,
    commentCount: 1567,
    lastActive: '1 hr ago',
    coverImage: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21-YCDoj1EkAxFn.jpg',
    hotTake: '"Gear 5 Luffy fights are on another level"',
    anilistId: 21,
  },
];

export function getEpisodeDiscussionCount(animeId: number, episode: number): number {
  // Deterministic mock count based on anime ID and episode number
  const seed = animeId * 100 + episode;
  return Math.floor(((Math.sin(seed) + 1) / 2) * 500) + 10;
}
