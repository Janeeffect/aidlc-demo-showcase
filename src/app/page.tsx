'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useDemoSession } from '@/contexts/DemoSessionContext';
import { logService } from '@/services/LogService';
import { useTranslation } from '@/i18n';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { detectScenario } from '@/utils/scenarioDetector';

const industryCategories = [
  { id: 1, name: '이커머스/리테일', examples: ['온라인 쇼핑몰', '재고 관리 시스템', '주문 추적 서비스', '상품 추천 엔진', '리뷰 관리 플랫폼'] },
  { id: 2, name: '핀테크/금융', examples: ['결제 게이트웨이', '가계부 앱', '투자 포트폴리오 관리', '송금 서비스', '대출 심사 시스템'] },
  { id: 3, name: '헬스케어/의료', examples: ['진료 예약 시스템', '건강 기록 관리', '원격 진료 플랫폼', '약 복용 알림 앱', '피트니스 트래커'] },
  { id: 4, name: '교육/에듀테크', examples: ['온라인 강의 플랫폼', '학습 관리 시스템(LMS)', '퀴즈/시험 앱', '과외 매칭 서비스', '학습 진도 추적'] },
  { id: 5, name: '물류/배송', examples: ['배송 추적 시스템', '창고 관리 솔루션', '라스트마일 배송 앱', '차량 관제 시스템', '배송 기사 앱'] },
  { id: 6, name: 'SaaS/생산성', examples: ['프로젝트 관리 도구', '팀 협업 플랫폼', 'CRM 시스템', '문서 관리 시스템', '일정 관리 앱'] },
];

function KiroLogo({ size = 48 }: { size?: number }) {
  return (
    <Image src="/kiro.jpg" alt="Kiro AI 어시스턴트" width={size} height={size} className="rounded-lg object-contain" />
  );
}

export default function StartPage() {
  const [projectIdea, setProjectIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const router = useRouter();
  const { initSession } = useDemoSession();
  const { t } = useTranslation();

  const handleStart = async () => {
    if (!projectIdea.trim()) return;
    setIsLoading(true);
    try {
      initSession(projectIdea);
      const sessionId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      logService.logStart(sessionId, projectIdea, selectedIndustry || undefined).catch(() => {});
      await fetch('/api/demo/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIdea }),
      }).catch(() => {});
      const scenarioId = detectScenario(projectIdea).id;
      router.push(`/demo?idea=${encodeURIComponent(projectIdea)}&scenario=${scenarioId}`);
    } catch (error) {
      console.error('Failed to start demo:', error);
      const scenarioId = detectScenario(projectIdea).id;
      router.push(`/demo?idea=${encodeURIComponent(projectIdea)}&scenario=${scenarioId}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-[#7c5cfc]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-[#4a9eff]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left Panel */}
      <div className="w-2/5 flex items-center justify-center p-8 border-r border-[#2a2a3a] relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="max-w-md w-full">
          <div className="text-center mb-10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="flex justify-center mb-5">
              <div className="animate-pulse-glow rounded-full p-3">
                <KiroLogo size={56} />
              </div>
            </motion.div>
            <h1 className="text-3xl font-semibold text-white mb-2">
              <span className="kiro-gradient-text">AI-DLC</span> Demo
            </h1>
            <p className="text-[#8888a0] text-sm">AI-Driven Development Life Cycle</p>
            <p className="text-[#4a4a5a] text-xs mt-1">Powered by Kiro</p>
          </div>

          <div className="bg-[#12121a] rounded-xl p-6 border border-[#2a2a3a] kiro-glow">
            <label className="block text-[#e4e4ed] mb-3 text-sm font-medium">{t('start.inputLabel')}</label>
            <input
              type="text"
              value={projectIdea}
              onChange={(e) => setProjectIdea(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder={t('start.placeholder')}
              aria-label={t('start.inputLabel')}
              className="w-full bg-[#0a0a0f] text-white p-3.5 rounded-lg border border-[#2a2a3a] focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/50 focus:outline-none placeholder-[#4a4a5a] transition-all text-sm"
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleStart}
              disabled={!projectIdea.trim() || isLoading}
              className="w-full mt-5 bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] hover:from-[#6b4beb] hover:to-[#3a8eef] text-white font-medium py-3.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('start.starting')}
                </span>
              ) : t('start.startButton')}
            </motion.button>
          </div>
          <p className="text-center text-[#4a4a5a] text-xs mt-6">AWS Summit 2026</p>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="w-3/5 p-6 overflow-auto relative z-10">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-white">{t('start.industryTitle')}</h2>
            <LanguageToggle />
          </div>
          <p className="text-[#8888a0] text-xs mb-6">{t('start.industryDesc')}</p>

          <div className="grid grid-cols-2 gap-3">
            {industryCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
                className="bg-[#12121a] rounded-xl border border-[#2a2a3a] p-4 hover:border-[#7c5cfc]/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 bg-gradient-to-br from-[#7c5cfc] to-[#4a9eff] rounded-md flex items-center justify-center text-white text-xs font-bold">
                    {category.id}
                  </span>
                  <span className="text-[#9d85fc] font-medium text-sm">{category.name}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {category.examples.map((example) => (
                    <button
                      key={example}
                      onClick={() => { setProjectIdea(example); setSelectedIndustry(category.name); }}
                      className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                        projectIdea === example
                          ? 'bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white'
                          : 'bg-[#1a1a25] hover:bg-[#2a2a3a] text-[#8888a0] hover:text-[#e4e4ed] border border-[#2a2a3a]'
                      }`}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
