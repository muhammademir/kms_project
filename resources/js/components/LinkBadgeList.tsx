import { Play, Globe, ExternalLink } from "lucide-react";

interface DokumenLink {
  id: number;
  url: string;
  platform: string;
}

const PLATFORM_LABELS: Record<string, { label: string; color: string }> = {
  youtube:      { label: 'YouTube',      color: 'bg-red-50 text-red-700 border-red-100' },
  tiktok:       { label: 'TikTok',       color: 'bg-slate-900 text-white border-slate-800' },
  instagram:    { label: 'Instagram',    color: 'bg-pink-50 text-pink-700 border-pink-100' },
  facebook:     { label: 'Facebook',     color: 'bg-blue-50 text-blue-700 border-blue-100' },
  twitter:      { label: 'Twitter/X',    color: 'bg-sky-50 text-sky-700 border-sky-100' },
  linkedin:     { label: 'LinkedIn',     color: 'bg-blue-50 text-blue-800 border-blue-100' },
  google_drive: { label: 'Google Drive', color: 'bg-green-50 text-green-700 border-green-100' },
  google_docs:  { label: 'Google Docs',  color: 'bg-blue-50 text-blue-600 border-blue-100' },
  website:      { label: 'Website',      color: 'bg-slate-50 text-slate-600 border-slate-200' },
};

function PlatformIcon({ platform }: { platform: string }) {
  const cls = "w-3.5 h-3.5";
  switch (platform) {
    case 'youtube':   return <Play className={cls + " text-red-500"} />;
    case 'instagram': return <Globe className={cls + " text-pink-500"} />;
    default:          return <Globe className={cls} />;
  }
}

function truncateUrl(url: string, max = 45): string {
  try {
    const u = new URL(url);
    const display = u.hostname.replace('www.', '') + u.pathname;
    return display.length > max ? display.slice(0, max) + '…' : display;
  } catch {
    return url.length > max ? url.slice(0, max) + '…' : url;
  }
}

interface Props {
  links: DokumenLink[];
  compact?: boolean; // for Validasi/Review table
}

export default function LinkBadgeList({ links, compact = false }: Props) {
  if (!links || links.length === 0) return null;

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {links.map(link => {
          const meta = PLATFORM_LABELS[link.platform] ?? PLATFORM_LABELS.website;
          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-opacity hover:opacity-80 ${meta.color}`}
            >
              <PlatformIcon platform={link.platform} />
              {meta.label}
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {links.map(link => {
        const meta = PLATFORM_LABELS[link.platform] ?? PLATFORM_LABELS.website;
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors group"
          >
            <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border ${meta.color}`}>
              <PlatformIcon platform={link.platform} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{meta.label}</p>
              <p className="text-sm text-[#1a2744] font-medium truncate group-hover:underline">{truncateUrl(link.url)}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          </a>
        );
      })}
    </div>
  );
}
