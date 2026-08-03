import AppLayout from "@/Layouts/AppLayout";
import { BarChart3, FileText, Download, TrendingUp, PieChart, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface LaporanProps {
  ringkasan: {
    total_terbit: number;
    total_menunggu: number;
    total_revisi: number;
    total_draft: number;
    total_validasi: number;
  };
  perKategori: {
    kategori: string;
    total: number;
  }[];
  perBulan: {
    bulan: string; // YYYY-MM
    total: number;
  }[];
}

Laporan.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default function Laporan({ ringkasan, perKategori, perBulan }: LaporanProps) {
  const totalSeluruh = ringkasan.total_terbit + ringkasan.total_menunggu + ringkasan.total_revisi;

  // Format YYYY-MM to readable month (e.g., 2026-08 -> Agustus 2026)
  const formatMonth = (str: string) => {
    const [y, m] = str.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1);
    return date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1923]">Laporan Knowledge Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Ringkasan eksekutif kinerja pengelolaan knowledge base institusi.
          </p>
        </div>
        <div className="flex gap-2">
          <a 
            href="/laporan/export-excel" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all h-9 px-4 py-2 border border-blue-200 text-blue-700 hover:bg-blue-50 bg-white"
          >
            <Download className="w-4 h-4 mr-2" /> Excel (.xlsx)
          </a>
          <a 
            href="/laporan/export-pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all h-9 px-4 py-2 bg-[#1a2744] hover:bg-[#0f1923] text-white"
          >
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3 text-slate-500">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Total Volume</h3>
          </div>
          <p className="text-3xl font-bold text-[#0f1923]">{totalSeluruh}</p>
          <p className="text-xs text-slate-500 mt-1">Seluruh dokumen masuk</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3 text-slate-500">
            <BarChart3 className="w-5 h-5 text-teal-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Telah Terbit</h3>
          </div>
          <p className="text-3xl font-bold text-teal-700">{ringkasan.total_terbit}</p>
          <p className="text-xs text-slate-500 mt-1">Siap dirujuk & dipublikasikan</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3 text-slate-500">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Dalam Proses</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-amber-700">{ringkasan.total_menunggu}</p>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {ringkasan.total_draft} Draft • {ringkasan.total_validasi} Validasi
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3 text-slate-500">
            <PieChart className="w-5 h-5 text-red-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Revisi</h3>
          </div>
          <p className="text-3xl font-bold text-red-700">{ringkasan.total_revisi}</p>
          <p className="text-xs text-slate-500 mt-1">Perlu perbaikan panitia</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi Kategori */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-50">
            <h3 className="text-sm font-bold text-[#0f1923] uppercase tracking-wide">Distribusi per Kategori</h3>
          </div>
          <div className="p-6">
            {perKategori.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">Belum ada dokumen terbit.</p>
            ) : (
              <div className="space-y-4">
                {perKategori.map((k, idx) => {
                  const percentage = Math.round((k.total / ringkasan.total_terbit) * 100) || 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-slate-700">{k.kategori}</span>
                        <span className="text-slate-500">{k.total} dokumen ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-[#1a2744] h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Tren Pertumbuhan */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-slate-50">
            <h3 className="text-sm font-bold text-[#0f1923] uppercase tracking-wide">Produksi Knowledge per Bulan</h3>
          </div>
          <div className="p-6">
            {perBulan.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">Data tren belum tersedia.</p>
            ) : (
              <div className="space-y-0">
                {perBulan.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                    <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-medium text-slate-700 text-sm flex-1">{formatMonth(b.bulan)}</span>
                    <span className="font-bold text-[#1a2744] bg-slate-100 px-3 py-1 rounded text-xs">
                      +{b.total}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
