FINORA — WEBSITE PENGELOLA KEUANGAN
=================================
Fitur: pemasukan, pengeluaran, tabungan, dana darurat; mata uang IDR dan EGP; kurs EGP dikonversi ke IDR menggunakan kurs online; login email; database cloud Supabase; responsif HP dan desktop.

A. Setup database (Supabase)
1. Buka https://supabase.com dan buat akun / login.
2. Create new project. Simpan password database di tempat aman.
3. Setelah project selesai, buka SQL Editor -> New query.
4. Buka file database.sql, salin semua isinya, tempel di SQL Editor lalu Run.
5. Buka Project Settings -> API (atau Data API/Connect tergantung tampilan).
6. Salin Project URL dan anon / publishable key. Jangan gunakan service_role/secret key.

B. Pasang konfigurasi
1. Buka file config.js dengan Notepad atau VS Code.
2. Ganti PASTE_PROJECT_URL dengan URL proyek Supabase.
3. Ganti PASTE_ANON_PUBLIC_KEY dengan anon/public key.
4. Save.

C. Jalankan lokal
1. Ekstrak ZIP.
2. Buka folder FINORA_MultiCurrency di VS Code.
3. Install extension Live Server (Ritwick Dey) jika belum ada.
4. Klik kanan index.html -> Open with Live Server.
5. Daftar akun dengan email + password, verifikasi email jika diminta, kemudian masuk.

D. Hosting gratis supaya bisa diakses perangkat lain
Cara GitHub Pages:
1. Buat akun GitHub dan repository baru bernama finora (Public).
2. Upload semua file website (index.html, style.css, app.js, config.js; database.sql dan README boleh disimpan).
3. Repository -> Settings -> Pages -> Deploy from branch -> main -> /root -> Save.
4. Tunggu proses selesai; link biasanya https://USERNAME.github.io/finora/
Alternatif Netlify:
1. Buka https://app.netlify.com, login.
2. Add new site / deploy manually; unggah folder hasil ekstrak (atau drag folder/file website sesuai UI).
3. Tunggu link Netlify muncul.
Untuk hosting, file config.js berisi URL dan anon/public key yang memang key publik untuk browser. Keamanan data dijaga oleh RLS policies dalam SQL. Jangan pernah menaruh service_role key.

E. Kurs mata uang
Website meminta kurs IDR dari open.er-api.com saat dibuka. Nilai EGP dikonversi menjadi IDR berdasarkan kurs saat transaksi dicatat dan disimpan amount_idr, sehingga riwayat tidak berubah mengikuti kurs berikutnya. Kurs live memerlukan internet; jika API kurs gagal, transaksi EGP tidak dapat dikonversi sementara.
Catatan: API kurs pihak ketiga dapat berubah atau memiliki batas layanan. Kurs adalah estimasi, bukan nilai transaksi bank.

F. Data tidak hilang
Data transaksi disimpan di Supabase, bukan di browser. Login dengan akun yang sama di perangkat mana pun untuk melihat data. Jangan hapus project Supabase. Gunakan email/password akun sendiri. RLS memastikan akun hanya melihat transaksi miliknya. Simpan cadangan secara berkala jika data penting.

Troubleshooting:
- "Konfigurasi belum diisi": periksa config.js, URL/key, dan save.
- Tidak dapat daftar: cek email verifikasi atau password min 6 karakter.
- Data tidak tampil: pastikan SQL berhasil, internet aktif, login akun sama.
- Kurs tidak muncul: refresh, coba nanti; API kurs memerlukan koneksi.
