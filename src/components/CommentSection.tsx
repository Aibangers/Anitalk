import { Comment } from '@/lib/types';
import { mockComments } from '@/lib/mockData';

interface CommentSectionProps {
  animeId: number;
  episode: number;
}

export default function CommentSection({ animeId, episode }: CommentSectionProps) {
  // Use mock data deterministically based on anime/episode
  const seed = (animeId * 100 + episode) % mockComments.length;
  const comments = [...mockComments.slice(seed), ...mockComments.slice(0, seed)].slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="rounded-xl bg-surface border border-border p-4">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple to-accent-blue text-xs font-bold text-white">
            ?
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Share your thoughts on this episode..."
              className="w-full resize-none rounded-lg bg-surface-hover border border-border p-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
              rows={3}
              disabled
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted">Sign up to join the discussion</p>
              <button
                disabled
                className="rounded-lg bg-gradient-to-r from-accent-purple to-accent-blue px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}

function CommentCard({ comment }: { comment: Comment }) {
  return (
    <div className="group rounded-xl bg-surface border border-border p-4 hover:border-border transition-colors">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-purple/10 text-sm font-bold text-accent-purple">
          {comment.avatar}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold">{comment.author}</span>
            <span className="text-xs text-muted">{comment.timestamp}</span>
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed text-foreground/90">{comment.content}</p>

          {/* Actions */}
          <div className="mt-2 flex items-center gap-4">
            <button className="flex items-center gap-1 text-xs text-muted hover:text-accent-purple transition-colors">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {comment.likes}
            </button>
            <button className="flex items-center gap-1 text-xs text-muted hover:text-accent-purple transition-colors">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              {comment.replies} replies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
