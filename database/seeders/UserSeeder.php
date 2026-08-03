<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = [
            ['username' => 'panitia',   'name' => 'Sari Panitia',   'role' => 'panitia'],
            ['username' => 'admin',     'name' => 'Rudi Admin',     'role' => 'admin'],
            ['username' => 'divisiide', 'name' => 'Tim Divisi IDE', 'role' => 'divisi_ide'],
            ['username' => 'pimpinan',  'name' => 'Kepala Pusat',   'role' => 'pimpinan'],
        ];

        foreach ($accounts as $acc) {
            $user = User::create([
                'name' => $acc['name'],
                'username' => $acc['username'],
                'email' => $acc['username'] . '@seaqis.local',
                'password' => Hash::make($acc['username'] . '123'),
            ]);
            $user->assignRole($acc['role']);
        }
    }
}
