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

interface IndustryScenario {
  domain: string;
  userTypes: string;
  mainFeatures: string[];
  techStack: { frontend: string; backend: string; db: string; extra: string };
  nfrFocus: string;
  questions: { q: string; options: string[]; answer: string }[];
  userStories: { persona: string; stories: string[] }[];
  apiEndpoints: string[];
  awsServices: string[];
}

function detectScenario(idea: string): IndustryScenario {
  const i = idea.toLowerCase();

  // 이커머스/리테일
  if (i.includes('쇼핑') || i.includes('이커머스') || i.includes('상품') || i.includes('주문') || i.includes('리테일') || i.includes('재고') || i.includes('리뷰')) {
    return {
      domain: '이커머스 플랫폼',
      userTypes: '구매자/판매자',
      mainFeatures: ['상품 카탈로그 및 검색', '장바구니 및 위시리스트', '결제 및 주문 관리', '리뷰 및 평점 시스템', '판매자 대시보드'],
      techStack: { frontend: 'Next.js 14 + TypeScript', backend: 'AWS Lambda + API Gateway', db: 'DynamoDB + ElastiCache', extra: 'Stripe 결제 연동' },
      nfrFocus: '결제 트랜잭션 보안 및 PCI DSS 준수',
      questions: [
        { q: '판매 상품 유형은?', options: ['A) 실물 상품 (배송 필요)', 'B) 디지털 상품 (즉시 다운로드)', 'C) 실물 + 디지털 혼합'], answer: 'A) 실물 상품 (배송 필요)' },
        { q: '결제 수단은?', options: ['A) 신용카드만', 'B) 신용카드 + 간편결제 (카카오페이, 네이버페이)', 'C) 전체 (카드+간편결제+계좌이체)'], answer: 'B) 신용카드 + 간편결제' },
        { q: '예상 상품 수는?', options: ['A) 100개 미만', 'B) 100~10,000개', 'C) 10,000개 이상'], answer: 'B) 100~10,000개' },
      ],
      userStories: [
        { persona: '구매자', stories: ['상품을 카테고리별로 탐색하고 싶다', '장바구니에 담고 한번에 결제하고 싶다', '주문 배송 상태를 실시간 추적하고 싶다'] },
        { persona: '판매자', stories: ['상품을 등록하고 재고를 관리하고 싶다', '주문 현황과 매출 통계를 보고 싶다', '고객 리뷰에 답변하고 싶다'] },
      ],
      apiEndpoints: ['GET /products - 상품 목록', 'POST /cart - 장바구니 추가', 'POST /orders - 주문 생성', 'GET /orders/:id/tracking - 배송 추적', 'POST /reviews - 리뷰 작성'],
      awsServices: ['API Gateway', 'Lambda', 'DynamoDB', 'S3 (상품 이미지)', 'CloudFront (CDN)', 'SQS (주문 처리 큐)', 'SNS (알림)'],
    };
  }

  // 핀테크/금융
  if (i.includes('금융') || i.includes('결제') || i.includes('핀테크') || i.includes('송금') || i.includes('가계부') || i.includes('투자') || i.includes('대출')) {
    return {
      domain: '핀테크 서비스',
      userTypes: '개인 사용자/기업 관리자',
      mainFeatures: ['계좌 관리 및 잔액 조회', '송금 및 결제', '거래 내역 분석', '예산 관리 및 알림', '투자 포트폴리오'],
      techStack: { frontend: 'Next.js 14 + TypeScript', backend: 'AWS Lambda + API Gateway', db: 'Aurora PostgreSQL + DynamoDB', extra: 'KMS 암호화 + WAF' },
      nfrFocus: '금융 보안 규정 준수 (전자금융거래법, PCI DSS)',
      questions: [
        { q: '주요 금융 서비스는?', options: ['A) 송금/결제', 'B) 자산 관리/투자', 'C) 대출/신용 평가'], answer: 'A) 송금/결제' },
        { q: '본인 인증 방식은?', options: ['A) 휴대폰 인증', 'B) 공동인증서', 'C) 생체 인증 (지문/Face ID)'], answer: 'C) 생체 인증' },
        { q: '일일 거래 한도는?', options: ['A) 100만원', 'B) 500만원', 'C) 1,000만원 이상'], answer: 'B) 500만원' },
      ],
      userStories: [
        { persona: '개인 사용자', stories: ['간편하게 송금하고 싶다', '월별 지출 패턴을 분석하고 싶다', '이상 거래 시 즉시 알림 받고 싶다'] },
        { persona: '기업 관리자', stories: ['직원 급여를 일괄 송금하고 싶다', '법인 계좌 거래 내역을 감사하고 싶다', '월별 재무 리포트를 자동 생성하고 싶다'] },
      ],
      apiEndpoints: ['GET /accounts - 계좌 목록', 'POST /transfers - 송금', 'GET /transactions - 거래 내역', 'POST /auth/biometric - 생체 인증', 'GET /analytics/spending - 지출 분석'],
      awsServices: ['API Gateway + WAF', 'Lambda', 'Aurora PostgreSQL', 'KMS (암호화)', 'CloudTrail (감사)', 'SNS (알림)', 'Step Functions (송금 워크플로우)'],
    };
  }

  // 헬스케어/의료
  if (i.includes('헬스') || i.includes('의료') || i.includes('진료') || i.includes('건강') || i.includes('병원') || i.includes('약') || i.includes('피트니스')) {
    return {
      domain: '헬스케어 플랫폼',
      userTypes: '환자/의료진',
      mainFeatures: ['진료 예약 및 대기 관리', '전자 건강 기록 (EHR)', '원격 진료 (화상 상담)', '처방전 및 약 복용 알림', '건강 데이터 대시보드'],
      techStack: { frontend: 'Next.js 14 + TypeScript', backend: 'AWS Lambda + API Gateway', db: 'Aurora PostgreSQL + S3', extra: 'Chime SDK (화상 진료)' },
      nfrFocus: '의료 데이터 보안 (HIPAA 준수) 및 개인정보 보호',
      questions: [
        { q: '주요 의료 서비스는?', options: ['A) 진료 예약 시스템', 'B) 원격 진료 플랫폼', 'C) 건강 기록 관리'], answer: 'B) 원격 진료 플랫폼' },
        { q: '환자 데이터 저장 방식은?', options: ['A) 클라우드 (암호화)', 'B) 온프레미스', 'C) 하이브리드'], answer: 'A) 클라우드 (암호화)' },
        { q: '연동할 외부 시스템은?', options: ['A) 건강보험 심사평가원', 'B) 약국 처방 시스템', 'C) 둘 다'], answer: 'C) 둘 다' },
      ],
      userStories: [
        { persona: '환자', stories: ['원하는 시간에 진료를 예약하고 싶다', '집에서 화상으로 진료 받고 싶다', '약 복용 시간에 알림을 받고 싶다'] },
        { persona: '의료진', stories: ['환자 진료 기록을 한눈에 보고 싶다', '오늘 예약 환자 목록을 확인하고 싶다', '처방전을 전자로 발행하고 싶다'] },
      ],
      apiEndpoints: ['POST /appointments - 예약 생성', 'GET /patients/:id/records - 진료 기록', 'POST /teleconsult - 원격 진료 시작', 'POST /prescriptions - 처방전 발행', 'GET /schedule - 의료진 일정'],
      awsServices: ['API Gateway', 'Lambda', 'Aurora PostgreSQL', 'S3 (의료 영상)', 'Chime SDK (화상)', 'KMS (암호화)', 'EventBridge (알림 스케줄)'],
    };
  }

  // 교육/에듀테크
  if (i.includes('교육') || i.includes('강의') || i.includes('학습') || i.includes('lms') || i.includes('퀴즈') || i.includes('과외') || i.includes('시험')) {
    return {
      domain: '교육 플랫폼',
      userTypes: '학습자/강사',
      mainFeatures: ['강의 영상 스트리밍', '학습 진도 추적', '퀴즈 및 과제 시스템', '수료증 발급', '실시간 Q&A'],
      techStack: { frontend: 'Next.js 14 + TypeScript', backend: 'AWS Lambda + API Gateway', db: 'DynamoDB + S3', extra: 'MediaConvert (영상 인코딩) + CloudFront' },
      nfrFocus: '대용량 영상 스트리밍 성능 및 CDN 최적화',
      questions: [
        { q: '강의 형태는?', options: ['A) 녹화 영상 (VOD)', 'B) 실시간 라이브', 'C) VOD + 라이브 혼합'], answer: 'C) VOD + 라이브 혼합' },
        { q: '평가 방식은?', options: ['A) 객관식 퀴즈', 'B) 과제 제출', 'C) 퀴즈 + 과제 + 실습'], answer: 'C) 퀴즈 + 과제 + 실습' },
        { q: '수강생 규모는?', options: ['A) 100명 미만', 'B) 100~5,000명', 'C) 5,000명 이상'], answer: 'B) 100~5,000명' },
      ],
      userStories: [
        { persona: '학습자', stories: ['내 수준에 맞는 강의를 찾고 싶다', '학습 진도를 확인하고 이어서 듣고 싶다', '퀴즈로 이해도를 점검하고 싶다'] },
        { persona: '강사', stories: ['강의를 업로드하고 커리큘럼을 구성하고 싶다', '수강생 학습 현황을 분석하고 싶다', '과제를 출제하고 채점하고 싶다'] },
      ],
      apiEndpoints: ['GET /courses - 강의 목록', 'GET /courses/:id/lessons - 레슨 목록', 'POST /progress - 진도 업데이트', 'POST /quizzes/:id/submit - 퀴즈 제출', 'GET /certificates - 수료증'],
      awsServices: ['API Gateway', 'Lambda', 'DynamoDB', 'S3 (영상 저장)', 'CloudFront (스트리밍)', 'MediaConvert (인코딩)', 'Cognito (인증)'],
    };
  }

  // 물류/배송
  if (i.includes('물류') || i.includes('배송') || i.includes('택배') || i.includes('창고') || i.includes('차량') || i.includes('라스트마일')) {
    return {
      domain: '물류 관리 시스템',
      userTypes: '고객/배송기사/관리자',
      mainFeatures: ['실시간 배송 추적', '경로 최적화', '창고 재고 관리', '배송기사 앱', '배송 상태 알림'],
      techStack: { frontend: 'Next.js 14 + TypeScript', backend: 'AWS Lambda + API Gateway', db: 'DynamoDB + Aurora', extra: 'Location Service (지도) + IoT Core' },
      nfrFocus: '실시간 위치 추적 및 대량 IoT 데이터 처리',
      questions: [
        { q: '배송 유형은?', options: ['A) 일반 택배', 'B) 당일/새벽 배송', 'C) 냉장/냉동 특수 배송'], answer: 'B) 당일/새벽 배송' },
        { q: '차량 관제 방식은?', options: ['A) GPS 실시간 추적', 'B) 체크포인트 기반', 'C) GPS + IoT 센서'], answer: 'C) GPS + IoT 센서' },
        { q: '일일 배송 건수는?', options: ['A) 100건 미만', 'B) 100~5,000건', 'C) 5,000건 이상'], answer: 'B) 100~5,000건' },
      ],
      userStories: [
        { persona: '고객', stories: ['내 택배가 어디 있는지 실시간으로 보고 싶다', '배송 도착 예정 시간을 알고 싶다', '부재 시 배송 장소를 변경하고 싶다'] },
        { persona: '배송기사', stories: ['오늘 배송 목록과 최적 경로를 보고 싶다', '배송 완료를 사진으로 증빙하고 싶다', '고객에게 도착 알림을 보내고 싶다'] },
      ],
      apiEndpoints: ['GET /deliveries - 배송 목록', 'GET /tracking/:id - 실시간 추적', 'PUT /deliveries/:id/status - 상태 업데이트', 'POST /routes/optimize - 경로 최적화', 'GET /warehouse/inventory - 재고 조회'],
      awsServices: ['API Gateway', 'Lambda', 'DynamoDB', 'Location Service (지도)', 'IoT Core (GPS)', 'SNS (알림)', 'S3 (배송 사진)'],
    };
  }

  // SaaS/생산성
  if (i.includes('프로젝트') || i.includes('협업') || i.includes('crm') || i.includes('문서') || i.includes('일정') || i.includes('관리 도구') || i.includes('팀')) {
    return {
      domain: 'SaaS 협업 플랫폼',
      userTypes: '팀원/관리자',
      mainFeatures: ['프로젝트 보드 (칸반)', '실시간 문서 편집', '팀 채팅 및 알림', '일정 관리', '리포트 및 분석'],
      techStack: { frontend: 'Next.js 14 + TypeScript', backend: 'AWS Lambda + API Gateway', db: 'DynamoDB + ElastiCache', extra: 'AppSync (실시간) + Cognito' },
      nfrFocus: '실시간 동시 편집 및 WebSocket 성능',
      questions: [
        { q: '주요 협업 기능은?', options: ['A) 프로젝트 관리 (칸반/간트)', 'B) 문서 협업', 'C) 프로젝트 + 문서 + 채팅 통합'], answer: 'C) 프로젝트 + 문서 + 채팅 통합' },
        { q: '팀 규모는?', options: ['A) 10명 미만', 'B) 10~100명', 'C) 100명 이상 (엔터프라이즈)'], answer: 'B) 10~100명' },
        { q: '외부 연동은?', options: ['A) Slack', 'B) Jira', 'C) Slack + Jira + GitHub'], answer: 'C) Slack + Jira + GitHub' },
      ],
      userStories: [
        { persona: '팀원', stories: ['내 할 일 목록을 한눈에 보고 싶다', '문서를 팀원과 동시에 편집하고 싶다', '프로젝트 진행 상황을 공유하고 싶다'] },
        { persona: '관리자', stories: ['팀 전체 업무 현황을 파악하고 싶다', '프로젝트별 리소스 배분을 관리하고 싶다', '주간/월간 리포트를 자동 생성하고 싶다'] },
      ],
      apiEndpoints: ['GET /projects - 프로젝트 목록', 'POST /tasks - 태스크 생성', 'PUT /tasks/:id - 태스크 업데이트', 'GET /documents/:id - 문서 조회', 'POST /messages - 메시지 전송'],
      awsServices: ['API Gateway', 'Lambda', 'DynamoDB', 'AppSync (실시간)', 'ElastiCache (캐시)', 'Cognito (인증)', 'S3 (파일 저장)'],
    };
  }

  // 채팅/메신저
  if (i.includes('채팅') || i.includes('chat') || i.includes('메신저')) {
    return {
      domain: '실시간 메시징 플랫폼',
      userTypes: '사용자/관리자',
      mainFeatures: ['1:1 및 그룹 채팅', '파일/이미지 공유', '읽음 확인 및 알림', '채널 관리', '메시지 검색'],
      techStack: { frontend: 'Next.js 14 + TypeScript', backend: 'AWS Lambda + API Gateway', db: 'DynamoDB + ElastiCache', extra: 'AppSync (WebSocket) + S3' },
      nfrFocus: 'WebSocket 실시간 메시지 전달 및 오프라인 동기화',
      questions: [
        { q: '채팅 유형은?', options: ['A) 1:1 채팅만', 'B) 1:1 + 그룹 채팅', 'C) 1:1 + 그룹 + 채널 (Slack형)'], answer: 'C) 1:1 + 그룹 + 채널' },
        { q: '파일 공유 한도는?', options: ['A) 10MB', 'B) 50MB', 'C) 100MB 이상'], answer: 'B) 50MB' },
        { q: '메시지 보관 기간은?', options: ['A) 30일', 'B) 1년', 'C) 무제한'], answer: 'C) 무제한' },
      ],
      userStories: [
        { persona: '사용자', stories: ['친구에게 실시간으로 메시지를 보내고 싶다', '사진과 파일을 쉽게 공유하고 싶다', '과거 대화를 검색하고 싶다'] },
        { persona: '관리자', stories: ['채널을 생성하고 멤버를 관리하고 싶다', '부적절한 메시지를 모니터링하고 싶다', '사용 통계를 확인하고 싶다'] },
      ],
      apiEndpoints: ['POST /messages - 메시지 전송', 'GET /conversations - 대화 목록', 'POST /channels - 채널 생성', 'GET /messages/search - 메시지 검색', 'POST /files/upload - 파일 업로드'],
      awsServices: ['API Gateway', 'Lambda', 'DynamoDB', 'AppSync (WebSocket)', 'ElastiCache (온라인 상태)', 'S3 (파일)', 'SNS (푸시 알림)'],
    };
  }

  // 기본 (범용)
  return {
    domain: '웹 서비스',
    userTypes: '사용자/관리자',
    mainFeatures: ['사용자 인증 및 프로필', '핵심 비즈니스 로직', '대시보드 및 분석', '알림 시스템', '데이터 관리'],
    techStack: { frontend: 'Next.js 14 + TypeScript', backend: 'AWS Lambda + API Gateway', db: 'DynamoDB', extra: 'Cognito + CloudFront' },
    nfrFocus: '성능 최적화 및 확장성',
    questions: [
      { q: '주요 타겟 플랫폼은?', options: ['A) 웹 애플리케이션', 'B) 모바일 앱', 'C) 웹 + 모바일'], answer: 'A) 웹 애플리케이션' },
      { q: '사용자 인증 방식은?', options: ['A) 이메일/비밀번호', 'B) 소셜 로그인', 'C) SSO'], answer: 'B) 소셜 로그인' },
      { q: '예상 사용자 수는?', options: ['A) 1,000명 미만', 'B) 1,000~10,000명', 'C) 10,000명 이상'], answer: 'B) 1,000~10,000명' },
    ],
    userStories: [
      { persona: '사용자', stories: ['쉽게 서비스에 가입하고 싶다', '핵심 기능을 빠르게 이용하고 싶다', '내 데이터를 안전하게 관리하고 싶다'] },
      { persona: '관리자', stories: ['사용자 현황을 파악하고 싶다', '시스템 상태를 모니터링하고 싶다', '리포트를 생성하고 싶다'] },
    ],
    apiEndpoints: ['POST /auth/signup - 회원가입', 'POST /auth/login - 로그인', 'GET /resources - 리소스 목록', 'POST /resources - 리소스 생성', 'GET /dashboard - 대시보드'],
    awsServices: ['API Gateway', 'Lambda', 'DynamoDB', 'Cognito', 'CloudFront', 'S3', 'CloudWatch'],
  };
}

