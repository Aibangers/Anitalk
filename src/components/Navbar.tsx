'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/seasonal', label: 'Seasonal', icon: CalendarIcon },
  { href: '/about', label: 'About', icon: InfoIcon },
];

const mobileNavLinks = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/seasonal', label: 'Seasonal', icon: CalendarIcon },
  { href: '/#trending', label: 'Trending', icon: TrendingIcon },
  { href: '/login', label: 'Profile', icon: UserIcon },
];

interface SearchResult {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: { large: string };
  format?: string;
  status?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const username = (session?.user as Record<string, unknown>)?.username as string | undefined;
  const displayName = username || session?.user?.name || session?.user?.email || 'User';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSearchResults(data.results || []);
      setShowSearchDropdown(true);
    } catch {
      setSearchResults([]);
    }
  }, []);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSearchDropdown(false);
      setSearchQuery('');
    }
    if (e.key === 'Enter' && searchQuery.length >= 2) {
      setShowSearchDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (id: number) => {
    setShowSearchDropdown(false);
    setSearchQuery('');
    router.push(`/anime/${id}`);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        // Don't close mobile search from outside clicks on the toggle button area
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Build mobile nav links dynamically based on auth
  const currentMobileLinks = session
    ? [
        { href: '/', label: 'Home', icon: HomeIcon },
        { href: '/seasonal', label: 'Seasonal', icon: CalendarIcon },
        { href: '/#trending', label: 'Trending', icon: TrendingIcon },
        { href: '/profile', label: 'Profile', icon: UserIcon },
      ]
    : mobileNavLinks;

  return (
    <>
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 glass bg-surface/80 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <span className="text-lg font-bold tracking-tight">
                Ani<span className="gradient-text">Talk</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-accent-purple bg-accent-purple/10'
                      : 'text-muted hover:text-foreground hover:bg-surface-hover'
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-md mx-4" ref={searchRef}>
              <div className="relative w-full">
                <SearchIconSvg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true); }}
                  className="w-full h-9 rounded-lg bg-surface-hover border border-border pl-9 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50 focus:border-accent-purple transition-all"
                />
                {/* Search Results Dropdown */}
                {showSearchDropdown && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-surface border border-border shadow-xl max-h-96 overflow-y-auto z-50">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result.id)}
                        className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-surface-hover transition-colors text-left"
                      >
                        <img
                          src={result.coverImage.large}
                          alt=""
                          className="h-12 w-8 rounded object-cover shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">
                            {result.title.english || result.title.romaji}
                          </p>
                          <p className="text-xs text-muted">
                            {result.format?.replace(/_/g, ' ')} · {result.status?.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </button>
                    ))}
                    <Link
                      href={`/search?q=${encodeURIComponent(searchQuery)}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="block text-center text-xs text-accent-purple font-medium py-2 hover:bg-surface-hover transition-colors border-t border-border"
                    >
                      View all results →
                    </Link>
                  </div>
                )}
                {showSearchDropdown && searchQuery.length >= 2 && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-surface border border-border shadow-xl p-4 z-50">
                    <p className="text-sm text-muted text-center">No results found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-surface hover:bg-surface-hover border border-border transition-colors"
                aria-label="Search"
              >
                <SearchIconSvg className="h-4 w-4" />
              </button>

              <ThemeToggle />

              {status === 'loading' ? (
                <div className="hidden sm:flex h-9 w-9 items-center justify-center">
                  <div className="h-5 w-5 rounded-full border-2 border-muted border-t-accent-purple animate-spin" />
                </div>
              ) : session ? (
                /* User Avatar + Dropdown */
                <div className="relative hidden sm:block" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple to-accent-blue text-sm font-bold text-white hover:opacity-90 transition-opacity"
                    aria-label="Profile menu"
                  >
                    {avatarLetter}
                  </button>
                  {showProfileDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-surface border border-border shadow-xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-semibold truncate">{displayName}</p>
                        {session.user?.email && (
                          <p className="text-xs text-muted truncate">{session.user.email}</p>
                        )}
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors"
                        >
                          <UserIcon className="h-4 w-4 text-muted" />
                          My Profile
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-surface-hover transition-colors"
                        >
                          <SettingsIcon className="h-4 w-4 text-muted" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-border py-1">
                        <button
                          onClick={() => { setShowProfileDropdown(false); signOut(); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-surface-hover transition-colors"
                        >
                          <LogOutIcon className="h-4 w-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden sm:flex h-9 items-center px-4 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover border border-border transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="hidden sm:flex h-9 items-center px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-accent-purple to-accent-blue hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {searchOpen && (
          <div className="sm:hidden border-t border-border p-4" ref={mobileSearchRef}>
            <div className="relative">
              <SearchIconSvg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="w-full h-10 rounded-lg bg-surface-hover border border-border pl-9 pr-4 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-purple/50"
                autoFocus
              />
              {/* Mobile Search Results */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-surface border border-border shadow-xl max-h-72 overflow-y-auto z-50">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => { handleResultClick(result.id); setSearchOpen(false); }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-surface-hover transition-colors text-left"
                    >
                      <img
                        src={result.coverImage.large}
                        alt=""
                        className="h-12 w-8 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {result.title.english || result.title.romaji}
                        </p>
                        <p className="text-xs text-muted">
                          {result.format?.replace(/_/g, ' ')} · {result.status?.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass bg-surface/90 border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around h-14">
          {currentMobileLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                pathname === link.href
                  ? 'text-accent-purple'
                  : 'text-muted'
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

// --- Icon Components ---

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function SearchIconSvg({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

function TrendingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.545 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}
