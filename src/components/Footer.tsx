import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto mb-14 md:mb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <span className="text-lg font-bold tracking-tight">
                Ani<span className="gradient-text">Talk</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              The spoiler-free anime discussion platform. Talk about every episode with fans who are exactly where you are.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Browse</h3>
            <ul className="space-y-2">
              <li><Link href="/seasonal" className="text-sm text-muted hover:text-accent-purple transition-colors">Seasonal Anime</Link></li>
              <li><Link href="/" className="text-sm text-muted hover:text-accent-purple transition-colors">Trending</Link></li>
              <li><Link href="/" className="text-sm text-muted hover:text-accent-purple transition-colors">Top Rated</Link></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted hover:text-accent-purple transition-colors">About</Link></li>
              <li><Link href="/" className="text-sm text-muted hover:text-accent-purple transition-colors">Guidelines</Link></li>
              <li><Link href="/" className="text-sm text-muted hover:text-accent-purple transition-colors">Discord</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted hover:text-accent-purple transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="text-sm text-muted hover:text-accent-purple transition-colors">Terms of Service</Link></li>
              <li><Link href="/" className="text-sm text-muted hover:text-accent-purple transition-colors">DMCA</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} AniTalk. Anime data provided by{' '}
            <a href="https://anilist.co" target="_blank" rel="noopener noreferrer" className="hover:text-accent-purple transition-colors">
              AniList
            </a>.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent-purple transition-colors" aria-label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent-purple transition-colors" aria-label="Discord">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
