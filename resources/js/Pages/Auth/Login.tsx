import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const SECI_BADGES = [
  { label: 'Socialization',   color: 'bg-slate-700 text-slate-200' },
  { label: 'Externalization', color: 'bg-slate-700 text-slate-200' },
  { label: 'Combination',     color: 'bg-slate-700 text-slate-200' },
  { label: 'Internalization', color: 'bg-slate-700 text-slate-200' },
];

const FASE_LEGEND = [
  { label: 'Draft',    sublabel: 'Menunggu Validasi', dot: 'bg-slate-400' },
  { label: 'Validasi', sublabel: 'Menunggu Review',   dot: 'bg-amber-400' },
  { label: 'Revisi',   sublabel: 'Perlu Diperbaiki',  dot: 'bg-red-500' },
  { label: 'Terbit',   sublabel: 'Dipublikasikan',    dot: 'bg-teal-400' },
];

const DEMO_ACCOUNTS = [
  { label: 'Panitia',     cred: 'panitia / panitia123' },
  { label: 'Admin',       cred: 'admin / admin123' },
  { label: 'Divisi IDE',  cred: 'divisiide / divisiide123' },
  { label: 'Pimpinan',    cred: 'pimpinan / pimpinan123' },
];

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    username: '',
    password: '',
  });

  const [showPass, setShowPass] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post('/login');
  }

  return (
    <div className="min-h-screen flex font-sans">

      {/* Left — dark hero panel */}
      <div className="hidden lg:flex flex-col justify-between w-[50%] bg-[#0f1923] p-10 xl:p-14">

        {/* Brand */}
        <div>
          <p className="text-[#e9b84a] text-[11px] font-bold uppercase tracking-[0.2em]">
            SEAQIS · Divisi ICT, Data &amp; Evaluation
          </p>
        </div>

        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight">
            Pengetahuan berpindah fase — dari catatan mentah jadi rujukan yang mengkristal.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Setiap kegiatan menghasilkan pengetahuan tacit &amp; explicit. Sistem ini melacak pengetahuan itu berubah fase — dari draft yang masih menguap, ke bentuk yang solid dan siap dirujuk kembali.
          </p>

          {/* SECI badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            {SECI_BADGES.map((b) => (
              <span key={b.label} className={`text-xs px-3 py-1.5 rounded border border-white/10 font-medium ${b.color}`}>
                {b.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Fase legend */}
        <div>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-3 font-semibold">Fase Dokumen</p>
          <div className="grid grid-cols-2 gap-2">
            {FASE_LEGEND.map((f) => (
              <div key={f.label} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${f.dot}`} />
                <div>
                  <span className="text-slate-300 text-xs font-semibold">{f.label}</span>
                  <span className="text-slate-500 text-[10px] ml-1.5">{f.sublabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center bg-[#f7f8fa] px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile brand */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded bg-[#e9b84a] flex items-center justify-center font-bold text-[#0f1923] text-xs">KM</div>
              <span className="font-bold text-[#0f1923] text-lg">SEAQIS</span>
            </div>
            <p className="text-slate-500 text-sm">Knowledge Management System</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-[#0f1923] mb-1">Masuk ke sistem</h2>
            <p className="text-slate-500 text-sm mb-7">
              Gunakan akun sesuai peran Anda pada alur pengelolaan knowledge.
            </p>

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744] focus:border-transparent placeholder:text-slate-300 transition"
                  required
                  autoFocus
                />
                {errors.username && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744] focus:border-transparent placeholder:text-slate-300 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-[#0f1923] text-white font-semibold rounded-lg py-2.5 text-sm hover:bg-[#1a2744] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {processing ? 'Masuk...' : 'Masuk'}
              </button>
            </form>

            {/* Demo accounts */}
            <div className="mt-7 pt-6 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-3">Akun demo</p>
              <div className="space-y-1.5">
                {DEMO_ACCOUNTS.map((a) => (
                  <div key={a.label} className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span className="text-slate-700 font-semibold not-mono font-sans w-20">{a.label}</span>
                    <span>—</span>
                    <span>{a.cred}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}