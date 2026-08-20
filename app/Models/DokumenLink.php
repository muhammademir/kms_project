<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DokumenLink extends Model
{
    protected $fillable = ['dokumen_id', 'url', 'platform'];

    /**
     * Deteksi platform dari URL secara otomatis.
     */
    public static function detectPlatform(string $url): string
    {
        $host = strtolower(parse_url($url, PHP_URL_HOST) ?? '');

        return match (true) {
            str_contains($host, 'youtube.com') || str_contains($host, 'youtu.be') => 'youtube',
            str_contains($host, 'tiktok.com')    => 'tiktok',
            str_contains($host, 'instagram.com') => 'instagram',
            str_contains($host, 'facebook.com') || str_contains($host, 'fb.com') => 'facebook',
            str_contains($host, 'twitter.com') || str_contains($host, 'x.com')  => 'twitter',
            str_contains($host, 'linkedin.com')  => 'linkedin',
            str_contains($host, 'drive.google.com') => 'google_drive',
            str_contains($host, 'docs.google.com')  => 'google_docs',
            default                              => 'website',
        };
    }

    public function dokumen(): BelongsTo
    {
        return $this->belongsTo(Dokumen::class);
    }
}
