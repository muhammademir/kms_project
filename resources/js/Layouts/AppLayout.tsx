import { PropsWithChildren, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Toaster, toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckCircle,
  FolderOpen,
  BookOpen,
  Users,
  BarChart3,
  Upload,
  FileText,
  Eye,
  LogOut,
  Menu,
  X,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_BY_ROLE: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  panitia: [
    { label: 'Dashboard',       href: '/dashboard',      icon: LayoutDashboard },
    { label: 'Upload Dokumen',  href: '/upload',         icon: Upload },
    { label: 'Status Dokumen',  href: '/status-dokumen', icon: FileText },
    { label: 'Ulasan Dokumen',  href: '/ulasan-dokumen', icon: MessageSquare },
  ],
  admin: [
    { label: 'Dashboard',         href: '/dashboard',        icon: LayoutDashboard },
    { label: 'Validasi Dokumen',  href: '/validasi',         icon: CheckCircle },
    { label: 'Kelola Repository', href: '/kelola-repository', icon: FolderOpen },
    { label: 'Kelola Pengguna',   href: '/kelola-pengguna',  icon: Users },
  ],
  divisi_ide: [
    { label: 'Dashboard',             href: '/dashboard',           icon: LayoutDashboard },
    { label: 'Review Dokumen',        href: '/review',              icon: Eye },
    { label: 'Knowledge Repository',  href: '/repository',          icon: BookOpen },
    { label: 'Ulasan & Umpan Balik',  href: '/ulasan-umpan-balik',  icon: MessageSquare },
  ],
  pimpinan: [
    { label: 'Dashboard',            href: '/dashboard',  icon: LayoutDashboard },
    { label: 'Knowledge Repository', href: '/repository', icon: BookOpen },
    { label: 'Laporan KM',           href: '/laporan',    icon: BarChart3 },
  ],
};

const ROLE_DISPLAY: Record<string, string> = {
  panitia:    'Panitia',
  admin:      'Administrator',
  divisi_ide: 'Divisi IDE',
  pimpinan:   'Pimpinan',
};

const DIVISI_BY_ROLE: Record<string, string> = {
  panitia:    'Unit Kegiatan',
  admin:      'Administrator Sistem',
  divisi_ide: 'Divisi ICT, Data & Evaluation',
  pimpinan:   'Pimpinan SEAQIS',
};

export default function AppLayout({ children }: PropsWithChildren) {
  const { auth, flash } = usePage().props as any;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success);
    }
    if (flash?.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const role      = auth?.user?.role ?? 'panitia';
  const navItems  = NAV_BY_ROLE[role] ?? [];
  const roleName  = ROLE_DISPLAY[role] ?? role;
  const divisi    = DIVISI_BY_ROLE[role] ?? '';
  const initials  = auth?.user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U';
  const pathname  = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <Toaster position="top-right" richColors />

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : undefined }}
        className={cn(
          'fixed lg:sticky top-0 h-screen w-[260px] bg-[#0f1923] text-slate-300 flex flex-col z-40',
          'transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo / Brand */}
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e9b84a] flex items-center justify-center font-bold text-[#0f1923] text-sm shrink-0">
              KM
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-tight">SEAQIS</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider truncate">{divisi}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group',
                  isActive
                    ? 'bg-[#1c3050] text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-[#e9b84a]' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-slate-500" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/5">
          <Link
            href="/logout"
            method="post"
            as="button"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-white/5 hover:text-red-400 transition-all group"
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-red-400 transition-colors" />
            <span>Keluar</span>
          </Link>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20 shadow-sm">
          <button
            className="lg:hidden p-1.5 rounded text-slate-600 hover:bg-slate-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#e9b84a] text-[#0f1923] px-2.5 py-1 rounded">
              {roleName}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#1a2744] flex items-center justify-center text-white font-bold text-xs">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1 p-5 lg:p-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}