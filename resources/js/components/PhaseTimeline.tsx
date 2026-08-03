import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

export type FaseStep = {
  key: string;
  label: string;
  sublabel?: string;
};

const ALL_STEPS: FaseStep[] = [
  { key: 'menunggu_validasi', label: 'Draft',    sublabel: 'Diunggah' },
  { key: 'menunggu_review',   label: 'Validasi', sublabel: 'Divalidasi Admin' },
  { key: 'dipublikasikan',    label: 'Terbit',   sublabel: 'Dipublikasikan' },
];

// Urutan status untuk menentukan step selesai
const STATUS_ORDER: Record<string, number> = {
  menunggu_validasi: 0,
  menunggu_review:   1,
  dipublikasikan:    2,
  revisi:            1, // Revisi terjadi setelah step 1 (validasi)
};

interface PhaseTimelineProps {
  status: string;
  className?: string;
}

export default function PhaseTimeline({ status, className }: PhaseTimelineProps) {
  const currentOrder = STATUS_ORDER[status] ?? 0;
  const isRevisi = status === 'revisi';

  return (
    <div className={cn('flex items-start gap-0', className)}>
      {ALL_STEPS.map((step, i) => {
        const stepOrder = STATUS_ORDER[step.key];
        const isDone = currentOrder > stepOrder || (step.key === 'dipublikasikan' && status === 'dipublikasikan');
        const isCurrent = step.key === status || (isRevisi && i === 1);
        const isLast = i === ALL_STEPS.length - 1;

        return (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                isDone
                  ? 'bg-[#1a2744] border-[#1a2744] text-white'
                  : isCurrent && isRevisi
                  ? 'bg-red-500 border-red-500 text-white'
                  : isCurrent
                  ? 'bg-[#1a2744] border-[#1a2744] text-white'
                  : 'bg-white border-slate-200 text-slate-300'
              )}>
                {isDone || (isCurrent && !isRevisi) ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={cn(
                  'text-xs font-semibold',
                  isDone || isCurrent ? 'text-[#1a2744]' : 'text-slate-400'
                )}>
                  {step.label}
                </p>
                {step.sublabel && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{step.sublabel}</p>
                )}
                {isRevisi && i === 1 && (
                  <p className="text-[10px] text-red-500 mt-0.5 font-medium">Perlu Revisi</p>
                )}
              </div>
            </div>
            {!isLast && (
              <div className={cn(
                'flex-1 h-0.5 mx-2 mt-[-16px]',
                currentOrder > i ? 'bg-[#1a2744]' : 'bg-slate-200'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
