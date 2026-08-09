<?php

namespace App\Http\Controllers;

use App\Http\Controllers\DokumenController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\RepositoryController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UlasanController;
use App\Http\Controllers\UlasanIdeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ValidasiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Auth
Route::get('/login', [AuthController::class, 'create'])->name('login');
Route::post('/login', [AuthController::class, 'store'])->name('login.store');

// Redirect root ke dashboard
Route::get('/', fn () => redirect()->route('login'));

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    // Dashboard — semua role
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $role = $user->getRoleNames()->first();

        // Statistik per status
        $stats = [
            'draft'    => \App\Models\Dokumen::where('status', 'menunggu_validasi')->count(),
            'validasi' => \App\Models\Dokumen::where('status', 'menunggu_review')->count(),
            'revisi'   => \App\Models\Dokumen::where('status', 'revisi')->count(),
            'terbit'   => \App\Models\Dokumen::where('status', 'dipublikasikan')->count(),
        ];

        // Dokumen terbaru (semua status)
        $recent = \App\Models\Dokumen::with('uploader:id,name', 'kategori:id,nama')
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($d) => [
                'id'           => $d->id,
                'judul'        => $d->judul,
                'uploader'     => $d->uploader?->name,
                'kategori'     => $d->kategori?->nama,
                'status'       => $d->status,
                'status_label' => $d->status_label,
                'status_color' => $d->status_color,
                'created_at'   => $d->created_at?->format('d M Y'),
            ]);

        return Inertia::render('Dashboard', compact('stats', 'recent', 'role'));
    })->name('dashboard');

    // Repository — semua role
    Route::get('/repository', [RepositoryController::class, 'index'])->name('repository');
    Route::get('/repository/{dokumen}', [RepositoryController::class, 'show'])->name('repository.show');
});

// Panitia routes
Route::middleware(['auth', 'role:panitia'])->group(function () {
    Route::get('/upload', [DokumenController::class, 'create'])->name('upload');
    Route::post('/upload', [DokumenController::class, 'store'])->name('upload.store');
    Route::get('/status-dokumen', [DokumenController::class, 'index'])->name('status-dokumen');
    Route::post('/status-dokumen/{dokumen}/reupload', [DokumenController::class, 'reupload'])->name('status-dokumen.reupload');
    
    Route::get('/ulasan-dokumen', [UlasanController::class, 'index'])->name('ulasan-dokumen');
    Route::post('/ulasan-dokumen/{dokumen}', [UlasanController::class, 'store'])->name('ulasan-dokumen.store');
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/validasi', [ValidasiController::class, 'index'])->name('validasi');
    Route::post('/validasi/{dokumen}/setujui', [ValidasiController::class, 'setujui'])->name('validasi.setujui');
    Route::post('/validasi/{dokumen}/revisi', [ValidasiController::class, 'revisi'])->name('validasi.revisi');

    Route::get('/kelola-repository', [KategoriController::class, 'index'])->name('kelola-repository');
    Route::post('/kategori', [KategoriController::class, 'store'])->name('kategori.store');
    Route::put('/kategori/{kategori}', [KategoriController::class, 'update'])->name('kategori.update');
    Route::delete('/kategori/{kategori}', [KategoriController::class, 'destroy'])->name('kategori.destroy');

    Route::get('/kelola-pengguna', [UserController::class, 'index'])->name('kelola-pengguna');
    Route::post('/pengguna', [UserController::class, 'store'])->name('pengguna.store');
    Route::put('/pengguna/{user}', [UserController::class, 'update'])->name('pengguna.update');
    Route::delete('/pengguna/{user}', [UserController::class, 'destroy'])->name('pengguna.destroy');
});

// Divisi IDE routes
Route::middleware(['auth', 'role:divisi_ide'])->group(function () {
    Route::get('/review', [ReviewController::class, 'index'])->name('review');
    Route::post('/review/{dokumen}/setujui', [ReviewController::class, 'setujui'])->name('review.setujui');
    Route::post('/review/{dokumen}/revisi', [ReviewController::class, 'revisi'])->name('review.revisi');

    Route::get('/ulasan-umpan-balik', [UlasanIdeController::class, 'index'])->name('ulasan-umpan-balik');
    Route::post('/ulasan-umpan-balik/{dokumen}/sintesis', [UlasanIdeController::class, 'sintesis'])->name('ulasan-umpan-balik.sintesis');
});

// Pimpinan routes
Route::middleware(['auth', 'role:pimpinan'])->group(function () {
    Route::get('/laporan', [LaporanController::class, 'index'])->name('laporan');
    Route::get('/laporan/export-pdf', [LaporanController::class, 'exportPdf'])->name('laporan.pdf');
    Route::get('/laporan/export-excel', [LaporanController::class, 'exportExcel'])->name('laporan.excel');
});
