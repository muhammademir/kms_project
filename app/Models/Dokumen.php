<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dokumen extends Model
{
    protected $fillable = [
        'kategori_id',
        'uploader_id',
        'created_by',
        'nomor_dokumen',
        'judul',
        'deskripsi',
        'file_path',
        'jenis',
        'status',
        'catatan_revisi',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    /**
     * Status display labels dan warna
     */
    public static array $statusLabels = [
        'menunggu_validasi' => 'Draft',
        'menunggu_review'   => 'Validasi',
        'revisi'            => 'Revisi',
        'dipublikasikan'    => 'Terbit',
    ];

    public static array $statusColors = [
        'menunggu_validasi' => 'slate',
        'menunggu_review'   => 'amber',
        'revisi'            => 'red',
        'dipublikasikan'    => 'teal',
    ];

    public function getStatusLabelAttribute(): string
    {
        return self::$statusLabels[$this->status] ?? $this->status;
    }

    public function getStatusColorAttribute(): string
    {
        return self::$statusColors[$this->status] ?? 'slate';
    }

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Kategori::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(LogAktivitas::class);
    }

    public function ulasans(): HasMany
    {
        return $this->hasMany(Ulasan::class);
    }
}
