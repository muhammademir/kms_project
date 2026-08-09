<?php

namespace App\Http\Controllers;

use App\Models\Dokumen;
use App\Models\Ulasan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UlasanController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Ambil semua dokumen yang terbit
        $dokumens = Dokumen::with('kategori:id,nama')
            ->where('status', 'dipublikasikan')
            ->latest()
            ->get()
            ->map(function ($dokumen) use ($user) {
                $hasReviewed = Ulasan::where('dokumen_id', $dokumen->id)
                    ->where('user_id', $user->id)
                    ->exists();

                return [
                    'id' => $dokumen->id,
                    'judul' => $dokumen->judul,
                    'kategori' => $dokumen->kategori?->nama,
                    'has_reviewed' => $hasReviewed,
                ];
            });

        return Inertia::render('Ulasan/Index', compact('dokumens'));
    }

    public function store(Request $request, Dokumen $dokumen)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'kategori' => 'required|string|max:255',
            'komentar' => 'required|string',
        ]);

        Ulasan::create([
            'dokumen_id' => $dokumen->id,
            'user_id' => auth()->id(),
            'rating' => $request->rating,
            'kategori' => $request->kategori,
            'komentar' => $request->komentar,
        ]);

        return back()->with('success', 'Ulasan berhasil dikirim.');
    }
}
