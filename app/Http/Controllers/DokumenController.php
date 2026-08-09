<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DokumenController extends Controller
{
    /**
     * Status Dokumen milik panitia yang sedang login.
     */
    public function index(Request $request)
    {
        $dokumens = Dokumen::where('uploader_id', $request->user()->id)
            ->with('kategori:id,nama')
            ->latest()
            ->get()
            ->map(fn ($d) => [
                'id'             => $d->id,
                'judul'          => $d->judul,
                'nomor_dokumen'  => $d->nomor_dokumen,
                'kategori'       => $d->kategori?->nama,
                'jenis'          => $d->jenis,
                'status'         => $d->status,
                'status_label'   => $d->status_label,
                'status_color'   => $d->status_color,
                'catatan_revisi' => $d->catatan_revisi,
                'created_at'     => $d->created_at?->format('d M Y'),
            ]);

        return Inertia::render('StatusDokumen', compact('dokumens'));
    }

    /**
     * Form upload dokumen baru.
     */
    public function create()
    {
        return Inertia::render('Upload', [
            'kategoris' => Kategori::select('id', 'nama')->orderBy('nama')->get(),
        ]);
    }

    /**
     * Simpan dokumen yang baru diunggah.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul'       => 'required|string|max:255',
            'deskripsi'   => 'nullable|string',
            'kategori_id' => 'required|exists:kategoris,id',
            'jenis'       => 'nullable|string|max:100',
            'file'        => 'required|file|mimes:pdf,doc,docx,xls,xlsx|max:10240',
        ]);

        $path = $request->file('file')->store('dokumen', 'public');

        // Generate nomor dokumen otomatis
        $count = Dokumen::count() + 1;
        $nomor = 'DOK-' . str_pad($count, 4, '0', STR_PAD_LEFT);

        Dokumen::create([
            ...$validated,
            'file_path'     => $path,
            'uploader_id'   => $request->user()->id,
            'created_by'    => $request->user()->id,
            'nomor_dokumen' => $nomor,
            'status'        => 'menunggu_validasi',
        ]);

        return redirect()->route('status-dokumen')->with('success', 'Dokumen berhasil diunggah.');
    }

    /**
     * Upload ulang file revisi dari panitia.
     */
    public function reupload(Request $request, Dokumen $dokumen)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx|mimetypes:application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|max:10240',
        ]);

        if ($dokumen->uploader_id !== auth()->id()) {
            abort(403);
        }

        $path = $request->file('file')->store('dokumen', 'public');

        $dokumen->update([
            'file_path' => $path,
            'status' => 'menunggu_validasi', // Rollback ke draft/validasi awal
            'catatan_revisi' => null,
        ]);

        \App\Models\LogAktivitas::create([
            'dokumen_id' => $dokumen->id,
            'user_id' => auth()->id(),
            'aksi' => 'unggah_revisi',
            'keterangan' => 'Panitia mengunggah ulang dokumen hasil revisi.',
        ]);

        return back()->with('success', 'Dokumen hasil revisi berhasil diunggah.');
    }
}
