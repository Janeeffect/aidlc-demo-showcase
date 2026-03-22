'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import MVPPreview from '@/components/ui/MVPPreview';
import AWSArchitectureDiagram from '@/components/ui/AWSArchitectureDiagram';
import BusinessWorkflowDiagram from '@/components/ui/BusinessWorkflowDiagram';
import { calculateEstimate, ProjectEstimate } from '@/services/EstimateService';
import { logService } from '@/services/LogService';
import { useDemoSession } from '@/contexts/DemoSessionContext';
import { useTranslation } from '@/i18n';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { getScenarioById } from '@/utils/scenarioDetector';

type TabType = 'mvp' | 'architecture' | 'workflow' | 'estimate' | 'aidlc' | 'kiro';

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state: sessionState } = useDemoSession();
  const projectIdea = searchParams.get('idea') || '';
  const scenarioId = searchParams.get('scenario') || undefined;
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('mvp');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (projectIdea) {
      const result = calculateEstimate(projectIdea, scenarioId);
      setEstimate(result);
    }
  }, [projectIdea, scenarioId]);

  useEffect(() => {
    if (projectIdea && sessionState.sessionId) {
      const durationMs = Date.now() - new Date(sessionState.startTime).getTime();
      logService.logComplete(sessionState.sessionId, projectIdea, durationMs).catch(() => {});
    }
  }, [projectIdea, sessionState.sessionId, sessionState.startTime]);

  if (!projectIdea) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-[#b0b0c0]">{t('common.error.noIdea')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e4ed] relative">
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#7c5cfc]/5 to-transparent pointer-events-none" />

      <header className="bg-[#12121a] border-b border-[#2a2a3a] px-8 py-5 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="px-3 py-1.5 text-[#b0b0c0] hover:text-[#e4e4ed] hover:bg-[#1a1a25] rounded-md transition-all text-sm"
              >
                {t('result.backToDemo')}
              </button>
              <div className="w-px h-5 bg-[#2a2a3a]" />
              <button
                onClick={() => router.push('/')}
                className="px-3 py-1.5 text-[#b0b0c0] hover:text-[#e4e4ed] hover:bg-[#1a1a25] rounded-md transition-all text-sm"
              >
                {t('result.backToStart')}
              </button>
              <div className="w-px h-5 bg-[#2a2a3a]" />
              <KiroIcon size={28} />
              <h1 className="text-xl font-semibold"><span className="kiro-gradient-text">AI-DLC</span> {t('result.complete')}</h1>
            </div>
            <LanguageToggle />
          </div>
          <p className="text-[#b0b0c0] text-sm mt-1 ml-[88px]">{projectIdea}</p>
        </div>
      </header>

      <div className="bg-[#12121a] border-b border-[#2a2a3a] relative z-10">
        <div role="tablist" aria-label="결과 탭" className="max-w-6xl mx-auto flex overflow-x-auto">
          {[
            { id: 'mvp', label: t('result.tabs.mvp') },
            { id: 'architecture', label: t('result.tabs.architecture') },
            { id: 'workflow', label: t('result.tabs.workflow') },
            { id: 'estimate', label: t('result.tabs.estimate') },
            { id: 'aidlc', label: t('result.tabs.aidlc') },
            { id: 'kiro', label: t('result.tabs.kiro') },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#7c5cfc] text-[#9d85fc]'
                  : 'border-transparent text-[#b0b0c0] hover:text-[#e4e4ed]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'mvp' && (
            <motion.div key="mvp" role="tabpanel" id="tabpanel-mvp" aria-labelledby="tab-mvp" tabIndex={0} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <MVPPreview projectIdea={projectIdea} />
            </motion.div>
          )}
          {activeTab === 'architecture' && (
            <motion.div key="arch" role="tabpanel" id="tabpanel-architecture" aria-labelledby="tab-architecture" tabIndex={0} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AWSArchitectureDiagram projectIdea={projectIdea} scenarioId={scenarioId} />
            </motion.div>
          )}
          {activeTab === 'workflow' && (
            <motion.div key="workflow" role="tabpanel" id="tabpanel-workflow" aria-labelledby="tab-workflow" tabIndex={0} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <BusinessWorkflowDiagram projectIdea={projectIdea} scenarioId={scenarioId} />
            </motion.div>
          )}
          {activeTab === 'estimate' && estimate && (
            <motion.div key="estimate" role="tabpanel" id="tabpanel-estimate" aria-labelledby="tab-estimate" tabIndex={0} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <EstimateTab estimate={estimate} />
            </motion.div>
          )}
          {activeTab === 'aidlc' && (
            <motion.div key="aidlc" role="tabpanel" id="tabpanel-aidlc" aria-labelledby="tab-aidlc" tabIndex={0} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AIDLCOutputsTab projectIdea={projectIdea} scenarioId={scenarioId} />
            </motion.div>
          )}
          {activeTab === 'kiro' && (
            <motion.div key="kiro" role="tabpanel" id="tabpanel-kiro" aria-labelledby="tab-kiro" tabIndex={0} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <KiroIntroTab />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white rounded-lg font-medium hover:from-[#6b4beb] hover:to-[#3a8eef] transition-all text-sm"
          >
            {t('result.tryAnother')}
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-8 py-3 bg-[#1a1a25] text-[#e4e4ed] rounded-lg font-medium hover:bg-[#2a2a3a] border border-[#2a2a3a] transition-all text-sm"
          >
            {t('result.emailReport')}
          </button>
        </div>
      </main>

      {showEmailModal && (
        <EmailReportModal
          projectIdea={projectIdea}
          estimate={estimate}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
}

function KiroIcon({ size = 20 }: { size?: number }) {
  return (
    <Image src="/kiro.jpg" alt="Kiro AI 어시스턴트" width={size} height={size} className="rounded-sm object-contain" />
  );
}

function EstimateTab({ estimate }: { estimate: ProjectEstimate }) {
  const { t, locale } = useTranslation();
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#7c5cfc]/20 to-[#7c5cfc]/5 border border-[#7c5cfc]/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#7c5cfc] mb-4">{t('result.estimate.aiSavings')}</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-bold text-white">{estimate.aiSavedDays}{t('result.estimate.days')}</p>
            <p className="text-sm text-[#b0b0c0]">{t('result.estimate.savedDays')}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{estimate.aiSavedPercentage}%</p>
            <p className="text-sm text-[#b0b0c0]">{t('result.estimate.speedUp')}</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{t('result.estimate.approxMinutes')}</p>
            <p className="text-sm text-[#b0b0c0]">{t('result.estimate.demoTime')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
          <h3 className="text-lg font-semibold mb-4">{t('result.estimate.schedule')}</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#b0b0c0]">{t('result.estimate.expectedDuration')}</span>
              <span className="text-xl font-bold">{estimate.developmentDays}{t('result.estimate.days')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#b0b0c0]">{t('result.estimate.complexity')}</span>
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                estimate.complexity === 'high' ? 'bg-red-500/20 text-red-400' :
                estimate.complexity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {estimate.complexity === 'high' ? t('result.estimate.complexityHigh') : estimate.complexity === 'medium' ? t('result.estimate.complexityMedium') : t('result.estimate.complexityLow')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#b0b0c0]">{t('result.estimate.teamSize')}</span>
              <span className="text-xl font-bold">{estimate.teamSize}{t('result.estimate.persons')}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
          <h3 className="text-lg font-semibold mb-4">{t('result.estimate.costEstimate')}</h3>
          <div className="space-y-4">
            <div>
              <p className="text-[#b0b0c0] text-sm mb-1">{t('result.estimate.devCost')}</p>
              <p className="text-xl font-bold">${estimate.estimatedCost.development.min.toLocaleString()} - ${estimate.estimatedCost.development.max.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[#b0b0c0] text-sm mb-1">{t('result.estimate.infraCost')}</p>
              <p className="text-xl font-bold">${estimate.estimatedCost.monthly.min} - ${estimate.estimatedCost.monthly.max}{t('result.estimate.monthly')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
        <h3 className="text-lg font-semibold mb-4">{t('result.estimate.teamComposition')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {estimate.teamComposition.map((member, index) => (
            <div key={index} className="bg-[#0a0a0f] rounded-lg p-4">
              <p className="font-medium">{translateRole(member.role, locale)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-[#7c5cfc]">{member.count}</span>
                <span className="text-sm text-[#b0b0c0]">{translateSeniority(member.seniorityLevel, locale)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
        <h3 className="text-lg font-semibold mb-4">{t('result.estimate.techStack')}</h3>
        <div className="flex flex-wrap gap-2">
          {estimate.techStack.map((tech, index) => (
            <span key={index} className="px-3 py-1.5 bg-[#0a0a0f] rounded-full text-sm border border-[#2a2a3a]">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function translateRole(role: string, locale: string): string {
  if (locale === 'en') return role;
  const map: Record<string, string> = {
    'Full-stack Developer': '풀스택 개발자',
    'Frontend Developer': '프론트엔드 개발자',
    'Backend Developer': '백엔드 개발자',
    'UI/UX Designer': 'UI/UX 디자이너',
    'QA Engineer': 'QA 엔지니어',
    'DevOps Engineer': 'DevOps 엔지니어',
    'Tech Lead': '기술 리드',
  };
  return map[role] || role;
}

function translateSeniority(level: string, locale: string): string {
  if (locale === 'en') return level;
  const map: Record<string, string> = {
    'Junior': '주니어',
    'Mid-level': '미드레벨',
    'Senior': '시니어',
  };
  return map[level] || level;
}

function AIDLCOutputsTab({ projectIdea, scenarioId }: { projectIdea: string; scenarioId?: string }) {
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const { t } = useTranslation();

  const s = getScenarioById(scenarioId || '');
  const user1 = s.userTypes.split('/')[0];
  const user2 = s.userTypes.split('/')[1] || '관리자';

  const outputs: Record<string, { name: string; phase: string; content: string }> = {
    'requirements.md': {
      name: '요구사항 정의서',
      phase: 'INCEPTION',
      content: `# 요구사항 분석서\n## 프로젝트: ${projectIdea}\n## 도메인: ${s.domain}\n\n---\n\n### 1. 프로젝트 개요\n\n- 프로젝트명: ${projectIdea}\n- 도메인: ${s.domain}\n- 대상 사용자: ${s.userTypes}\n- 기술 스택: ${s.techStack.frontend} / ${s.techStack.backend} / ${s.techStack.db}\n\n### 2. 기능 요구사항\n\n| ID | 요구사항 | 우선순위 | MVP |\n|----|----------|----------|-----|\n${s.mainFeatures.map((f, i) => `| FR-${String(i+1).padStart(3,'0')} | ${f} | ${i < 2 ? '높음' : '중간'} | ${i < 3 ? 'O' : 'X'} |`).join('\n')}\n\n### 3. 비기능 요구사항\n\n| ID | 카테고리 | 요구사항 | 목표치 |\n|----|----------|----------|--------|\n| NFR-001 | 성능 | API 응답 시간 | P95 < 500ms |\n| NFR-002 | 성능 | 동시 사용자 | 1,000명 |\n| NFR-003 | 보안 | ${s.nfrFocus} | 필수 |\n| NFR-004 | 가용성 | SLA | 99.9% |\n\n### 4. 기술 스택\n\n- Frontend: ${s.techStack.frontend}\n- Backend: ${s.techStack.backend}\n- Database: ${s.techStack.db}\n- 추가: ${s.techStack.extra}`,
    },
    'user-stories.md': {
      name: '사용자 스토리',
      phase: 'INCEPTION',
      content: `# 사용자 스토리\n## 프로젝트: ${projectIdea}\n\n---\n\n## 페르소나\n\n### ${user1}\n- 역할: ${s.domain}의 주요 사용자\n- 목표: 서비스를 통해 핵심 가치를 얻음\n\n### ${user2}\n- 역할: ${s.domain}의 운영/관리 담당\n- 목표: 서비스 운영 효율화\n\n---\n\n## ${user1} 스토리\n\n${s.userStories[0].stories.map((st, i) => `**US-${String(i+1).padStart(3,'0')}**: ${user1}로서 ${st}\n- 인수 기준: ${st.replace('싶다', '수 있다')}\n- 우선순위: ${i === 0 ? '높음' : '중간'}`).join('\n\n')}\n\n## ${user2} 스토리\n\n${s.userStories[1].stories.map((st, i) => `**US-${String(i+11).padStart(3,'0')}**: ${user2}로서 ${st}\n- 인수 기준: ${st.replace('싶다', '수 있다')}\n- 우선순위: ${i === 0 ? '높음' : '중간'}`).join('\n\n')}`,
    },
    'components.md': {
      name: '컴포넌트 설계서',
      phase: 'INCEPTION',
      content: `# 컴포넌트 설계서\n## ${s.domain}\n\n---\n\n### 1. API 설계\n\n| Method | Endpoint | 설명 |\n|--------|----------|------|\n${s.apiEndpoints.map(e => { const p = e.split(' - '); const mp = p[0].split(' '); return `| ${mp[0]} | ${mp[1]} | ${p[1] || ''} |`; }).join('\n')}\n\n### 2. 프론트엔드 구조\n\nsrc/\n  app/ (라우팅)\n  components/\n    common/ (Button, Input, Modal)\n    features/\n${s.mainFeatures.slice(0, 3).map(f => `      ${f.split(' ')[0]}/`).join('\n')}\n  hooks/ (useAuth, useApi)\n  services/ (api.ts)\n  types/ (index.ts)\n\n### 3. 데이터 모델\n\n${s.mainFeatures.slice(0, 3).map((f, i) => `- **${f.split(' ')[0]}**: id, ${i === 0 ? 'title, description, status' : 'userId, data, timestamp'}, createdAt`).join('\n')}`,
    },
    'nfr-design.md': {
      name: 'NFR 설계서',
      phase: 'CONSTRUCTION',
      content: `# 비기능 요구사항 설계서\n## ${s.domain}\n\n---\n\n### 1. 성능 설계\n\n| 지표 | 목표 | 전략 |\n|------|------|------|\n| API 응답 | P95 < 500ms | Lambda 최적화 + 캐시 |\n| 페이지 로드 | < 2초 (LCP) | CloudFront CDN |\n| 동시 사용자 | 1,000명 | Auto Scaling |\n\n### 2. 보안 설계\n\n- 핵심: ${s.nfrFocus}\n- 인증: AWS Cognito + JWT\n- 암호화: TLS 1.3 (전송) + AES-256 (저장)\n- 네트워크: WAF + API Gateway 스로틀링\n\n### 3. AWS 서비스\n\n${s.awsServices.map(svc => `- ${svc}`).join('\n')}`,
    },
    'infrastructure.yaml': {
      name: 'AWS 인프라 템플릿',
      phase: 'OPERATIONS',
      content: `# AWS CloudFormation Template\nAWSTemplateFormatVersion: '2010-09-09'\nDescription: ${projectIdea} - ${s.domain} Infrastructure\n\nResources:\n${s.awsServices.map(svc => { const name = svc.split(' ')[0].replace(/[^a-zA-Z]/g, ''); return `  ${name}:\n    Type: AWS::${svc.split(' ')[0]}\n    Properties:\n      Tags:\n        - Key: Project\n          Value: ${projectIdea}`; }).join('\n\n')}\n\nOutputs:\n  ApiEndpoint:\n    Value: !Sub 'https://api.example.com/v1'`,
    },
  };

  const phases = [
    { id: 'INCEPTION', label: 'INCEPTION', color: '#7c5cfc' },
    { id: 'CONSTRUCTION', label: 'CONSTRUCTION', color: '#4a9eff' },
    { id: 'OPERATIONS', label: 'OPERATIONS', color: '#ff9900' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">{t('result.aidlcOutputs.title')}</h2>
        <p className="text-[#b0b0c0]">{t('result.aidlcOutputs.desc')}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {phases.map(phase => (
          <div key={phase.id} className="bg-[#12121a] rounded-lg border border-[#2a2a3a] overflow-hidden">
            <div className="px-4 py-3 font-semibold text-white" style={{ backgroundColor: phase.color }}>
              {phase.label}
            </div>
            <div className="p-4 space-y-2">
              {Object.entries(outputs)
                .filter(([, v]) => v.phase === phase.id)
                .map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedOutput(key)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                      selectedOutput === key ? 'bg-[#7c5cfc]/20 border border-[#7c5cfc]' : 'bg-[#0a0a0f] hover:bg-[#1a1a25]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[#4a9eff]">&#10003;</span>
                      <span className="text-[#e4e4ed]">{value.name}</span>
                    </div>
                    <p className="text-xs text-[#b0b0c0] mt-1 ml-6">{key}</p>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#12121a] rounded-lg border border-[#2a2a3a] overflow-hidden"
        >
          <div className="px-4 py-3 bg-[#0a0a0f] border-b border-[#2a2a3a] flex items-center justify-between">
            <span className="font-medium">{outputs[selectedOutput].name}</span>
            <button onClick={() => setSelectedOutput(null)} className="text-[#b0b0c0] hover:text-white">x</button>
          </div>
          <pre className="p-4 text-sm text-[#e4e4ed] overflow-auto max-h-96 whitespace-pre-wrap font-mono">
            {outputs[selectedOutput].content}
          </pre>
        </motion.div>
      )}
    </div>
  );
}

function KiroIntroTab() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <KiroIcon size={48} />
          <h2 className="text-3xl font-semibold">Kiro</h2>
        </div>
        <p className="text-[#b0b0c0]">{t('result.kiro.subtitle')}</p>
      </div>

      <div className="bg-gradient-to-r from-[#7c5cfc]/20 to-[#7c5cfc]/5 border border-[#7c5cfc]/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#7c5cfc] mb-4">{t('result.kiro.plans')}</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0a0a0f] rounded-lg p-4">
            <p className="text-2xl font-bold text-white">{t('result.kiro.free')}</p>
            <p className="text-sm text-[#b0b0c0] mt-1">{t('result.kiro.freePlan')}</p>
            <ul className="mt-3 space-y-1 text-sm text-[#e4e4ed]">
              <li>- {t('result.kiro.freeFeatures.0')}</li>
              <li>- {t('result.kiro.freeFeatures.1')}</li>
              <li>- {t('result.kiro.freeFeatures.2')}</li>
            </ul>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-4 border border-[#7c5cfc]">
            <p className="text-2xl font-bold text-[#7c5cfc]">{t('result.kiro.pro')}</p>
            <p className="text-sm text-[#b0b0c0] mt-1">{t('result.kiro.proPlan')}</p>
            <ul className="mt-3 space-y-1 text-sm text-[#e4e4ed]">
              <li>- {t('result.kiro.proFeatures.0')}</li>
              <li>- {t('result.kiro.proFeatures.1')}</li>
              <li>- {t('result.kiro.proFeatures.2')}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
        <h3 className="text-lg font-semibold mb-4">{t('result.kiro.features')}</h3>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0a0a0f] rounded-lg p-4">
              <p className="font-medium text-[#7c5cfc] mb-2">{t(`result.kiro.featureItems.${i}.title`)}</p>
              <p className="text-sm text-[#b0b0c0]">{t(`result.kiro.featureItems.${i}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
        <h3 className="text-lg font-semibold mb-4">{t('result.kiro.comparison')}</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a3a]">
              <th className="text-left py-3 px-4 text-[#b0b0c0]">{t('result.kiro.comparisonHeaders.feature')}</th>
              <th className="text-center py-3 px-4 text-[#7c5cfc]">{t('result.kiro.comparisonHeaders.kiro')}</th>
              <th className="text-center py-3 px-4 text-[#b0b0c0]">{t('result.kiro.comparisonHeaders.others')}</th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <tr key={i} className="border-b border-[#2a2a3a]/50">
                <td className="py-3 px-4 text-[#e4e4ed]">{t(`result.kiro.comparisonItems.${i}`)}</td>
                <td className="text-center py-3 px-4"><span className="text-[#4a9eff]">&#10003;</span></td>
                <td className="text-center py-3 px-4">
                  {i === 6 ? <span className="text-yellow-400">-</span> : <span className="text-red-400">&#10007;</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#4a9eff]">
        <h3 className="text-lg font-semibold mb-4 text-[#4a9eff]">{t('result.kiro.security')}</h3>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="bg-[#0a0a0f] rounded-lg p-4">
              <p className="font-medium text-[#4a9eff]">{t(`result.kiro.securityItems.${i}.title`)}</p>
              <p className="text-sm text-[#b0b0c0] mt-1">{t(`result.kiro.securityItems.${i}.desc`)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <a href="https://kiro.dev" target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white rounded-lg font-medium hover:from-[#6b4beb] hover:to-[#3a8eef] transition-all">
          {t('result.kiro.getStarted')}
        </a>
      </div>
    </div>
  );
}

function EmailReportModal({ projectIdea, estimate, onClose }: { projectIdea: string; estimate: ProjectEstimate | null; onClose: () => void }) {
  const [formData, setFormData] = useState({ email: '', name: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/demo/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          projectIdea,
          estimate,
          outputs: ['requirements.md', 'user-stories.md', 'components.md', 'api-spec.md', 'infrastructure.yaml'],
        }),
      });
      if (response.ok) {
        setIsSuccess(true);
      }
    } catch (error) {
      setErrorMessage(t('common.error.sendFailed'));
      console.error('Failed to send report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#12121a] rounded-lg p-8 max-w-md w-full mx-4 text-center"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-[#4a9eff] rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">&#10003;</div>
          <h3 className="text-xl font-semibold text-white mb-2">{t('result.email.successTitle')}</h3>
          <p className="text-[#b0b0c0] mb-6">{t('result.email.successDesc').replace('{email}', formData.email)}</p>
          <button onClick={onClose} className="px-6 py-2 bg-[#7c5cfc] text-white rounded-lg">{t('common.confirm')}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#12121a] rounded-lg p-6 max-w-md w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">{t('result.email.title')}</h3>
          <button onClick={onClose} className="text-[#b0b0c0] hover:text-white">x</button>
        </div>

        <p className="text-sm text-[#b0b0c0] mb-4">
          {t('result.email.desc')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <p role="alert" className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">{errorMessage}</p>
          )}
          <div>
            <label className="block text-sm text-[#e4e4ed] mb-1">{t('result.email.emailLabel')}</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#0a0a0f] text-white p-3 rounded-lg border border-[#2a2a3a] focus:border-[#7c5cfc] focus:outline-none"
              placeholder={t('result.email.emailPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm text-[#e4e4ed] mb-1">{t('result.email.nameLabel')}</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0a0a0f] text-white p-3 rounded-lg border border-[#2a2a3a] focus:border-[#7c5cfc] focus:outline-none"
              placeholder={t('result.email.namePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm text-[#e4e4ed] mb-1">{t('result.email.companyLabel')}</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-[#0a0a0f] text-white p-3 rounded-lg border border-[#2a2a3a] focus:border-[#7c5cfc] focus:outline-none"
              placeholder={t('result.email.companyPlaceholder')}
            />
          </div>

          <div className="bg-[#0a0a0f] rounded-lg p-4 text-sm">
            <p className="text-[#7c5cfc] font-medium mb-2">{t('result.email.reportIncludes')}</p>
            <ul className="text-[#b0b0c0] space-y-1">
              <li>- {t('result.email.reportItems.0')}</li>
              <li>- {t('result.email.reportItems.1')}</li>
              <li>- {t('result.email.reportItems.2')}</li>
              <li>- {t('result.email.reportItems.3')}</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white py-3 rounded-lg font-medium hover:from-[#6b4beb] hover:to-[#3a8eef] disabled:opacity-50 transition-all"
          >
            {isSubmitting ? t('result.email.submitting') : t('result.email.submitButton')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-[#e4e4ed]">Loading...</div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  );
}
