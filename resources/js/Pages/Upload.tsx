import { useForm } from "@inertiajs/react";
import AppLayout from "@/Layouts/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, File, AlertCircle, X, CheckCircle2,
  Plus, Link2, Globe, Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef } from "react";
import { toast } from 'sonner';

interface UploadProps {
  kategoris: { id: number; nama: string }[];
}

Upload.layout = (page: React.ReactNode) => <AppLayout children={page} />;

// ── Platform helpers ──────────────────────────────────────────
const ALLOWED_DOMAINS = [
  'youtube.com', 'youtu.be',
  'tiktok.com',
  'instagram.com',
  'facebook.com', 'fb.com', 'fb.watch',
  'twitter.com', 'x.com',
  'linkedin.com',
  'drive.google.com', 'docs.google.com',
];

function detectPlatform(url: string): string {
  try {
    const host = new URL(url).hostname.replace('www.', '');
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube';
    if (host.includes('tiktok.com'))    return 'tiktok';
    if (host.includes('instagram.com')) return 'instagram';
    if (host.includes('facebook.com') || host.includes('fb.com')) return 'facebook';
    if (host.includes('twitter.com') || host.includes('x.com'))   return 'twitter';
    if (host.includes('linkedin.com'))  return 'linkedin';
    if (host.includes('drive.google.com')) return 'google_drive';
    if (host.includes('docs.google.com')) return 'google_docs';
    return 'website';
  } catch {
    return 'website';
  }
}

