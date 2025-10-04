
# Panduan Deploy dan Update Aplikasi React di cPanel dengan Git

Halo! Anda bertanya apakah aplikasi React ini bisa dijalankan di cPanel dan diupdate secara otomatis menggunakan Git. Jawabannya adalah **IYA, BISA**.

Ini adalah praktik umum yang disebut CI/CD (Continuous Integration/Continuous Deployment) sederhana. Dengan alur ini, Anda cukup melakukan `git push` dari komputer lokal, dan cPanel akan mengambil perubahan tersebut, membangun ulang aplikasi, dan menayangkannya secara otomatis.

Berikut adalah langkah-langkah detailnya:

---

### Prasyarat

1.  **Akses cPanel:** Anda memiliki akses ke akun cPanel hosting Anda.
2.  **Akses Terminal/SSH (Sangat Direkomendasikan):** Beberapa cPanel memiliki fitur Terminal bawaan. Jika tidak, Anda mungkin perlu mengaktifkan akses SSH. Ini diperlukan untuk menginstal Node.js.
3.  **Git:** Terinstal di komputer lokal Anda.
4.  **Node.js & npm:** Terinstal di komputer lokal Anda untuk development.
5.  **Akun Git Remote:** Sebuah repository di GitHub, GitLab, atau Bitbucket.

---

### Langkah 1: Setup di Komputer Lokal dan Git

1.  **Inisialisasi Git:** Jika belum, buka terminal di folder proyek Anda dan jalankan:
    ```bash
    git init
    git add .
    git commit -m "Initial commit of inventory application"
    ```

2.  **Buat Repository Remote:** Buat sebuah repository baru (private atau public) di GitHub/GitLab.

3.  **Hubungkan Lokal ke Remote:** Ikuti instruksi dari GitHub/GitLab untuk menghubungkan repository lokal Anda ke remote. Biasanya perintahnya seperti ini:
    ```bash
    git remote add origin https://github.com/USERNAME/NAMA_REPO.git
    git branch -M main
    git push -u origin main
    ```

---

### Langkah 2: Menyiapkan Lingkungan di cPanel

React membutuhkan Node.js untuk proses *build*. Kebanyakan shared hosting cPanel modern sudah menyediakan "Node.js Selector".

1.  **Login ke cPanel.**
2.  Cari menu **"Setup Node.js App"**.
3.  Klik **"Create Application"**:
    *   **Node.js version:** Pilih versi LTS terbaru (misal: 18.x.x atau 20.x.x).
    *   **Application mode:** `Development`.
    *   **Application root:** `repos/aplikasi-inventaris` (Ini adalah folder di dalam `home` Anda, bukan `public_html`. Gunakan nama yang deskriptif).
    *   **Application URL:** Biarkan kosong untuk saat ini.
    *   **Application startup file:** Biarkan kosong.
4.  Klik **"Create"**.
5.  Setelah aplikasi Node.js dibuat, Anda akan melihat perintah untuk masuk ke *virtual environment*. Catat atau salin perintah ini, contohnya:
    `source /home/USERNAME/nodevenv/repos/aplikasi-inventaris/18/bin/activate`

---

### Langkah 3: Menghubungkan cPanel ke Repository Git

1.  Kembali ke menu utama cPanel.
2.  Cari menu **"Git™ Version Control"**.
3.  Klik **"Create"**.
4.  Isi form:
    *   **Clone URL:** Masukkan URL HTTPS dari repository Git Anda (misal: `https://github.com/USERNAME/NAMA_REPO.git`).
    *   **Repository Path:** Masukkan path yang **SAMA PERSIS** dengan "Application root" yang Anda buat di Langkah 2 (misal: `/home/USERNAME/repos/aplikasi-inventaris`).
    *   **Repository Name:** Beri nama, misal "Aplikasi Inventaris".
5.  Klik **"Create"**. cPanel akan meng-kloning proyek Anda dari GitHub/GitLab ke folder yang ditentukan.

---

### Langkah 4: Membuat Skrip Deployment

Ini adalah bagian terpenting. Kita perlu memberitahu cPanel apa yang harus dilakukan setelah mengambil kode terbaru dari Git. Kita akan melakukannya dengan file `.cpanel.yml` di dalam root repository Anda.

1.  **Buat file baru** di root proyek lokal Anda dengan nama `.cpanel.yml`.

2.  **Isi file tersebut** dengan kode berikut. **PENTING:** Ganti `USERNAME` dan path sesuai dengan konfigurasi Anda.

    ```yaml
    ---
    deployment:
      tasks:
        # Masuk ke virtual environment Node.js yang sudah kita buat
        - export DEPLOYPATH=/home/USERNAME/public_html/inventaris/
        - export REPOPATH=/home/USERNAME/repos/aplikasi-inventaris/
        - source /home/USERNAME/nodevenv/repos/aplikasi-inventaris/18/bin/activate && cd $REPOPATH
        
        # Install dependencies dan build aplikasi React
        - npm install
        - npm run build
        
        # Bersihkan folder tujuan dan salin hasil build ke sana
        - rm -rf $DEPLOYPATH*
        - /bin/cp -R dist/* $DEPLOYPATH
    ```

    **Penjelasan Skrip:**
    *   `DEPLOYPATH`: Folder di `public_html` tempat aplikasi akan diakses oleh pengunjung (misal: `domainanda.com/inventaris`). Pastikan folder ini sudah dibuat.
    *   `REPOPATH`: Folder tempat kode dari Git disimpan.
    *   `source ...`: Perintah ini mengaktifkan versi Node.js yang benar.
    *   `npm install`: Menginstal semua package yang dibutuhkan.
    *   `npm run build`: Menjalankan proses build React, yang menghasilkan folder `dist` berisi file statis (HTML, CSS, JS).
    *   `rm` dan `cp`: Menghapus konten lama dan menyalin file-file baru dari `dist` ke folder `public_html`.

3.  **Commit dan Push file `.cpanel.yml`:**
    ```bash
    git add .cpanel.yml
    git commit -m "feat: add cpanel deployment script"
    git push origin main
    ```

---

### Langkah 5: Alur Kerja Update (Sangat Mudah!)

Sekarang, setiap kali Anda ingin mengupdate aplikasi:

1.  **Lakukan perubahan kode** di komputer lokal Anda.
2.  **Commit dan Push** perubahan ke Git:
    ```bash
    git add .
    git commit -m "Update fitur X"
    git push origin main
    ```
3.  **Masuk ke cPanel** -> **"Git™ Version Control"**.
4.  Anda akan melihat repository Anda. Klik **"Manage"**.
5.  Pilih tab **"Pull or Deploy"**.
6.  Klik tombol **"Update from Remote"**. Ini akan mengambil perubahan terbaru dari GitHub/GitLab.
7.  Setelah selesai, klik tombol **"Deploy HEAD Commit"**. cPanel akan secara otomatis menjalankan semua perintah di file `.cpanel.yml`.

Selesai! Buka URL Anda di browser (misal: `domainanda.com/inventaris`), dan Anda akan melihat perubahan terbaru.

Dengan cara ini, proses update menjadi sangat terstruktur, aman, dan cepat.
