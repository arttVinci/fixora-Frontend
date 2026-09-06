import { useState, useRef, useEffect } from "react";
import type {
  IssueCategory,
  SeverityLevel,
  ReportSubmission,
  IssueReport,
} from "../../types";
import {
  analyzePhoto,
  submitReport,
  getGreeting,
} from "../../services/reportService";
import ReportMapPicker from "../ReportMapPicker";
import {
  AiSparkleIcon,
  SendIcon,
  CameraIcon,
  MapPinIcon,
  GpsIcon,
  CheckIcon,
  EditIcon,
  PlusIcon,
  CloseIcon,
  MapIcon,
  ReportIcon,
} from "../Icons";

type Step =
  | "idle" // Fase 1: Greeting & Entry Point
  | "photo_prompt" // Fase 2: Upload Foto Prompt
  | "classifying" // Fase 2: CV Classifier Analyzing
  | "review_data" // Fase 3: Review & Edit Data (Human-in-the-loop)
  | "edit_data" // Fase 3: Inline Form Editor
  | "location_verify" // Fase 4: Deteksi & Verifikasi Lokasi
  | "map_picker" // Fase 4: Geser Pin di Peta
  | "email_optional" // Fase 5: Identitas Pelapor (Opsional)
  | "submitting" // Fase 6: Submit Process
  | "done"; // Fase 6: Konfirmasi & Sukses

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text?: string;
  image?: string;
  step?: Step;
}

type InlineHeroAiCardProps = {
  onReportSubmitted?: (report: IssueReport) => void;
  onScrollToMap?: () => void;
};

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  jalan: "Jalan Rusak",
  jembatan: "Jembatan",
  sampah: "Sampah",
  bangunan: "Bangunan",
  drainase: "Drainase",
};

const SEVERITY_LABELS: Record<SeverityLevel, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
  kritis: "Kritis",
};

const SEVERITY_COLORS: Record<
  SeverityLevel,
  { bg: string; text: string; border: string }
> = {
  rendah: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-300",
    border: "border-emerald-500/30",
  },
  sedang: {
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    border: "border-blue-500/30",
  },
  tinggi: {
    bg: "bg-amber-500/20",
    text: "text-amber-300",
    border: "border-amber-500/30",
  },
  kritis: {
    bg: "bg-rose-500/20",
    text: "text-rose-300",
    border: "border-rose-500/30",
  },
};

interface DraftData {
  title: string;
  description: string;
  category: IssueCategory;
  severity: SeverityLevel;
  confidence: number;
}

