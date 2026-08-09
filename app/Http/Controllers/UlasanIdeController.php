<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\LogAktivitas;
use App\Models\Ulasan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class UlasanIdeController extends Controller
{
    public function index()
    {
        // 1. Dapatkan semua ulasan terbaru (untuk daftar komentar terbaru)
        $latestReviews = Ulasan::with('dokumen:id,judul', 'user:id,name')
            ->latest()
            ->take(10)
            ->get();

        // 2. Kalkulasi Dokumen Kandidat Revisi
        // Kandidat jika rata-rata rating < 3.0 atau jumlah ulasan >= 5
        // (Sesuai dengan mockups dan aturan yang lebih sederhana:
        // misal: rating rendah / komentar menumpuk)
        $candidates = Dokumen::where('status', 'dipublikasikan')
            ->whereHas('ulasans')
            ->with(['ulasans' => function($q) {
                $q->latest();
            }, 'ulasans.user:id,name'])
            ->withCount('ulasans')
            ->get()
            ->map(function ($dokumen) {
                $avgRating = $dokumen->ulasans->avg('rating');
                $kategoriCounts = $dokumen->ulasans->countBy('kategori');
                
                // Cari kategori dominan
                $kategoriDominan = $kategoriCounts->sortDesc()->keys()->first();
                $kategoriDominanCount = $kategoriCounts->sortDesc()->first();

                $isCandidate = false;
                if ($avgRating < 3.0 || $kategoriDominanCount >= 5) {
                    $isCandidate = true;
                }

                return [
                    'id' => $dokumen->id,
                    'judul' => $dokumen->judul,
                    'avg_rating' => round($avgRating, 2),
                    'ulasan_count' => $dokumen->ulasans_count,
                    'kategori_dominan' => $kategoriDominan,
                    'kategori_dominan_count' => $kategoriDominanCount,
                    'is_candidate' => $isCandidate,
                    'ulasans' => $dokumen->ulasans->map(fn($u) => [
                        'id' => $u->id,
                        'rating' => $u->rating,
                        'kategori' => $u->kategori,
                        'komentar' => $u->komentar,
                        'user_name' => $u->user?->name,
                        'created_at' => $u->created_at->format('d M Y')
                    ])
                ];
            })
            ->filter(fn ($d) => $d['is_candidate'])
            ->values();

        // 3. Rekap Statistik (Dashboard atas)
        $totalRating = Ulasan::avg('rating');
        $newReviews = Ulasan::where('created_at', '>=', now()->subDays(7))->count();
        $needRevisionCount = $candidates->count();

        return Inertia::render('UlasanIde/Index', [
            'stats' => [
                'avg_rating' => round($totalRating ?? 0, 1),
                'new_reviews' => $newReviews,
                'need_revision' => $needRevisionCount,
            ],
            'latest_reviews' => $latestReviews->map(fn($r) => [
                'id' => $r->id,
                'dokumen' => $r->dokumen?->judul,
                'rating' => $r->rating,
                'komentar' => $r->komentar,
                'user' => $r->user?->name,
                'created_at' => $r->created_at->diffForHumans()
            ]),
            'candidates' => $candidates
        ]);
    }

    public function sintesis(Request $request, Dokumen $dokumen)
    {
        $request->validate([
            'kategori_masalah' => 'required|array',
            'catatan_revisi' => 'required|string',
        ]);

        $kategoriMasalah = implode(', ', $request->kategori_masalah);
        
        $dokumen->update([
            'status' => 'revisi',
            'catatan_revisi' => "Disintesis dari kategori: {$kategoriMasalah}.\n\n" . $request->catatan_revisi,
        ]);

        LogAktivitas::create([
            'dokumen_id' => $dokumen->id,
            'user_id' => auth()->id(),
            'aksi' => 'sintesis_ulasan',
            'keterangan' => 'Divisi IDE mengirim dokumen untuk direvisi berdasarkan ulasan.',
        ]);

        return back()->with('success', 'Catatan revisi berhasil dikirim ke Panitia.');
    }
}
