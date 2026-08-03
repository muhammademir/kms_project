import AppLayout from "@/Layouts/AppLayout";
import PhaseTimeline from "@/components/PhaseTimeline";
import FaseBadge from "@/components/FaseBadge";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, FileText, Calendar, User, FolderOpen, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DokumenDetailProps {
  dokumen: {
    id: number;
    nomor_dokumen: string | null;
    judul: string;
    deskripsi: string | null;
    jenis: string | null;
    kategori: string;
    kategori_kode: string | null;
    uploader: string;
    status: string;
    status_label: string;
    file_path: string;
    published_at: string | null;
    created_at: string;
    logs: {
      aksi: string;
      catatan: string | null;
      user: string;
      tanggal: string;
    }[];
  };
}

DokumenDetail.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default function DokumenDetail({ dokumen }: DokumenDetailProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <Link 
        href="/repository" 
        className="inline-flex items-center text-sm text-slate-500 hover:text-[#1a2744] font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" /> Kembali ke Repository
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kolom Kiri - Detail Utama */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Dokumen */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              {dokumen.kategori_kode && (
                <span className="text-[10px] font-bold tracking-widest text-[#1a2744] bg-slate-100 px-2.5 py-1 rounded">
                  {dokumen.kategori_kode}
                </span>
              )}
              {dokumen.nomor_dokumen && (
                <span className="text-xs font-mono text-slate-400">
                  {dokumen.nomor_dokumen}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-[#0f1923] mb-6 leading-tight">
              {dokumen.judul}
            </h1>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-6 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Fase Saat Ini</p>
                <FaseBadge status={dokumen.status} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Tanggal Terbit</p>
                <p className="text-sm font-semibold text-slate-700">{dokumen.published_at ?? '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Pengunggah</p>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#1a2744] text-white flex items-center justify-center text-[8px] font-bold">
                    {dokumen.uploader.substring(0, 2).toUpperCase()}
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{dokumen.uploader}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stepper Timeline (Menggunakan komponen yg sesuai mockup) */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm"
          >
            <h3 className="text-sm font-bold text-[#0f1923] uppercase tracking-wide mb-8">Alur Status Dokumen</h3>
            <div className="px-4">
              <PhaseTimeline status={dokumen.status} />
            </div>
          </motion.div>

          {/* Deskripsi & Unduh */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm"
          >
            <h3 className="text-sm font-bold text-[#0f1923] uppercase tracking-wide mb-4">Deskripsi</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mb-8">
              {dokumen.deskripsi || "Tidak ada deskripsi yang ditambahkan untuk dokumen ini."}
            </p>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-slate-700 text-sm">File Dokumen</p>
                  <p className="text-xs text-slate-500">{dokumen.file_path.split('/').pop()}</p>
                </div>
              </div>
              
              <a 
                href={`/storage/${dokumen.file_path}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all h-9 px-4 py-2 bg-[#1a2744] hover:bg-[#0f1923] text-white"
              >
                <Download className="w-4 h-4 mr-2" /> Unduh Dokumen
              </a>
            </div>
          </motion.div>

        </div>

        {/* Kolom Kanan - Metadata Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#0f1923] uppercase tracking-wide mb-4 border-b border-slate-100 pb-3">Informasi Tambahan</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <FolderOpen className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Kategori</p>
                  <p className="text-sm text-slate-700 font-medium">{dokumen.kategori}</p>
                </div>
              </li>
              {dokumen.jenis && (
                <li className="flex gap-3">
                  <Tag className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Jenis Dokumen</p>
                    <p className="text-sm text-slate-700 font-medium">{dokumen.jenis}</p>
                  </div>
                </li>
              )}
              <li className="flex gap-3">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Tanggal Diunggah</p>
                  <p className="text-sm text-slate-700 font-medium">{dokumen.created_at}</p>
                </div>
              </li>
            </ul>
          </div>
          
          {dokumen.logs.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#0f1923] uppercase tracking-wide mb-4 border-b border-slate-100 pb-3">Riwayat Aktivitas</h3>
              <div className="space-y-5">
                {dokumen.logs.map((log, index) => (
                  <div key={index} className="relative pl-4 border-l-2 border-slate-100 last:border-0 pb-1">
                    <div className="absolute w-2 h-2 bg-[#1a2744] rounded-full -left-[5px] top-1.5" />
                    <p className="text-xs font-semibold text-slate-700 capitalize">
                      {log.aksi.replace('_', ' ')}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Oleh {log.user} pada {log.tanggal}</p>
                    {log.catatan && (
                      <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                        "{log.catatan}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
