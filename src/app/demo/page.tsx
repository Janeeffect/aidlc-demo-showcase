'use client';

import React, { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDemoSession } from '@/contexts/DemoSessionContext';
import KiroIDELayout from '@/components/kiro-ide/KiroIDELayout';
import { Phase, Stage } from '@/types/demo';

interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
}

interface DemoStep {
  phase: Phase;
  stage: Stage;
  label: string;
  fileName: string;
  fileContent: string;
  chatSequence: ChatMessage[];
}

function generateDemoSteps(projectIdea: string): DemoStep[] {
  const idea = projectIdea.toLowerCase();

  let domain = '서비스';
  let mainFeatures = '핵심 기능 구현';
  let userType = '사용자/관리자';
  let techBackend = 'AWS Lambda + API Gateway';
  let techDB = 'DynamoDB';
  let nfrFocus = '성능 최적화';

  if (idea.includes('쇼핑') || idea.includes('이커머스') || idea.includes('상품') || idea.includes('주문')) {
    domain = '이커머스 플랫폼'; mainFeatures = '상품 카탈로그, 장바구니, 결제 시스템'; userType = '구매자/판매자'; nfrFocus = '결제 보안 및 트랜잭션 처리';
  } else if (idea.includes('예약') || idea.includes('진료') || idea.includes('병원')) {
    domain = '예약 관리 시스템'; mainFeatures = '예약 스케줄링, 알림, 이력 관리'; userType = '고객/서비스 제공자'; nfrFocus = '실시간 가용성 및 동시성 제어';
  } else if (idea.includes('교육') || idea.includes('강의') || idea.includes('학습') || idea.includes('lms')) {
    domain = '교육 플랫폼'; mainFeatures = '강의 관리, 진도 추적, 퀴즈 시스템'; userType = '학습자/강사'; nfrFocus = '미디어 스트리밍 성능';
  } else if (idea.includes('채팅') || idea.includes('협업') || idea.includes('메신저')) {
    domain = '실시간 협업 플랫폼'; mainFeatures = '실시간 메시징, 파일 공유, 채널 관리'; userType = '팀원/관리자'; techDB = 'DynamoDB + ElastiCache'; nfrFocus = 'WebSocket 실시간 통신';
  } else if (idea.includes('배송') || idea.includes('물류') || idea.includes('택배')) {
    domain = '물류 관리 시스템'; mainFeatures = '배송 추적, 경로 최적화, 재고 관리'; userType = '고객/배송기사'; nfrFocus = '위치 기반 실시간 추적';
  } else if (idea.includes('금융') || idea.includes('결제') || idea.includes('핀테크') || idea.includes('송금')) {
    domain = '핀테크 서비스'; mainFeatures = '계좌 관리, 송금, 거래 내역'; userType = '개인/기업 사용자'; nfrFocus = '금융 보안 및 규정 준수';
  } else if (idea.includes('crm') || idea.includes('고객') || idea.includes('영업')) {
    domain = 'CRM 시스템'; mainFeatures = '고객 관리, 영업 파이프라인, 리포트'; userType = '영업팀/관리자'; nfrFocus = '대용량 데이터 처리';
  }

  const u1 = userType.split('/')[0] || '사용자';
  const u2 = userType.split('/')[1] || '관리자';
  const feat1 = mainFeatures.split(',')[0] || '핵심 기능';

  return [
    {
      phase: 'INCEPTION', stage: 'requirements', label: '요구사항 분석',
      fileName: 'aidlc-docs/inception/requirements.md',
      fileContent: `# 요구사항 분석서\n## 프로젝트: ${projectIdea}\n## 도메인: ${domain}\n\n### 기능 요구사항\n| ID | 요구사항 | 우선순위 |\n|----|----------|----------|\n| FR-001 | ${userType} 인증 및 권한 관리 | 높음 |\n| FR-002 | ${mainFeatures} | 높음 |\n| FR-003 | 대시보드 및 분석 | 중간 |\n| FR-004 | 알림 시스템 | 중간 |\n\n### 비기능 요구사항\n- 성능: API 응답 500ms 이내\n- 보안: ${nfrFocus}\n- 가용성: 99.9% SLA\n\n상태: 완료`,
      chatSequence: [
        { id: '1', type: 'system', content: 'AI-DLC 워크플로우를 시작합니다' },
        { id: '2', type: 'ai', content: `"${projectIdea}" 프로젝트를 분석하겠습니다.\n\n${domain} 유형으로 판별되었습니다.` },
        { id: '3', type: 'ai', content: `Q1. 주요 타겟 플랫폼은?\nA) 웹 애플리케이션  B) 모바일 앱  C) 웹 + 모바일` },
        { id: '4', type: 'user', content: 'A) 웹 애플리케이션' },
        { id: '5', type: 'ai', content: `Q2. ${userType} 인증 방식은?\nA) 이메일/비밀번호  B) 소셜 로그인  C) 기업용 SSO` },
        { id: '6', type: 'user', content: 'B) 소셜 로그인' },
        { id: '7', type: 'ai', content: `요구사항 문서를 생성합니다...\n핵심 기능: ${mainFeatures}` },
      ],
    },
    {
      phase: 'INCEPTION', stage: 'design', label: '사용자 스토리',
      fileName: 'aidlc-docs/inception/user-stories.md',
      fileContent: `# 사용자 스토리\n## 프로젝트: ${projectIdea}\n\n### 페르소나 1: ${u1}\n- US-001: ${u1}로서 쉽게 서비스에 접근하고 싶다\n- US-002: ${u1}로서 ${feat1}을 이용하고 싶다\n\n### 페르소나 2: ${u2}\n- US-003: ${u2}로서 현황을 파악하고 싶다\n\n상태: 완료`,
      chatSequence: [
        { id: '8', type: 'system', content: '사용자 스토리 정의 단계' },
        { id: '9', type: 'ai', content: `Q3. 주요 사용자 유형은?\nA) ${u1}만  B) ${userType}  C) 다중 역할` },
        { id: '10', type: 'user', content: `B) ${userType}` },
        { id: '11', type: 'ai', content: '사용자 스토리를 생성합니다...' },
      ],
    },
    {
      phase: 'INCEPTION', stage: 'design', label: '애플리케이션 설계',
      fileName: 'aidlc-docs/inception/application-design.md',
      fileContent: `# 애플리케이션 설계서\n## ${domain}\n\n### 프론트엔드\n- Next.js 14 + TypeScript\n- Tailwind CSS\n\n### 백엔드\n- ${techBackend}\n- ${techDB}\n- AWS Cognito\n\n상태: 완료`,
      chatSequence: [
        { id: '12', type: 'system', content: '애플리케이션 설계 단계' },
        { id: '13', type: 'ai', content: `Q4. 선호하는 기술 스택은?\nA) Next.js + TypeScript  B) React + JS  C) Vue.js` },
        { id: '14', type: 'user', content: 'A) Next.js + TypeScript' },
        { id: '15', type: 'ai', content: `설계 문서를 생성합니다...\n백엔드: ${techBackend}` },
      ],
    },
    {
      phase: 'CONSTRUCTION', stage: 'code', label: 'NFR 설계',
      fileName: 'aidlc-docs/construction/nfr-design.md',
      fileContent: `# 비기능 요구사항 설계서\n## ${domain}\n\n### 성능: < 500ms (P95)\n### 보안: ${nfrFocus}\n### 확장성: Auto Scaling + DynamoDB On-Demand\n\n상태: 완료`,
      chatSequence: [
        { id: '16', type: 'system', content: 'CONSTRUCTION 단계 진입' },
        { id: '17', type: 'ai', content: `비기능 요구사항을 설계합니다...\n주요 포커스: ${nfrFocus}` },
      ],
    },
    {
      phase: 'CONSTRUCTION', stage: 'code', label: '코드 생성',
      fileName: 'src/app/page.tsx',
      fileContent: `'use client';\n\nexport default function HomePage() {\n  return (\n    <div className="min-h-screen">\n      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">\n        <h1>${projectIdea}</h1>\n        <p>${domain}</p>\n      </header>\n    </div>\n  );\n}`,
      chatSequence: [
        { id: '18', type: 'system', content: '코드 생성 시작' },
        { id: '19', type: 'ai', content: `코드를 생성합니다...\n- ${feat1} 컴포넌트\n- API 라우트 설정` },
      ],
    },
    {
      phase: 'OPERATIONS', stage: 'infrastructure', label: '인프라 설계',
      fileName: 'aidlc-docs/construction/infrastructure.yaml',
      fileContent: `# AWS 인프라 - ${domain}\nResources:\n  ApiGateway:\n    Type: AWS::ApiGatewayV2::Api\n  MainFunction:\n    Type: AWS::Lambda::Function\n  MainTable:\n    Type: AWS::DynamoDB::Table\n  UserPool:\n    Type: AWS::Cognito::UserPool\n  CDN:\n    Type: AWS::CloudFront::Distribution`,
      chatSequence: [
        { id: '20', type: 'system', content: 'OPERATIONS 단계 진입' },
        { id: '21', type: 'ai', content: `AWS 인프라를 설계합니다...\n${techBackend}\n${techDB}` },
      ],
    },
    {
      phase: 'OPERATIONS', stage: 'deployment', label: '배포 계획',
      fileName: 'aidlc-docs/operations/deployment-plan.md',
      fileContent: `# 배포 계획서 - ${domain}\n\n## CI/CD\nGitHub Actions -> AWS CodePipeline\n\n## 환경\n1. dev  2. staging  3. prod\n\nAI-DLC 완료!`,
      chatSequence: [
        { id: '22', type: 'system', content: '배포 계획 생성' },
        { id: '23', type: 'ai', content: 'AI-DLC 워크플로우가 완료되었습니다!' },
      ],
    },
  ];
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function DemoPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdea = searchParams.get('idea') || '';

  const { state, setPhase, setStage, addFile, setProgress } = useDemoSession();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const demoSteps = useMemo(() => generateDemoSteps(projectIdea), [projectIdea]);

  // Refs to avoid stale closures
  const allMessagesRef = useRef<ChatMessage[]>([]);
  const cancelRef = useRef(false);
  const hasInitRef = useRef(false);
  const stepIndexRef = useRef(0);
  const addFileRef = useRef(addFile);
  const setPhaseRef = useRef(setPhase);
  const setStageRef = useRef(setStage);
  const setProgressRef = useRef(setProgress);
  const routerRef = useRef(router);

  useEffect(() => {
    addFileRef.current = addFile;
    setPhaseRef.current = setPhase;
    setStageRef.current = setStage;
    setProgressRef.current = setProgress;
    routerRef.current = router;
  });

  // 전체 자동 진행
  useEffect(() => {
    if (!projectIdea) {
      router.push('/');
      return;
    }
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    cancelRef.current = false;

    async function runAllSteps() {
      const steps = demoSteps;

      for (let stepIdx = 0; stepIdx < steps.length; stepIdx++) {
        if (cancelRef.current) return;

        stepIndexRef.current = stepIdx;
        setCurrentStepIndex(stepIdx);
        const step = steps[stepIdx];

        setPhaseRef.current(step.phase);
        setStageRef.current(step.stage);

        // 채팅 메시지 애니메이션
        for (let i = 0; i < step.chatSequence.length; i++) {
          if (cancelRef.current) return;
          const msg = step.chatSequence[i];

          if (msg.type === 'ai') {
            setIsTyping(true);
            await delay(800);
            if (cancelRef.current) return;
            setIsTyping(false);
          } else if (msg.type === 'user') {
            await delay(400);
          } else {
            await delay(200);
          }
          if (cancelRef.current) return;

          allMessagesRef.current = [...allMessagesRef.current, msg];
          setChatMessages([...allMessagesRef.current]);
        }

        if (cancelRef.current) return;
        await delay(500);
        if (cancelRef.current) return;

        // 파일 추가
        addFileRef.current({
          name: step.fileName.split('/').pop() || step.fileName,
          path: step.fileName,
          type: 'file',
          isNew: true,
        });
        setActiveFile(step.fileName);
        setEditorContent(step.fileContent);
        setProgressRef.current(Math.round(((stepIdx + 1) / steps.length) * 100));

        // 단계 간 대기
        if (stepIdx < steps.length - 1) {
          await delay(1200);
        }
      }

      if (cancelRef.current) return;

      // 완료 -> 결과 페이지
      await delay(1000);
      if (!cancelRef.current) {
        routerRef.current.push(`/result?idea=${encodeURIComponent(projectIdea)}`);
      }
    }

    runAllSteps();

    return () => {
      cancelRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIdea]);

  // 결과 페이지로 스킵
  const handleSkip = () => {
    cancelRef.current = true;
    router.push(`/result?idea=${encodeURIComponent(projectIdea)}`);
  };

  if (!projectIdea) return null;

  const currentStep = demoSteps[currentStepIndex];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <div className="flex-1 min-h-0">
        <KiroIDELayout
          files={state.files}
          activeFile={activeFile}
          editorContent={editorContent}
          onFileClick={setActiveFile}
          isTyping={isTyping}
          chatMessages={chatMessages}
        />
      </div>
      {/* 하단 진행 바 */}
      <div className="bg-[#12121a] border-t border-[#2a2a3a] px-6 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => { cancelRef.current = true; router.push('/'); }}
          className="px-4 py-2 text-sm text-[#b0b0c0] hover:text-[#e4e4ed] transition-colors"
        >
          ← 처음으로
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#b0b0c0]">
            {currentStep?.label} ({currentStepIndex + 1}/{demoSteps.length})
          </span>
          <div className="flex gap-1">
            {demoSteps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i <= currentStepIndex ? 'bg-[#7c5cfc]' : 'bg-[#2a2a3a]'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleSkip}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#1a1a25] text-[#b0b0c0] hover:text-[#e4e4ed] hover:bg-[#2a2a3a] border border-[#2a2a3a] transition-all"
          >
            결과 바로 보기 →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7c5cfc] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#e4e4ed]">Loading Kiro...</div>
        </div>
      </div>
    }>
      <DemoPageContent />
    </Suspense>
  );
}
