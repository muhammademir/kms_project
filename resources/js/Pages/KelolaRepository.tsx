import { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { FolderOpen, Plus, Pencil, Trash2 } from "lucide-react";
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

interface Kategori {
  id: number;
  nama: string;
  kode: string | null;
  dokumens_count: number;
  created_at: string;
}

interface KelolaRepositoryProps {
  kategoris: Kategori[];
}

KelolaRepository.layout = (page: React.ReactNode) => <AppLayout children={page} />;

export default function KelolaRepository({ kategoris }: KelolaRepositoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Kategori | null>(null);
  const [deleteData, setDeleteData] = useState<{id: number, nama: string} | null>(null);

  const form = useForm({
    nama: '',
    kode: '',
  });
  
  const deleteForm = useForm();

  const handleOpenAdd = () => {
    setEditing(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (kat: Kategori) => {
    setEditing(kat);
    form.setData({
      nama: kat.nama,
      kode: kat.kode || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      form.put(`/kategori/${editing.id}`, {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
        }
      });
    } else {
      form.post('/kategori', {
        onSuccess: () => {
          setIsDialogOpen(false);
          form.reset();
        }
      });
    }
  };

  const handleDelete = (id: number, nama: string) => {
    setDeleteData({ id, nama });
  };

  const confirmDelete = () => {
    if (deleteData) {
      deleteForm.delete(`/kategori/${deleteData.id}`, {
        onSuccess: () => setDeleteData(null)
      });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f1923]">Kelola Kategori</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manajemen kategori untuk klasifikasi dokumen knowledge.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-[#1a2744] hover:bg-[#0f1923]">
          <Plus className="w-4 h-4 mr-2" /> Kategori Baru
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
                <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Nama Kategori</th>
                <th className="text-center px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Dokumen</th>
                <th className="text-left px-4 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Ditambahkan</th>
                <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {kategoris.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Belum ada data kategori.</td>
                </tr>
              ) : (
                kategoris.map((kat, i) => (
                  <motion.tr
                    key={kat.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                          <FolderOpen className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#0f1923]">{kat.nama}</p>
                          <p className="text-xs font-mono text-slate-400">Kode: {kat.kode || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {kat.dokumens_count}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs hidden sm:table-cell">
                      {kat.created_at}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(kat)} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(kat.id, kat.nama)} className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8">
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
              <DialogTitle>{editing ? 'Edit Kategori' : 'Tambah Kategori'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Kategori</Label>
                <Input
                  id="nama"
                  value={form.data.nama}
                  onChange={(e) => form.setData('nama', e.target.value)}
                  placeholder="Misal: Laporan Kegiatan"
                  required
                />
                {form.errors.nama && <p className="text-xs text-red-500">{form.errors.nama}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="kode">Kode Kategori (Opsional)</Label>
                <Input
                  id="kode"
                  value={form.data.kode}
                  onChange={(e) => form.setData('kode', e.target.value)}
                  placeholder="Misal: LAP"
                />
                <p className="text-[10px] text-slate-500">Kode singkatan untuk penomoran dokumen (Maks 10 karakter).</p>
                {form.errors.kode && <p className="text-xs text-red-500">{form.errors.kode}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button type="submit" disabled={form.processing} className="bg-[#1a2744] hover:bg-[#0f1923]">
                {editing ? 'Simpan Perubahan' : 'Tambahkan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteData} onOpenChange={(open) => !open && setDeleteData(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Yakin ingin menghapus kategori "{deleteData?.nama}"? Tindakan ini tidak dapat dibatalkan.
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
