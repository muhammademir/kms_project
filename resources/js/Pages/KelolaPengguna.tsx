import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Users as UsersIcon, Plus, Pencil, Trash2, KeyRound } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

interface User {
  id: number;
  name: string;
  username: string;
  role: string | null;
  created_at: string;
}

interface KelolaPenggunaProps {
  users: User[];
  roles: string[];
}

KelolaPengguna.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default function KelolaPengguna({ users, roles }: KelolaPenggunaProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [deleteData, setDeleteData] = useState<{id: number, name: string} | null>(null);

  const form = useForm({
    name: '',
    username: '',
    password: '',
    role: '',
  });
  
  const deleteForm = useForm();

  const handleOpenAdd = () => {
    setEditing(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditing(user);
    form.setData({
      name: user.name,
      username: user.username,
      password: '', // Kosongkan saat edit, hanya diisi kalau mau ubah password
      role: user.role || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      form.put(`/pengguna/${editing.id}`, {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
        }
      });
    } else {
      form.post('/pengguna', {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
        }
      });
    }
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteData({ id, name });
  };

  const confirmDelete = () => {
    if (deleteData) {
      deleteForm.delete(`/pengguna/${deleteData.id}`, {
        onSuccess: () => setDeleteData(null)
      });
    }
  };

  const getRoleLabel = (role: string | null) => {
    if (!role) return '-';
    switch (role) {
      case 'admin': return 'Administrator';
      case 'panitia': return 'Panitia';
      case 'divisi_ide': return 'Divisi IDE';
      case 'pimpinan': return 'Pimpinan';
      default: return role;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1923]">Kelola Pengguna</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manajemen akun pengguna dan hak akses sistem.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-[#1a2744] hover:bg-[#0f1923]">
          <Plus className="w-4 h-4 mr-2" /> Pengguna Baru
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Nama & Username</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Hak Akses (Role)</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Ditambahkan</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Belum ada data pengguna.</td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1a2744] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#0f1923]">{user.name}</p>
                          <p className="text-xs font-mono text-slate-400">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded bg-[#e9b84a]/20 text-[#0f1923] text-xs font-bold uppercase tracking-wider">
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs hidden sm:table-cell">
                      {user.created_at}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(user)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(user.id, user.name)} className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                  placeholder="Misal: Sari Purnamasari"
                  required
                />
                {form.errors.name && <p className="text-xs text-red-500">{form.errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={form.data.username}
                  onChange={(e) => form.setData('username', e.target.value)}
                  placeholder="Misal: saripurnamasari"
                  required
                />
                {form.errors.username && <p className="text-xs text-red-500">{form.errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Hak Akses</Label>
                <select
                  id="role"
                  value={form.data.role}
                  onChange={(e) => form.setData('role', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                  required
                >
                  <option value="" disabled>Pilih Role...</option>
                  {roles.map(r => (
                    <option key={r} value={r}>{getRoleLabel(r)}</option>
                  ))}
                </select>
                {form.errors.role && <p className="text-xs text-red-500">{form.errors.role}</p>}
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5" /> 
                  {editing ? 'Ganti Password Baru (Opsional)' : 'Password'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.data.password}
                  onChange={(e) => form.setData('password', e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required={!editing}
                />
                {form.errors.password && <p className="text-xs text-red-500">{form.errors.password}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={form.processing} className="bg-[#1a2744] hover:bg-[#0f1923]">
                {editing ? 'Simpan Perubahan' : 'Tambahkan Akun'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteData} onOpenChange={(open) => !open && setDeleteData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus pengguna "{deleteData?.name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              {deleteForm.processing ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