function isValidUrl(url: string): boolean {
  if (!url) return true; // empty = OK (opsional)
  if (!/^https?:\/\//i.test(url)) return false;
  return true;
}

function isAllowedDomain(url: string): boolean {
  if (!url) return true;
  try {
    const host = new URL(url).hostname.replace('www.', '');
    return ALLOWED_DOMAINS.some(d => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  const cls = "w-4 h-4";
  switch (platform) {
    case 'youtube':     return <Play className={cls + " text-red-500"} />;
    case 'instagram':   return <Globe className={cls + " text-pink-500"} />;
    case 'tiktok':      return <span className={cls + " text-[10px] font-black leading-none text-black"}>TK</span>;
    case 'facebook':    return <span className={cls + " text-[11px] font-black leading-none text-blue-600"}>f</span>;
    case 'twitter':     return <span className={cls + " text-[11px] font-black leading-none text-sky-500"}>𝕏</span>;
    case 'linkedin':    return <span className={cls + " text-[10px] font-black leading-none text-blue-700"}>in</span>;
    case 'google_drive':return <span className={cls + " text-[8px] font-bold leading-none text-green-600"}>GD</span>;
    case 'google_docs': return <span className={cls + " text-[8px] font-bold leading-none text-blue-500"}>Doc</span>;
    default:            return <Globe className={cls + " text-slate-400"} />;
  }
};

export default function Upload({ kategoris }: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, setData, post, progress, errors, processing } = useForm<{
    judul: string;
    deskripsi: string;
    kategori_id: string;
    jenis: string;
    files: File[];
    links: string[];
  }>({
    judul: '',
    deskripsi: '',
    kategori_id: '',
    jenis: '',
    files: [],
    links: [''],
  });

  // ── File handling ─────────────────────────────────────────────
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? []);
    if (incoming.length === 0) return;

    const oversized = incoming.filter(f => f.size > 10 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error(`${oversized.length} file melebihi batas 10 MB dan tidak ditambahkan.`);
    }

    const valid = incoming.filter(f => f.size <= 10 * 1024 * 1024);
    const existing = data.files;
    const merged = [
      ...existing,
      ...valid.filter(v => !existing.some(ex => ex.name === v.name && ex.size === v.size)),
    ];
    setData('files', merged);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setData('files', data.files.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const synth = { target: { files: e.dataTransfer.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleFilesChange(synth);
  };

  // ── Link handling ─────────────────────────────────────────────
  const setLink = (idx: number, value: string) => {
    const next = [...data.links];
    next[idx] = value;
    setData('links', next);
  };

  const addLink = () => {
    setData('links', [...data.links, '']);
  };

  const removeLink = (idx: number) => {
    const next = data.links.filter((_, i) => i !== idx);
    setData('links', next.length > 0 ? next : ['']);
  };

  const filledLinks = data.links.filter(l => l.trim() !== '');

  // ── Validation helpers ────────────────────────────────────────
  const getLinkError = (url: string): string | null => {
    if (!url) return null;
    if (!isValidUrl(url)) return 'URL harus diawali https:// atau http://';
    if (!isAllowedDomain(url)) return `Domain tidak dikenal. Gunakan: ${ALLOWED_DOMAINS.slice(0, 5).join(', ')}, dll.`;
    return null;
  };

  const hasValidLinks = filledLinks.length > 0 && filledLinks.every(l => !getLinkError(l));
  const hasFiles = data.files.length > 0;

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasFiles && filledLinks.length === 0) {
      toast.error('Minimal satu file atau satu link referensi harus diisi.');
      return;
    }

    // Validate links client-side
    for (const url of filledLinks) {
      const err = getLinkError(url);
      if (err) {
        toast.error(`Link tidak valid: ${err}`);
        return;
      }
    }

    // Send only non-empty links
    setData('links', filledLinks);
    post('/upload');
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const totalSize = data.files.reduce((acc, f) => acc + f.size, 0);

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

          {/* ── Metadata ── */}
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
                  className="flex h-10 w-full mt-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="flex w-full mt-1.5 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 min-h-[144px] resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="border-t border-slate-100" />

          {/* ── File upload ── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label>
                File Dokumen
                <span className="ml-1.5 text-[11px] font-normal text-slate-400">(opsional jika ada link referensi)</span>
              </Label>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 cursor-pointer group hover:border-[#1a2744] hover:bg-slate-100 transition-colors"
            >
              <input
                ref={inputRef}
                type="file"
                onChange={handleFilesChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
                multiple
              />
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400 group-hover:text-[#1a2744] transition-colors mb-3">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {hasFiles ? 'Tambah lebih banyak file' : 'Pilih file atau tarik ke sini'}
              </p>
              <p className="text-xs text-slate-500 mt-1">Maks. 10 MB per file (PDF, DOCX, XLSX, PNG, JPG, JPEG, WEBP)</p>
            </div>

            <AnimatePresence>
              {hasFiles && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 space-y-2"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-medium text-slate-600">
                      {data.files.length} file dipilih &mdash; Total {formatBytes(totalSize)}
                    </span>
                    <button type="button" onClick={() => setData('files', [])} className="text-xs text-red-500 hover:text-red-700 transition-colors">
                      Hapus semua
                    </button>
                  </div>
                  {data.files.map((file, idx) => (
                    <motion.div
                      key={`${file.name}-${file.size}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-center gap-3 bg-white border border-slate-100 rounded-lg px-3 py-2.5 shadow-sm"
                    >
                      <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center text-blue-600 shrink-0">
                        <File className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {errors.files && <p className="text-xs text-red-500 mt-1.5">{errors.files}</p>}
          </div>

          {/* ── Link Referensi ── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <Label>
                  Link Referensi
                  <span className="ml-1.5 text-[11px] font-normal text-slate-400">(opsional jika ada file)</span>
                </Label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  YouTube, TikTok, Instagram, Facebook, Twitter/X, LinkedIn, Google Drive, dll.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {data.links.map((url, idx) => {
                  const platform = url ? detectPlatform(url) : null;
                  const linkErr  = getLinkError(url);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className="flex items-center gap-2">
                        {/* Platform icon */}
                        <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                          {platform ? <PlatformIcon platform={platform} /> : <Link2 className="w-3.5 h-3.5 text-slate-300" />}
                        </div>

                        <Input
                          type="url"
                          value={url}
                          onChange={(e) => setLink(idx, e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className={`flex-1 text-sm ${linkErr ? 'border-red-300 focus-visible:ring-red-300' : ''}`}
                        />

                        {/* Remove button — always show except when only 1 empty */}
                        {(data.links.length > 1 || url) && (
                          <button
                            type="button"
                            onClick={() => removeLink(idx)}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {linkErr && (
                        <p className="text-[11px] text-red-500 mt-1 ml-10">{linkErr}</p>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              <button
                type="button"
                onClick={addLink}
                className="flex items-center gap-1.5 text-xs font-medium text-[#1a2744] hover:text-[#0f1923] transition-colors mt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Link
              </button>
            </div>

            {errors.links && <p className="text-xs text-red-500 mt-1">{(errors as any).links}</p>}
          </div>

          {/* ── Validasi warning ── */}
          {!hasFiles && !hasValidLinks && (filledLinks.length > 0 || data.files.length === 0) && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Minimal satu <strong>file</strong> atau satu <strong>link referensi</strong> yang valid harus diisi sebelum bisa mengunggah.
            </p>
          )}

          {/* ── Progress bar ── */}
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
              disabled={processing || (!hasFiles && !hasValidLinks)}
              className="bg-[#0f1923] hover:bg-[#1a2744] px-8"
            >
              {processing
                ? 'Mengunggah...'
                : hasFiles
                  ? `Unggah ${data.files.length > 1 ? `${data.files.length} Dokumen` : 'Dokumen'}`
                  : 'Unggah Dokumen'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}