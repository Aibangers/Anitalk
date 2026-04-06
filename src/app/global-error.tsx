'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#0B0D13] text-white font-sans">
        <div className="text-center px-4">
          <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-gray-400 mb-6 text-sm max-w-md">
            {error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={reset}
            className="rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
