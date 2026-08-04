import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Database, Search, Shield, Users } from 'lucide-react';
import { useState } from 'react';

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
      <div className="flex-1 flex items-center justify-center bg-[#f7f8fa] relative overflow-hidden px-6 py-12">
        {/* Decorative background blobs for glassmorphism */}
        <div className="absolute top-[-5%] left-[-5%] w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile brand */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded bg-[#e9b84a] flex items-center justify-center font-bold text-[#0f1923] text-xs">KM</div>
              <span className="font-bold text-[#0f1923] text-lg">SEAQIS</span>
            </div>
            <p className="text-slate-500 text-sm">Knowledge Management System</p>
          </div>

          <div className="bg-white/40 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 sm:p-10 border border-white/60">
            <div className="flex justify-center mb-6">
              <img src="/images/LogoSeaqis.jpeg" alt="Logo SEAQIS" className="h-28 w-auto object-contain mix-blend-multiply" />
            </div>
            <h2 className="text-2xl font-bold text-[#0f1923] mb-1 text-center">Selamat Datang</h2>
            <p className="text-slate-500 text-sm mb-7 text-center">
              Silahkan Masukan Username dan Password untuk Login.
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
                  className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744] focus:border-transparent placeholder:text-slate-400 transition shadow-sm backdrop-blur-sm"
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
                    className="w-full bg-white/60 border border-white/80 rounded-xl px-4 py-3 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1a2744] focus:border-transparent placeholder:text-slate-400 transition shadow-sm backdrop-blur-sm"
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
                className="w-full bg-[#0f1923] text-white font-semibold rounded-xl py-3.5 text-sm hover:bg-[#1a2744] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-4 shadow-lg"
              >
                {processing ? 'Masuk...' : 'Masuk'}
              </button>
            </form>

          </div>
        </motion.div>
      </div>
    </div>
  );
}