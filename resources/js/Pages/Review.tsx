import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import FaseBadge from "@/components/FaseBadge";
import LinkBadgeList from "@/components/LinkBadgeList";
import { FileText, CheckCircle2, XCircle, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ReviewProps {
  dokumens: {
    id: number;
    nomor_dokumen: string | null;
    judul: string;
    deskripsi: string | null;
    jenis: string | null;
    kategori: string;
    uploader: string;
    status: string;
    file_path: string | null;
    file_name: string | null;
    links: { id: number; url: string; platform: string }[];
    created_at: string;
  }[];
}

Review.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default function Review({ dokumens }: ReviewProps) {
  const [revisiDoc, setRevisiDoc] = useState<number | null>(null);
  const [approveDoc, setApproveDoc] = useState<number | null>(null);
  
  const approveForm = useForm();
  const revisiForm = useForm({ catatan: '' });

  const handleApprove = (id: number) => {
    setApproveDoc(id);
  };

  const confirmApprove = () => {
    if (approveDoc) {
      approveForm.post(`/review/${approveDoc}/setujui`, {
        onSuccess: () => setApproveDoc(null)
      });
    }
  };

  const handleRevisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (revisiDoc) {
      revisiForm.post(`/review/${revisiDoc}/revisi`, {
        onSuccess: () => {
          setRevisiDoc(null);
          revisiForm.reset();
        }
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1923]">Review Dokumen</h1>
        <p className="text-slate-500 text-sm mt-1">
          Antrean dokumen yang telah divalidasi dan berada pada fase <FaseBadge status="menunggu_review" size="sm" className="mx-1" />
          Periksa dan setujui untuk mempublikasikan (Terbit).
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
      >
        {dokumens.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-slate-700 font-semibold text-lg">Tidak Ada Antrean Review</h3>
            <p className="text-slate-500 text-sm mt-1">
              Semua dokumen telah selesai direview.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 min-w-[300px]">Dokumen</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-48">Pengunggah</th>
                  <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-32 hidden sm:table-cell">Tanggal</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 w-48">Aksi</th>
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
                          </div>
                          {doc.deskripsi && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{doc.deskripsi}</p>
                          )}
                          {/* Links compact */}
                          <LinkBadgeList links={doc.links} compact />
                          {/* File download */}
                          {doc.file_path && (
                            <a
                              href={`/dokumen/${doc.id}/download`}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 mt-3 hover:underline"
                            >
                              <Download className="w-3.5 h-3.5" /> Unduh File
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top pt-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#1a2744] flex items-center justify-center text-white font-bold text-[10px]">
                          {doc.uploader.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-slate-700 text-xs font-medium">{doc.uploader}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top pt-5 text-slate-500 text-xs hidden sm:table-cell whitespace-nowrap">
                      {doc.created_at}
                    </td>
                    <td className="px-6 py-4 align-top pt-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                          onClick={() => setRevisiDoc(doc.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1.5" /> Revisi
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-8 bg-[#1a2744] hover:bg-[#0f1923]"
                          onClick={() => handleApprove(doc.id)}
                          disabled={approveForm.processing}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Publikasikan
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <Dialog open={revisiDoc !== null} onOpenChange={(open) => !open && setRevisiDoc(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleRevisi}>
            <DialogHeader>
              <DialogTitle>Kembalikan untuk Revisi</DialogTitle>
              <DialogDescription>
                Berikan catatan perbaikan yang harus dilakukan oleh panitia sebelum dokumen dapat dipublikasikan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="catatan">Catatan Revisi</Label>
                <textarea
                  id="catatan"
                  value={revisiForm.data.catatan}
                  onChange={(e) => revisiForm.setData('catatan', e.target.value)}
                  placeholder="Misal: Data lampiran tidak lengkap..."
                  className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 min-h-[100px] resize-none"
                  required
                />
                {revisiForm.errors.catatan && <p className="text-xs text-red-500">{revisiForm.errors.catatan}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRevisiDoc(null)}>Batal</Button>
              <Button type="submit" variant="destructive" disabled={revisiForm.processing}>Kirim Revisi</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={approveDoc !== null} onOpenChange={(open) => !open && setApproveDoc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Publikasikan Dokumen?</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin mempublikasikan dokumen ini? Dokumen akan berpindah ke fase Terbit dan dapat dilihat oleh Pimpinan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} className="bg-[#1a2744] hover:bg-[#0f1923] text-white">
              {approveForm.processing ? 'Memproses...' : 'Publikasikan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
