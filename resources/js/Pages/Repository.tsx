import AppLayout from "@/Layouts/AppLayout";
import { Search, Filter, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";

interface RepositoryProps {
  dokumens: {
    data: {
      id: number;
      nomor_dokumen: string | null;
      judul: string;
      deskripsi: string | null;
      jenis: string | null;
      kategori: string;
      kategori_kode: string | null;
      uploader: string;
      published_at: string;
    }[];
    links: any[];
  };
  kategoris: { id: number; nama: string }[];
  filters: { q?: string; kategori_id?: string };
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

Repository.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default function Repository({ dokumens, kategoris, filters }: RepositoryProps) {
  const { data, setData, get } = useForm({
    q: filters.q ?? '',
    kategori_id: filters.kategori_id ?? '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    get('/repository', { preserveState: true });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#0f1923]">Knowledge Repository</h1>
        <p className="text-slate-500 text-sm mt-1">
          Koleksi dokumen fase <span className="font-semibold text-[#1a2744]">Terbit</span> — yang sudah dipublikasikan dan siap dirujuk.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={data.q}
            onChange={(e) => setData('q', e.target.value)}
            placeholder="Cari judul atau deskripsi..."
            className="pl-9 h-11 bg-white border-slate-200"
          />
        </div>
        <div className="relative sm:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={data.kategori_id}
            onChange={(e) => {
              setData('kategori_id', e.target.value);
              // Langsung submit ketika kategori berubah
              setTimeout(() => get('/repository', { preserveState: true }), 0);
            }}
            className="flex h-11 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
          >
            <option value="">Semua Kategori</option>
            {kategoris.map(k => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>
      </form>

      {dokumens.data.length === 0 ? (
        <div className="py-24 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-slate-700 font-semibold text-lg">Tidak ada hasil</h3>
          <p className="text-slate-500 text-sm mt-1">Coba sesuaikan kata kunci atau filter pencarian Anda.</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {dokumens.data.map((doc) => (
            <motion.div key={doc.id} variants={item}>
              <Link 
                href={`/repository/${doc.id}`}
                className="group flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#1a2744]/30 transition-all p-6 relative overflow-hidden"
              >
                {/* Aksen top border hover */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#e9b84a] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono text-slate-400">
                    {doc.nomor_dokumen || `ID: ${doc.id}`}
                  </span>
                  {doc.kategori_kode && (
                    <span className="text-[10px] font-bold tracking-widest text-[#1a2744] bg-slate-100 px-2 py-1 rounded">
                      {doc.kategori_kode}
                    </span>
                  )}
                </div>

                <h3 className="text-[#0f1923] font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                  {doc.judul}
                </h3>
                
                <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                  {doc.deskripsi || "Tidak ada deskripsi."}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Terbit {doc.published_at}</span>
                  <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                    Lihat <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {dokumens.links.length > 3 && (
        <div className="flex justify-center mt-10">
          <div className="flex flex-wrap items-center gap-1">
            {dokumens.links.map((link, k) => (
              <Link
                key={k}
                href={link.url || '#'}
                className={`px-3.5 py-2 text-sm rounded-md transition-colors ${
                  link.active 
                    ? 'bg-[#0f1923] text-white font-medium' 
                    : !link.url 
                    ? 'text-slate-300 pointer-events-none' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
