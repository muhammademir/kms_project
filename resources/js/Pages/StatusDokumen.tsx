import AppLayout from "@/Layouts/AppLayout";
import FaseBadge from "@/components/FaseBadge";
import { FileText, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useForm } from "@inertiajs/react";
import React from "react";

import { toast } from 'sonner';

const ReuploadForm = ({ dokumenId }: { dokumenId: number }) => {
  const { data, setData, post, processing, errors, progress } = useForm({
    file: null as File | null,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (data.file && data.file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran maksimal dokumen adalah 10 MB.');
      return;
    }

    post(`/status-dokumen/${dokumenId}/reupload`, {
      forceFormData: true,
      onSuccess: () => setData('file', null)
    });
  };

  return (
    <form onSubmit={submit} className="mt-4 border border-dashed border-slate-300 rounded-lg p-4 bg-slate-50/50 flex flex-col items-start gap-3">
      <p className="text-xs font-semibold text-slate-700">Unggah Dokumen Hasil Revisi</p>
      <input
        type="file"
        onChange={e => setData('file', e.target.files ? e.target.files[0] : null)}
        className="block w-full text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[#0f1923] file:text-white hover:file:bg-[#1a2744] cursor-pointer"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
      />
      {errors.file && <p className="text-red-500 text-xs">{errors.file}</p>}
      <button
        type="submit"
        disabled={!data.file || processing}
        className="bg-[#e9b84a] text-[#0f1923] px-4 py-2 rounded text-xs font-bold disabled:opacity-50 hover:bg-[#d6a537] transition-colors"
      >
        {processing ? 'Mengunggah...' : 'Kirim Revisi'}
      </button>
      {progress && <progress value={progress.percentage} max="100" className="w-full h-1 mt-1 rounded overflow-hidden" />}
    </form>
  );
};

interface StatusDokumenProps {
  dokumens: {
    id: number;
    judul: string;
    nomor_dokumen: string | null;
    kategori: string;
    jenis: string | null;
    status: string;
    catatan_revisi: string | null;
    created_at: string;
  }[];
}

StatusDokumen.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default function StatusDokumen({ dokumens }: StatusDokumenProps) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1923]">Status Dokumen</h1>
          <p className="text-slate-500 text-sm mt-1">
            Pantau status fase dokumen yang telah Anda unggah ke sistem.
          </p>
        </div>
        <Link 
          href="/upload" 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#0f1923] text-primary-foreground hover:bg-[#0f1923]/90 h-10 px-4 py-2"
        >
          Upload Baru
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
      >
        {dokumens.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-700 font-semibold text-lg">Belum Ada Dokumen</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">
              Anda belum mengunggah dokumen apapun. Dokumen yang Anda unggah akan muncul di sini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Info Dokumen</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-40">Fase Saat Ini</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-32 hidden sm:table-cell">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dokumens.map((doc, i) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#0f1923] text-sm">{doc.judul}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {doc.nomor_dokumen && (
                              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                {doc.nomor_dokumen}
                              </span>
                            )}
                            <span className="text-xs text-slate-500">{doc.kategori}</span>
                            {doc.jenis && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="text-xs text-slate-500">{doc.jenis}</span>
                              </>
                            )}
                          </div>
                          
                          {/* Tampilkan catatan revisi jika ada dan statusnya revisi */}
                          {doc.status === 'revisi' && doc.catatan_revisi && (
                            <div className="mt-3 p-3 bg-red-50/50 border border-red-100 rounded-md flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <div className="text-xs text-red-800 leading-relaxed">
                                <span className="font-semibold block mb-0.5">Catatan Revisi:</span>
                                <div className="whitespace-pre-wrap">{doc.catatan_revisi}</div>
                              </div>
                            </div>
                          )}

                          {doc.status === 'revisi' && (
                            <ReuploadForm dokumenId={doc.id} />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top pt-5">
                      <FaseBadge status={doc.status} />
                    </td>
                    <td className="px-6 py-4 align-top pt-5 text-slate-500 text-xs hidden sm:table-cell whitespace-nowrap">
                      {doc.created_at}
                    </td>
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
