<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kategori extends Model
{
    protected $fillable = ['nama', 'kode'];

    public function dokumens(): HasMany
    {
        return $this->hasMany(Dokumen::class);
    }
}