export default function InlineHeroAiCard({
  onReportSubmitted,
  onScrollToMap,
}: InlineHeroAiCardProps) {
  const [step, setStep] = useState<Step>("idle");
  const [inputValue, setInputValue] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftData>({
    title: "Laporan Kerusakan Fasilitas Publik",
    description: "Kerusakan infrastruktur publik terdeteksi.",
    category: "jalan",
    severity: "sedang",
    confidence: 90,
  });

  // Location state - silently captured in background
  const [latitude, setLatitude] = useState<number>(-6.2088);
  const [longitude, setLongitude] = useState<number>(106.8456);
  const [stagingSessionId, setStagingSessionId] = useState<string | null>(
    null,
  );

  const [locationLabel, setLocationLabel] = useState<string>(
    "Menteng, Jakarta Pusat",
  );
  const [, setReporterEmail] = useState<string>("");
  const [submittedReport, setSubmittedReport] = useState<IssueReport | null>(
    null,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesCountRef = useRef<number>(1);

  // Chat message stream history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      sender: "ai",
      text: `${getGreeting()}! Ada yang bisa saya bantu hari ini? Anda bisa melihat peta laporan terkini atau melaporkan masalah infrastruktur di sekitar Anda.`,
      step: "idle",
    },
  ]);

  // Background GPS Acquisition on mount (Fase 4 background silently)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setLocationLabel(
            `Koordinat GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          );
        },
        () => {
          setLatitude(-6.2088);
          setLongitude(106.8456);
          setLocationLabel("Jakarta Pusat (Default GPS)");
        },
        { timeout: 8000, enableHighAccuracy: true },
      );
    }
  }, []);

  // Native smooth scroll to bottom ONLY when a new message is appended
  useEffect(() => {
    if (messages.length > prevMessagesCountRef.current) {
      prevMessagesCountRef.current = messages.length;
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    } else {
      prevMessagesCountRef.current = messages.length;
    }
  }, [messages.length]);

  // FASE 1: Mulai Melapor
  const handleStartReporting = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "Saya ingin melapor masalah infrastruktur",
      },
      {
        id: `ai-${Date.now() + 1}`,
        sender: "ai",
        text: "Nanti foto Anda akan dianalisis AI, lokasi dideteksi otomatis, lalu diverifikasi sebelum tayang.\n\nSilakan masukkan atau pilih foto masalah infrastruktur:",
        step: "photo_prompt",
      },
    ]);
    setStep("photo_prompt");
  };

  // FASE 1: Handle text input on idle
  const handleInitialTextQuery = (text: string) => {
    setInputValue("");
    setDraft((prev) => ({
      ...prev,
      description: text,
      title: `Laporan: ${text.slice(0, 35)}...`,
    }));
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text,
      },
      {
        id: `ai-${Date.now() + 1}`,
        sender: "ai",
        text: `Baik, saya catat deskripsi awal: "${text}".\n\nNanti foto Anda akan dianalisis AI, lokasi dideteksi otomatis, lalu diverifikasi sebelum tayang.\n\nSilakan upload foto masalahnya:`,
        step: "photo_prompt",
      },
    ]);
    setStep("photo_prompt");
  };

  // FASE 2: Handle Photo Upload & CV Classifier (US-06)
  const handlePhotoUpload = async (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setStep("classifying");

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: `Mengunggah foto: ${file.name}`,
        image: previewUrl,
      },
      {
        id: "ai-classifying",
        sender: "ai",
        text: "Menganalisis foto dengan Fixora AI Vision Classifier…",
        step: "classifying",
      },
    ]);

    try {
      const result = await analyzePhoto(file);

      if (!result.isRelevant) {
        setStagingSessionId(null);
        setImagePreview(null);
        setStep("photo_prompt");
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== "ai-classifying"),
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: "Maaf, foto yang Anda unggah tidak tampak menunjukkan kerusakan infrastruktur yang bisa dilaporkan. Silakan unggah ulang foto lain, atau klik 'Bersihkan Chat' untuk mulai dari awal.",
            step: "photo_prompt",
          },
        ]);
        return;
      }

      setStagingSessionId(result.sessionId);

      setDraft({
        title: result.title,
        description: result.description || result.reason || 'Kerusakan terdeteksi oleh AI',
        category: result.category,
        severity: result.severity,
        confidence: 90,
      });

      if (result.latitude != null && !isNaN(Number(result.latitude))) {
        setLatitude(Number(result.latitude));
      }
      if (result.longitude != null && !isNaN(Number(result.longitude))) {
        setLongitude(Number(result.longitude));
      }
      if (result.address) {
        setLocationLabel(result.address);
      } else if (result.location) {
        setLocationLabel(result.location);
      }

      setStep("review_data");
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "ai-classifying"),
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Hasil Analisis AI Selesai. Silakan periksa draft data di bawah ini:`,
          step: "review_data",
        },
      ]);
    } catch {
      setStep("review_data");
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "ai-classifying"),
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Analisis AI otomatis mengalami kendala. Silakan tinjau dan sesuaikan kategori secara manual:",
          step: "review_data",
        },
      ]);
    }
  };

  // FASE 3: Konfirmasi Data Hasil Review
  const handleConfirmData = () => {
    setStep("location_verify");
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "Data laporan sudah benar",
      },
      {
        id: `ai-${Date.now() + 1}`,
        sender: "ai",
        text: `Titik lokasi Anda saat ini terdeteksi di:\n**${locationLabel}**\n\nApakah titik lokasi ini sudah sesuai?`,
        step: "location_verify",
      },
    ]);
  };

  // FASE 4: Konfirmasi Lokasi
  const handleConfirmLocation = () => {
    setStep("email_optional");
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "Lokasi sudah sesuai",
      },
      {
        id: `ai-${Date.now() + 1}`,
        sender: "ai",
        text: "Apakah Anda ingin mengisi email untuk konfirmasi & update penanganan laporan ini? (Opsional, laporan tetap dapat dikirim secara anonim)",
        step: "email_optional",
      },
    ]);
  };

  // FASE 4: Buka Map Picker
  const handleOpenMapPicker = () => {
    setStep("map_picker");
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "Saya ingin geser titik di peta",
      },
      {
        id: `ai-${Date.now() + 1}`,
        sender: "ai",
        text: "Silakan geser pin atau klik pada peta interaktif untuk menentukan titik lokasi yang tepat:",
        step: "map_picker",
      },
    ]);
  };

  const handleMapLocationSelected = (
    lat: number,
    lng: number,
    label: string,
  ) => {
    setLatitude(lat);
    setLongitude(lng);
    setLocationLabel(
      label || `Koordinat (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    );
  };

  const handleMapLocationConfirm = () => {
    setStep("email_optional");
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: `Titik dipilih: ${locationLabel}`,
      },
      {
        id: `ai-${Date.now() + 1}`,
        sender: "ai",
        text: "Apakah Anda ingin mengisi email untuk konfirmasi & update penanganan laporan ini? (Opsional, laporan tetap dapat dikirim secara anonim)",
        step: "email_optional",
      },
    ]);
  };

  // FASE 5 & 6: Submit Final Report
  const handleSubmitWithEmail = (email: string) => {
    setReporterEmail(email);
    setInputValue("");
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: `Email konfirmasi: ${email}`,
      },
    ]);
    finalizeReportSubmission(email);
  };

  const handleSkipEmail = () => {
    setReporterEmail("");
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: "Kirim laporan secara anonim (Lewati email)",
      },
    ]);
    finalizeReportSubmission("");
  };

  const finalizeReportSubmission = async (email: string) => {
    setStep("submitting");
    setMessages((prev) => [
      ...prev,
      {
        id: "ai-submitting",
        sender: "ai",
        text: "Mengirim laporan dan mendaftarkan ke sistem verifikasi Fixora…",
        step: "submitting",
      },
    ]);

    await new Promise((res) => setTimeout(res, 900));

    try {
      const submissionData: ReportSubmission = {
        reporterName: email ? email.split("@")[0] : "Warga Anonim",
        reporterEmail: email,
        imagePreviewUrl: imagePreview || undefined,
        finalCategory: draft.category,
        finalSeverity: draft.severity,
        aiCategory: draft.category,
        aiSeverity: draft.severity,
        latitude: latitude,
        longitude: longitude,
        locationLabel: locationLabel,
        locationMethod: "gps",
        title: draft.title,
        description: draft.description,
        stagingSessionId: stagingSessionId || undefined,
      };

      const newReport = await submitReport(submissionData);
      setSubmittedReport(newReport);
      setStep("done");

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "ai-submitting"),
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: `Terima kasih atas laporan Anda!\n\nLaporan Anda berhasil dicatat dengan ID **#${newReport.id}** (Status: Menunggu Verifikasi). Laporan akan segera tayang di peta publik setelah diverifikasi oleh tim.`,
          step: "done",
        },
      ]);

      if (onReportSubmitted) {
        onReportSubmitted(newReport);
      }
    } catch {
      setStep("email_optional");
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== "ai-submitting"),
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: "Gagal mengirim laporan ke server. Silakan coba submit kembali.",
          step: "email_optional",
        },
      ]);
    }
  };

  // Reset flow
  const handleResetFlow = () => {
    setStep("idle");
    setInputValue("");
    setImagePreview(null);
    setSubmittedReport(null);
    setMessages([
      {
        id: "initial-welcome",
        sender: "ai",
        text: `${getGreeting()}! Ada yang bisa saya bantu hari ini? Anda bisa melihat peta laporan terkini atau melaporkan masalah infrastruktur di sekitar Anda.`,
        step: "idle",
      },
    ]);
  };

  // Handle Bottom Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;

    if (step === "idle") {
      handleInitialTextQuery(val);
    } else if (step === "email_optional") {
      if (val.includes("@")) {
        handleSubmitWithEmail(val);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: "Format email kurang tepat. Masukkan email yang benar atau klik tombol 'Lewati (Kirim Anonim)'.",
            step: "email_optional",
          },
        ]);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `user-${Date.now()}`,
          sender: "user",
          text: val,
        },
      ]);
      setInputValue("");
    }
  };

  const isChatStarted = messages.length > 1 || step !== "idle";

  return (
    <div
      className={`relative w-full max-w-[620px] bg-[#161918]/60 text-left rounded-2xl sm:rounded-3xl border border-[#2A2E2C] shadow-2xl backdrop-blur-md overflow-hidden font-sans select-none flex flex-col justify-between transition-[height] duration-300 ease-out ${
        isChatStarted ? "h-[490px] sm:h-[530px]" : "h-auto"
      }`}
    >
      {/* Hidden File Input for Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handlePhotoUpload(file);
        }}
      />

      {/* Chat Messages Body - Pure native performant scroll */}
      <div
        ref={chatContainerRef}
        className={`relative z-10 space-y-3.5 overflow-y-auto overscroll-contain scrollbar-thin ${
          isChatStarted
            ? "flex-1 px-3.5 sm:px-5 py-4 sm:py-5"
            : "px-3.5 sm:px-4 py-3.5 sm:py-4"
        }`}
        style={{ willChange: "scroll-position" }}
      >
        {messages.map((msg, idx) => {
          const isLatest = idx === messages.length - 1;

          if (msg.sender === "user") {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[86%] sm:max-w-[82%] bg-[#1B5E20]/30 text-[#F2F2F0] px-4 py-2.5 sm:px-4.5 sm:py-3 rounded-2xl rounded-tr-md border border-[#2E7D32]/45 text-xs sm:text-[13.5px] leading-relaxed shadow-sm">
                  <p>{msg.text}</p>
                  {msg.image && (
                    <div className="mt-2.5">
                      <img
                        src={msg.image}
                        alt="Foto upload"
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-[#2E7D32]/40 shadow-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          }

          // AI Message
          return (
            <div key={msg.id} className="flex items-start gap-2.5 sm:gap-3">
              {/* AI Assistant Badge */}
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1B5E20]/40 border border-[#2E7D32]/60 flex items-center justify-center flex-shrink-0 shadow-md mt-0.5">
                <AiSparkleIcon className="w-5 h-4.5 text-[#81C784]" />
              </div>

              {/* AI Text Content Bubble */}
              <div className="max-w-[88%] sm:max-w-[85%] bg-[#0D0F0E]/55 border border-[#2A2E2C] text-[#F2F2F0] px-4 py-3.5 sm:px-4.5 sm:py-3.5 rounded-2xl rounded-tl-md text-xs sm:text-[13.5px] leading-relaxed shadow-sm">
                <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                {/* ----------------- FASE 1: ENTRY POINT ACTIONS ----------------- */}
                {msg.step === "idle" && isLatest && step === "idle" && (
                  <div className="flex items-center gap-2.5 mt-3.5 pt-1">
                    <button
                      onClick={handleStartReporting}
                      className="bg-[#2E7D32]/30 hover:bg-[#2E7D32]/50 text-[#81C784] border border-[#2E7D32]/60 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <ReportIcon className="w-4 h-4" />
                      <span>Melapor</span>
                    </button>
                    <button
                      onClick={onScrollToMap}
                      className="text-[#9BA39E] hover:text-[#F2F2F0] text-xs font-medium px-2 py-1.5 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <MapIcon className="w-4 h-4" />
                      <span>Lihat Terkini</span>
                    </button>
                  </div>
                )}

                {/* ----------------- FASE 2: UPLOAD FOTO PROMPT ----------------- */}
                {msg.step === "photo_prompt" &&
                  isLatest &&
                  step === "photo_prompt" && (
                    <div className="mt-3.5 flex items-center gap-2.5">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-[#2E7D32]/30 hover:bg-[#2E7D32]/50 text-[#81C784] border border-[#2E7D32]/60 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <CameraIcon className="w-4 h-4" />
                        <span>Pilih / Ambil Foto</span>
                      </button>
                      <button
                        onClick={handleResetFlow}
                        className="text-[#9BA39E] hover:text-[#F2F2F0] text-xs font-medium px-2 py-1.5 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <CloseIcon className="w-3.5 h-3.5" />
                        <span>Bersihkan Chat</span>
                      </button>
                    </div>
                  )}

                {/* ----------------- FASE 3: REVIEW DATA (HUMAN-IN-THE-LOOP) ----------------- */}
                {msg.step === "review_data" &&
                  isLatest &&
                  step === "review_data" && (
                    <div className="mt-3.5 space-y-3">
                      {/* Structured Form Card */}
                      <div className="p-3 sm:p-3.5 rounded-xl bg-[#0D0F0E]/70 border border-[#2E7D32]/35 space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-2 border-b border-[#2A2E2C] pb-2">
                          <span className="font-semibold text-[#F2F2F0] text-[13px]">
                            {draft.title}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2E7D32]/25 text-[#81C784] font-mono border border-[#2E7D32]/40">
                            {draft.confidence}% AI
                          </span>
                        </div>

                        <p className="text-[#9BA39E] text-xs leading-relaxed">
                          {draft.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="px-2.5 py-1 rounded-lg bg-[#161918] border border-[#2A2E2C] text-[#9BA39E] font-medium text-[11px]">
                            Kategori:{" "}
                            <strong className="text-[#81C784]">
                              {CATEGORY_LABELS[draft.category]}
                            </strong>
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-lg border font-medium text-[11px] ${
                              SEVERITY_COLORS[draft.severity].bg
                            } ${SEVERITY_COLORS[draft.severity].text} ${SEVERITY_COLORS[draft.severity].border}`}
                          >
                            Tingkat:{" "}
                            <strong>{SEVERITY_LABELS[draft.severity]}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={handleConfirmData}
                          className="flex-1 py-1.5 px-3.5 rounded-full bg-[#2E7D32]/30 hover:bg-[#2E7D32]/50 text-[#81C784] border border-[#2E7D32]/60 text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                          <span>Data Sudah Benar</span>
                        </button>
                        <button
                          onClick={() => setStep("edit_data")}
                          className="py-1.5 px-3.5 rounded-full bg-[#161918] hover:bg-[#1F2422] text-[#9BA39E] border border-[#2A2E2C] text-xs font-medium transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <EditIcon className="w-3.5 h-3.5" />
                          <span>Edit Data</span>
                        </button>
                      </div>
                    </div>
                  )}

                {/* ----------------- FASE 3: INLINE EDIT FORM ----------------- */}
                {msg.step === "review_data" &&
                  isLatest &&
                  step === "edit_data" && (
                    <div className="mt-3.5 p-3 rounded-xl bg-[#0D0F0E]/80 border border-[#2A2E2C] space-y-2.5 text-xs">
                      <div className="flex items-center justify-between border-b border-[#2A2E2C] pb-1.5">
                        <span className="font-semibold text-[#F2F2F0]">
                          Koreksi Data Laporan
                        </span>
                        <button
                          onClick={() => setStep("review_data")}
                          className="text-[#9BA39E] hover:text-[#F2F2F0] cursor-pointer"
                        >
                          <CloseIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <label className="text-[11px] text-[#9BA39E] block mb-1">
                          Judul Laporan
                        </label>
                        <input
                          type="text"
                          value={draft.title}
                          onChange={(e) =>
                            setDraft((d) => ({ ...d, title: e.target.value }))
                          }
                          className="w-full bg-[#161918] border border-[#2A2E2C] rounded-lg px-2.5 py-1.5 text-[#F2F2F0] text-xs outline-none focus:border-[#4CAF50]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-[#9BA39E] block mb-1">
                          Deskripsi
                        </label>
                        <textarea
                          rows={2}
                          value={draft.description}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              description: e.target.value,
                            }))
                          }
                          className="w-full bg-[#161918] border border-[#2A2E2C] rounded-lg px-2.5 py-1.5 text-[#F2F2F0] text-xs outline-none focus:border-[#4CAF50] resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-[#9BA39E] block mb-1">
                          Kategori
                        </label>
                        <div className="grid grid-cols-3 gap-1">
                          {(Object.keys(CATEGORY_LABELS) as IssueCategory[]).map(
                            (cat) => (
                              <button
                                key={cat}
                                onClick={() =>
                                  setDraft((d) => ({ ...d, category: cat }))
                                }
                                className={`py-1 px-1.5 rounded-lg text-[11px] transition-all border cursor-pointer ${
                                  draft.category === cat
                                    ? "bg-[#2E7D32]/35 border-[#2E7D32]/70 text-[#81C784] font-bold"
                                    : "bg-[#161918] border-[#2A2E2C] text-[#9BA39E] hover:bg-[#1F2422]"
                                }`}
                              >
                                {CATEGORY_LABELS[cat]}
                              </button>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] text-[#9BA39E] block mb-1">
                          Tingkat Keparahan
                        </label>
                        <div className="grid grid-cols-4 gap-1">
                          {(Object.keys(SEVERITY_LABELS) as SeverityLevel[]).map(
                            (sev) => (
                              <button
                                key={sev}
                                onClick={() =>
                                  setDraft((d) => ({ ...d, severity: sev }))
                                }
                                className={`py-0.5 px-1 rounded-lg text-[10px] transition-all border cursor-pointer ${
                                  draft.severity === sev
                                    ? "bg-amber-500/30 border-amber-500/50 text-amber-300 font-bold"
                                    : "bg-[#161918] border-[#2A2E2C] text-[#9BA39E] hover:bg-[#1F2422]"
                                }`}
                              >
                                {SEVERITY_LABELS[sev]}
                              </button>
                            ),
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setStep("review_data")}
                        className="w-full py-1.5 rounded-xl bg-[#2E7D32]/30 hover:bg-[#2E7D32]/50 text-[#81C784] border border-[#2E7D32]/50 text-xs font-semibold transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                      >
                        <CheckIcon className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  )}

                {/* ----------------- FASE 4: DETEKSI & VERIFIKASI LOKASI ----------------- */}
                {msg.step === "location_verify" &&
                  isLatest &&
                  step === "location_verify" && (
                    <div className="mt-3.5 space-y-3">
                      <div className="p-3 rounded-xl bg-[#0D0F0E]/70 border border-[#2A2E2C] flex items-start gap-2.5">
                        <MapPinIcon className="w-4 h-4 text-[#81C784] flex-shrink-0 mt-0.5" />
                        <div className="text-xs">
                          <p className="text-[#F2F2F0] font-medium">
                            {locationLabel}
                          </p>
                          <p className="text-[#9BA39E] text-[11px] font-mono mt-0.5">
                            {latitude.toFixed(4)}, {longitude.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleConfirmLocation}
                          className="flex-1 py-1.5 px-3.5 rounded-full bg-[#2E7D32]/30 hover:bg-[#2E7D32]/50 text-[#81C784] border border-[#2E7D32]/60 text-xs font-semibold transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                          <span>Lokasi Benar</span>
                        </button>
                        <button
                          onClick={handleOpenMapPicker}
                          className="py-1.5 px-3.5 rounded-full bg-[#161918] hover:bg-[#1F2422] text-[#9BA39E] border border-[#2A2E2C] text-xs font-medium transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <GpsIcon className="w-3.5 h-3.5" />
                          <span>Geser Pin di Peta</span>
                        </button>
                      </div>
                    </div>
                  )}

                {/* ----------------- FASE 4: MAP PICKER ----------------- */}
                {msg.step === "map_picker" &&
                  isLatest &&
                  step === "map_picker" && (
                    <div className="mt-3.5 space-y-2">
                      <ReportMapPicker
                        onLocationSelect={handleMapLocationSelected}
                        initialLat={latitude}
                        initialLng={longitude}
                      />
                      <button
                        onClick={handleMapLocationConfirm}
                        className="w-full py-1.5 rounded-xl bg-[#2E7D32]/30 hover:bg-[#2E7D32]/50 text-[#81C784] border border-[#2E7D32]/50 text-xs font-semibold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <CheckIcon className="w-3.5 h-3.5" />
                        <span>Konfirmasi Titik Lokasi</span>
                      </button>
                    </div>
                  )}

                {/* ----------------- FASE 5: IDENTITAS PELAPOR (OPSIONAL) ----------------- */}
                {msg.step === "email_optional" &&
                  isLatest &&
                  step === "email_optional" && (
                    <div className="mt-3.5 flex items-center gap-2">
                      <button
                        onClick={handleSkipEmail}
                        className="py-1.5 px-3.5 rounded-full bg-[#161918] hover:bg-[#1F2422] text-[#9BA39E] border border-[#2A2E2C] text-xs font-medium transition-all active:scale-95 cursor-pointer"
                      >
                        Lewati (Kirim Anonim)
                      </button>
                    </div>
                  )}

                {/* ----------------- FASE 6: SUKSES & KONFIRMASI ----------------- */}
                {msg.step === "done" && isLatest && submittedReport && (
                  <div className="mt-3.5 flex items-center gap-2.5">
                    <button
                      onClick={onScrollToMap}
                      className="py-1.5 px-3.5 rounded-full bg-[#2E7D32]/30 hover:bg-[#2E7D32]/50 text-[#81C784] border border-[#2E7D32]/50 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <MapIcon className="w-3.5 h-3.5" />
                      <span>Lihat di Peta Interaktif</span>
                    </button>
                    <button
                      onClick={handleResetFlow}
                      className="text-[#9BA39E] hover:text-[#F2F2F0] text-xs font-medium px-2 py-1.5 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <PlusIcon className="w-3.5 h-3.5" />
                      <span>Lapor Baru</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ----------------- BOTTOM INPUT BAR ----------------- */}
      <div className="relative z-10 border-t border-[#2A2E2C] bg-[#161918]/45">
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center px-3.5 py-2.5 sm:px-4.5 sm:py-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              step === "email_optional"
                ? "Masukkan email kamu (opsional) atau klik Lewati..."
                : step === "idle"
                  ? "Ketik masalah atau pertanyaan, atau klik Melapor..."
                  : "Ketik pesan..."
            }
            className="flex-1 bg-transparent text-[#F2F2F0] placeholder-[#9BA39E]/60 text-xs sm:text-sm font-normal outline-none py-1 pr-3"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
              inputValue.trim()
                ? "bg-[#2E7D32]/40 border border-[#4CAF50]/60 text-[#F2F2F0] hover:bg-[#2E7D32]/70 cursor-pointer"
                : "bg-[#1B5E20]/25 border border-[#2E7D32]/35 text-[#81C784] cursor-not-allowed"
            }`}
            aria-label="Send"
          >
            <SendIcon className="w-5.5 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
