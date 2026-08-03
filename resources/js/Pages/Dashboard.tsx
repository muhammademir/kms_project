import AppLayout from '@/Layouts/AppLayout';
import FaseBadge from '@/components/FaseBadge';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, RotateCcw, BookOpen, Clock, ArrowRight } from 'lucide-react';

interface DashboardProps {
  stats: {
    draft: number;
    validasi: number;
    revisi: number;
    terbit: number;
  };
  recent: {
    id: number;
    judul: string;
    uploader: string;
    kategori: string;
    status: string;
    status_label: string;
    status_color: string;
    created_at: string;
  }[];
  role: string;
}

const STAT_CARDS = (stats: DashboardProps['stats']) => [
  {
    label: 'Draft',
    sublabel: 'Menunggu Validasi',
    value: stats.draft,
    status: 'menunggu_validasi',
    icon: FileText,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
  },
  {
    label: 'Validasi',
    sublabel: 'Menunggu Review',
    value: stats.validasi,
    status: 'menunggu_review',
    icon: Clock,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    label: 'Revisi',
    sublabel: 'Perlu Diperbaiki',
    value: stats.revisi,
    status: 'revisi',
    icon: RotateCcw,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
  {
    label: 'Terbit',
    sublabel: 'Dipublikasikan',
    value: stats.terbit,
    status: 'dipublikasikan',
    icon: BookOpen,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

Dashboard.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default function Dashboard({ stats, recent, role }: DashboardProps) {
  const { auth } = usePage().props as any;

  return (
    <div className="space-y-8">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f1923]">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Selamat datang kembali, <span className="font-semibold text-slate-700">{auth.user.name}</span>.
          Berikut ringkasan knowledge di sistem.
        </p>
      </div>

      {/* Stat cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {STAT_CARDS(stats).map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={item}
              className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
                <FaseBadge status={card.status} size="sm" showDot />
              </div>
              <p className="text-3xl font-bold text-[#0f1923]">{card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.sublabel}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Recent documents */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h2 className="text-sm font-bold text-[#0f1923] uppercase tracking-wide">Dokumen Terbaru</h2>
          {(role === 'admin' || role === 'divisi_ide') && (
            <Link
              href="/repository"
              className="flex items-center gap-1 text-xs text-[#1a2744] font-medium hover:underline"
            >
              Lihat Repository <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            Belum ada dokumen dalam sistem.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="text-left px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Judul</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Diunggah Oleh</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Fase</th>
                  <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((doc, i) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + i * 0.04 }}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-[#0f1923] text-sm leading-tight truncate max-w-[280px]">{doc.judul}</p>
                      {doc.kategori && (
                        <p className="text-xs text-slate-400 mt-0.5">{doc.kategori}</p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-xs hidden md:table-cell">{doc.uploader}</td>
                    <td className="px-4 py-3.5">
                      <FaseBadge status={doc.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs hidden lg:table-cell whitespace-nowrap">{doc.created_at}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
