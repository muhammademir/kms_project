<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dokumens', function (Blueprint $table) {
            if (!Schema::hasColumn('dokumens', 'published_at')) {
                $table->timestamp('published_at')->nullable()->after('status');
            }
            if (!Schema::hasColumn('dokumens', 'nomor_dokumen')) {
                $table->string('nomor_dokumen', 50)->nullable()->after('id');
            }
            if (!Schema::hasColumn('dokumens', 'catatan_revisi')) {
                $table->text('catatan_revisi')->nullable()->after('published_at');
            }
        });

        // Tambah kolom kode ke kategoris jika belum ada
        Schema::table('kategoris', function (Blueprint $table) {
            if (!Schema::hasColumn('kategoris', 'kode')) {
                $table->string('kode', 10)->nullable()->after('nama');
            }
        });

        // Tambah kolom catatan ke log_aktivitas jika belum ada
        Schema::table('log_aktivitas', function (Blueprint $table) {
            if (!Schema::hasColumn('log_aktivitas', 'catatan')) {
                $table->text('catatan')->nullable()->after('aksi');
            }
        });
    }

    public function down(): void
    {
        Schema::table('dokumens', function (Blueprint $table) {
            $table->dropColumnIfExists(['published_at', 'nomor_dokumen', 'catatan_revisi']);
        });
        Schema::table('kategoris', function (Blueprint $table) {
            $table->dropColumnIfExists('kode');
        });
        Schema::table('log_aktivitas', function (Blueprint $table) {
            $table->dropColumnIfExists('catatan');
        });
    }
};
