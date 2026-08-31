import { useEffect, useState } from 'react';
import type {
  ApiVerificationSessionResponse,
  ApiVerificationLogResponse,
} from '../../types/api';
import { getVerificationSessions } from '../../services/reportApiService';
import {
  ShieldCheckIcon,
  AiRobotIcon,
  ClockIcon,
} from '../Icons';

const STATUS_META: Record<
  string,
  { label: string; badge: string; dot: string }
> = {
  pending: {
    label: 'Menunggu',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-400 animate-pulse',
  },
  running: {
    label: 'Berlangsung',
    badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    dot: 'bg-blue-400 animate-pulse',
  },
  approved: {
    label: 'Terverifikasi',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  rejected: {
    label: 'Ditolak',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
  },
  error: {
    label: 'Gagal',
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-400',
  },
};

const AGENT_ROLE_LABEL: Record<string, string> = {
  advocate: 'Advokat',
  skeptic: 'Skeptis',
  manager: 'Manajer',
};

function formatDateTime(iso?: string | null) {
  if (!iso) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function AgentLogRow({ log }: { log: ApiVerificationLogResponse }) {
  const role = AGENT_ROLE_LABEL[log.agent_role] || log.agent_role;
  const verdictColor =
    log.verdict === true
      ? 'text-emerald-400'
      : log.verdict === false
        ? 'text-rose-400'
        : 'text-[#9BA39E]';

  return (
    <div className="flex items-start gap-2.5 py-2">
      <div className="w-7 h-7 rounded-lg bg-[#161918] border border-[#2A2E2C] flex items-center justify-center flex-shrink-0">
        <AiRobotIcon className="w-3.5 h-3.5 text-[#81C784]" />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-[#F2F2F0]">{role}</span>
          <span className={`text-[10px] font-bold ${verdictColor}`}>
            {log.verdict === true ? '✓ Setuju' : log.verdict === false ? '✗ Tolak' : '— Abstain'}
          </span>
          <span className="text-[10px] font-mono text-[#9BA39E]">
            {log.confidence}% • {log.latency_ms}ms
          </span>
        </div>
        {log.raw_argument && (
          <p className="text-[11px] text-[#9BA39E] leading-relaxed line-clamp-2">
            {log.raw_argument}
          </p>
        )}
      </div>
    </div>
  );
}

export default function VerificationPanel({ reportId }: { reportId: string }) {
  const [sessions, setSessions] = useState<ApiVerificationSessionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getVerificationSessions(reportId);
      setSessions(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat sesi verifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-[#161918] border border-[#2A2E2C] space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#1B5E20]/30 border border-[#2E7D32]/50 text-[#81C784] flex items-center justify-center flex-shrink-0">
          <ShieldCheckIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold font-heading text-[#F2F2F0]">
            Verifikasi Multi-Agent
          </h2>
          <p className="text-xs text-[#9BA39E]">
            Rekam jejak verifikasi berlapis laporan ini.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-[#0D0F0E] rounded-xl" />
          <div className="h-16 bg-[#0D0F0E] rounded-xl" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <ClockIcon className="w-8 h-8 mx-auto text-[#9BA39E]/40" />
          <p className="text-xs text-[#9BA39E]">
            Belum ada sesi verifikasi untuk laporan ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const meta = STATUS_META[session.status] || STATUS_META.pending;
            return (
              <div
                key={session.id}
                className="p-4 rounded-xl bg-[#0D0F0E] border border-[#2A2E2C] space-y-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  <span className="text-xs font-bold text-[#F2F2F0]">
                    {meta.label}
                  </span>
                  <span className="text-[10px] font-mono text-[#9BA39E]">
                    {formatDateTime(session.created_at)}
                  </span>
                </div>

                {session.final_reasoning && (
                  <p className="text-xs text-[#9BA39E] leading-relaxed">
                    {session.final_reasoning}
                  </p>
                )}

                {session.final_category_slug && session.final_severity && (
                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-[#161918] border border-[#2A2E2C] text-[#81C784] font-mono">
                      {session.final_category_slug}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#161918] border border-[#2A2E2C] text-[#9BA39E] font-mono">
                      {session.final_severity}
                    </span>
                    {session.final_verdict != null && (
                      <span
                        className={`px-2 py-0.5 rounded font-semibold ${
                          session.final_verdict
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-rose-500/15 text-rose-300'
                        }`}
                      >
                        {session.final_verdict ? 'Disetujui' : 'Ditolak'}
                      </span>
                    )}
                    {session.decided_by && (
                      <span className="px-2 py-0.5 rounded bg-[#161918] border border-[#2A2E2C] text-[#9BA39E] font-mono">
                        diputuskan: {session.decided_by}
                      </span>
                    )}
                  </div>
                )}

                {session.logs && session.logs.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-[#2A2E2C]">
                    {session.logs.map((log) => (
                      <AgentLogRow key={log.id} log={log} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
