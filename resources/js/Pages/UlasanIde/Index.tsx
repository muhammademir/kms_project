import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Star, MessageSquare, AlertCircle, FileText, CheckSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function UlasanIdeIndex({ stats, latest_reviews, candidates }: any) {
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        kategori_masalah: [] as string[],
        catatan_revisi: '',
    });

    const openModal = (candidate: any) => {
        setSelectedCandidate(candidate);
        setData({ kategori_masalah: [], catatan_revisi: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCandidate(null);
        reset();
    };

    const handleCheckboxChange = (kategori: string) => {
        const isChecked = data.kategori_masalah.includes(kategori);
        if (isChecked) {
            setData('kategori_masalah', data.kategori_masalah.filter((k) => k !== kategori));
        } else {
            setData('kategori_masalah', [...data.kategori_masalah, kategori]);
        }
    };

    const submitSintesis = (e: any) => {
        e.preventDefault();
        post(`/ulasan-umpan-balik/${selectedCandidate.id}/sintesis`, {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AppLayout>
            <Head title="Ulasan & Umpan Balik" />

            <div className="max-w-6xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Ulasan & Umpan Balik</h1>
                    <p className="text-slate-500 mt-1">Rekap ulasan dokumen untuk keperluan revisi (Combination)</p>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-2 text-slate-500">
                            <Star className="w-5 h-5 text-[#e9b84a] fill-[#e9b84a]" />
                            <span className="text-sm font-medium">Rata-rata Rating</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">
                            {stats.avg_rating} <span className="text-sm font-normal text-slate-500">dari 5.0</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-2 text-slate-500">
                            <MessageSquare className="w-5 h-5 text-blue-500" />
                            <span className="text-sm font-medium">Ulasan Baru</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">
                            {stats.new_reviews} <span className="text-sm font-normal text-slate-500">7 hari terakhir</span>
                        </div>
                    </div>
                    <div className="bg-[#fff8e6] rounded-xl p-5 border border-[#f5d996] shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-2 text-[#b08726]">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Perlu Direvisi</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900">
                            {stats.need_revision} <span className="text-sm font-normal text-[#b08726]">rating rendah / komentar menumpuk</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Kandidat Revisi (Utama) */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Kandidat Revisi</h2>
                        <p className="text-sm text-slate-500 mb-4">
                            Dokumen dengan rating rendah atau komentar yang menumpuk otomatis masuk ke sini.
                        </p>
                        
                        {candidates.length === 0 ? (
                            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 border-dashed">
                                <CheckSquare className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                                <h3 className="text-slate-900 font-medium">Semua dokumen dalam kondisi baik</h3>
                                <p className="text-slate-500 text-sm mt-1">Tidak ada dokumen yang perlu direvisi saat ini.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {candidates.map((candidate: any) => (
                                    <div key={candidate.id} className="bg-white rounded-xl p-5 border border-[#f5d996] shadow-sm border-l-4 border-l-[#e9b84a]">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">{candidate.judul}</h3>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="inline-flex items-center text-sm font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                                        <Star className="w-3.5 h-3.5 mr-1 fill-red-600" />
                                                        {candidate.avg_rating} / 5.0
                                                    </span>
                                                    <span className="text-sm text-slate-500">{candidate.ulasan_count} ulasan</span>
                                                    <span className="text-sm text-slate-500 flex items-center gap-1">
                                                        &mdash; dominan kategori <span className="font-semibold text-slate-700">"{candidate.kategori_dominan}"</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => openModal(candidate)}
                                                className="bg-[#0f1923] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a2744] transition-colors"
                                            >
                                                Susun Catatan Revisi
                                            </button>
                                        </div>
                                        
                                        {/* Tampilkan 2 komentar relevan */}
                                        <div className="mt-4 space-y-2">
                                            {candidate.ulasans.slice(0, 2).map((u: any) => (
                                                <div key={u.id} className="text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                                    <span className="font-medium text-slate-900">[{u.rating}/5] {u.user_name}:</span> "{u.komentar}"
                                                </div>
                                            ))}
                                            {candidate.ulasans.length > 2 && (
                                                <div className="text-xs text-slate-400 italic px-1">... {candidate.ulasans.length - 2} ulasan lainnya</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Komentar Terbaru */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h2 className="font-bold text-slate-900">Komentar Terbaru</h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {latest_reviews.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-500">Belum ada ulasan.</div>
                            ) : (
                                latest_reviews.map((review: any) => (
                                    <div key={review.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-semibold text-slate-900 line-clamp-1">{review.dokumen}</span>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{review.created_at}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-1.5">
                                            <Star className="w-3 h-3 text-[#e9b84a] fill-[#e9b84a]" />
                                            <span className="text-xs font-medium text-slate-700">{review.rating}/5</span>
                                            <span className="text-xs text-slate-500 mx-1">&middot;</span>
                                            <span className="text-xs text-slate-500">{review.user}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 italic line-clamp-2">"{review.komentar}"</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Sintesis Revisi */}
            <AnimatePresence>
                {isModalOpen && selectedCandidate && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
                            onClick={closeModal}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
                                <h2 className="text-lg font-semibold">Form Susun Catatan Revisi</h2>
                                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={submitSintesis} className="p-6 overflow-y-auto space-y-6 flex-1">
                                
                                <div className="mb-2">
                                    <h3 className="text-sm font-bold text-slate-700 mb-1">Dokumen: {selectedCandidate.judul}</h3>
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-sm text-indigo-900">
                                        <span className="font-semibold text-indigo-700 block mb-1">Ringkasan Ulasan (otomatis)</span>
                                        Rata-rata <strong>{selectedCandidate.avg_rating}</strong> dari <strong>{selectedCandidate.ulasan_count} ulasan</strong> — dominan kategori <strong>"{selectedCandidate.kategori_dominan}"</strong> ({selectedCandidate.kategori_dominan_count}x).
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Seluruh Ulasan Terkait</label>
                                    <div className="border border-slate-200 rounded-lg p-3 max-h-40 overflow-y-auto bg-slate-50 space-y-2 text-sm">
                                        {selectedCandidate.ulasans.map((u: any) => (
                                            <div key={u.id} className="text-slate-700">
                                                <span className="font-semibold">[{u.rating}/5] {u.user_name}:</span> "{u.komentar}"
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Kategori Masalah (pilih yang relevan)
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {['Relevansi', 'Kejelasan Langkah', 'Kesesuaian Pelaksanaan', 'Format / Desain'].map((kat) => (
                                            <label key={kat} className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="checkbox"
                                                    checked={data.kategori_masalah.includes(kat)}
                                                    onChange={() => handleCheckboxChange(kat)}
                                                    className="rounded border-slate-300 text-[#e9b84a] focus:ring-[#e9b84a] w-4 h-4"
                                                />
                                                <span className="text-sm text-slate-700">{kat}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.kategori_masalah && <p className="text-sm text-red-500 mt-1">{errors.kategori_masalah}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Catatan Revisi Tersintesis
                                    </label>
                                    <p className="text-xs text-slate-500 mb-2">
                                        Gabungkan masukan-masukan di atas menjadi satu instruksi revisi yang jelas untuk panitia (Combination E-E).
                                    </p>
                                    <textarea
                                        value={data.catatan_revisi}
                                        onChange={(e) => setData('catatan_revisi', e.target.value)}
                                        placeholder="Tuliskan catatan revisi tersintesis..."
                                        rows={6}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#e9b84a] focus:outline-none focus:ring-1 focus:ring-[#e9b84a] placeholder:text-slate-400"
                                    />
                                    {errors.catatan_revisi && <p className="text-sm text-red-500 mt-1">{errors.catatan_revisi}</p>}
                                </div>
                            </form>

                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={submitSintesis}
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#0f1923] rounded-lg hover:bg-[#1a2744] transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim ke Panitia'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </AppLayout>
    );
}