function generateDemoSteps(projectIdea: string): DemoStep[] {
  const s = detectScenario(projectIdea);
  const user1 = s.userTypes.split('/')[0];
  const user2 = s.userTypes.split('/')[1] || '관리자';
  let id = 0;
  const nextId = () => String(++id);

  return [
    {
      phase: 'INCEPTION',
      stage: 'requirements',
      label: '요구사항 분석',
      fileName: 'aidlc-docs/inception/requirements.md',
      fileContent: `# 요구사항 분석서\n## 프로젝트: ${projectIdea}\n## 도메인: ${s.domain}\n\n---\n\n## 1. 프로젝트 개요\n\n**프로젝트명**: ${projectIdea}\n**도메인**: ${s.domain}\n**대상 사용자**: ${s.userTypes}\n**프로젝트 유형**: 신규 개발 (Greenfield)\n\n## 2. 기능 요구사항 (Functional Requirements)\n\n| ID | 요구사항 | 우선순위 | 복잡도 | 비고 |\n|------|----------|----------|--------|------|\n${s.mainFeatures.map((f, i) => `| FR-${String(i+1).padStart(3,'0')} | ${f} | ${i < 2 ? '높음' : i < 4 ? '중간' : '낮음'} | ${i < 2 ? '상' : '중'} | MVP ${i < 3 ? '포함' : '제외'} |`).join('\n')}\n\n## 3. 비기능 요구사항 (Non-Functional Requirements)\n\n| ID | 카테고리 | 요구사항 | 목표치 |\n|------|----------|----------|--------|\n| NFR-001 | 성능 | API 응답 시간 | P95 < 500ms |\n| NFR-002 | 성능 | 동시 사용자 | 1,000명 |\n| NFR-003 | 가용성 | SLA | 99.9% |\n| NFR-004 | 보안 | ${s.nfrFocus} | 필수 |\n| NFR-005 | 확장성 | Auto Scaling | 트래픽 기반 |\n\n## 4. 기술 스택\n\n- **Frontend**: ${s.techStack.frontend}\n- **Backend**: ${s.techStack.backend}\n- **Database**: ${s.techStack.db}\n- **추가**: ${s.techStack.extra}\n\n## 5. 제약 조건\n\n- AWS 클라우드 환경에서 운영\n- 한국어 UI 우선 지원\n- 모바일 반응형 필수\n\n---\n상태: 완료`,
      chatSequence: [
        { id: nextId(), type: 'system', content: 'AI-DLC 워크플로우를 시작합니다' },
        { id: nextId(), type: 'ai', content: `"${projectIdea}" 프로젝트를 분석하겠습니다.\n\n${s.domain} 유형으로 판별되었습니다.\n주요 사용자: ${s.userTypes}` },
        { id: nextId(), type: 'ai', content: `Q1. ${s.questions[0].q}\n\n${s.questions[0].options.join('\n')}` },
        { id: nextId(), type: 'user', content: s.questions[0].answer },
        { id: nextId(), type: 'ai', content: `Q2. ${s.questions[1].q}\n\n${s.questions[1].options.join('\n')}` },
        { id: nextId(), type: 'user', content: s.questions[1].answer },
        { id: nextId(), type: 'ai', content: `요구사항 문서를 생성합니다...\n\n핵심 기능:\n${s.mainFeatures.slice(0, 3).map(f => `- ${f}`).join('\n')}` },
      ],
    },
    {
      phase: 'INCEPTION',
      stage: 'design',
      label: '사용자 스토리',
      fileName: 'aidlc-docs/inception/user-stories.md',
      fileContent: `# 사용자 스토리\n## 프로젝트: ${projectIdea}\n\n---\n\n## 페르소나 정의\n\n### ${user1}\n- **역할**: ${s.domain}의 주요 사용자\n- **목표**: 서비스를 통해 핵심 가치를 얻음\n- **기술 수준**: 일반 사용자 (모바일/웹 친숙)\n\n### ${user2}\n- **역할**: ${s.domain}의 운영/관리 담당\n- **목표**: 서비스 운영 효율화 및 데이터 기반 의사결정\n- **기술 수준**: 중급 (관리 도구 사용 경험)\n\n---\n\n## 사용자 스토리 목록\n\n### ${user1} 스토리\n\n${s.userStories[0].stories.map((st, i) => `**US-${String(i+1).padStart(3,'0')}**: ${user1}로서 ${st}\n- **인수 기준**: ${st.replace('싶다', '수 있다')}\n- **우선순위**: ${i === 0 ? '높음' : '중간'}`).join('\n\n')}\n\n### ${user2} 스토리\n\n${s.userStories[1].stories.map((st, i) => `**US-${String(i+11).padStart(3,'0')}**: ${user2}로서 ${st}\n- **인수 기준**: ${st.replace('싶다', '수 있다')}\n- **우선순위**: ${i === 0 ? '높음' : '중간'}`).join('\n\n')}\n\n---\n\n## 스토리 맵 요약\n\n| 페르소나 | 스토리 수 | MVP 포함 | 우선순위 높음 |\n|----------|-----------|----------|---------------|\n| ${user1} | ${s.userStories[0].stories.length} | ${Math.min(2, s.userStories[0].stories.length)} | 1 |\n| ${user2} | ${s.userStories[1].stories.length} | ${Math.min(2, s.userStories[1].stories.length)} | 1 |\n\n상태: 완료`,
      chatSequence: [
        { id: nextId(), type: 'system', content: '사용자 스토리 정의 단계' },
        { id: nextId(), type: 'ai', content: `Q3. ${s.questions[2].q}\n\n${s.questions[2].options.join('\n')}` },
        { id: nextId(), type: 'user', content: s.questions[2].answer },
        { id: nextId(), type: 'ai', content: `사용자 스토리를 생성합니다...\n\n${user1} 페르소나: ${s.userStories[0].stories[0]}\n${user2} 페르소나: ${s.userStories[1].stories[0]}` },
      ],
    },
    {
      phase: 'INCEPTION',
      stage: 'design',
      label: '애플리케이션 설계',
      fileName: 'aidlc-docs/inception/application-design.md',
      fileContent: `# 애플리케이션 설계서\n## ${s.domain}\n\n---\n\n## 1. 시스템 아키텍처\n\n### 프론트엔드\n- **프레임워크**: ${s.techStack.frontend}\n- **스타일링**: Tailwind CSS + Headless UI\n- **상태관리**: React Context + useReducer\n- **데이터 페칭**: TanStack Query (React Query)\n\n### 백엔드\n- **런타임**: ${s.techStack.backend}\n- **데이터베이스**: ${s.techStack.db}\n- **추가**: ${s.techStack.extra}\n\n## 2. API 설계\n\n| Method | Endpoint | 설명 |\n|--------|----------|------|\n${s.apiEndpoints.map(e => { const p = e.split(' - '); const mp = p[0].split(' '); return `| ${mp[0]} | ${mp[1]} | ${p[1] || ''} |`; }).join('\n')}\n\n## 3. 컴포넌트 구조\n\nsrc/\n  app/\n    layout.tsx\n    page.tsx\n    (routes)/\n  components/\n    common/ (Button, Input, Modal, Card)\n    layout/ (Header, Sidebar, Footer)\n    features/\n${s.mainFeatures.slice(0, 3).map(f => `      ${f.split(' ')[0]}/`).join('\n')}\n  hooks/\n    useAuth.ts\n    useApi.ts\n  contexts/\n    AuthContext.tsx\n  services/\n    api.ts\n  types/\n    index.ts\n\n## 4. 데이터 모델\n\n### 주요 엔티티\n- **User**: id, email, name, role, createdAt\n${s.mainFeatures.slice(0, 2).map((f, i) => `- **${f.split(' ')[0]}**: id, ${i === 0 ? 'title, description, status' : 'userId, data, timestamp'}`).join('\n')}\n\n---\n상태: 완료`,
      chatSequence: [
        { id: nextId(), type: 'system', content: '애플리케이션 설계 단계' },
        { id: nextId(), type: 'ai', content: `${s.domain} 아키텍처를 설계합니다...\n\nFrontend: ${s.techStack.frontend}\nBackend: ${s.techStack.backend}\nDB: ${s.techStack.db}` },
        { id: nextId(), type: 'ai', content: `API 엔드포인트:\n${s.apiEndpoints.slice(0, 3).map(e => `- ${e}`).join('\n')}` },
      ],
    },
    {
      phase: 'CONSTRUCTION',
      stage: 'code',
      label: 'NFR 설계',
      fileName: 'aidlc-docs/construction/nfr-design.md',
      fileContent: `# 비기능 요구사항 설계서\n## ${s.domain}\n\n---\n\n## 1. 성능 설계\n\n| 지표 | 목표 | 전략 |\n|------|------|------|\n| API 응답 시간 | P95 < 500ms | Lambda 최적화 + ElastiCache |\n| 페이지 로드 | < 2초 (LCP) | CloudFront CDN + 코드 스플리팅 |\n| 동시 사용자 | 1,000명 | Auto Scaling + Connection Pooling |\n| DB 쿼리 | < 100ms | 인덱스 최적화 + 캐시 레이어 |\n\n## 2. 보안 설계\n\n### 인증/인가\n- AWS Cognito User Pool + JWT\n- OAuth 2.0 + PKCE (소셜 로그인)\n- Role-Based Access Control (RBAC)\n\n### 데이터 보안\n- 전송 중: TLS 1.3\n- 저장 시: AES-256 (KMS 관리)\n- 핵심: ${s.nfrFocus}\n\n### 네트워크 보안\n- AWS WAF (SQL Injection, XSS 방어)\n- API Gateway 스로틀링 (10,000 req/sec)\n- VPC + Private Subnet (DB 격리)\n\n## 3. 확장성 설계\n\n- **수평 확장**: Lambda 동시성 자동 조절\n- **데이터 계층**: ${s.techStack.db} On-Demand 모드\n- **캐시**: ElastiCache Redis 클러스터\n- **CDN**: CloudFront 글로벌 엣지\n\n## 4. 관측성 (Observability)\n\n- **로깅**: CloudWatch Logs + 구조화 로깅\n- **메트릭**: CloudWatch Metrics + 커스텀 대시보드\n- **트레이싱**: AWS X-Ray 분산 추적\n- **알림**: CloudWatch Alarms + SNS\n\n---\n상태: 완료`,
      chatSequence: [
        { id: nextId(), type: 'system', content: 'CONSTRUCTION 단계 진입' },
        { id: nextId(), type: 'ai', content: `비기능 요구사항을 설계합니다...\n\n핵심 포커스: ${s.nfrFocus}\n\n- 성능 최적화 전략\n- 보안 아키텍처\n- 확장성 계획` },
      ],
    },
    {
      phase: 'CONSTRUCTION',
      stage: 'code',
      label: '코드 생성',
      fileName: 'src/app/page.tsx',
      fileContent: `'use client';\n\nimport React, { useState, useEffect } from 'react';\n\n// ${s.domain} - 메인 페이지\n// Generated by AI-DLC Code Generation\n\ninterface ${s.mainFeatures[0].split(' ')[0]}Item {\n  id: string;\n  title: string;\n  description: string;\n  status: 'active' | 'inactive';\n  createdAt: string;\n}\n\nexport default function HomePage() {\n  const [items, setItems] = useState<${s.mainFeatures[0].split(' ')[0]}Item[]>([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        const res = await fetch('${s.apiEndpoints[0].split(' - ')[0].split(' ')[1]}');\n        const data = await res.json();\n        setItems(data);\n      } catch (err) {\n        console.error('Failed to fetch:', err);\n      } finally {\n        setLoading(false);\n      }\n    };\n    fetchData();\n  }, []);\n\n  return (\n    <div className="min-h-screen bg-gray-50">\n      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">\n        <div className="max-w-6xl mx-auto">\n          <h1 className="text-2xl font-bold">${projectIdea}</h1>\n          <p className="text-blue-100 mt-1">${s.domain}</p>\n        </div>\n      </header>\n\n      <nav className="bg-white shadow-sm border-b">\n        <div className="max-w-6xl mx-auto flex gap-6 px-6 py-3">\n${s.mainFeatures.slice(0, 4).map(f => `          <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">${f.split(' ')[0]}</a>`).join('\n')}\n        </div>\n      </nav>\n\n      <main className="max-w-6xl mx-auto p-6">\n        {loading ? (\n          <div className="text-center py-12 text-gray-500">로딩 중...</div>\n        ) : (\n          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\n            {items.map(item => (\n              <div key={item.id} className="bg-white p-6 rounded-lg shadow">\n                <h3 className="font-semibold text-gray-900">{item.title}</h3>\n                <p className="text-gray-600 text-sm mt-2">{item.description}</p>\n              </div>\n            ))}\n          </div>\n        )}\n      </main>\n    </div>\n  );\n}`,
      chatSequence: [
        { id: nextId(), type: 'system', content: '코드 생성 시작' },
        { id: nextId(), type: 'ai', content: `코드를 생성합니다...\n\n- 프로젝트 구조 생성\n- ${s.mainFeatures[0]} 컴포넌트\n- ${s.mainFeatures[1]} 컴포넌트\n- API 라우트 설정` },
      ],
    },
    {
      phase: 'OPERATIONS',
      stage: 'infrastructure',
      label: '인프라 설계',
      fileName: 'aidlc-docs/construction/infrastructure.yaml',
      fileContent: `# AWS 인프라 설계 - ${s.domain}\n# Generated by AI-DLC Infrastructure Design\nAWSTemplateFormatVersion: '2010-09-09'\nDescription: ${projectIdea} - AWS Infrastructure\n\nParameters:\n  Environment:\n    Type: String\n    Default: production\n    AllowedValues: [dev, staging, production]\n  ProjectName:\n    Type: String\n    Default: ${projectIdea.replace(/\s/g, '-').toLowerCase()}\n\nResources:\n\n${s.awsServices.map(svc => { const name = svc.split(' ')[0].replace(/[^a-zA-Z]/g, ''); const desc = svc.includes('(') ? svc.split('(')[1].replace(')', '') : svc; return `  # ${svc}\n  ${name}Resource:\n    Type: AWS::${svc.split(' ')[0]}\n    Properties:\n      Tags:\n        - Key: Project\n          Value: !Ref ProjectName\n        - Key: Environment\n          Value: !Ref Environment\n        - Key: Purpose\n          Value: ${desc}`; }).join('\n\n')}\n\nOutputs:\n  ApiEndpoint:\n    Description: API Gateway Endpoint URL\n    Value: !Sub 'https://api.example.com/\${Environment}'\n  Region:\n    Description: Deployment Region\n    Value: !Ref AWS::Region`,
      chatSequence: [
        { id: nextId(), type: 'system', content: 'OPERATIONS 단계 진입' },
        { id: nextId(), type: 'ai', content: `AWS 인프라를 설계합니다...\n\n사용 서비스:\n${s.awsServices.map(svc => `- ${svc}`).join('\n')}` },
      ],
    },
    {
      phase: 'OPERATIONS',
      stage: 'deployment',
      label: '배포 계획',
      fileName: 'aidlc-docs/operations/deployment-plan.md',
      fileContent: `# 배포 계획서\n## ${s.domain}\n\n---\n\n## 1. CI/CD 파이프라인\n\nGitHub Actions -> AWS CodePipeline -> CloudFormation\n\n### 파이프라인 단계\n1. **Source**: GitHub main 브랜치 push 트리거\n2. **Build**: npm install + npm run build + npm test\n3. **Test**: 단위 테스트 + 통합 테스트 + E2E 테스트\n4. **Deploy-Dev**: 개발 환경 자동 배포\n5. **Approval**: 스테이징 배포 수동 승인\n6. **Deploy-Staging**: 스테이징 환경 배포\n7. **Deploy-Prod**: 프로덕션 Blue/Green 배포\n\n## 2. 환경 구성\n\n| 환경 | 용도 | 자동 배포 |\n|------|------|----------|\n| dev | 개발/테스트 | O |\n| staging | QA/UAT | 승인 후 |\n| prod | 프로덕션 | 승인 후 |\n\n## 3. 모니터링 및 알림\n\n- **CloudWatch Alarms**: 에러율 > 1%, 응답시간 > 1s\n- **X-Ray Tracing**: 분산 추적 활성화\n- **CloudWatch Logs**: 구조화 로깅 + 로그 인사이트\n- **비용 알림**: 월 예산 초과 시 SNS 알림\n\n## 4. 롤백 전략\n\n- Blue/Green 배포로 즉시 롤백 가능\n- CloudFormation 스택 롤백 자동화\n- DB 마이그레이션 롤백 스크립트 준비\n\n## 5. 프로덕션 체크리스트\n\n- [ ] ${s.nfrFocus} 검증 완료\n- [ ] 부하 테스트 통과 (1,000 동시 사용자)\n- [ ] 보안 스캔 통과 (OWASP Top 10)\n- [ ] 백업/복구 테스트 완료\n- [ ] 모니터링 대시보드 구성\n- [ ] 장애 대응 런북 작성\n- [ ] DNS 및 SSL 인증서 설정\n\n---\nAI-DLC 워크플로우 완료!`,
      chatSequence: [
        { id: nextId(), type: 'system', content: '배포 계획 생성' },
        { id: nextId(), type: 'ai', content: `AI-DLC 워크플로우가 완료되었습니다!\n\n${s.domain} 프로젝트의 전체 설계가 완성되었습니다.` },
      ],
    },
  ];
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [fileContentsMap, setFileContentsMap] = useState<Record<string, string>>({});

  const demoSteps = useMemo(() => generateDemoSteps(projectIdea), [projectIdea]);
  const allMessagesRef = useRef<ChatMessage[]>([]);
  const runIdRef = useRef(0);

  const runStep = async (stepIdx: number) => {
    if (stepIdx >= demoSteps.length) return;

    try {
      const myRunId = ++runIdRef.current;
      const cancelled = () => runIdRef.current !== myRunId;

      setIsAnimating(true);
      setIsTyping(false);
      setStepCompleted(false);
      const step = demoSteps[stepIdx];

      const priorMessages: ChatMessage[] = [];
      for (let s = 0; s < stepIdx; s++) {
        priorMessages.push(...demoSteps[s].chatSequence);
      }
      allMessagesRef.current = priorMessages;
      setChatMessages([...allMessagesRef.current]);

      setPhase(step.phase);
      setStage(step.stage);

      for (let i = 0; i < step.chatSequence.length; i++) {
        if (cancelled()) return;
        const msg = step.chatSequence[i];

        if (msg.type === 'ai') {
          setIsTyping(true);
          await delay(800);
          if (cancelled()) { setIsTyping(false); return; }
          setIsTyping(false);
        } else if (msg.type === 'user') {
          await delay(400);
          if (cancelled()) return;
        } else {
          await delay(200);
          if (cancelled()) return;
        }

        allMessagesRef.current = [...allMessagesRef.current, msg];
        setChatMessages([...allMessagesRef.current]);
      }

      if (cancelled()) return;
      await delay(500);
      if (cancelled()) return;

      addFile({
        name: step.fileName.split('/').pop() || step.fileName,
        path: step.fileName,
        type: 'file',
        isNew: true,
      });
      setActiveFile(step.fileName);
      setEditorContent(step.fileContent);
      setFileContentsMap(prev => ({ ...prev, [step.fileName]: step.fileContent }));

      const progress = Math.round(((stepIdx + 1) / demoSteps.length) * 100);
      setProgress(progress);

      // 단계 완료 안내 메시지 추가
      const completeMsg: ChatMessage = {
        id: `complete-${stepIdx}`,
        type: 'system',
        content: stepIdx < demoSteps.length - 1
          ? `${step.label} 완료 -- 아래 "다음 단계" 버튼을 눌러주세요`
          : `${step.label} 완료 -- 아래 "결과 보기" 버튼을 눌러주세요`,
      };
      allMessagesRef.current = [...allMessagesRef.current, completeMsg];
      setChatMessages([...allMessagesRef.current]);

      setIsAnimating(false);
      setStepCompleted(true);
    } catch (err) {
      console.error('[runStep] Error:', err);
      setIsAnimating(false);
      setIsTyping(false);
      setStepCompleted(true);
    }
  };

  // 첫 진입 시 자동 시작
  const hasStarted = useRef(false);
  useEffect(() => {
    if (!projectIdea) {
      router.push('/');
      return;
    }
    if (!hasStarted.current) {
      hasStarted.current = true;
      runStep(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIdea]);

  const handleNextStep = () => {
    const nextIdx = currentStepIndex + 1;
    if (nextIdx >= demoSteps.length) {
      router.push(`/result?idea=${encodeURIComponent(projectIdea)}`);
      return;
    }
    setCurrentStepIndex(nextIdx);
    runStep(nextIdx);
  };

  const handlePrevStep = () => {
    if (currentStepIndex <= 0 || isAnimating) return;
    const prevIdx = currentStepIndex - 1;
    setCurrentStepIndex(prevIdx);
    runStep(prevIdx);
  };

  const handleFileClick = (path: string) => {
    setActiveFile(path);
    if (fileContentsMap[path]) {
      setEditorContent(fileContentsMap[path]);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  if (!projectIdea) return null;

  const isLastStep = currentStepIndex >= demoSteps.length - 1;
  const currentStep = demoSteps[currentStepIndex];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <div className="bg-[#12121a] border-b border-[#2a2a3a] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm text-[#b0b0c0] hover:text-[#e4e4ed] transition-colors"
          >
            ← 처음으로
          </button>
          {currentStepIndex > 0 && !isAnimating && (
            <>
              <div className="w-px h-4 bg-[#2a2a3a]" />
              <button
                onClick={handlePrevStep}
                disabled={isAnimating}
                className="px-4 py-2 text-sm text-[#b0b0c0] hover:text-[#e4e4ed] transition-colors"
              >
                ← 이전 단계
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#b0b0c0]">
            {currentStep?.label} ({currentStepIndex + 1}/{demoSteps.length})
          </span>
          <div className="flex gap-1">
            {demoSteps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < currentStepIndex ? 'bg-[#4a9eff]' :
                  i === currentStepIndex ? 'bg-[#7c5cfc]' :
                  'bg-[#2a2a3a]'
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleNextStep}
            disabled={isAnimating || !stepCompleted}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              isAnimating || !stepCompleted
                ? 'bg-[#2a2a3a] text-[#666] cursor-not-allowed'
                : isLastStep
                  ? 'bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-white hover:from-[#16a34a] hover:to-[#22c55e] animate-pulse'
                  : 'bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white hover:from-[#6b4beb] hover:to-[#3a8eef] animate-pulse'
            }`}
          >
            {isAnimating ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                진행 중...
              </span>
            ) : isLastStep ? '결과 보기' : '다음 단계 →'}
          </button>
        </div>
      </div>
      <KiroIDELayout
        files={state.files}
        activeFile={activeFile}
        editorContent={editorContent}
        onFileClick={handleFileClick}
        isTyping={isTyping}
        isAnimating={isAnimating}
        chatMessages={chatMessages}
      />
    </div>
  );
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
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
