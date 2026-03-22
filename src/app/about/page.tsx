import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About AniTalk',
  description: 'AniTalk is a spoiler-free anime episode discussion platform where fans can talk about every episode without fear of spoilers.',
};

export default function AboutPage() {
  return (
    <div className="pb-20 md:pb-0">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-purple/10 px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-accent-purple">About Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
            We&apos;re building the home for{' '}
            <span className="gradient-text">anime discussions</span>
          </h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            No more getting spoiled scrolling through Twitter. No more avoiding Reddit after a new episode drops. 
            AniTalk is the safe space for anime fans to discuss every episode.
          </p>
        </div>

        {/* Mission */}
        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span> Our Mission
            </h2>
            <div className="rounded-xl bg-surface border border-border p-6 space-y-4">
              <p className="text-sm leading-relaxed text-muted">
                Every anime fan knows the pain. You miss one episode and suddenly your timeline is full of spoilers. 
                Or you want to discuss an amazing scene but can&apos;t find anyone who&apos;s watching at the same pace.
              </p>
              <p className="text-sm leading-relaxed text-muted">
                AniTalk solves this by organizing discussions episode-by-episode with built-in spoiler protection. 
                Set your progress, and you&apos;ll only see discussions for episodes you&apos;ve already watched.
              </p>
              <p className="text-sm leading-relaxed text-muted">
                Our goal is to create the best place on the internet to discuss anime — thoughtfully, passionately, 
                and without the fear of having the next plot twist ruined.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span> What Makes Us Different
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-surface border border-border p-5">
                <h3 className="text-sm font-semibold mb-2 text-accent-purple">Spoiler Protection</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Built from the ground up with spoiler prevention. Your progress determines what you see.
                </p>
              </div>
              <div className="rounded-xl bg-surface border border-border p-5">
                <h3 className="text-sm font-semibold mb-2 text-accent-purple">Episode-by-Episode</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Every episode gets its own discussion space. No mixing up arcs or seasons.
                </p>
              </div>
              <div className="rounded-xl bg-surface border border-border p-5">
                <h3 className="text-sm font-semibold mb-2 text-accent-purple">Quick Reactions</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Was it peak fiction or mid? React instantly and see what the community thinks.
                </p>
              </div>
              <div className="rounded-xl bg-surface border border-border p-5">
                <h3 className="text-sm font-semibold mb-2 text-accent-purple">No Noise</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Clean, focused discussions without memes, karma farming, or off-topic posts.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🚀</span> Roadmap
            </h2>
            <div className="rounded-xl bg-surface border border-border p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500 text-xs">✓</span>
                  <div>
                    <p className="text-sm font-medium">Episode Discussions</p>
                    <p className="text-xs text-muted">Spoiler-free, episode-by-episode discussions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500 text-xs">✓</span>
                  <div>
                    <p className="text-sm font-medium">Quick Reactions</p>
                    <p className="text-xs text-muted">Rate episodes with emoji reactions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-purple/10 text-accent-purple text-xs font-bold">→</span>
                  <div>
                    <p className="text-sm font-medium">User Accounts & Profiles</p>
                    <p className="text-xs text-muted">Track your anime list and discussion history</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-hover text-muted text-xs">○</span>
                  <div>
                    <p className="text-sm font-medium">Notifications</p>
                    <p className="text-xs text-muted">Get notified when new episodes air and when there are replies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-hover text-muted text-xs">○</span>
                  <div>
                    <p className="text-sm font-medium">Community Features</p>
                    <p className="text-xs text-muted">Follow users, upvote comments, earn reputation</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted mb-4">Ready to join the community?</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-8 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-accent-purple/25"
          >
            Create Free Account
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
