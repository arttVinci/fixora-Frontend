import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  AiRobotIcon,
  MapPinIcon,
  UserIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
  DocumentIcon,
} from '../Icons';

export default function ArchitectureSection() {
  const [activeTab, setActiveTab] = useState<'flow' | 'code'>('flow');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#090B0A] border-t border-[#2A2E2C] relative overflow-hidden">
      {/* Subtle Monochrome Emerald Glow Backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-gradient-to-r from-[#2E7D32]/12 via-[#1B5E20]/8 to-[#81C784]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-[#2A2E2C]/80">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B5E20]/25 border border-[#2E7D32]/40 text-[#81C784] text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#81C784] animate-pulse" />
              <span>COGNITIVE SWARM & AUTONOMOUS PIPELINE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-[#F2F2F0] tracking-tight leading-tight">
              Arsitektur Pemantauan Terpadu Fixora.
            </h2>

            <p className="text-sm sm:text-base text-[#9BA39E] leading-relaxed">
              Ditenagai alur otonom dan verifikasi multi-agen: memadukan <span className="text-[#F2F2F0] font-medium">Conversational AI warga</span>, <span className="text-[#F2F2F0] font-medium">AI News Crawler otonom</span>, <span className="text-[#F2F2F0] font-medium">Vision Classifier</span>, <span className="text-[#F2F2F0] font-medium">Multi-Agent Debate (Advocate, Skeptic, Manager)</span>, dan <span className="text-[#F2F2F0] font-medium">Geocoding Jawa Barat</span>.
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121514] border border-[#2A2E2C] rounded-2xl self-start md:self-end">
            <button
              onClick={() => setActiveTab('flow')}
              className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'flow'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-[#9BA39E] hover:text-[#F2F2F0]'
              }`}
            >
              Visual Node Graph
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`py-2 px-4 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-[#2E7D32] text-white shadow-md'
                  : 'text-[#9BA39E] hover:text-[#F2F2F0]'
              }`}
            >
              Pipeline Code
            </button>
          </div>
        </div>

        {/* ── Main Canvas View Container ── */}
        <div className="rounded-3xl bg-[#0F1211] border border-[#2A2E2C] shadow-2xl p-4 sm:p-8 relative overflow-hidden">
          {/* Subtle Dot Matrix Background */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#81C784 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* ── 1. VISUAL NODE GRAPH TAB ── */}
          {activeTab === 'flow' && (
            <div className="relative w-full overflow-x-auto py-4">
              <div className="min-w-[980px] max-w-[1100px] mx-auto relative h-[600px] select-none">
                
                {/* SVG Connecting Wires Layer */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <defs>
                    <linearGradient id="wireGreen" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2E7D32" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#81C784" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  {/* Wire 1: Warga -> Fixora Server */}
                  <path
                    d="M 230 155 C 285 155, 285 240, 340 240"
                    fill="none"
                    stroke="url(#wireGreen)"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                    opacity={hoveredNode === 'warga' || !hoveredNode ? 0.9 : 0.2}
                    className="transition-opacity duration-300 animate-pulse"
                  />
                  <circle cx="285" cy="195" r="3" fill="#81C784" className="animate-ping" opacity={hoveredNode === 'warga' || !hoveredNode ? 1 : 0.2} />

                  {/* Wire 2: AI Crawler -> Fixora Server */}
                  <path
                    d="M 230 295 C 285 295, 285 270, 340 270"
                    fill="none"
                    stroke="url(#wireGreen)"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                    opacity={hoveredNode === 'crawler' || !hoveredNode ? 0.9 : 0.2}
                    className="transition-opacity duration-300"
                  />
                  <circle cx="285" cy="282" r="3" fill="#81C784" opacity={hoveredNode === 'crawler' || !hoveredNode ? 1 : 0.2} />

                  {/* Wire 3: Fixora Server -> 1. CV Classifier */}
                  <path
                    d="M 510 230 C 565 230, 565 76, 620 76"
                    fill="none"
                    stroke="url(#wireGreen)"
                    strokeWidth="1.8"
                    opacity={hoveredNode === 'cv' || !hoveredNode ? 0.9 : 0.2}
                    className="transition-opacity duration-300"
                  />
                  <circle cx="565" cy="153" r="3" fill="#81C784" opacity={hoveredNode === 'cv' || !hoveredNode ? 1 : 0.2} />

                  {/* Wire 4: Fixora Server -> 2. Geocoding */}
                  <path
                    d="M 510 245 C 565 245, 565 151, 620 151"
                    fill="none"
                    stroke="url(#wireGreen)"
                    strokeWidth="1.8"
                    opacity={hoveredNode === 'geo' || !hoveredNode ? 0.9 : 0.2}
                    className="transition-opacity duration-300"
                  />
                  <circle cx="565" cy="198" r="3" fill="#81C784" opacity={hoveredNode === 'geo' || !hoveredNode ? 1 : 0.2} />

                  {/* Wire 5: Fixora Server -> 3. Multi-Agent Debate */}
                  <path
                    d="M 510 260 C 565 260, 565 231, 620 231"
                    fill="none"
                    stroke="url(#wireGreen)"
                    strokeWidth="1.8"
                    opacity={hoveredNode === 'debate' || !hoveredNode ? 0.9 : 0.2}
                    className="transition-opacity duration-300 animate-pulse"
                  />
                  <circle cx="565" cy="245" r="3" fill="#81C784" opacity={hoveredNode === 'debate' || !hoveredNode ? 1 : 0.2} />

                  {/* Wire 6: Fixora Server -> 4. Deduplication */}
                  <path
                    d="M 510 275 C 565 275, 565 311, 620 311"
                    fill="none"
                    stroke="url(#wireGreen)"
                    strokeWidth="1.8"
                    opacity={hoveredNode === 'dedup' || !hoveredNode ? 0.9 : 0.2}
                    className="transition-opacity duration-300"
                  />
                  <circle cx="565" cy="293" r="3" fill="#81C784" opacity={hoveredNode === 'dedup' || !hoveredNode ? 1 : 0.2} />

                  {/* Wire 7, 8, 9, 10: Converge from 4 Nodes to Output Map */}
                  <path
                    d="M 845 76 C 865 76, 865 240, 885 240"
                    fill="none"
                    stroke="#81C784"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <path
                    d="M 845 151 C 865 151, 865 245, 885 245"
                    fill="none"
                    stroke="#81C784"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <path
                    d="M 845 231 C 865 231, 865 250, 885 250"
                    fill="none"
                    stroke="#81C784"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                  <path
                    d="M 845 311 C 865 311, 865 255, 885 255"
                    fill="none"
                    stroke="#81C784"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />

                  {/* Vertical Wire: Fixora Server -> Async Background */}
                  <path
                    d="M 425 350 L 425 490"
                    fill="none"
                    stroke="#81C784"
                    strokeWidth="1.8"
                    strokeDasharray="5 5"
                    opacity="0.7"
                  />
                  <text x="435" y="420" fill="#9BA39E" fontSize="10" fontFamily="monospace" letterSpacing="0.05em">
                    Async Background
                  </text>
                </svg>

                {/* ── LAYER 1: DATA INGESTION (LEFT) ── */}
                <div className="absolute left-0 top-[100px] w-[230px] p-3 rounded-2xl border border-dashed border-[#2A2E2C] bg-[#0B0D0C]/60 space-y-4">
                  <div className="text-[10px] font-mono font-bold text-[#81C784] uppercase tracking-wider px-1">
                    • Ingestion Channels
                  </div>

                  {/* Node: Warga */}
                  <div
                    onMouseEnter={() => setHoveredNode('warga')}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="p-3.5 rounded-2xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 shadow-lg transition-all cursor-pointer relative group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#1B5E20]/25 border border-[#2E7D32]/40 text-[#81C784] flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                          Laporan Warga
                        </div>
                        <div className="text-[10px] font-mono text-[#9BA39E]">
                          Conversational AI
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#2A2E2C] flex items-center justify-between text-[10px] font-mono text-[#81C784]">
                      <span>Foto + Silent GPS</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#81C784] animate-ping" />
                    </div>
                  </div>

                  {/* Node: Crawler */}
                  <div
                    onMouseEnter={() => setHoveredNode('crawler')}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="p-3.5 rounded-2xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 shadow-lg transition-all cursor-pointer relative group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#1B5E20]/25 border border-[#2E7D32]/40 text-[#81C784] flex items-center justify-center flex-shrink-0">
                        <AiRobotIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                          AI News Crawler
                        </div>
                        <div className="text-[10px] font-mono text-[#9BA39E]">
                          Media Pers Terverifikasi
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-[#2A2E2C] flex items-center justify-between text-[10px] font-mono text-[#81C784]">
                      <span>Ekstraksi Otonom</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#81C784]" />
                    </div>
                  </div>
                </div>

                {/* ── LAYER 2: CORE ORCHESTRATOR (CENTER) ── */}
                <div className="absolute left-[340px] top-[180px] w-[170px] p-3 rounded-2xl border border-dashed border-[#2E7D32]/50 bg-[#0B0D0C]/80 space-y-2 text-center shadow-2xl">
                  <div className="text-[10px] font-mono font-bold text-[#81C784] uppercase tracking-wider">
                    • Core Orchestrator
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#161918] border border-[#2E7D32] shadow-[0_0_30px_rgba(46,125,50,0.25)] space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/30 text-[#81C784] flex items-center justify-center mx-auto shadow-inner">
                      <SparklesIcon className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F2F2F0]">Fixora Server</h4>
                      <p className="text-[10px] font-mono text-[#81C784]">Go Backend / Fiber</p>
                    </div>
                    <div className="text-[9.5px] px-2 py-0.5 rounded-md bg-[#0D0F0E] text-[#9BA39E] font-mono border border-[#2A2E2C]">
                      Processing Stream
                    </div>
                  </div>
                </div>

                {/* ── LAYER 3: 4 PROCESSING & VERIFICATION NODES (RIGHT-MIDDLE) ── */}
                <div className="absolute left-[620px] top-4 w-[225px] p-2.5 rounded-2xl border border-dashed border-[#2A2E2C] bg-[#0B0D0C]/60 space-y-2.5">
                  <div className="text-[10px] font-mono font-bold text-[#81C784] uppercase tracking-wider px-1 whitespace-nowrap">
                    • Pipeline & Verification (4 Fitur)
                  </div>

                  {/* 1. CV Classifier */}
                  <div
                    onMouseEnter={() => setHoveredNode('cv')}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="p-2.5 rounded-xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#1B5E20]/25 border border-[#2E7D32]/40 text-[#81C784] flex items-center justify-center flex-shrink-0">
                        <SparklesIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                          CV Classifier
                        </div>
                        <div className="text-[9px] font-mono text-[#81C784]">
                          Vision LLM (US-06)
                        </div>
                      </div>
                    </div>
                    <div className="text-[9px] text-[#9BA39E] mt-1 font-mono">
                      Kategori & Severity Scoring
                    </div>
                  </div>

                  {/* 2. Geocoding */}
                  <div
                    onMouseEnter={() => setHoveredNode('geo')}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="p-2.5 rounded-xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#1B5E20]/25 border border-[#2E7D32]/40 text-[#81C784] flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                          Nominatim GIS
                        </div>
                        <div className="text-[9px] font-mono text-[#81C784]">
                          Region DB Jabar
                        </div>
                      </div>
                    </div>
                    <div className="text-[9px] text-[#9BA39E] mt-1 font-mono">
                      Forward Geocoding
                    </div>
                  </div>

                  {/* 3. Multi-Agent Debate Verification */}
                  <div
                    onMouseEnter={() => setHoveredNode('debate')}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="p-2.5 rounded-xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#1B5E20]/25 border border-[#2E7D32]/40 text-[#81C784] flex items-center justify-center flex-shrink-0">
                        <ShieldCheckIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                          Multi-Agent Verification
                        </div>
                        <div className="text-[9px] font-mono text-[#81C784]">
                          Advocate • Skeptic • Manager
                        </div>
                      </div>
                    </div>
                    <div className="text-[9px] text-[#9BA39E] mt-1 font-mono flex items-center justify-between">
                      <span>Konsensus 3 Agen</span>
                      <span className="text-[#81C784] font-bold text-[8.5px]">Verifikasi Otonom</span>
                    </div>
                  </div>

                  {/* 4. Deduplication */}
                  <div
                    onMouseEnter={() => setHoveredNode('dedup')}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="p-2.5 rounded-xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 shadow-lg transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#1B5E20]/25 border border-[#2E7D32]/40 text-[#81C784] flex items-center justify-center flex-shrink-0">
                        <SparklesIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                          Auto-Deduplikasi
                        </div>
                        <div className="text-[9px] font-mono text-[#81C784]">
                          Radius Check (US-07)
                        </div>
                      </div>
                    </div>
                    <div className="text-[9px] text-[#9BA39E] mt-1 font-mono">
                      Merge Laporan Serupa
                    </div>
                  </div>
                </div>

                {/* ── LAYER 4: PUBLIC OUTPUT (FAR RIGHT) ── */}
                <div className="absolute right-0 top-[195px] w-[170px]">
                  <div className="p-4 rounded-2xl bg-[#161918] border border-[#2E7D32] shadow-[0_0_30px_rgba(46,125,50,0.25)] space-y-2 text-center group cursor-pointer hover:bg-[#1A201D] transition-all">
                    <div className="w-9 h-9 rounded-xl bg-[#1B5E20]/40 text-[#81C784] flex items-center justify-center mx-auto shadow-inner">
                      <ShieldCheckIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                        Peta Publik & API
                      </div>
                      <div className="text-[10px] font-mono text-[#81C784]">
                        Status: Verified
                      </div>
                    </div>
                    <div className="text-[9px] font-mono text-[#9BA39E] border-t border-[#2A2E2C] pt-1">
                      Durasi Pemantauan Publik
                    </div>
                  </div>
                </div>

                {/* ── LAYER 5: ASYNC BUDGET CORRELATION BACKGROUND NODE (BOTTOM) ── */}
                <div className="absolute left-[280px] top-[490px] w-[290px]">
                  <div className="p-3.5 rounded-2xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 shadow-xl flex items-center gap-3 text-left transition-all group">
                    <div className="w-8 h-8 rounded-xl bg-[#1B5E20]/25 border border-[#2E7D32]/40 text-[#81C784] flex items-center justify-center flex-shrink-0 shadow-inner">
                      <DocumentIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors">
                        Korelasi Anggaran Daerah
                      </div>
                      <div className="text-[10px] font-mono text-[#9BA39E]">
                        Pencocokan Dokumen & SatuData
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ── 2. PIPELINE CODE CONFIG TAB ── */}
          {activeTab === 'code' && (
            <div className="rounded-2xl bg-[#0B0D0C] border border-[#2A2E2C] p-5 font-mono text-xs shadow-xl overflow-x-auto animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#2A2E2C] mb-4 text-xs text-[#9BA39E]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#2A2E2C]" />
                  <span className="w-3 h-3 rounded-full bg-[#2E7D32]" />
                  <span className="w-3 h-3 rounded-full bg-[#81C784]" />
                  <span className="ml-2 font-mono text-[11px] text-[#F2F2F0]">verification-usecase.go / orchestrator.ts</span>
                </div>
                <span className="text-[11px] text-[#81C784]">Go Fiber + VerificationWorker (30s Cron)</span>
              </div>

              <pre className="text-[#9BA39E] leading-relaxed text-xs">
                <code>
                  <span className="text-zinc-600 select-none"> 1  </span><span className="text-zinc-500">// Fixora Backend Architecture — Modular Monolith & Multi-Agent Verification</span>{'\n'}
                  <span className="text-zinc-600 select-none"> 2  </span><span className="text-[#81C784]">export const</span> <span className="text-emerald-400">FixoraPipelineConfig</span> = <span className="text-[#81C784]">definePipeline</span>({'{'}{'\n'}
                  <span className="text-zinc-600 select-none"> 3  </span>  region: <span className="text-[#81C784]">"Jawa Barat (Bandung, Bogor, Bekasi, etc.)"</span>,{'\n'}
                  <span className="text-zinc-600 select-none"> 4  </span>  inputs: [{'\n'}
                  <span className="text-zinc-600 select-none"> 5  </span>    <span className="text-[#81C784]">citizenConversationalAI</span>({'{'} maxImages: <span className="text-emerald-400">1</span>, silentGPS: <span className="text-[#81C784]">true</span>, anonymousAllowed: <span className="text-[#81C784]">true</span> {'}'}),{'\n'}
                  <span className="text-zinc-600 select-none"> 6  </span>    <span className="text-[#81C784]">newsMediaCrawler</span>({'{'} sources: [<span className="text-[#81C784]">"Kompas"</span>, <span className="text-[#81C784]">"Detik"</span>, <span className="text-[#81C784]">"Antara"</span>] {'}'}){'\n'}
                  <span className="text-zinc-600 select-none"> 7  </span>  ],{'\n'}
                  <span className="text-zinc-600 select-none"> 8  </span>  coreOrchestrator: <span className="text-[#81C784]">"Fixora Server (Go Backend / Fiber)"</span>,{'\n'}
                  <span className="text-zinc-600 select-none"> 9  </span>  processingNodes: [{'\n'}
                  <span className="text-zinc-600 select-none">10  </span>    <span className="text-[#81C784]">visionLLMClassifier</span>({'{'} extractSeverity: <span className="text-[#81C784]">true</span>, autoCategory: <span className="text-[#81C784]">true</span> {'}'}), <span className="text-zinc-500">// 1. US-06</span>{'\n'}
                  <span className="text-zinc-600 select-none">11  </span>    <span className="text-[#81C784]">nominatimGeocoding</span>({'{'} fallbackJabarRegionDB: <span className="text-[#81C784]">true</span> {'}'}),            <span className="text-zinc-500">// 2. US-05</span>{'\n'}
                  <span className="text-zinc-600 select-none">12  </span>    <span className="text-[#81C784]">multiAgentDebateVerification</span>({'{'}                             <span className="text-zinc-500">// 3. VerificationUseCase</span>{'\n'}
                  <span className="text-zinc-600 select-none">13  </span>      agents: [<span className="text-[#81C784]">"advocate"</span>, <span className="text-[#81C784]">"skeptic"</span>, <span className="text-[#81C784]">"manager"</span>],{'\n'}
                  <span className="text-zinc-600 select-none">14  </span>      model: <span className="text-[#81C784]">"qwen/qwen3.7-flash"</span>,{'\n'}
                  <span className="text-zinc-600 select-none">15  </span>      cronWorker: <span className="text-[#81C784]">"*/30 * * * * *"</span>,{'\n'}
                  <span className="text-zinc-600 select-none">16  </span>      minConsensusScore: <span className="text-emerald-400">0.80</span>,{'\n'}
                  <span className="text-zinc-600 select-none">17  </span>      managerOnDisagreement: <span className="text-[#81C784]">true</span>{'\n'}
                  <span className="text-zinc-600 select-none">18  </span>    {'}'}),{'\n'}
                  <span className="text-zinc-600 select-none">19  </span>    <span className="text-[#81C784]">autoDeduplication</span>({'{'} mergeRadiusMeters: <span className="text-emerald-400">50</span> {'}'})              <span className="text-zinc-500">// 4. US-07: Auto-flag & merge duplikat</span>{'\n'}
                  <span className="text-zinc-600 select-none">20  </span>  ],{'\n'}
                  <span className="text-zinc-600 select-none">21  </span>  output: <span className="text-[#81C784]">"public-interactive-map"</span>,{'\n'}
                  <span className="text-zinc-600 select-none">22  </span>  asyncTasks: [<span className="text-[#81C784]">"budgetDocumentCorrelation"</span>]              <span className="text-zinc-500">// US-08: Korelasi anggaran daerah di background</span>{'\n'}
                  <span className="text-zinc-600 select-none">23  </span>{'}'});
                </code>
              </pre>
            </div>
          )}
        </div>

        {/* ── 4 Key Technical Pillar Cards (Unified Theme) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Conversational AI-Assisted */}
          <div className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 transition-all duration-300 space-y-3 shadow-xl group">
            <div className="w-11 h-11 rounded-2xl bg-[#1B5E20]/25 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784] group-hover:scale-110 transition-transform">
              <UserIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#81C784] uppercase font-bold tracking-wider">
                US-02 • USER FLOW FASE 1-6
              </span>
              <h3 className="text-base font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors mt-0.5">
                Conversational AI
              </h3>
            </div>
            <p className="text-xs text-[#9BA39E] leading-relaxed">
              Pelaporan dipandu percakapan asisten AI step-by-step tanpa form statis. Upload foto, GPS dicatat di background, dan opsi kirim anonim tanpa registrasi.
            </p>
          </div>

          {/* Card 2: Autonomous News Crawler */}
          <div className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 transition-all duration-300 space-y-3 shadow-xl group">
            <div className="w-11 h-11 rounded-2xl bg-[#1B5E20]/25 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784] group-hover:scale-110 transition-transform">
              <AiRobotIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#81C784] uppercase font-bold tracking-wider">
                US-05 • AKUISISI BERITA
              </span>
              <h3 className="text-base font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors mt-0.5">
                AI News Crawler
              </h3>
            </div>
            <p className="text-xs text-[#9BA39E] leading-relaxed">
              Sistem secara otomatis memantau dan menarik berita fasilitas publik dari media pers resmi (Kompas, Detik, Antara). LLM mengekstrak slug kategori dan lokasi menjadi laporan terverifikasi.
            </p>
          </div>

          {/* Card 3: Multi-Agent Debate Verification */}
          <div className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 transition-all duration-300 space-y-3 shadow-xl group">
            <div className="w-11 h-11 rounded-2xl bg-[#1B5E20]/25 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784] group-hover:scale-110 transition-transform">
              <ShieldCheckIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#81C784] uppercase font-bold tracking-wider">
                VERIFICATION USECASE • KONSENSUS AI
              </span>
              <h3 className="text-base font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors mt-0.5">
                Multi-Agent Debate
              </h3>
            </div>
            <p className="text-xs text-[#9BA39E] leading-relaxed">
              Sistem memanggil 3 agen LLM (<span className="text-white font-medium">Advocate</span>, <span className="text-white font-medium">Skeptic</span>, dan <span className="text-white font-medium">Manager</span> saat sengketa) untuk menghasilkan konsensus verifikasi laporan yang objektif.
            </p>
          </div>

          {/* Card 4: Peta Publik & Sinkronisasi Anggaran */}
          <div className="p-6 rounded-3xl bg-[#161918] border border-[#2A2E2C] hover:border-[#81C784]/60 transition-all duration-300 space-y-3 shadow-xl group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-[#1B5E20]/25 border border-[#2E7D32]/40 flex items-center justify-center text-[#81C784] group-hover:scale-110 transition-transform">
                <MapPinIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#81C784] uppercase font-bold tracking-wider">
                  US-01, US-03, US-07, US-08
                </span>
                <h3 className="text-base font-bold text-[#F2F2F0] group-hover:text-[#81C784] transition-colors mt-0.5">
                  Peta Publik & Open Data
                </h3>
              </div>
              <p className="text-xs text-[#9BA39E] leading-relaxed">
                Penayangan titik di peta Jawa Barat dengan timer durasi pemantauan harian, deduplikasi otomatis, dan persiapan korelasi dokumen anggaran daerah.
              </p>
            </div>

            <Link
              to="/transparansi"
              className="text-xs font-semibold text-[#81C784] hover:underline flex items-center gap-1.5 pt-2"
            >
              <span>Buka Data & Transparansi</span>
              <ExternalLinkIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
