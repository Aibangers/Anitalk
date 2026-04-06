'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function SettingsPage() {
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

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="rounded-2xl bg-surface border border-border p-8">
        <p className="text-sm text-muted">
          Settings page coming soon. This is where you&apos;ll manage your account preferences, notifications, and privacy.
        </p>
      </div>
    </div>
  );
}
