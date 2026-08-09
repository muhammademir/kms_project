<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\Kategori;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use OpenSpout\Writer\XLSX\Writer;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Common\Entity\Cell;

class LaporanController extends Controller
{
    public function index()
    {
        $ringkasan = [
            'total_terbit'    => Dokumen::where('status', 'dipublikasikan')->count(),
            'total_menunggu'  => Dokumen::whereIn('status', ['menunggu_validasi', 'menunggu_review'])->count(),
            'total_revisi'    => Dokumen::where('status', 'revisi')->count(),
            'total_draft'     => Dokumen::where('status', 'menunggu_validasi')->count(),
            'total_validasi'  => Dokumen::where('status', 'menunggu_review')->count(),
        ];

        $perKategori = Dokumen::selectRaw('kategori_id, count(*) as total')
            ->where('status', 'dipublikasikan')
            ->groupBy('kategori_id')
            ->with('kategori:id,nama')
            ->get()
            ->map(fn ($d) => [
                'kategori' => $d->kategori?->nama ?? 'Tanpa Kategori',
                'total'    => $d->total,
            ]);

        $perBulan = Dokumen::selectRaw("DATE_FORMAT(published_at, '%Y-%m') as bulan, count(*) as total")
            ->where('status', 'dipublikasikan')
            ->whereNotNull('published_at')
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get()
            ->map(fn ($d) => [
                'bulan' => $d->bulan,
                'total' => $d->total,
            ]);

        $insightUlasan = [
            'avg_rating_all' => \App\Models\Ulasan::avg('rating'),
            'dokumen_bermasalah' => Dokumen::where('status', 'dipublikasikan')
                ->whereHas('ulasans')
                ->withCount('ulasans')
                ->withAvg('ulasans', 'rating')
                ->having('ulasans_avg_rating', '<', 3.0)
                ->orHaving('ulasans_count', '>=', 5) // Simplified for insight, just highlighting highly reviewed or low rated
                ->orderBy('ulasans_avg_rating', 'asc')
                ->take(5)
                ->get()
                ->map(fn($d) => [
                    'judul' => $d->judul,
                    'rating' => round($d->ulasans_avg_rating, 2),
                    'ulasan_count' => $d->ulasans_count,
                ])
        ];

        return Inertia::render('Laporan', compact('ringkasan', 'perKategori', 'perBulan', 'insightUlasan'));
    }

    public function exportPdf()
    {
        $dokumens = Dokumen::where('status', 'dipublikasikan')
            ->with('kategori:id,nama', 'uploader:id,name')
            ->latest('published_at')
            ->get();

        $ringkasan = [
            'total_terbit'   => $dokumens->count(),
            'total_menunggu' => Dokumen::whereIn('status', ['menunggu_validasi', 'menunggu_review'])->count(),
            'total_revisi'   => Dokumen::where('status', 'revisi')->count(),
        ];

        $pdf = Pdf::loadView('exports.laporan-pdf', compact('dokumens', 'ringkasan'))
            ->setPaper('a4', 'landscape');

        return $pdf->download('laporan-km-' . now()->format('Y-m-d') . '.pdf');
    }

    public function exportExcel()
    {
        $dokumens = Dokumen::where('status', 'dipublikasikan')
            ->with('kategori:id,nama', 'uploader:id,name')
            ->latest('published_at')
            ->get();

        $filePath = storage_path('app/temp/laporan-km-' . now()->format('Y-m-d') . '.xlsx');

        // Pastikan direktori ada
        if (!file_exists(dirname($filePath))) {
            mkdir(dirname($filePath), 0755, true);
        }

        $writer = new Writer();
        $writer->openToFile($filePath);

        // Header row
        $writer->addRow(Row::fromValues([
            'No', 'Nomor Dokumen', 'Judul', 'Kategori', 'Jenis', 'Diunggah Oleh', 'Tanggal Terbit'
        ]));

        foreach ($dokumens as $i => $d) {
            $writer->addRow(Row::fromValues([
                $i + 1,
                $d->nomor_dokumen ?? '-',
                $d->judul,
                $d->kategori?->nama ?? '-',
                $d->jenis ?? '-',
                $d->uploader?->name ?? '-',
                $d->published_at?->format('d M Y') ?? '-',
            ]));
        }

        $writer->close();

        return response()->download($filePath)->deleteFileAfterSend(true);
    }
}
