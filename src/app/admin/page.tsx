'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/i18n';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { IndustryDistribution, SessionTrend, PopularIdea } from '@/types/api';
import { DemoLog } from '@/types/demo';

interface DashboardStats {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;
  averageDuration: number;
  recentLogs: DemoLog[];
  industryDistribution: IndustryDistribution[];
  sessionTrend: SessionTrend[];
  popularIdeas: PopularIdea[];
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin2026';

function formatDuration(ms: number): string {
  if (ms <= 0) return '0s';
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min === 0) return `${sec}s`;
  return `${min}m ${sec}s`;
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  } catch {
    return iso;
  }
}

export default function AdminPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (sessionStorage.getItem('aidlc-admin-auth') === 'true') {
        setIsAuthenticated(true);
      }
    } catch { /* ignore */ }
  }, []);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/log');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setStats(data);
    } catch {
      setError(t('common.error.logFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isAuthenticated) loadStats();
  }, [isAuthenticated, loadStats]);

  const handleAuth = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      try { sessionStorage.setItem('aidlc-admin-auth', 'true'); } catch { /* ignore */ }
    } else {
      setAuthError(t('admin.password.error'));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="bg-[#12121a] rounded-xl p-8 border border-[#2a2a3a] max-w-sm w-full mx-4">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">{t('admin.password.title')}</h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => { setPasswordInput(e.target.value); setAuthError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            placeholder={t('admin.password.placeholder')}
            className="w-full bg-[#0a0a0f] text-white p-3 rounded-lg border border-[#2a2a3a] focus:border-[#7c5cfc] focus:outline-none mb-4"
          />
          {authError && <p className="text-red-400 text-sm mb-4">{authError}</p>}
          <button onClick={handleAuth} className="w-full bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white py-3 rounded-lg font-medium">
            {t('admin.password.submit')}
          </button>
        </div>
      </div>
    );
  }

  const maxIndustry = stats?.industryDistribution?.reduce((m, d) => Math.max(m, d.count), 0) || 1;
  const maxTrend = stats?.sessionTrend?.reduce((m, d) => Math.max(m, d.count), 0) || 1;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e4ed]">
      <header className="bg-[#12121a] border-b border-[#2a2a3a] px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold"><span className="kiro-gradient-text">AI-DLC</span> {t('admin.title')}</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/')} className="px-3 py-1.5 text-sm text-[#b0b0c0] hover:text-[#e4e4ed] hover:bg-[#1a1a25] rounded-md transition-all">
            {t('admin.home')}
          </button>
          <button onClick={loadStats} disabled={loading} className="px-3 py-1.5 text-sm text-[#b0b0c0] hover:text-[#e4e4ed] hover:bg-[#1a1a25] rounded-md border border-[#2a2a3a] transition-all">
            {t('admin.refresh')}
          </button>
          <LanguageToggle />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8">
        {loading && !stats && <p className="text-center text-[#b0b0c0]">{t('common.loading')}</p>}
        {error && <p className="text-center text-red-400">{error}</p>}

        {stats && (
          <>
            {/* 통계 카드 */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: t('admin.totalSessions'), value: stats.totalSessions },
                { label: t('admin.completedSessions'), value: stats.completedSessions },
                { label: t('admin.completionRate'), value: `${stats.completionRate.toFixed(1)}%` },
                { label: t('admin.avgDuration'), value: formatDuration(stats.averageDuration) },
              ].map((card, i) => (
                <div key={i} className="bg-[#12121a] rounded-lg p-5 border border-[#2a2a3a]">
                  <p className="text-sm text-[#b0b0c0] mb-1">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
              ))}
            </div>

            {/* 차트 2열 */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* 산업별 분포 */}
              <div className="bg-[#12121a] rounded-lg p-5 border border-[#2a2a3a]">
                <h3 className="text-sm font-semibold mb-4">{t('admin.industryDist')}</h3>
                {stats.industryDistribution.length === 0 ? (
                  <p className="text-[#b0b0c0] text-sm">{t('admin.noData')}</p>
                ) : (
                  <div className="space-y-3">
                    {stats.industryDistribution.map((d, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span>{d.industry}</span>
                          <span className="text-[#b0b0c0]">{d.count} ({d.percentage}%)</span>
                        </div>
                        <div className="h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] rounded-full transition-all"
                            style={{ width: `${(d.count / maxIndustry) * 100}%` }}
                            title={`${d.industry}: ${d.count}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 세션 추이 */}
              <div className="bg-[#12121a] rounded-lg p-5 border border-[#2a2a3a]">
                <h3 className="text-sm font-semibold mb-4">{t('admin.sessionTrend')}</h3>
                {stats.sessionTrend.length === 0 ? (
                  <p className="text-[#b0b0c0] text-sm">{t('admin.noData')}</p>
                ) : (
                  <div className="flex items-end gap-2 h-32">
                    {stats.sessionTrend.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-[#7c5cfc] to-[#4a9eff] rounded-t transition-all"
                          style={{ height: `${(d.count / maxTrend) * 100}%`, minHeight: d.count > 0 ? '4px' : '0' }}
                          title={`${d.hour}: ${d.count}`}
                        />
                        <span className="text-[10px] text-[#b0b0c0] mt-1">{d.hour}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 인기 아이디어 */}
            <div className="bg-[#12121a] rounded-lg p-5 border border-[#2a2a3a] mb-8">
              <h3 className="text-sm font-semibold mb-4">{t('admin.popularIdeas')}</h3>
              {stats.popularIdeas.length === 0 ? (
                <p className="text-[#b0b0c0] text-sm">{t('admin.noData')}</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {stats.popularIdeas.map((idea, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#0a0a0f] rounded-full text-sm border border-[#2a2a3a]">
                      {idea.idea} <span className="text-[#7c5cfc] font-medium">({idea.count})</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 최근 세션 테이블 */}
            <div className="bg-[#12121a] rounded-lg border border-[#2a2a3a] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#2a2a3a]">
                <h3 className="text-sm font-semibold">{t('admin.recentSessions')}</h3>
              </div>
              {stats.recentLogs.length === 0 ? (
                <p className="text-[#b0b0c0] text-sm p-5">{t('admin.noData')}</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2a2a3a] text-[#b0b0c0]">
                      <th className="text-left px-5 py-3">{t('admin.table.timestamp')}</th>
                      <th className="text-left px-5 py-3">{t('admin.table.projectIdea')}</th>
                      <th className="text-left px-5 py-3">{t('admin.table.status')}</th>
                      <th className="text-left px-5 py-3">{t('admin.table.duration')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentLogs.map((log, i) => (
                      <tr key={i} className="border-b border-[#2a2a3a]/50">
                        <td className="px-5 py-3">{formatTimestamp(log.timestamp)}</td>
                        <td className="px-5 py-3">{log.projectIdea}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs ${log.completed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                            {log.completed ? t('admin.table.completed') : t('admin.table.inProgress')}
                          </span>
                        </td>
                        <td className="px-5 py-3">{formatDuration(log.durationMs)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
