<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function index()
    {
        return Inertia::render('KelolaRepository', [
            'kategoris' => Kategori::withCount('dokumens')->orderBy('nama')->get()
                ->map(fn ($k) => [
                    'id'            => $k->id,
                    'nama'          => $k->nama,
                    'kode'          => $k->kode,
                    'dokumens_count'=> $k->dokumens_count,
                    'created_at'    => $k->created_at?->format('d M Y'),
                ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:100|unique:kategoris,nama',
            'kode' => 'nullable|string|max:10|unique:kategoris,kode',
        ]);

        Kategori::create($request->only('nama', 'kode'));

        return back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, Kategori $kategori)
    {
        $request->validate([
            'nama' => 'required|string|max:100|unique:kategoris,nama,' . $kategori->id,
            'kode' => 'nullable|string|max:10|unique:kategoris,kode,' . $kategori->id,
        ]);

        $kategori->update($request->only('nama', 'kode'));

        return back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(Kategori $kategori)
    {
        if ($kategori->dokumens()->exists()) {
            return back()->with('error', 'Kategori tidak dapat dihapus karena masih digunakan oleh dokumen.');
        }

        $kategori->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }
}
