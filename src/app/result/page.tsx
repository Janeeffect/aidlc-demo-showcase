'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import MVPPreview from '@/components/ui/MVPPreview';
import AWSArchitectureDiagram from '@/components/ui/AWSArchitectureDiagram';
import BusinessWorkflowDiagram from '@/components/ui/BusinessWorkflowDiagram';
import { calculateEstimate, ProjectEstimate } from '@/services/EstimateService';

type TabType = 'mvp' | 'architecture' | 'workflow' | 'estimate' | 'aidlc' | 'kiro';

function ResultPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectIdea = searchParams.get('idea') || '';
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('mvp');
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    if (projectIdea) {
      const result = calculateEstimate(projectIdea);
      setEstimate(result);
    }
  }, [projectIdea]);

  if (!projectIdea) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <p className="text-[#b0b0c0]">프로젝트 아이디어가 없습니다</p>
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
                className="text-[#b0b0c0] hover:text-[#e4e4ed] transition-colors text-sm"
              >
                ← 뒤로
              </button>
              <KiroIcon size={28} />
              <h1 className="text-xl font-semibold"><span className="kiro-gradient-text">AI-DLC</span> 완료</h1>
            </div>
          </div>
          <p className="text-[#b0b0c0] text-sm mt-1 ml-[88px]">{projectIdea}</p>
        </div>
      </header>

      <div className="bg-[#12121a] border-b border-[#2a2a3a] relative z-10">
        <div className="max-w-6xl mx-auto flex overflow-x-auto">
          {[
            { id: 'mvp', label: 'MVP 미리보기' },
            { id: 'architecture', label: 'AWS 아키텍처' },
            { id: 'workflow', label: '비즈니스 워크플로우' },
            { id: 'estimate', label: '프로젝트 예상' },
            { id: 'aidlc', label: 'AI-DLC 산출물' },
            { id: 'kiro', label: 'Kiro 소개' },
          ].map((tab) => (
            <button
              key={tab.id}
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
            <motion.div key="mvp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <MVPPreview projectIdea={projectIdea} />
            </motion.div>
          )}
          {activeTab === 'architecture' && (
            <motion.div key="arch" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AWSArchitectureDiagram projectIdea={projectIdea} />
            </motion.div>
          )}
          {activeTab === 'workflow' && (
            <motion.div key="workflow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <BusinessWorkflowDiagram projectIdea={projectIdea} />
            </motion.div>
          )}
          {activeTab === 'estimate' && estimate && (
            <motion.div key="estimate" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <EstimateTab estimate={estimate} />
            </motion.div>
          )}
          {activeTab === 'aidlc' && (
            <motion.div key="aidlc" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <AIDLCOutputsTab projectIdea={projectIdea} />
            </motion.div>
          )}
          {activeTab === 'kiro' && (
            <motion.div key="kiro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <KiroIntroTab />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white rounded-lg font-medium hover:from-[#6b4beb] hover:to-[#3a8eef] transition-all text-sm"
          >
            다른 프로젝트 시도하기
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            className="px-8 py-3 bg-[#1a1a25] text-[#e4e4ed] rounded-lg font-medium hover:bg-[#2a2a3a] border border-[#2a2a3a] transition-all text-sm"
          >
            리포트 이메일로 받기
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
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C6.48 2 2 6.48 2 12v8c0 1.1.9 2 2 2h2v-2H4v-8c0-4.42 3.58-8 8-8s8 3.58 8 8v8h-2v2h2c1.1 0 2-.9 2-2v-8c0-5.52-4.48-10-10-10z" fill="url(#kiro-icon-grad)"/>
      <circle cx="9" cy="13" r="1.5" fill="url(#kiro-icon-grad)"/>
      <circle cx="15" cy="13" r="1.5" fill="url(#kiro-icon-grad)"/>
      <defs>
        <linearGradient id="kiro-icon-grad" x1="2" y1="2" x2="22" y2="22">
          <stop stopColor="#7c5cfc"/>
          <stop offset="1" stopColor="#4a9eff"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function EstimateTab({ estimate }: { estimate: ProjectEstimate }) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#7c5cfc]/20 to-[#7c5cfc]/5 border border-[#7c5cfc]/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#7c5cfc] mb-4">AI-DLC 시간 절감 효과</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-bold text-white">{estimate.aiSavedDays}일</p>
            <p className="text-sm text-[#b0b0c0]">AI로 절감한 시간</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">{estimate.aiSavedPercentage}%</p>
            <p className="text-sm text-[#b0b0c0]">개발 속도 향상</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-white">~5분</p>
            <p className="text-sm text-[#b0b0c0]">AI-DLC 소요 시간</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
          <h3 className="text-lg font-semibold mb-4">개발 일정</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[#b0b0c0]">예상 기간</span>
              <span className="text-xl font-bold">{estimate.developmentDays}일</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#b0b0c0]">복잡도</span>
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                estimate.complexity === 'high' ? 'bg-red-500/20 text-red-400' :
                estimate.complexity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {estimate.complexity === 'high' ? '높음' : estimate.complexity === 'medium' ? '중간' : '낮음'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#b0b0c0]">팀 규모</span>
              <span className="text-xl font-bold">{estimate.teamSize}명</span>
            </div>
          </div>
        </div>

        <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
          <h3 className="text-lg font-semibold mb-4">비용 예상</h3>
          <div className="space-y-4">
            <div>
              <p className="text-[#b0b0c0] text-sm mb-1">개발 비용</p>
              <p className="text-xl font-bold">${estimate.estimatedCost.development.min.toLocaleString()} - ${estimate.estimatedCost.development.max.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[#b0b0c0] text-sm mb-1">인프라 비용</p>
              <p className="text-xl font-bold">${estimate.estimatedCost.monthly.min} - ${estimate.estimatedCost.monthly.max}/월</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
        <h3 className="text-lg font-semibold mb-4">권장 팀 구성</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {estimate.teamComposition.map((member, index) => (
            <div key={index} className="bg-[#0a0a0f] rounded-lg p-4">
              <p className="font-medium">{translateRole(member.role)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold text-[#7c5cfc]">{member.count}</span>
                <span className="text-sm text-[#b0b0c0]">{translateSeniority(member.seniorityLevel)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
        <h3 className="text-lg font-semibold mb-4">기술 스택</h3>
        <div className="flex flex-wrap gap-2">
          {estimate.techStack.map((tech, index) => (
            <span key={index} className="px-3 py-1.5 bg-[#0a0a0f] rounded-full text-sm border border-[#2a2a3a]">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function translateRole(role: string): string {
  const t: Record<string, string> = {
    'Full-stack Developer': '풀스택 개발자',
    'Frontend Developer': '프론트엔드 개발자',
    'Backend Developer': '백엔드 개발자',
    'UI/UX Designer': 'UI/UX 디자이너',
    'QA Engineer': 'QA 엔지니어',
    'DevOps Engineer': 'DevOps 엔지니어',
    'Tech Lead': '기술 리드',
  };
  return t[role] || role;
}

function translateSeniority(level: string): string {
  const t: Record<string, string> = {
    'Junior': '주니어',
    'Mid-level': '미드레벨',
    'Senior': '시니어',
  };
  return t[level] || level;
}

function AIDLCOutputsTab({ projectIdea }: { projectIdea: string }) {
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);

  const outputs: Record<string, { name: string; phase: string; content: string }> = {
    'requirements.md': {
      name: '요구사항 정의서',
      phase: 'INCEPTION',
      content: `# 요구사항 정의서\n## 프로젝트: ${projectIdea}\n\n### 1. 기능 요구사항 (Functional Requirements)\n\n| ID | 요구사항 | 우선순위 | 상태 |\n|----|----------|----------|------|\n| FR-001 | 사용자 회원가입 로그인 기능 | 높음 | 정의됨 |\n| FR-002 | 소셜 로그인 연동 (Google, Kakao) | 중간 | 정의됨 |\n| FR-003 | 사용자 프로필 관리 | 중간 | 정의됨 |\n| FR-004 | 핵심 비즈니스 로직 구현 | 높음 | 정의됨 |\n| FR-005 | 대시보드 알림 기능 | 중간 | 정의됨 |\n| FR-006 | 검색 및 필터링 기능 | 높음 | 정의됨 |\n| FR-007 | 데이터 내보내기 (CSV, PDF) | 낮음 | 정의됨 |\n\n### 2. 비기능 요구사항\n\n#### 2.1 성능\n- 페이지 로딩 시간: 3초 이내\n- API 응답 시간: 500ms 이내\n- 동시 접속자: 1,000명 이상 지원\n\n#### 2.2 보안\n- HTTPS 전수 사용\n- JWT 기반 인증\n- 민감 데이터 암호화 처리\n- OWASP Top 10 보안 취약점 대응`,
    },
    'user-stories.md': {
      name: '사용자 스토리',
      phase: 'INCEPTION',
      content: `# 사용자 스토리\n## 프로젝트: ${projectIdea}\n\n### Epic 1: 사용자 인증\n\n**US-001: 회원가입**\n- As a 신규 사용자\n- I want to 이메일로 회원가입을\n- So that 서비스를 이용할 수 있다\n\n인수 기준:\n- [ ] 이메일 형식 검증\n- [ ] 비밀번호 강도 검증 (8자 이상, 특수문자 포함)\n- [ ] 이메일 중복 확인\n- [ ] 인증 이메일 발송\n\n**US-002: 소셜 로그인**\n- As a 사용자\n- I want to 소셜 계정으로 간편 로그인을\n- So that 빠르게 서비스에 접근할 수 있다\n\n### Epic 2: 핵심 기능\n\n**US-003: 메인 기능 사용**\n- As a 로그인한 사용자\n- I want to 핵심 서비스 기능을 이용\n- So that 목표를 달성할 수 있다`,
    },
    'components.md': {
      name: '컴포넌트 설계서',
      phase: 'INCEPTION',
      content: `# 컴포넌트 설계서\n## 프로젝트: ${projectIdea}\n\n### 1. 프론트엔드 컴포넌트\n\nsrc/\n  components/\n    common/ (Button, Input, Modal, Loading)\n    layout/ (Header, Sidebar, Footer)\n    features/\n      auth/ (LoginForm, SignupForm)\n      dashboard/ (StatsCard, DataTable)\n  hooks/ (useAuth, useApi)\n  contexts/ (AuthContext)\n\n### 2. 컴포넌트 의존성\n\n| 컴포넌트 | 의존성 | 설명 |\n|----------|--------|------|\n| LoginForm | useAuth, Input, Button | 로그인 폼 |\n| Dashboard | useApi, StatsCard, DataTable | 대시보드 |\n| Header | AuthContext, Button | 상단 네비게이션 |`,
    },
    'api-spec.md': {
      name: 'API 명세서',
      phase: 'CONSTRUCTION',
      content: `# API 명세서\n## 프로젝트: ${projectIdea}\n\n### Base URL: https://api.example.com/v1\n\n### 1. 인증 API\n\nPOST /auth/signup - 회원가입\nPOST /auth/login - 로그인\nPOST /auth/refresh - 토큰 갱신\n\n### 2. 리소스 API\n\nGET /resources - 목록 조회\nPOST /resources - 생성\nGET /resources/:id - 상세 조회\nPUT /resources/:id - 수정\nDELETE /resources/:id - 삭제`,
    },
    'infrastructure.yaml': {
      name: 'AWS 인프라 템플릿',
      phase: 'OPERATIONS',
      content: `# AWS CloudFormation Template\nAWSTemplateFormatVersion: '2010-09-09'\nDescription: ${projectIdea} Infrastructure\n\nResources:\n  ApiGateway:\n    Type: AWS::ApiGatewayV2::Api\n  MainFunction:\n    Type: AWS::Lambda::Function\n    Properties:\n      Runtime: nodejs18.x\n      MemorySize: 256\n  MainTable:\n    Type: AWS::DynamoDB::Table\n    Properties:\n      BillingMode: PAY_PER_REQUEST\n  AssetsBucket:\n    Type: AWS::S3::Bucket`,
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
        <h2 className="text-2xl font-semibold mb-2">AI-DLC 산출물</h2>
        <p className="text-[#b0b0c0]">클릭하여 AI가 생성한 산출물을 확인하세요</p>
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
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <KiroIcon size={48} />
          <h2 className="text-3xl font-semibold">Kiro</h2>
        </div>
        <p className="text-[#b0b0c0]">AWS의 AI 기반 통합 개발 환경</p>
      </div>

      <div className="bg-gradient-to-r from-[#7c5cfc]/20 to-[#7c5cfc]/5 border border-[#7c5cfc]/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-[#7c5cfc] mb-4">구독 플랜</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-[#0a0a0f] rounded-lg p-4">
            <p className="text-2xl font-bold text-white">무료</p>
            <p className="text-sm text-[#b0b0c0] mt-1">기본 기능</p>
            <ul className="mt-3 space-y-1 text-sm text-[#e4e4ed]">
              <li>- 월 50회 AI 요청</li>
              <li>- 기본 코드 생성</li>
              <li>- 커뮤니티 지원</li>
            </ul>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-4 border border-[#7c5cfc]">
            <p className="text-2xl font-bold text-[#7c5cfc]">$19/월</p>
            <p className="text-sm text-[#b0b0c0] mt-1">Pro 플랜</p>
            <ul className="mt-3 space-y-1 text-sm text-[#e4e4ed]">
              <li>- 무제한 AI 요청</li>
              <li>- AI-DLC 전체 기능</li>
              <li>- 우선 지원</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
        <h3 className="text-lg font-semibold mb-4">Kiro만의 특장점</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'AWS Knowledge Base 연동', desc: 'AWS 공식 문서와 베스트 프랙티스가 기본 탑재되어 아키텍처 설계가 수월합니다' },
            { title: '원클릭 AWS 배포', desc: 'CloudFormation/CDK 템플릿 자동 생성으로 즉시 배포 가능합니다' },
            { title: '코드 학습 불필요', desc: '기업 코드로 AI 모델 학습을 하지 않아 안전합니다' },
            { title: '엔터프라이즈 보안', desc: 'AWS 보안 원칙 준수, SOC 2, ISO 27001 인증' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0a0a0f] rounded-lg p-4">
              <p className="font-medium text-[#7c5cfc] mb-2">{item.title}</p>
              <p className="text-sm text-[#b0b0c0]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
        <h3 className="text-lg font-semibold mb-4">다른 AI 에디터와 비교</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a3a]">
              <th className="text-left py-3 px-4 text-[#b0b0c0]">기능</th>
              <th className="text-center py-3 px-4 text-[#7c5cfc]">Kiro</th>
              <th className="text-center py-3 px-4 text-[#b0b0c0]">기존 AI 에디터</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: '코드 학습 불필요 (보안)', kiro: true, others: false },
              { feature: '기업 데이터 안전 보호', kiro: true, others: false },
              { feature: 'AWS Knowledge Base 탑재', kiro: true, others: false },
              { feature: 'AWS 서비스 통합', kiro: true, others: false },
              { feature: '체계적 개발 방법론 (AI-DLC)', kiro: true, others: false },
              { feature: '자동 인프라 설계/배포', kiro: true, others: false },
              { feature: '자동 문서화', kiro: true, others: 'partial' as const },
            ].map((row, i) => (
              <tr key={i} className="border-b border-[#2a2a3a]/50">
                <td className="py-3 px-4 text-[#e4e4ed]">{row.feature}</td>
                <td className="text-center py-3 px-4"><span className="text-[#4a9eff]">&#10003;</span></td>
                <td className="text-center py-3 px-4">
                  {row.others === true ? <span className="text-[#4a9eff]">&#10003;</span> :
                   row.others === 'partial' ? <span className="text-yellow-400">-</span> :
                   <span className="text-red-400">&#10007;</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#4a9eff]">
        <h3 className="text-lg font-semibold mb-4 text-[#4a9eff]">보안 및 프라이버시</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: '코드 학습 불필요', desc: '사용자의 코드로 AI 모델 학습을 하지 않습니다' },
            { title: '데이터 격리', desc: '기업 데이터는 안전하게 격리되어 보호됩니다' },
            { title: 'AWS 보안 원칙', desc: 'AWS의 인프라와 보안 원칙 준수' },
            { title: '규정 준수', desc: 'SOC 2, ISO 27001 등 주요 규정 준수' },
          ].map((item, i) => (
            <div key={i} className="bg-[#0a0a0f] rounded-lg p-4">
              <p className="font-medium text-[#4a9eff]">{item.title}</p>
              <p className="text-sm text-[#b0b0c0] mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <a href="https://kiro.dev" target="_blank" rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white rounded-lg font-medium hover:from-[#6b4beb] hover:to-[#3a8eef] transition-all">
          Kiro 시작하기
        </a>
      </div>
    </div>
  );
}

function EmailReportModal({ projectIdea, estimate, onClose }: { projectIdea: string; estimate: ProjectEstimate | null; onClose: () => void }) {
  const [formData, setFormData] = useState({ email: '', name: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
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
          <h3 className="text-xl font-semibold text-white mb-2">전송 완료</h3>
          <p className="text-[#b0b0c0] mb-6">리포트가 {formData.email}로 전송되었습니다</p>
          <button onClick={onClose} className="px-6 py-2 bg-[#7c5cfc] text-white rounded-lg">확인</button>
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
          <h3 className="text-lg font-semibold text-white">리포트 이메일로 받기</h3>
          <button onClick={onClose} className="text-[#b0b0c0] hover:text-white">x</button>
        </div>

        <p className="text-sm text-[#b0b0c0] mb-4">
          AI-DLC 결과 리포트를 PDF 형태로 이메일로 받아보세요. 프로젝트 산출물, AWS 아키텍처, 예상 비용 등이 포함됩니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#e4e4ed] mb-1">이메일 주소 *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#0a0a0f] text-white p-3 rounded-lg border border-[#2a2a3a] focus:border-[#7c5cfc] focus:outline-none"
              placeholder="email@company.com"
            />
          </div>
          <div>
            <label className="block text-sm text-[#e4e4ed] mb-1">이름 *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#0a0a0f] text-white p-3 rounded-lg border border-[#2a2a3a] focus:border-[#7c5cfc] focus:outline-none"
              placeholder="홍길동"
            />
          </div>
          <div>
            <label className="block text-sm text-[#e4e4ed] mb-1">회사명 *</label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={e => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-[#0a0a0f] text-white p-3 rounded-lg border border-[#2a2a3a] focus:border-[#7c5cfc] focus:outline-none"
              placeholder="회사명"
            />
          </div>

          <div className="bg-[#0a0a0f] rounded-lg p-4 text-sm">
            <p className="text-[#7c5cfc] font-medium mb-2">리포트에 포함되는 내용:</p>
            <ul className="text-[#b0b0c0] space-y-1">
              <li>- 프로젝트 요구사항 정의서</li>
              <li>- AWS 아키텍처 설계</li>
              <li>- 예상 개발 기간 및 비용</li>
              <li>- Kiro 소개 및 장점</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white py-3 rounded-lg font-medium hover:from-[#6b4beb] hover:to-[#3a8eef] disabled:opacity-50 transition-all"
          >
            {isSubmitting ? '전송 중...' : '리포트 받기'}
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
        <div className="text-[#e4e4ed]">결과 로딩 중...</div>
      </div>
    }>
      <ResultPageContent />
    </Suspense>
  );
}
