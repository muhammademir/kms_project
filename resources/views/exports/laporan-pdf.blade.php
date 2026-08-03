<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Knowledge Management - SEAQIS</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DejaVu Sans', Arial, sans-serif; font-size: 10px; color: #1a1a2e; }
        .header { background: #1a2744; color: white; padding: 16px 20px; margin-bottom: 20px; }
        .header h1 { font-size: 16px; font-weight: bold; }
        .header p { font-size: 9px; opacity: 0.8; margin-top: 4px; }
        .summary { display: flex; gap: 12px; margin-bottom: 20px; padding: 0 4px; }
        .summary-card { flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; }
        .summary-card .num { font-size: 22px; font-weight: bold; color: #1a2744; }
        .summary-card .label { font-size: 8px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        thead th { background: #1a2744; color: white; padding: 8px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
        tbody tr:nth-child(even) { background: #f8fafc; }
        tbody td { padding: 7px 10px; border-bottom: 1px solid #e2e8f0; font-size: 9px; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 20px; font-size: 8px; font-weight: bold; background: #d1fae5; color: #065f46; }
        .footer { margin-top: 20px; text-align: center; font-size: 8px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        .section-title { font-size: 11px; font-weight: bold; color: #1a2744; margin-bottom: 8px; padding-left: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Knowledge Management — SEAQIS</h1>
        <p>Divisi ICT, Data & Evaluation &nbsp;|&nbsp; Diekspor pada {{ now()->format('d F Y') }}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <div class="num">{{ $ringkasan['total_terbit'] }}</div>
            <div class="label">Dokumen Terbit</div>
        </div>
        <div class="summary-card">
            <div class="num">{{ $ringkasan['total_menunggu'] }}</div>
            <div class="label">Menunggu Proses</div>
        </div>
        <div class="summary-card">
            <div class="num">{{ $ringkasan['total_revisi'] }}</div>
            <div class="label">Dalam Revisi</div>
        </div>
        <div class="summary-card">
            <div class="num">{{ $dokumens->count() }}</div>
            <div class="label">Total Diekspor</div>
        </div>
    </div>

    <p class="section-title">Daftar Dokumen Terbit</p>
    <table>
        <thead>
            <tr>
                <th style="width:30px">No</th>
                <th style="width:80px">Nomor</th>
                <th>Judul Dokumen</th>
                <th style="width:100px">Kategori</th>
                <th style="width:70px">Jenis</th>
                <th style="width:100px">Diunggah Oleh</th>
                <th style="width:75px">Tgl Terbit</th>
            </tr>
        </thead>
        <tbody>
            @forelse($dokumens as $i => $d)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $d->nomor_dokumen ?? '-' }}</td>
                <td>{{ $d->judul }}</td>
                <td>{{ $d->kategori?->nama ?? '-' }}</td>
                <td>{{ $d->jenis ?? '-' }}</td>
                <td>{{ $d->uploader?->name ?? '-' }}</td>
                <td>{{ $d->published_at?->format('d M Y') ?? '-' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align:center; color:#94a3b8; padding: 20px;">Belum ada dokumen terbit.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Sistem Knowledge Management SEAQIS &copy; {{ date('Y') }} &nbsp;|&nbsp; Dokumen ini dibuat secara otomatis.</p>
    </div>
</body>
</html>
