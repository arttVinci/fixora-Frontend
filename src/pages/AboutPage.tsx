export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0F0E] text-[#F2F2F0] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-[#2A2E2C] pb-8 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-px bg-[#2E7D32]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#81C784] font-mono">
              OPEN SOURCE SOFTWARE (OSS)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F2F2F0] tracking-tight">
            Tentang Platform Fixora
          </h1>
          <p className="text-base text-[#9BA39E] max-w-3xl leading-relaxed">
            Fixora adalah platform pelacakan akuntabilitas jangka panjang terhadap infrastruktur publik yang dibiarkan rusak di Indonesia, ditenagai oleh kecerdasan buatan otonom dan partisipasi warga terbuka.
          </p>
        </div>

        {/* 1. Latar Belakang & Visi Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] space-y-3">
            <h2 className="text-lg font-bold text-[#F2F2F0] font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#81C784]" />
              Visi Kami
            </h2>
            <p className="text-sm text-[#9BA39E] leading-relaxed">
              Menjadi penyedia open data infrastruktur Indonesia yang terstruktur rapi berdasarkan wilayah — mencakup jenis infrastruktur, kondisi, durasi pembiaran, hingga alokasi anggarannya — sehingga dapat dimanfaatkan secara bebas oleh publik, media, maupun pemerintah.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] space-y-3">
            <h2 className="text-lg font-bold text-[#F2F2F0] font-heading flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#81C784]" />
              Misi Kami
            </h2>
            <p className="text-sm text-[#9BA39E] leading-relaxed">
              Menciptakan platform transparansi infrastruktur di Indonesia dengan informasi yang jelas dan terverifikasi, menghubungkan laporan masyarakat dengan data resmi pemerintah dan lokasi aktual di lapangan.
            </p>
          </div>
        </div>

        {/* 2. Diferensiasi vs Platform Lain */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#F2F2F0] font-heading">
            Diferensiasi vs Platform Tradisional
          </h2>
          <div className="overflow-hidden rounded-2xl border border-[#2A2E2C] bg-[#161918]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#0D0F0E] text-[#9BA39E] font-mono text-[11px] uppercase border-b border-[#2A2E2C]">
                <tr>
                  <th className="py-3 px-4">Fitur / Pendekatan</th>
                  <th className="py-3 px-4 text-[#81C784]">Fixora (AI + OSS)</th>
                  <th className="py-3 px-4 text-[#9BA39E]">Platform Konvensional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2E2C] text-[#F2F2F0]">
                <tr>
                  <td className="py-3 px-4 font-semibold">Pelacakan Durasi Mangkrak</td>
                  <td className="py-3 px-4 text-[#81C784]">Terdokumentasi otomatis (Hari/Bulan)</td>
                  <td className="py-3 px-4 text-[#9BA39E]">Lapor sekali, tidak ada timer publik</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Sumber Data</td>
                  <td className="py-3 px-4 text-[#81C784]">AI News Crawler Otonom + Warga</td>
                  <td className="py-3 px-4 text-[#9BA39E]">Pasif (Hanya menunggu laporan warga)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Korelasi Anggaran APBD</td>
                  <td className="py-3 px-4 text-[#81C784]">Cross-reference data APBD SatuData</td>
                  <td className="py-3 px-4 text-[#9BA39E]">Terisolasi tanpa konteks anggaran</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Klasifikasi Foto</td>
                  <td className="py-3 px-4 text-[#81C784]">Multimodal Computer Vision otomatis</td>
                  <td className="py-3 px-4 text-[#9BA39E]">Pilih kategori manual oleh user</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold">Lisensi & Data</td>
                  <td className="py-3 px-4 text-[#81C784]">Open Source (MIT) + Open API</td>
                  <td className="py-3 px-4 text-[#9BA39E]">Tertutup (Proprietary)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Tech Stack & Arsitektur */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#F2F2F0] font-heading">
            Arsitektur & Tech Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C]">
              <div className="text-xs text-[#9BA39E] font-mono mb-1">BACKEND ENGINE</div>
              <div className="text-base font-bold text-[#F2F2F0]">Go (Golang) + Fiber</div>
              <p className="text-xs text-[#9BA39E] mt-1">Clean Architecture / Modular Monolith dengan GORM & PostgreSQL.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C]">
              <div className="text-xs text-[#9BA39E] font-mono mb-1">FRONTEND SPA</div>
              <div className="text-base font-bold text-[#F2F2F0]">React 19 + TypeScript</div>
              <p className="text-xs text-[#9BA39E] mt-1">Vite + TailwindCSS dengan Industrial Green Engineering Palette.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C]">
              <div className="text-xs text-[#9BA39E] font-mono mb-1">GEOSPATIAL MAPPING</div>
              <div className="text-base font-bold text-[#F2F2F0]">Leaflet + OpenStreetMap</div>
              <p className="text-xs text-[#9BA39E] mt-1">Marker Clustering, Heatmap density layer, dan dark GIS tiles.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#161918] border border-[#2A2E2C]">
              <div className="text-xs text-[#9BA39E] font-mono mb-1">AI & VISION PIPELINE</div>
              <div className="text-base font-bold text-[#F2F2F0]">Multimodal Vision LLM</div>
              <p className="text-xs text-[#9BA39E] mt-1">Autonomous News Crawling & Computer Vision Severity Scoring.</p>
            </div>
          </div>
        </div>

        {/* 4. Open Source Contribution & GitHub */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#161918] to-[#121514] border border-[#2E7D32]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#F2F2F0] font-heading">
              Berkontribusi di GitHub (Open Source)
            </h3>
            <p className="text-sm text-[#9BA39E] max-w-xl leading-relaxed">
              Fixora adalah proyek open source di bawah lisensi MIT. Anda dapat berkontribusi pada pengembangan backend Go, frontend React, maupun dataset verifikasi AI.
            </p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-6 rounded-2xl bg-[#2E7D32] hover:bg-[#1B5E20] text-[#F2F2F0] text-sm font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>Kunjungi Repositori</span>
          </a>
        </div>
      </div>
    </div>
  );
}
