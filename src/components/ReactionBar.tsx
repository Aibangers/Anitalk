'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface ReactionBarProps {
  animeId: number;
  episode: number;
}

const REACTIONS = [
  { emoji: '🔥', label: 'Peak Fiction' },
  { emoji: '💀', label: 'Mid' },
  { emoji: '😭', label: 'Emotional' },
  { emoji: '🤯', label: 'Plot Twist' },
  { emoji: '😂', label: 'Comedy Gold' },
];

export default function ReactionBar({ animeId, episode }: ReactionBarProps) {
  const { data: session } = useSession();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReactions = useCallback(async () => {
    try {
      const res = await fetch(`/api/reactions?animeId=${animeId}&episode=${episode}`);
      if (res.ok) {
        const data = await res.json();
        setCounts(data.counts || {});
        setUserReaction(data.userReaction || null);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [animeId, episode]);

  useEffect(() => {
    fetchReactions();
  }, [fetchReactions]);

  const handleReaction = async (emoji: string) => {
    if (!session) return;

    // Optimistic update
    const prevCounts = { ...counts };
    const prevUserReaction = userReaction;

    if (userReaction === emoji) {
      // Removing reaction
      setCounts((prev) => ({ ...prev, [emoji]: Math.max(0, (prev[emoji] || 0) - 1) }));
      setUserReaction(null);
    } else {
      // Adding/switching reaction
      if (userReaction) {
        setCounts((prev) => ({
          ...prev,
          [userReaction!]: Math.max(0, (prev[userReaction!] || 0) - 1),
          [emoji]: (prev[emoji] || 0) + 1,
        }));
      } else {
        setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
      }
      setUserReaction(emoji);
    }

    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji, animeId, episode }),
      });

      if (!res.ok) {
        // Revert on error
        setCounts(prevCounts);
        setUserReaction(prevUserReaction);
      }
    } catch {
      setCounts(prevCounts);
      setUserReaction(prevUserReaction);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {REACTIONS.map((r) => (
          <div key={r.emoji} className="h-10 w-32 rounded-full bg-surface border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {REACTIONS.map((reaction) => {
        const count = counts[reaction.emoji] || 0;
        const isSelected = userReaction === reaction.emoji;

        return (
          <button
            key={reaction.emoji}
            onClick={() => handleReaction(reaction.emoji)}
            disabled={!session}
            title={!session ? 'Log in to react' : reaction.label}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all duration-200 hover:scale-105 active:scale-95 ${
              isSelected
                ? 'bg-accent-purple/10 border-accent-purple text-accent-purple'
                : 'bg-surface border-border text-foreground hover:border-accent-purple/50'
            } ${!session ? 'opacity-70 cursor-default hover:scale-100 active:scale-100' : ''}`}
          >
            <span className="text-base">{reaction.emoji}</span>
            <span className="hidden sm:inline">{reaction.label}</span>
            <span className={`text-xs ${isSelected ? 'text-accent-purple' : 'text-muted'}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
