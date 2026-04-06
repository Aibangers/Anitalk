import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'AniTalk — Spoiler-Free Anime Episode Discussions',
    template: '%s | AniTalk',
  },
  description:
    'Where anime fans discuss every episode — spoiler-free. Join the conversation on the latest anime episodes with built-in spoiler protection.',
  openGraph: {
    title: 'AniTalk — Spoiler-Free Anime Episode Discussions',
    description: 'Where anime fans discuss every episode — spoiler-free.',
    url: 'https://anitalk.gg',
    siteName: 'AniTalk',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AniTalk — Spoiler-Free Anime Episode Discussions',
    description: 'Where anime fans discuss every episode — spoiler-free.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAFA' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0D13' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Inline script to set theme class before first paint — prevents flash
  const themeScript = `
    (function(){
      try {
        var t = localStorage.getItem('anitalk-theme');
        if (t === 'dark' || t === 'light') {
          document.documentElement.classList.remove('light','dark');
          document.documentElement.classList.add(t);
        }
      } catch(e){}
    })();
  `;

  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
