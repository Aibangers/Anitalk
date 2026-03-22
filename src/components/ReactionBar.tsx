'use client';

import { useState, useEffect } from 'react';
import { Reaction } from '@/lib/types';
import { mockReactions } from '@/lib/mockData';

interface ReactionBarProps {
  animeId: number;
  episode: number;
}

export default function ReactionBar({ animeId, episode }: ReactionBarProps) {
  const storageKey = `anitalk-reactions-${animeId}-${episode}`;
  const [reactions, setReactions] = useState<Reaction[]>(mockReactions);
  const [userReaction, setUserReaction] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUserReaction(parsed.userReaction);
        setReactions(parsed.reactions);
      } catch { /* ignore */ }
    }
  }, [storageKey]);

  const handleReaction = (emoji: string) => {
    setReactions((prev) => {
      const updated = prev.map((r) => {
        if (r.emoji === emoji && userReaction !== emoji) {
          return { ...r, count: r.count + 1 };
        }
        if (r.emoji === userReaction && r.emoji !== emoji) {
          return { ...r, count: Math.max(0, r.count - 1) };
        }
        return r;
      });

      const newUserReaction = userReaction === emoji ? null : emoji;
      setUserReaction(newUserReaction);

      localStorage.setItem(storageKey, JSON.stringify({
        userReaction: newUserReaction,
        reactions: updated,
      }));

      return updated;
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {reactions.map((reaction) => (
        <button
          key={reaction.emoji}
          onClick={() => handleReaction(reaction.emoji)}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all duration-200 hover:scale-105 active:scale-95 ${
            userReaction === reaction.emoji
              ? 'bg-accent-purple/10 border-accent-purple text-accent-purple'
              : 'bg-surface border-border text-foreground hover:border-accent-purple/50'
          }`}
        >
          <span className="text-base">{reaction.emoji}</span>
          <span className="hidden sm:inline">{reaction.label}</span>
          <span className={`text-xs ${userReaction === reaction.emoji ? 'text-accent-purple' : 'text-muted'}`}>
            {reaction.count}
          </span>
        </button>
      ))}
    </div>
  );
}
