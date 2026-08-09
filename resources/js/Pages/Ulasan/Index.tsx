import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { FileText, MessageSquare, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function UlasanIndex({ dokumens }: any) {
    const [selectedDokumen, setSelectedDokumen] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        kategori: 'Relevansi',
        komentar: '',
    });

    const openModal = (dokumen: any) => {
        setSelectedDokumen(dokumen);
        setData({ rating: 5, kategori: 'Relevansi', komentar: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDokumen(null);
        reset();
    };

    const submitReview = (e: any) => {
        e.preventDefault();
        post(`/ulasan-dokumen/${selectedDokumen.id}`, {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AppLayout>
            <Head title="Ulasan Dokumen" />

            <div className="max-w-5xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Ulasan Dokumen</h1>
                    <p className="text-slate-500 mt-1">Beri ulasan pada dokumen terbit yang telah digunakan</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-4 py-3">Judul Dokumen</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Status Ulasan</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {dokumens.map((dokumen: any) => (
                                    <tr key={dokumen.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-slate-900 line-clamp-1">
                                                    {dokumen.judul}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{dokumen.kategori ?? '-'}</td>
                                        <td className="px-4 py-3">
                                            {dokumen.has_reviewed ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                                    Sudah diulas
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10">
                                                    Belum diulas
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {!dokumen.has_reviewed ? (
                                                <button
                                                    onClick={() => openModal(dokumen)}
                                                    className="inline-flex items-center justify-center rounded-lg bg-[#e9b84a] px-3 py-1.5 text-sm font-semibold text-[#0f1923] hover:bg-[#d6a537] transition-colors"
                                                >
                                                    <MessageSquare className="w-4 h-4 mr-1.5" />
                                                    Beri Ulasan
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-400 cursor-not-allowed"
                                                >
                                                    Telah Diulas
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {dokumens.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                            Belum ada dokumen terbit yang bisa diulas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Form Ulasan */}
            <AnimatePresence>
                {isModalOpen && selectedDokumen && (
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
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900">Form Ulasan</h2>
                                    <p className="text-sm text-slate-500 line-clamp-1">{selectedDokumen.judul}</p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={submitReview} className="p-6 overflow-y-auto space-y-5">
                                {/* Rating Stars */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Rating Dokumen
                                    </label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                onClick={() => setData('rating', star)}
                                                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e9b84a] rounded"
                                            >
                                                <Star
                                                    className={cn(
                                                        "w-8 h-8 transition-colors",
                                                        star <= data.rating ? "fill-[#e9b84a] text-[#e9b84a]" : "text-slate-200 fill-slate-200"
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {errors.rating && <p className="text-sm text-red-500 mt-1">{errors.rating}</p>}
                                </div>

                                {/* Kategori */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Kategori Masukan
                                    </label>
                                    <select
                                        value={data.kategori}
                                        onChange={(e) => setData('kategori', e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#e9b84a] focus:outline-none focus:ring-1 focus:ring-[#e9b84a]"
                                    >
                                        <option value="Relevansi">Relevansi</option>
                                        <option value="Kejelasan Langkah">Kejelasan Langkah</option>
                                        <option value="Kesesuaian Pelaksanaan">Kesesuaian Pelaksanaan</option>
                                        <option value="Format / Desain">Format / Desain</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                    {errors.kategori && <p className="text-sm text-red-500 mt-1">{errors.kategori}</p>}
                                </div>

                                {/* Komentar */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Komentar / Masukan
                                    </label>
                                    <textarea
                                        value={data.komentar}
                                        onChange={(e) => setData('komentar', e.target.value)}
                                        placeholder="Tulis komentar atau masukan terkait dokumen ini..."
                                        rows={4}
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#e9b84a] focus:outline-none focus:ring-1 focus:ring-[#e9b84a] placeholder:text-slate-400"
                                    />
                                    {errors.komentar && <p className="text-sm text-red-500 mt-1">{errors.komentar}</p>}
                                </div>
                            </form>

                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={submitReview}
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#0f1923] rounded-lg hover:bg-[#1a2744] transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Mengirim...' : 'Kirim Ulasan'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
