<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="MIT License" />
</p>

# Fixora — Infrastructure Neglect Tracker

**Fixora** adalah platform open-source berbasis peta interaktif yang dirancang untuk melacak, memvisualisasikan, dan mendorong akuntabilitas terhadap kerusakan infrastruktur publik yang dibiarkan mangkrak di Indonesia.

> _"Berapa lama jalan ini berlubang? Siapa yang bertanggung jawab? Apakah ada anggaran perbaikan?"_  
> Fixora menjawab pertanyaan-pertanyaan ini dengan data terbuka dan transparan.

---

## Daftar Isi

- [Latar Belakang](#-latar-belakang)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Arsitektur Proyek](#-arsitektur-proyek)
- [Prasyarat](#-prasyarat)
- [Instalasi & Menjalankan](#-instalasi--menjalankan)
- [Environment Variables](#-environment-variables)
- [Halaman & Routing](#-halaman--routing)
- [Kontribusi](#-kontribusi)
- [Tim Pengembang](#-tim-pengembang)
- [Lisensi](#-lisensi)

---

## Latar Belakang

Di kota-kota besar Indonesia, masalah infrastruktur publik yang dibiarkan rusak dalam jangka waktu lama — jalan berlubang, jembatan rawan roboh, bangunan terbengkalai, drainase tersumbat — adalah persoalan berulang yang jarang mendapat akuntabilitas jangka panjang.

Platform pelaporan yang ada saat ini memiliki kelemahan utama:

- **Qlue** — sudah tidak terawat dan domain resminya dialihkan.
- **LAPOR!** — masih beroperasi namun bersifat "lapor sekali, selesai" tanpa pelacakan progres berkelanjutan.

**Fixora** hadir untuk mengisi celah tersebut dengan pendekatan yang berbeda: setiap kerusakan infrastruktur dilacak secara _real-time_ dengan **Public Neglect Timer**, AI-powered photo analysis, dan visualisasi peta interaktif.

---

## Fitur Utama

### Peta Interaktif Real-Time

- Visualisasi seluruh titik kerusakan infrastruktur di atas peta Leaflet
- Marker clustering untuk performa optimal di ribuan titik data
- Heatmap layer untuk mendeteksi zona kerusakan terkonsentrasi
- Filter berdasarkan kategori dan status langsung dari peta

### Public Neglect Timer

- Setiap laporan memiliki penghitung durasi otomatis sejak pertama kali dilaporkan
- Metrik akuntabilitas objektif — _"Sudah X hari dibiarkan"_
- Timeline riwayat perubahan status yang transparan

### AI Photo Analysis

- Upload foto kerusakan dan dapatkan analisis otomatis menggunakan AI
- Deteksi kategori kerusakan (jalan, jembatan, drainase, sampah, bangunan)
- Validasi relevansi foto terhadap laporan infrastruktur

### Dashboard Transparansi

- Statistik real-time: total laporan, rata-rata hari mangkrak, status penanganan
- Tabel data lengkap dengan fitur pencarian dan filter
- Data terbuka untuk publik, jurnalis data, dan aktivis keterbukaan informasi

### Sistem Pelaporan Warga

- Form pelaporan dengan photo upload dan map picker lokasi
- Proses step-by-step: Upload → AI Analysis → Isi Detail → Kirim
- Konfirmasi komunitas untuk validasi laporan

### Detail Laporan Lengkap

- Halaman detail per laporan dengan foto, deskripsi, dan lokasi
- Related reports — laporan terkait di sekitar lokasi yang sama
- Verification panel — status verifikasi dari AI dan komunitas

---

## Tech Stack

| Layer           | Teknologi                                         | Kegunaan dalam Codebase                                                                                          |
| --------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Framework**   | React 19 + TypeScript 5.8                         | Fondasi utama UI — seluruh halaman dan komponen dibangun sebagai React functional components dengan strict typing |
| **Build Tool**  | Vite 6                                            | Dev server dengan HMR instan dan bundler production, termasuk proxy `/api` ke backend saat development            |
| **Styling**     | Tailwind CSS 3 + Custom CSS animations            | Utility-first styling untuk layout dan tema gelap, ditambah custom keyframes untuk efek scanner dan laser glow    |
| **Maps**        | Leaflet + React-Leaflet + MapLibre GL             | Render peta interaktif full-screen di halaman `/peta` dengan tile layer dan kontrol zoom/pan                      |
| **Clustering**  | Leaflet.markercluster + react-leaflet-cluster     | Mengelompokkan marker laporan yang berdekatan agar peta tetap rapi dan performa terjaga pada ribuan titik data    |
| **Animations**  | Framer Motion                                     | Transisi halaman, reveal-on-scroll pada landing page, dan micro-interactions pada kartu dan modal                 |
| **Routing**     | React Router DOM 7                                | Client-side routing untuk navigasi antar 6 halaman utama tanpa full page reload                                  |
| **Icons**       | React Icons + Koboyo Icons                        | Ikon kategori kerusakan (jalan, jembatan, drainase, dll.) dan ikon UI umum di navbar, sidebar, dan modal          |
| **Fonts**       | Plus Jakarta Sans + JetBrains Mono (Google Fonts) | Plus Jakarta Sans untuk body text dan heading; JetBrains Mono untuk elemen kode dan data statistik                |
| **Backend API** | Go (repository terpisah)                          | REST API yang menyajikan data laporan, analisis foto AI, dan manajemen status — dikonsumsi via `fetch` di service |

---

## Arsitektur Proyek

```
fixora-Frontend/
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── landing/            # Landing page sections
│   │   │   ├── AnalyticsSection.tsx
│   │   │   ├── ArchitectureSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HeroMapBackground.tsx
│   │   │   ├── HowItWorksSection.tsx
│   │   │   ├── InlineHeroAiCard.tsx
│   │   │   ├── MapSection.tsx
│   │   │   └── ReportingTutorialSection.tsx
│   │   ├── Map/                # Map-related components
│   │   │   ├── InteractiveMap.tsx
│   │   │   ├── CustomMarker.tsx
│   │   │   ├── HeatmapLayer.tsx
│   │   │   ├── MapFilterBar.tsx
│   │   │   ├── MapSidebar.tsx
│   │   │   ├── MarkerPopup.tsx
│   │   │   ├── PhotoReportModal.tsx
│   │   │   ├── PinReportModal.tsx
│   │   │   ├── ReportDetailModal.tsx
│   │   │   ├── StatSummaryBar.tsx
│   │   │   ├── StatusHistoryTimeline.tsx
│   │   │   └── VerificationPanel.tsx
│   │   ├── AnimatedCounter.tsx
│   │   ├── Footer.tsx
│   │   ├── HoverButton.tsx
│   │   ├── Icons.tsx
│   │   ├── Navbar.tsx
│   │   ├── ReportMapPicker.tsx
│   │   └── Reveal.tsx
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Route-level page components
│   │   ├── HomePage.tsx
│   │   ├── MapPage.tsx
│   │   ├── CreateReportPage.tsx
│   │   ├── TransparencyPage.tsx
│   │   ├── ReportDetailPage.tsx
│   │   └── AboutPage.tsx
│   ├── services/               # API & business logic services
│   │   ├── api.ts
│   │   ├── categoryMapping.ts
│   │   ├── reportApiService.ts
│   │   └── reportService.ts
│   ├── types/                  # TypeScript type definitions
│   │   ├── api.ts
│   │   └── index.ts
│   ├── utils/                  # Utility functions
│   │   ├── dateUtils.ts
│   │   ├── reportStats.ts
│   │   └── statusUtils.ts
│   ├── App.tsx                 # Root component with routing
│   ├── main.tsx                # Application entry point
│   └── index.css               # Global styles & animations
├── .env.example                # Environment variable template
├── index.html                  # HTML entry point
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── LICENSE
```

---

## Prasyarat

Pastikan environment development kamu sudah memiliki:

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (atau gunakan `yarn` / `pnpm`)
- **Git**

---

## Instalasi & Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/arttVinci/fixora-Frontend.git
cd fixora-Frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Edit file `.env` sesuai kebutuhan (lihat [Environment Variables](#-environment-variables)).

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

### 5. Build untuk Production

```bash
npm run build
```

Output build akan tersedia di folder `dist/`.

### 6. Preview Production Build

```bash
npm run preview
```

---

## Environment Variables

| Variable            | Deskripsi                  | Default                       |
| ------------------- | -------------------------- | ----------------------------- |
| `VITE_API_BASE_URL` | Base URL untuk backend API | `https://api.portofy.net/api` |

Buat file `.env` di root project berdasarkan `.env.example`:

```env
VITE_API_BASE_URL=https://api.portofy.net/api
```

> **Note:** Pada mode development, Vite proxy akan meneruskan request `/api` ke backend secara otomatis.

---

## Halaman & Routing

| Route           | Halaman         | Deskripsi                                                        |
| --------------- | --------------- | ---------------------------------------------------------------- |
| `/`             | Home            | Landing page dengan hero, statistik, tutorial, dan arsitektur    |
| `/peta`         | Peta Interaktif | Peta full-screen dengan markers, clustering, dan sidebar detail  |
| `/lapor`        | Buat Laporan    | Form pelaporan kerusakan dengan upload foto dan AI analysis      |
| `/transparansi` | Transparansi    | Dashboard tabel data seluruh laporan dengan filter dan statistik |
| `/tentang`      | Tentang         | Informasi platform, visi misi, dan tim pengembang                |
| `/laporan/:id`  | Detail Laporan  | Halaman detail laporan individual dengan timeline status         |

---

## Tim Pengembang

**Fixora** dirancang dan dibangun oleh:

- [Putra Rizky Nugraha](https://github.com/arttVinci)
- [Muhammad Fadhil Sevano](https://github.com/MFSevanoo)

---

## Lisensi

Proyek ini dilisensikan di bawah **MIT License** — lihat file [LICENSE](./LICENSE) untuk detail lengkap.

```
MIT License © 2026 Putra Rizky Nugraha
```

---

<p align="center">
  <strong>Fixora</strong> — Karena infrastruktur yang mangkrak bukan sesuatu yang boleh dilupakan.
</p>
