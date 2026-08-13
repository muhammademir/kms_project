<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RepositoryController extends Controller
{
    public function index(Request $request)
    {
        $keyword    = $request->get('q', '');
        $kategoriId = $request->get('kategori_id');

        $query = Dokumen::where('status', 'dipublikasikan')
            ->with('kategori:id,nama,kode', 'uploader:id,name');

        if ($keyword) {
            $query->where(fn ($q) => $q
                ->where('judul', 'like', "%{$keyword}%")
                ->orWhere('deskripsi', 'like', "%{$keyword}%")
            );
        }

        if ($kategoriId) {
            $query->where('kategori_id', $kategoriId);
        }

        return Inertia::render('Repository', [
            'dokumens' => $query->latest('published_at')->paginate(12)->withQueryString()
                ->through(fn ($d) => [
                    'id'            => $d->id,
                    'nomor_dokumen' => $d->nomor_dokumen,
                    'judul'         => $d->judul,
                    'deskripsi'     => $d->deskripsi,
                    'jenis'         => $d->jenis,
                    'kategori'      => $d->kategori?->nama,
                    'kategori_kode' => $d->kategori?->kode,
                    'uploader'      => $d->uploader?->name,
                    'status_label'  => $d->status_label,
                    'published_at'  => $d->published_at?->format('d M Y'),
                ]),
            'kategoris' => Kategori::select('id', 'nama')->orderBy('nama')->get(),
            'filters'   => $request->only('q', 'kategori_id'),
        ]);
    }

    public function show(Dokumen $dokumen)
    {
        abort_unless($dokumen->status === 'dipublikasikan', 404);

        $dokumen->load('kategori:id,nama,kode', 'uploader:id,name', 'logs.user:id,name');

        return Inertia::render('DokumenDetail', [
            'dokumen' => [
                'id'            => $dokumen->id,
                'nomor_dokumen' => $dokumen->nomor_dokumen,
                'judul'         => $dokumen->judul,
                'deskripsi'     => $dokumen->deskripsi,
                'jenis'         => $dokumen->jenis,
                'kategori'      => $dokumen->kategori?->nama,
                'kategori_kode' => $dokumen->kategori?->kode,
                'uploader'      => $dokumen->uploader?->name,
                'status'        => $dokumen->status,
                'status_label'  => $dokumen->status_label,
                'file_path'     => $dokumen->file_path,
                'published_at'  => $dokumen->published_at?->format('d M Y'),
                'created_at'    => $dokumen->created_at?->format('d M Y'),
                'logs'          => $dokumen->logs->map(fn ($l) => [
                    'aksi'     => $l->aksi,
                    'catatan'  => $l->catatan,
                    'user'     => $l->user?->name,
                    'tanggal'  => $l->created_at?->format('d M Y'),
                ]),
            ],
        ]);
    }

    /**
     * Download file dokumen dengan header yang proper.
     * Menghindari browser "not responding" saat download .docx / file besar.
     */
    public function download(Dokumen $dokumen)
    {
        abort_unless($dokumen->status === 'dipublikasikan', 404);

        $path = $dokumen->file_path; // e.g. "dokumen/xxxx.docx"

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'File tidak ditemukan. Hubungi Mas Admin!.');
        }

        $fullPath  = Storage::disk('public')->path($path);
        $fileName  = basename($path); // nama file asli saat diupload
        $mimeType  = Storage::disk('public')->mimeType($path);

        return response()->streamDownload(function () use ($fullPath) {
            $handle = fopen($fullPath, 'rb');
            while (!feof($handle)) {
                echo fread($handle, 8192); // 8KB chunks
                flush();
            }
            fclose($handle);
        }, $fileName, [
            'Content-Type'        => $mimeType,
            'Content-Length'      => Storage::disk('public')->size($path),
            'Content-Disposition' => 'attachment; filename="' . rawurlencode($fileName) . '"',
            'Cache-Control'       => 'no-store',
        ]);
    }
}
