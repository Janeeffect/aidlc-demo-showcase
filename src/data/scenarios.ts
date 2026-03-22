// 산업별 시나리오 데이터 (DemoPage에서 외부화)

export interface TechStack {
  frontend: string;
  backend: string;
  db: string;
  extra: string;
}

export interface ScenarioQuestion {
  q: string;
  options: string[];
  answer: string;
}

export interface PersonaStories {
  persona: string;
  stories: string[];
}

export interface ScenarioStepMessage {
  stepIndex: number;
  aiMessages: string[];
}

export interface ScenarioStepFileContent {
  stepIndex: number;
  fileContent: string;
}

export interface ScenarioDemoContent {
  stepMessages: ScenarioStepMessage[];
  stepFileContents: ScenarioStepFileContent[];
}

export interface ScenarioEstimateTemplate {
  developmentDays: number;
  teamSize: number;
  complexity: 'low' | 'medium' | 'high';
  teamComposition: { role: string; count: number; seniorityLevel: string }[];
  estimatedCost: { monthly: { min: number; max: number }; development: { min: number; max: number }; currency: string };
  techStack: string[];
  aiSavedDays: number;
  aiSavedPercentage: number;
}

export interface ScenarioKiroUseCase {
  title: string;
  description: string;
}

export interface ScenarioResultData {
  architectureKey: string;
  workflowKey: string;
  estimateTemplate: ScenarioEstimateTemplate;
  aidlcOutputs: Record<string, { name: string; phase: string; content: string }>;
  kiroUseCases: ScenarioKiroUseCase[];
}

export interface ScenarioDefinition {
  id: string;
  keywords: string[];       // 앞쪽 키워드가 높은 우선순위 (가중치 1.5)
  priority: number;          // 동점 시 시나리오 우선순위 (낮을수록 높은 우선순위)
  domain: string;
  userTypes: string;
  mainFeatures: string[];
  techStack: TechStack;
  nfrFocus: string;
  questions: ScenarioQuestion[];
  userStories: PersonaStories[];
  apiEndpoints: string[];
  awsServices: string[];
  demoContent?: ScenarioDemoContent;
  resultData?: ScenarioResultData;
}

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'ecommerce',
    keywords: ['쇼핑', '이커머스', '상품', '주문', '리테일', '재고', '리뷰'],
    priority: 1,
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
  },
  {
    id: 'fintech',
    keywords: ['금융', '결제', '핀테크', '송금', '가계부', '투자', '대출'],
    priority: 2,
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
  },
  {
    id: 'healthcare',
    keywords: ['헬스', '의료', '진료', '건강', '병원', '약', '피트니스'],
    priority: 3,
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
  },
  {
    id: 'education',
    keywords: ['교육', '강의', '학습', 'lms', '퀴즈', '과외', '시험'],
    priority: 4,
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
  },
  {
    id: 'logistics',
    keywords: ['물류', '배송', '택배', '창고', '차량', '라스트마일'],
    priority: 5,
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
  },
  {
    id: 'saas',
    keywords: ['프로젝트', '협업', 'crm', '문서', '일정', '관리 도구', '팀'],
    priority: 6,
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
  },
  {
    id: 'chat',
    keywords: ['채팅', 'chat', '메신저'],
    priority: 7,
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
  },
];

export const DEFAULT_SCENARIO: ScenarioDefinition = {
  id: 'default',
  keywords: [],
  priority: 99,
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
