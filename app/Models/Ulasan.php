<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ulasan extends Model
{
    protected $fillable = [
        'dokumen_id',
        'user_id',
        'rating',
        'kategori',
        'komentar',
    ];

    public function dokumen(): BelongsTo
    {
        return $this->belongsTo(Dokumen::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
