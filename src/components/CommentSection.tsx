'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface ApiComment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string | null;
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  animeId: number;
  episode: number;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function CommentSection({ animeId, episode }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?animeId=${animeId}&episode=${episode}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  }, [animeId, episode]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim(), animeId, episode }),
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch {
      // silently fail
    } finally {
      setIsSubmitting(false);
    }
  };

  const username = (session?.user as Record<string, unknown>)?.username as string | undefined;
  const displayName = username || session?.user?.name || 'U';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="rounded-xl bg-surface border border-border p-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple to-accent-blue text-xs font-bold text-white">
            {session ? avatarLetter : '?'}
          </div>
          <div className="flex-1">
            {session ? (
              <>
                <textarea
                  placeholder="Share your thoughts on this episode..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full resize-none rounded-lg bg-surface-hover border border-border p-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                  rows={3}
                  maxLength={2000}
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted">
                    {newComment.length}/2000
                  </p>
                  <button
                    onClick={handleSubmit}
                    disabled={!newComment.trim() || isSubmitting}
                    className="rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea
                  placeholder="Share your thoughts on this episode..."
                  className="w-full resize-none rounded-lg bg-surface-hover border border-border p-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                  rows={3}
                  disabled
                />
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted">
                    <Link href="/signup" className="text-accent-purple hover:text-accent-blue transition-colors">
                      Sign up
                    </Link>
                    {' '}to join the discussion
                  </p>
                  <button
                    disabled
                    className="rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
                  >
                    Comment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl bg-surface border border-border p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-full bg-surface-hover" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-surface-hover" />
                  <div className="h-4 w-full rounded bg-surface-hover" />
                  <div className="h-4 w-3/4 rounded bg-surface-hover" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-xl bg-surface border border-border p-8 text-center">
          <p className="text-sm text-muted">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

function CommentCard({ comment }: { comment: ApiComment }) {
  const displayName = comment.user.username || comment.user.name || 'Anonymous';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="group rounded-xl bg-surface border border-border p-4 hover:border-border transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-purple/10 text-sm font-bold text-accent-purple">
          {avatarLetter}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold">{displayName}</span>
            <span className="text-xs text-muted">{timeAgo(comment.createdAt)}</span>
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed text-foreground/90">{comment.content}</p>
        </div>
      </div>
    </div>
  );
}
