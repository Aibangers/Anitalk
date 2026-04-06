'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface SpoilerGateProps {
  animeId: number;
  totalEpisodes: number | null;
  children: (maxEpisode: number) => React.ReactNode;
}

export default function SpoilerGate({ animeId, totalEpisodes, children }: SpoilerGateProps) {
  const { data: session } = useSession();
  const storageKey = `anitalk-progress-${animeId}`;
  const maxEp = totalEpisodes || 24;
  const [progress, setProgress] = useState<number>(0);
  const [mounted, setMounted] = useState(false);

  // Load progress from API or localStorage
  const loadProgress = useCallback(async () => {
    if (session?.user) {
      try {
        const res = await fetch(`/api/progress?animeId=${animeId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.maxEpisode > 0) {
            setProgress(data.maxEpisode);
            setMounted(true);
            return;
          }
        }
      } catch {
        // Fall back to localStorage
      }
    }

    // Fall back to localStorage for anonymous users
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setProgress(parseInt(stored, 10));
    }
    setMounted(true);
  }, [animeId, session, storageKey]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const handleProgressChange = async (value: number) => {
    setProgress(value);
    localStorage.setItem(storageKey, value.toString());

    if (session?.user) {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ animeId, maxEpisode: value }),
        });
      } catch {
        // localStorage is the fallback
      }
    }
  };

  if (!mounted) return null;

  return (
    <div>
      {/* Spoiler Progress Selector */}
      <div className="rounded-xl bg-surface border border-border p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-purple/10">
              <svg className="h-5 w-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold">Spoiler Protection</p>
              <p className="text-xs text-muted">Only show discussions for episodes you&apos;ve watched</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            <label htmlFor="progress-select" className="text-sm text-muted whitespace-nowrap">
              Watched up to:
            </label>
            <select
              id="progress-select"
              value={progress}
              onChange={(e) => handleProgressChange(parseInt(e.target.value, 10))}
              className="rounded-lg bg-surface-hover border border-border px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all cursor-pointer"
            >
              <option value={0}>Not started</option>
              {Array.from({ length: maxEp }, (_, i) => i + 1).map((ep) => (
                <option key={ep} value={ep}>
                  Episode {ep}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted">Progress</span>
              <span className="text-xs font-medium text-accent-purple">
                {progress}/{maxEp} episodes
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-blue transition-all duration-500"
                style={{ width: `${(progress / maxEp) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Gated Content */}
      {children(progress)}
    </div>
  );
}
