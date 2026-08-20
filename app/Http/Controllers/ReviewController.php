<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\LogAktivitas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function index()
    {
        $dokumens = Dokumen::where('status', 'menunggu_review')
            ->with('uploader:id,name', 'kategori:id,nama', 'links')
            ->latest()
            ->get()
            ->map(fn ($d) => [
                'id'           => $d->id,
                'nomor_dokumen'=> $d->nomor_dokumen,
                'judul'        => $d->judul,
                'deskripsi'    => $d->deskripsi,
                'jenis'        => $d->jenis,
                'kategori'     => $d->kategori?->nama,
                'uploader'     => $d->uploader?->name,
                'status'       => $d->status,
                'status_label' => $d->status_label,
                'status_color' => $d->status_color,
                'file_path'    => $d->file_path,
                'file_name'    => $d->file_name,
                'links'        => $d->links->map(fn ($l) => [
                    'id'       => $l->id,
                    'url'      => $l->url,
                    'platform' => $l->platform,
                ]),
                'created_at'   => $d->created_at?->format('d M Y'),
            ]);

        return Inertia::render('Review', compact('dokumens'));
    }

    public function setujui(Dokumen $dokumen)
    {
        $dokumen->update([
            'status'       => 'dipublikasikan',
            'published_at' => now(),
        ]);

        LogAktivitas::create([
            'dokumen_id' => $dokumen->id,
            'user_id'    => auth()->id(),
            'aksi'       => 'review_disetujui',
        ]);

        return back()->with('success', 'Dokumen berhasil dipublikasikan ke repository.');
    }

    public function revisi(Request $request, Dokumen $dokumen)
    {
        $request->validate(['catatan' => 'required|string']);

        $dokumen->update([
            'status'         => 'revisi',
            'catatan_revisi' => $request->catatan,
        ]);

        LogAktivitas::create([
            'dokumen_id' => $dokumen->id,
            'user_id'    => auth()->id(),
            'aksi'       => 'review_revisi',
            'catatan'    => $request->catatan,
        ]);

        return back()->with('success', 'Dokumen dikembalikan untuk revisi.');
    }
}
