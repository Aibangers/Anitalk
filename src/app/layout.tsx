import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} light`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
