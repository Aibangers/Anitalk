interface StreamingLinksProps {
  streamingEpisodes?: { title: string; url: string; site: string }[];
}

const streamingServices = [
  {
    name: 'Crunchyroll',
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    borderColor: 'border-orange-500/30',
    bgHover: 'hover:bg-orange-500/10',
    url: 'https://crunchyroll.com',
  },
  {
    name: 'Netflix',
    color: 'bg-red-600',
    textColor: 'text-red-500',
    borderColor: 'border-red-500/30',
    bgHover: 'hover:bg-red-500/10',
    url: 'https://netflix.com',
  },
  {
    name: 'Hulu',
    color: 'bg-green-500',
    textColor: 'text-green-500',
    borderColor: 'border-green-500/30',
    bgHover: 'hover:bg-green-500/10',
    url: 'https://hulu.com',
  },
  {
    name: 'HIDIVE',
    color: 'bg-blue-600',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    bgHover: 'hover:bg-blue-500/10',
    url: 'https://hidive.com',
  },
];

export default function StreamingLinks({ streamingEpisodes }: StreamingLinksProps) {
  // Try to match streaming episodes from AniList, fall back to placeholders
  const getServiceUrl = (serviceName: string) => {
    if (streamingEpisodes) {
      const match = streamingEpisodes.find((ep) =>
        ep.site.toLowerCase().includes(serviceName.toLowerCase())
      );
      if (match) return match.url;
    }
    return null;
  };

  const availableServices = streamingServices.map((service) => ({
    ...service,
    actualUrl: getServiceUrl(service.name),
  }));

  return (
    <div className="rounded-xl bg-surface border border-border p-5">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <svg className="h-4 w-4 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
        </svg>
        Watch On
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {availableServices.map((service) => (
          <a
            key={service.name}
            href={service.actualUrl || service.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 rounded-lg border ${service.borderColor} px-3 py-2.5 text-sm font-medium ${service.textColor} ${service.bgHover} transition-colors`}
          >
            <span className={`h-2 w-2 rounded-full ${service.color}`} />
            {service.name}
          </a>
        ))}
      </div>
    </div>
  );
}
