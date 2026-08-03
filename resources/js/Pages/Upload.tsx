import { useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { motion } from "framer-motion";
import { UploadCloud, File, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadProps {
  kategoris: { id: number; nama: string }[];
}

Upload.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default function Upload({ kategoris }: UploadProps) {
  const { data, setData, post, progress, errors, processing } = useForm({
    judul: '',
    deskripsi: '',
    kategori_id: '',
    jenis: '',
    file: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/upload');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1923]">Upload Dokumen</h1>
        <p className="text-slate-500 text-sm mt-1">
          Unggah knowledge atau laporan kegiatan baru ke dalam sistem. Dokumen akan masuk ke fase Draft.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 lg:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="judul">Judul Dokumen</Label>
                <Input
                  id="judul"
                  value={data.judul}
                  onChange={(e) => setData('judul', e.target.value)}
                  placeholder="Contoh: Laporan Training Guru IPA 2025"
                  className="mt-1.5"
                  required
                />
                {errors.judul && <p className="text-xs text-red-500 mt-1">{errors.judul}</p>}
              </div>

              <div>
                <Label htmlFor="kategori">Kategori</Label>
                <select
                  id="kategori"
                  value={data.kategori_id}
                  onChange={(e) => setData('kategori_id', e.target.value)}
                  className="flex h-10 w-full mt-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="" disabled>Pilih kategori dokumen...</option>
                  {kategoris.map(k => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
                {errors.kategori_id && <p className="text-xs text-red-500 mt-1">{errors.kategori_id}</p>}
              </div>

              <div>
                <Label htmlFor="jenis">Jenis Dokumen (Opsional)</Label>
                <Input
                  id="jenis"
                  value={data.jenis}
                  onChange={(e) => setData('jenis', e.target.value)}
                  placeholder="Contoh: SOP, Laporan, Modul"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="deskripsi">Deskripsi Singkat</Label>
                <textarea
                  id="deskripsi"
                  value={data.deskripsi}
                  onChange={(e) => setData('deskripsi', e.target.value)}
                  placeholder="Jelaskan isi dokumen secara singkat..."
                  className="flex w-full mt-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 min-h-[114px] resize-none"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>File Dokumen</Label>
            <div className="mt-1.5 border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 relative group">
              <input
                type="file"
                onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                required
              />
              
              {!data.file ? (
                <>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-hover:text-[#1a2744] transition-colors mb-3">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Pilih file atau tarik ke sini</p>
                  <p className="text-xs text-slate-500 mt-1">Maks. 10MB (PDF, DOCX, XLSX)</p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-3">
                    <File className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{data.file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(data.file.size / 1024 / 1024).toFixed(2)} MB — Klik untuk ganti
                  </p>
                </>
              )}
            </div>
            {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
          </div>
          
          {progress && (
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#1a2744] h-2 transition-all duration-300" 
                style={{ width: `${progress.percentage}%` }} 
              />
            </div>
          )}

          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
            <AlertCircle className="w-5 h-5 shrink-0 text-blue-600" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold block mb-0.5">Informasi Alur</span>
              Dokumen yang diunggah akan masuk ke fase Draft dan perlu persetujuan Validasi oleh Administrator sebelum diteruskan untuk Review oleh Divisi IDE.
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button 
              type="submit" 
              disabled={processing || (progress && progress.percentage === 100) ? true : false} 
              className="bg-[#0f1923] hover:bg-[#1a2744] px-8"
            >
              {processing ? 'Mengunggah...' : 'Unggah Dokumen'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}