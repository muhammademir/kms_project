<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\DokumenLink;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        $request->validate([
            'judul'         => 'required|string|max:255',
            'deskripsi'     => 'nullable|string',
            'kategori_id'   => 'required|exists:kategoris,id',
            'jenis'         => 'nullable|string|max:100',
            'files'         => 'nullable|array',
            'files.*'       => 'file|mimes:pdf,doc,docx,xls,xlsx,png,jpg,jpeg,webp|max:10240',
            'links'         => 'nullable|array',
            'links.*'       => [
                'nullable',
                'url',
                'regex:/^https?:\/\//i',
                'max:2048',
            ],
        ]);

        // Wajib minimal satu: file atau link
        $hasFiles = !empty($request->file('files'));
        $hasLinks = !empty(array_filter($request->input('links', [])));

        if (!$hasFiles && !$hasLinks) {
            return back()->withErrors([
                'files' => 'Minimal satu file atau satu link referensi harus diisi.',
            ])->withInput();
        }

        $uploadedCount = 0;
        $files         = $request->file('files') ?? [];
        $links         = array_filter($request->input('links', []));

        // Jika ada file: buat satu dokumen per file
        if ($hasFiles) {
            foreach ($files as $file) {
                $path = $file->store('dokumen', 'public');

                $count = Dokumen::count() + 1;
                $nomor = 'DOK-' . str_pad($count, 4, '0', STR_PAD_LEFT);

                $dokumen = Dokumen::create([
                    'judul'         => $request->judul,
                    'deskripsi'     => $request->deskripsi,
                    'kategori_id'   => $request->kategori_id,
                    'jenis'         => $request->jenis,
                    'file_path'     => $path,
                    'file_name'     => $file->getClientOriginalName(),
                    'uploader_id'   => $request->user()->id,
                    'created_by'    => $request->user()->id,
                    'nomor_dokumen' => $nomor,
                    'status'        => 'menunggu_validasi',
                ]);

                // Attach links ke masing-masing dokumen
                foreach ($links as $url) {
                    $dokumen->links()->create([
                        'url'      => $url,
                        'platform' => DokumenLink::detectPlatform($url),
                    ]);
                }

                $uploadedCount++;
            }
        } else {
            // Hanya link, tanpa file — buat satu dokumen
            $count = Dokumen::count() + 1;
            $nomor = 'DOK-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $dokumen = Dokumen::create([
                'judul'         => $request->judul,
                'deskripsi'     => $request->deskripsi,
                'kategori_id'   => $request->kategori_id,
                'jenis'         => $request->jenis,
                'file_path'     => null,
                'file_name'     => null,
                'uploader_id'   => $request->user()->id,
                'created_by'    => $request->user()->id,
                'nomor_dokumen' => $nomor,
                'status'        => 'menunggu_validasi',
            ]);

            foreach ($links as $url) {
                $dokumen->links()->create([
                    'url'      => $url,
                    'platform' => DokumenLink::detectPlatform($url),
                ]);
            }

            $uploadedCount++;
        }

        $msg = $uploadedCount === 1
            ? 'Dokumen berhasil diunggah.'
            : "{$uploadedCount} dokumen berhasil diunggah.";

        return redirect()->route('status-dokumen')->with('success', $msg);
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

        $file = $request->file('file');
        $path = $file->store('dokumen', 'public');

        $dokumen->update([
            'file_path'     => $path,
            'file_name'     => $file->getClientOriginalName(), // nama asli file revisi
            'status'        => 'menunggu_validasi', // Rollback ke draft/validasi awal
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

    /**
     * Download dokumen — accessible untuk semua role, semua status.
     * Selalu set Content-Disposition agar nama file yang tersimpan benar.
     */
    public function download(Dokumen $dokumen)
    {
        $path = $dokumen->file_path;

        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        // Gunakan file_name asli jika ada
        if ($dokumen->file_name) {
            $fileName = $dokumen->file_name;
        } else {
            // Fallback: buat nama dari judul + ekstensi dari path
            $ext      = pathinfo($path, PATHINFO_EXTENSION);
            $slug     = preg_replace('/[^\w\-]/', '-', $dokumen->judul);
            $fileName = rtrim($slug, '-') . ($ext ? '.' . $ext : '');
        }

        $fullPath = Storage::disk('public')->path($path);
        $mimeType = Storage::disk('public')->mimeType($path);

        return response()->streamDownload(function () use ($fullPath) {
            $handle = fopen($fullPath, 'rb');
            while (!feof($handle)) {
                echo fread($handle, 8192);
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
