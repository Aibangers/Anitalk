'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="h-8 w-8 mx-auto rounded-full border-2 border-muted border-t-accent-purple animate-spin" />
      </div>
    );
  }

  if (!session) {
    redirect('/login');
  }

  const username = (session.user as Record<string, unknown>)?.username as string | undefined;
  const displayName = username || session.user?.name || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <div className="rounded-2xl bg-surface border border-border p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple to-accent-blue text-2xl font-bold text-white">
            {avatarLetter}
          </div>
          <div>
            <h1 className="text-xl font-bold">{displayName}</h1>
            {session.user?.email && (
              <p className="text-sm text-muted">{session.user.email}</p>
            )}
          </div>
        </div>
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted">
            Profile page coming soon. This is where you&apos;ll see your watch history, comments, and activity.
          </p>
        </div>
      </div>
    </div>
  );
}
