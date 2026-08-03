import { cn } from '@/lib/utils';

export type FaseStatus = 'menunggu_validasi' | 'menunggu_review' | 'revisi' | 'dipublikasikan';

interface FaseBadgeProps {
  status: FaseStatus | string;
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

const CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  menunggu_validasi: {
    label: 'Draft',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  menunggu_review: {
    label: 'Validasi',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  revisi: {
    label: 'Revisi',
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
  },
  dipublikasikan: {
    label: 'Terbit',
    dot: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
  },
};

export default function FaseBadge({ status, label, size = 'md', showDot = true, className }: FaseBadgeProps) {
  const cfg = CONFIG[status] ?? {
    label: label ?? status,
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const displayLabel = label ?? cfg.label;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold tracking-wide uppercase',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
        cfg.badge,
        className
      )}
    >
      {showDot && <span className={cn('rounded-full shrink-0', size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2', cfg.dot)} />}
      {displayLabel}
    </span>
  );
}
