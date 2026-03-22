// DemoStepGenerator - 프로젝트 아이디어 기반 7개 데모 단계 생성
import { DemoStep, ChatMessage } from '@/types/demo';
import { AnimationSequence, AnimationStep, ANIMATION_TARGETS } from '@/types/animation';
import { detectScenario, getScenarioById } from '@/utils/scenarioDetector';

let idCounter = 0;
function nextId(): string {
  return String(++idCounter);
}

let animStepCounter = 0;
function nextAnimId(): string {
  return `anim-${++animStepCounter}`;
}

/**
 * DemoStep에 대한 AnimationSequence를 생성한다.
 * 패턴: move(chat) -> type(내용) -> click(send) -> wait -> move(file) -> click(file) -> scroll
 */
export function buildAnimationSequence(
  step: Pick<DemoStep, 'phase' | 'stage' | 'label' | 'fileName' | 'chatSequence'>,
  stepIndex: number
): AnimationSequence {
  const steps: AnimationStep[] = [];
  const hasUserMessage = step.chatSequence.some(m => m.type === 'user');
  const userMsg = step.chatSequence.find(m => m.type === 'user');

  // 1. move to chat input
  steps.push({
    id: nextAnimId(),
    type: 'move',
    target: ANIMATION_TARGETS.CHAT_INPUT,
    duration: 400,
  });

  // 2. type user message (if exists)
  if (hasUserMessage && userMsg) {
    steps.push({
      id: nextAnimId(),
      type: 'type',
      target: ANIMATION_TARGETS.CHAT_INPUT,
      content: userMsg.content,
      duration: Math.max(100, userMsg.content.length * 30),
    });
  }

  // 3. click send button
  steps.push({
    id: nextAnimId(),
    type: 'click',
    target: ANIMATION_TARGETS.SEND_BUTTON,
    duration: 200,
  });

  // 4. wait for AI response
  steps.push({
    id: nextAnimId(),
    type: 'wait',
    duration: 500,
  });

  // 5. move to file in explorer
  const fileTarget = `${ANIMATION_TARGETS.FILE_PREFIX}${stepIndex}`;
  steps.push({
    id: nextAnimId(),
    type: 'move',
    target: fileTarget,
    duration: 300,
  });

  // 6. click file to open
  steps.push({
    id: nextAnimId(),
    type: 'click',
    target: fileTarget,
    duration: 200,
  });

  // 7. open file in editor
  steps.push({
    id: nextAnimId(),
    type: 'openFile',
    target: step.fileName,
    duration: 300,
  });

  // 8. scroll through content
  steps.push({
    id: nextAnimId(),
    type: 'scroll',
    target: ANIMATION_TARGETS.EDITOR_CONTENT,
    duration: 600,
  });

  return {
    id: `seq-${stepIndex}`,
    phase: step.phase,
    stage: step.stage,
    steps,
  };
}

/**
 * 프로젝트 아이디어 기반 7개 데모 단계 생성
 */
export function generateDemoSteps(projectIdea: string, scenarioId?: string): DemoStep[] {
  idCounter = 0;
  animStepCounter = 0;
  const s = scenarioId
    ? getScenarioById(scenarioId)
    : detectScenario(projectIdea);
  const user1 = s.userTypes.split('/')[0];
  const user2 = s.userTypes.split('/')[1] || '관리자';

  const rawSteps: Omit<DemoStep, 'animationSequence'>[] = [
    {
      phase: 'INCEPTION',
      stage: 'requirements',
      label: '요구사항 분석',
      fileName: 'aidlc-docs/inception/requirements.md',
      fileContent: buildRequirementsContent(projectIdea, s.domain, s.userTypes, s.mainFeatures, s.nfrFocus, s.techStack),
      chatSequence: [
        { id: nextId(), type: 'system', content: 'AI-DLC 워크플로우를 시작합니다' },
        { id: nextId(), type: 'ai', content: `"${projectIdea}" 프로젝트를 분석하겠습니다.\n\n워크스페이스를 스캔한 결과, ${s.domain} 유형으로 판별되었습니다.\n주요 사용자 그룹: ${s.userTypes}\n\n요구사항을 구체화하기 위해 몇 가지 질문을 드리겠습니다.` },
        { id: nextId(), type: 'ai', content: `Q1. ${s.questions[0].q}\n\n${s.questions[0].options.join('\n')}` },
        { id: nextId(), type: 'user', content: s.questions[0].answer },
        { id: nextId(), type: 'ai', content: `"${s.questions[0].answer}" 선택을 반영하겠습니다.\n\n이 선택에 따라 ${s.mainFeatures[0]} 기능의 설계 방향이 결정됩니다.\n관련 엣지케이스도 함께 검토하겠습니다.` },
        { id: nextId(), type: 'ai', content: `Q2. ${s.questions[1].q}\n\n${s.questions[1].options.join('\n')}` },
        { id: nextId(), type: 'user', content: s.questions[1].answer },
        { id: nextId(), type: 'ai', content: `답변을 분석했습니다. ${s.nfrFocus} 관점에서 추가 고려사항이 있습니다.\n\n- 데이터 무결성 보장 방안\n- 동시성 처리 전략\n- 장애 복구 시나리오\n\n이를 요구사항에 반영하겠습니다.` },
        { id: nextId(), type: 'ai', content: `요구사항 문서를 생성합니다...\n\n기능 요구사항 ${s.mainFeatures.length}건:\n${s.mainFeatures.map((f, i) => `- FR-${String(i+1).padStart(3,'0')}: ${f}`).join('\n')}\n\n비기능 요구사항 5건 (성능, 보안, 가용성, 확장성, 관측성)` },
        { id: nextId(), type: 'ai', content: `요구사항 분석이 완료되었습니다.\n\n총 ${s.mainFeatures.length + 5}건의 요구사항이 정의되었으며,\nMVP 범위에 ${Math.min(3, s.mainFeatures.length)}건의 핵심 기능이 포함됩니다.` },
      ],
    },
    {
      phase: 'INCEPTION',
      stage: 'design',
      label: '사용자 스토리',
      fileName: 'aidlc-docs/inception/user-stories.md',
      fileContent: buildUserStoriesContent(projectIdea, user1, user2, s.domain, s.userStories),
      chatSequence: [
        { id: nextId(), type: 'system', content: '사용자 스토리 정의 단계' },
        { id: nextId(), type: 'ai', content: `${s.domain} 프로젝트의 사용자 페르소나를 분석합니다.\n\n식별된 페르소나:\n- ${user1}: 서비스의 주요 사용자\n- ${user2}: 운영/관리 담당자\n\n각 페르소나별 핵심 여정을 정의하겠습니다.` },
        { id: nextId(), type: 'ai', content: `Q3. ${s.questions[2].q}\n\n${s.questions[2].options.join('\n')}` },
        { id: nextId(), type: 'user', content: s.questions[2].answer },
        { id: nextId(), type: 'ai', content: `답변을 반영하여 스토리를 구성합니다.\n\n${user1} 핵심 스토리:\n${s.userStories[0].stories.map((st, i) => `- US-${String(i+1).padStart(3,'0')}: ${st}`).join('\n')}` },
        { id: nextId(), type: 'ai', content: `${user2} 핵심 스토리:\n${s.userStories[1].stories.map((st, i) => `- US-${String(i+11).padStart(3,'0')}: ${st}`).join('\n')}\n\n각 스토리에 인수 기준(Acceptance Criteria)을 정의합니다.` },
        { id: nextId(), type: 'ai', content: `스토리 우선순위를 정리합니다.\n\nMVP 필수 (P0):\n- ${s.userStories[0].stories[0]}\n- ${s.userStories[1].stories[0]}\n\nMVP 권장 (P1):\n- ${s.userStories[0].stories[1] || s.userStories[0].stories[0]}\n- ${s.userStories[1].stories[1] || s.userStories[1].stories[0]}` },
        { id: nextId(), type: 'ai', content: `사용자 스토리 문서가 완성되었습니다.\n\n총 ${s.userStories[0].stories.length + s.userStories[1].stories.length}개 스토리, 2개 페르소나가 정의되었습니다.` },
      ],
    },
    {
      phase: 'INCEPTION',
      stage: 'design',
      label: '애플리케이션 설계',
      fileName: 'aidlc-docs/inception/application-design.md',
      fileContent: buildAppDesignContent(s.domain, s.techStack, s.apiEndpoints, s.mainFeatures),
      chatSequence: [
        { id: nextId(), type: 'system', content: '애플리케이션 설계 단계' },
        { id: nextId(), type: 'ai', content: `${s.domain} 아키텍처를 설계합니다.\n\n기술 스택 선정 근거:\n- Frontend: ${s.techStack.frontend} (SSR + ISR 지원, SEO 최적화)\n- Backend: ${s.techStack.backend} (서버리스, 자동 스케일링)\n- DB: ${s.techStack.db} (온디맨드 과금, 밀리초 응답)` },
        { id: nextId(), type: 'ai', content: `컴포넌트 구조를 설계합니다.\n\n프론트엔드 레이어:\n- pages/ (라우팅)\n- components/ (UI 컴포넌트)\n- hooks/ (비즈니스 로직)\n- services/ (API 통신)\n- contexts/ (상태 관리)` },
        { id: nextId(), type: 'user', content: '좋습니다. API 설계도 진행해주세요.' },
        { id: nextId(), type: 'ai', content: `API 엔드포인트를 설계합니다.\n\nRESTful API 설계:\n${s.apiEndpoints.map(e => `- ${e}`).join('\n')}\n\n모든 엔드포인트에 인증/인가, 입력 검증, 에러 핸들링을 적용합니다.` },
        { id: nextId(), type: 'ai', content: `데이터 모델을 정의합니다.\n\n주요 엔티티:\n${s.mainFeatures.slice(0, 3).map(f => `- ${f.split(' ')[0]}: id, 속성, 관계, 타임스탬프`).join('\n')}\n\n엔티티 간 관계와 인덱스 전략도 포함합니다.` },
        { id: nextId(), type: 'ai', content: `트레이드오프 검토:\n\n1. 서버리스 vs 컨테이너: 서버리스 선택 (비용 효율, 자동 스케일링)\n2. NoSQL vs RDB: ${s.techStack.db} 선택 (스키마 유연성, 수평 확장)\n3. CSR vs SSR: SSR 선택 (SEO, 초기 로딩 성능)` },
        { id: nextId(), type: 'ai', content: `애플리케이션 설계가 완료되었습니다.\n\n${s.apiEndpoints.length}개 API 엔드포인트, ${s.mainFeatures.length}개 핵심 컴포넌트가 정의되었습니다.` },
      ],
    },
    {
      phase: 'CONSTRUCTION',
      stage: 'code',
      label: 'NFR 설계',
      fileName: 'aidlc-docs/construction/nfr-design.md',
      fileContent: buildNfrContent(s.domain, s.nfrFocus, s.techStack),
      chatSequence: [
        { id: nextId(), type: 'system', content: 'CONSTRUCTION 단계 진입' },
        { id: nextId(), type: 'ai', content: `비기능 요구사항을 설계합니다.\n\n핵심 포커스: ${s.nfrFocus}\n\n성능, 보안, 확장성, 관측성 4개 영역을 순차적으로 설계하겠습니다.` },
        { id: nextId(), type: 'ai', content: `성능 설계:\n- API 응답 시간: P95 < 500ms\n- 페이지 로드: < 2초 (LCP)\n- 동시 사용자: 1,000명\n\n전략: Lambda 최적화 + ElastiCache + CloudFront CDN` },
        { id: nextId(), type: 'ai', content: `보안 아키텍처:\n- 인증: AWS Cognito + JWT\n- 인가: RBAC (Role-Based Access Control)\n- 데이터 암호화: TLS 1.3 (전송) + AES-256 (저장)\n- 네트워크: WAF + API Gateway 스로틀링` },
        { id: nextId(), type: 'user', content: '확장성 전략도 설명해주세요.' },
        { id: nextId(), type: 'ai', content: `확장성 설계:\n- 수평 확장: Lambda 동시성 자동 조절\n- 데이터 계층: ${s.techStack.db} On-Demand 모드\n- 캐시: ElastiCache Redis 클러스터\n- CDN: CloudFront 글로벌 엣지 로케이션` },
        { id: nextId(), type: 'ai', content: `관측성 (Observability) 설계:\n- 로깅: CloudWatch Logs + 구조화 로깅\n- 메트릭: CloudWatch Metrics + 커스텀 대시보드\n- 트레이싱: AWS X-Ray 분산 추적\n- 알림: CloudWatch Alarms + SNS 알림` },
        { id: nextId(), type: 'ai', content: `NFR 설계가 완료되었습니다.\n\n4개 영역(성능/보안/확장성/관측성)에 대한 상세 설계가 정의되었습니다.` },
      ],
    },
    {
      phase: 'CONSTRUCTION',
      stage: 'code',
      label: '코드 생성',
      fileName: 'src/app/page.tsx',
      fileContent: buildCodeContent(projectIdea, s.domain, s.mainFeatures, s.apiEndpoints),
      chatSequence: [
        { id: nextId(), type: 'system', content: '코드 생성 시작' },
        { id: nextId(), type: 'ai', content: `TDD 방식으로 코드를 생성합니다.\n\n생성 순서:\n1. Contract/Interface 스켈레톤\n2. 테스트 코드 (RED)\n3. 구현 코드 (GREEN)\n4. 리팩토링 (REFACTOR)` },
        { id: nextId(), type: 'ai', content: `프로젝트 구조를 생성합니다.\n\nsrc/\n  app/ (라우팅)\n  components/ (${s.mainFeatures[0]}, ${s.mainFeatures[1]})\n  hooks/ (useAuth, useApi)\n  services/ (api.ts)\n  types/ (index.ts)` },
        { id: nextId(), type: 'ai', content: `핵심 컴포넌트를 구현합니다.\n\n- ${s.mainFeatures[0]} 컴포넌트: 메인 비즈니스 로직\n- ${s.mainFeatures[1]} 컴포넌트: 보조 기능\n- API 라우트: ${s.apiEndpoints.slice(0, 2).map(e => e.split(' - ')[0]).join(', ')}` },
        { id: nextId(), type: 'user', content: '테스트 코드도 함께 생성해주세요.' },
        { id: nextId(), type: 'ai', content: `테스트 코드를 생성합니다.\n\n- 단위 테스트: 각 컴포넌트별 렌더링 + 인터랙션\n- API 테스트: 엔드포인트별 요청/응답 검증\n- 통합 테스트: 사용자 시나리오 기반 E2E\n\n총 ${s.mainFeatures.length * 3}개 테스트 케이스` },
        { id: nextId(), type: 'ai', content: `코드 리뷰를 수행합니다.\n\n- 코드 품질: ESLint + Prettier 적용\n- 타입 안전성: TypeScript strict 모드\n- 접근성: ARIA 속성 + 키보드 네비게이션\n- 성능: React.memo + useMemo 최적화` },
        { id: nextId(), type: 'ai', content: `코드 생성이 완료되었습니다.\n\n${s.mainFeatures.length}개 핵심 컴포넌트, ${s.apiEndpoints.length}개 API 라우트가 생성되었습니다.` },
      ],
    },
    {
      phase: 'OPERATIONS',
      stage: 'infrastructure',
      label: '인프라 설계',
      fileName: 'aidlc-docs/construction/infrastructure.yaml',
      fileContent: buildInfraContent(projectIdea, s.awsServices),
      chatSequence: [
        { id: nextId(), type: 'system', content: 'OPERATIONS 단계 진입' },
        { id: nextId(), type: 'ai', content: `AWS 인프라를 설계합니다.\n\n사용 서비스 ${s.awsServices.length}개:\n${s.awsServices.map(svc => `- ${svc}`).join('\n')}` },
        { id: nextId(), type: 'ai', content: `네트워크 아키텍처:\n- VPC: 2개 AZ, Public/Private 서브넷\n- NAT Gateway: Private 서브넷 인터넷 접근\n- Security Group: 최소 권한 원칙 적용\n- Route 53: DNS 관리 + 헬스체크` },
        { id: nextId(), type: 'ai', content: `보안 설정:\n- IAM: 서비스별 최소 권한 역할\n- KMS: 데이터 암호화 키 관리\n- WAF: SQL Injection, XSS 방어 규칙\n- CloudTrail: API 호출 감사 로그` },
        { id: nextId(), type: 'user', content: '비용 예측도 해주세요.' },
        { id: nextId(), type: 'ai', content: `월간 비용 예측 (us-east-1 기준):\n\n- Lambda: ~$15 (100만 요청/월)\n- ${s.techStack.db}: ~$25 (온디맨드)\n- CloudFront: ~$10 (100GB 전송)\n- 기타: ~$20 (S3, CloudWatch 등)\n\n예상 총 비용: ~$70/월 (트래픽 증가 시 자동 스케일링)` },
        { id: nextId(), type: 'ai', content: `모니터링 설정:\n- CloudWatch 대시보드: 핵심 메트릭 시각화\n- 알람: 에러율 > 1%, 응답시간 > 1초\n- X-Ray: 분산 추적 활성화\n- 비용 알림: 월 예산 초과 시 SNS 알림` },
        { id: nextId(), type: 'ai', content: `인프라 설계가 완료되었습니다.\n\nCloudFormation 템플릿이 생성되었으며, ${s.awsServices.length}개 AWS 서비스가 구성되었습니다.` },
      ],
    },
    {
      phase: 'OPERATIONS',
      stage: 'deployment',
      label: '배포 계획',
      fileName: 'aidlc-docs/operations/deployment-plan.md',
      fileContent: buildDeployContent(s.domain, s.nfrFocus),
      chatSequence: [
        { id: nextId(), type: 'system', content: '배포 계획 생성' },
        { id: nextId(), type: 'ai', content: `${s.domain} 프로젝트의 배포 전략을 수립합니다.\n\n배포 환경:\n- Production: AWS 멀티 AZ\n- Staging: 단일 AZ (비용 최적화)\n- Development: 로컬 + AWS 개발 계정\n\nCI/CD 파이프라인을 설계하겠습니다.` },
        { id: nextId(), type: 'ai', content: `CI/CD 파이프라인 구성:\n\n1. Source: GitHub → CodePipeline 트리거\n2. Build: CodeBuild (테스트 + 빌드)\n3. Deploy-Staging: 자동 배포 + 통합 테스트\n4. Approval: 수동 승인 게이트\n5. Deploy-Prod: Blue/Green 배포\n\n롤백 전략도 함께 정의합니다.` },
        { id: nextId(), type: 'user', content: '무중단 배포 전략을 적용해주세요.' },
        { id: nextId(), type: 'ai', content: `무중단 배포 전략을 적용합니다.\n\nBlue/Green 배포:\n- Blue(현재): 운영 트래픽 처리 중\n- Green(신규): 새 버전 배포 + 헬스체크\n- Route 53 가중치 기반 트래픽 전환\n- 문제 발생 시 즉시 Blue로 롤백\n\n배포 시간: 약 5분 (다운타임 0초)` },
        { id: nextId(), type: 'ai', content: `모니터링 및 알림 설정:\n\n배포 후 자동 검증:\n- 헬스체크 엔드포인트 확인 (30초 간격)\n- 에러율 모니터링 (임계값: 1%)\n- 응답 시간 모니터링 (임계값: P95 < 500ms)\n- 자동 롤백 조건: 에러율 > 5% (5분 이내)` },
        { id: nextId(), type: 'ai', content: `환경별 설정 관리:\n\n- AWS Systems Manager Parameter Store: 환경 변수\n- AWS Secrets Manager: 민감 정보 (DB 비밀번호, API 키)\n- 환경별 분리: /prod/*, /staging/*, /dev/*\n- 자동 로테이션: 90일 주기 비밀번호 갱신` },
        { id: nextId(), type: 'ai', content: `AI-DLC 워크플로우가 완료되었습니다!\n\n${s.domain} 프로젝트의 전체 설계가 완성되었습니다.\n\n산출물 요약:\n- 요구사항 정의서\n- 사용자 스토리\n- 애플리케이션 설계서\n- NFR 설계서\n- 소스 코드\n- 인프라 템플릿\n- 배포 계획서` },
      ],
    },
  ];

  return rawSteps.map((step, index) => ({
    ...step,
    animationSequence: buildAnimationSequence(step, index),
  }));
}

// --- Template Builder Functions ---

function buildRequirementsContent(
  projectIdea: string, domain: string, userTypes: string,
  mainFeatures: string[], nfrFocus: string, techStack: { frontend: string; backend: string; db: string; extra: string }
): string {
  const featureRows = mainFeatures.map((f, i) =>
    `| FR-${String(i+1).padStart(3,'0')} | ${f} | ${i < 2 ? '높음' : i < 4 ? '중간' : '낮음'} | ${i < 2 ? '상' : '중'} | MVP ${i < 3 ? '포함' : '제외'} |`
  ).join('\n');

  return `# 요구사항 분석서\n## 프로젝트: ${projectIdea}\n## 도메인: ${domain}\n\n---\n\n## 1. 프로젝트 개요\n\n**프로젝트명**: ${projectIdea}\n**도메인**: ${domain}\n**대상 사용자**: ${userTypes}\n**프로젝트 유형**: 신규 개발 (Greenfield)\n\n## 2. 기능 요구사항 (Functional Requirements)\n\n| ID | 요구사항 | 우선순위 | 복잡도 | 비고 |\n|------|----------|----------|--------|------|\n${featureRows}\n\n## 3. 비기능 요구사항 (Non-Functional Requirements)\n\n| ID | 카테고리 | 요구사항 | 목표치 |\n|------|----------|----------|--------|\n| NFR-001 | 성능 | API 응답 시간 | P95 < 500ms |\n| NFR-002 | 성능 | 동시 사용자 | 1,000명 |\n| NFR-003 | 가용성 | SLA | 99.9% |\n| NFR-004 | 보안 | ${nfrFocus} | 필수 |\n| NFR-005 | 확장성 | Auto Scaling | 트래픽 기반 |\n\n## 4. 기술 스택\n\n- **Frontend**: ${techStack.frontend}\n- **Backend**: ${techStack.backend}\n- **Database**: ${techStack.db}\n- **추가**: ${techStack.extra}\n\n## 5. 제약 조건\n\n- AWS 클라우드 환경에서 운영\n- 한국어 UI 우선 지원\n- 모바일 반응형 필수\n\n---\n상태: 완료`;
}

function buildUserStoriesContent(
  projectIdea: string, user1: string, user2: string, domain: string,
  userStories: { persona: string; stories: string[] }[]
): string {
  const u1Stories = userStories[0].stories.map((st, i) =>
    `**US-${String(i+1).padStart(3,'0')}**: ${user1}로서 ${st}\n- **인수 기준**: ${st.replace('싶다', '수 있다')}\n- **우선순위**: ${i === 0 ? '높음' : '중간'}`
  ).join('\n\n');
  const u2Stories = userStories[1].stories.map((st, i) =>
    `**US-${String(i+11).padStart(3,'0')}**: ${user2}로서 ${st}\n- **인수 기준**: ${st.replace('싶다', '수 있다')}\n- **우선순위**: ${i === 0 ? '높음' : '중간'}`
  ).join('\n\n');

  return `# 사용자 스토리\n## 프로젝트: ${projectIdea}\n\n---\n\n## 페르소나 정의\n\n### ${user1}\n- **역할**: ${domain}의 주요 사용자\n- **목표**: 서비스를 통해 핵심 가치를 얻음\n- **기술 수준**: 일반 사용자 (모바일/웹 친숙)\n\n### ${user2}\n- **역할**: ${domain}의 운영/관리 담당\n- **목표**: 서비스 운영 효율화 및 데이터 기반 의사결정\n- **기술 수준**: 중급 (관리 도구 사용 경험)\n\n---\n\n## 사용자 스토리 목록\n\n### ${user1} 스토리\n\n${u1Stories}\n\n### ${user2} 스토리\n\n${u2Stories}\n\n---\n\n## 스토리 맵 요약\n\n| 페르소나 | 스토리 수 | MVP 포함 | 우선순위 높음 |\n|----------|-----------|----------|---------------|\n| ${user1} | ${userStories[0].stories.length} | ${Math.min(2, userStories[0].stories.length)} | 1 |\n| ${user2} | ${userStories[1].stories.length} | ${Math.min(2, userStories[1].stories.length)} | 1 |\n\n상태: 완료`;
}

function buildAppDesignContent(
  domain: string, techStack: { frontend: string; backend: string; db: string; extra: string },
  apiEndpoints: string[], mainFeatures: string[]
): string {
  const apiRows = apiEndpoints.map(e => {
    const p = e.split(' - ');
    const mp = p[0].split(' ');
    return `| ${mp[0]} | ${mp[1]} | ${p[1] || ''} |`;
  }).join('\n');
  const featureDirs = mainFeatures.slice(0, 3).map(f => `      ${f.split(' ')[0]}/`).join('\n');

  return `# 애플리케이션 설계서\n## ${domain}\n\n---\n\n## 1. 시스템 아키텍처\n\n### 프론트엔드\n- **프레임워크**: ${techStack.frontend}\n- **스타일링**: Tailwind CSS + Headless UI\n- **상태관리**: React Context + useReducer\n- **데이터 페칭**: TanStack Query (React Query)\n\n### 백엔드\n- **런타임**: ${techStack.backend}\n- **데이터베이스**: ${techStack.db}\n- **추가**: ${techStack.extra}\n\n## 2. API 설계\n\n| Method | Endpoint | 설명 |\n|--------|----------|------|\n${apiRows}\n\n## 3. 컴포넌트 구조\n\nsrc/\n  app/\n    layout.tsx\n    page.tsx\n    (routes)/\n  components/\n    common/ (Button, Input, Modal, Card)\n    layout/ (Header, Sidebar, Footer)\n    features/\n${featureDirs}\n  hooks/\n    useAuth.ts\n    useApi.ts\n  contexts/\n    AuthContext.tsx\n  services/\n    api.ts\n  types/\n    index.ts\n\n## 4. 데이터 모델\n\n### 주요 엔티티\n- **User**: id, email, name, role, createdAt\n${mainFeatures.slice(0, 2).map((f, i) => `- **${f.split(' ')[0]}**: id, ${i === 0 ? 'title, description, status' : 'userId, data, timestamp'}`).join('\n')}\n\n---\n상태: 완료`;
}

function buildNfrContent(
  domain: string, nfrFocus: string, techStack: { db: string }
): string {
  return `# 비기능 요구사항 설계서\n## ${domain}\n\n---\n\n## 1. 성능 설계\n\n| 지표 | 목표 | 전략 |\n|------|------|------|\n| API 응답 시간 | P95 < 500ms | Lambda 최적화 + ElastiCache |\n| 페이지 로드 | < 2초 (LCP) | CloudFront CDN + 코드 스플리팅 |\n| 동시 사용자 | 1,000명 | Auto Scaling + Connection Pooling |\n| DB 쿼리 | < 100ms | 인덱스 최적화 + 캐시 레이어 |\n\n## 2. 보안 설계\n\n### 인증/인가\n- AWS Cognito User Pool + JWT\n- OAuth 2.0 + PKCE (소셜 로그인)\n- Role-Based Access Control (RBAC)\n\n### 데이터 보안\n- 전송 중: TLS 1.3\n- 저장 시: AES-256 (KMS 관리)\n- 핵심: ${nfrFocus}\n\n### 네트워크 보안\n- AWS WAF (SQL Injection, XSS 방어)\n- API Gateway 스로틀링 (10,000 req/sec)\n- VPC + Private Subnet (DB 격리)\n\n## 3. 확장성 설계\n\n- **수평 확장**: Lambda 동시성 자동 조절\n- **데이터 계층**: ${techStack.db} On-Demand 모드\n- **캐시**: ElastiCache Redis 클러스터\n- **CDN**: CloudFront 글로벌 엣지\n\n## 4. 관측성 (Observability)\n\n- **로깅**: CloudWatch Logs + 구조화 로깅\n- **메트릭**: CloudWatch Metrics + 커스텀 대시보드\n- **트레이싱**: AWS X-Ray 분산 추적\n- **알림**: CloudWatch Alarms + SNS\n\n---\n상태: 완료`;
}

function buildCodeContent(
  projectIdea: string, domain: string, mainFeatures: string[], apiEndpoints: string[]
): string {
  const navLinks = mainFeatures.slice(0, 4).map(f =>
    `          <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">${f.split(' ')[0]}</a>`
  ).join('\n');
  const firstEndpoint = apiEndpoints[0]?.split(' - ')[0]?.split(' ')[1] || '/api';
  const entityName = mainFeatures[0]?.split(' ')[0] || 'Item';

  return `'use client';\n\nimport React, { useState, useEffect } from 'react';\n\n// ${domain} - 메인 페이지\n// Generated by AI-DLC Code Generation\n\ninterface ${entityName}Item {\n  id: string;\n  title: string;\n  description: string;\n  status: 'active' | 'inactive';\n  createdAt: string;\n}\n\nexport default function HomePage() {\n  const [items, setItems] = useState<${entityName}Item[]>([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    const fetchData = async () => {\n      try {\n        const res = await fetch('${firstEndpoint}');\n        const data = await res.json();\n        setItems(data);\n      } catch (err) {\n        console.error('Failed to fetch:', err);\n      } finally {\n        setLoading(false);\n      }\n    };\n    fetchData();\n  }, []);\n\n  return (\n    <div className="min-h-screen bg-gray-50">\n      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">\n        <div className="max-w-6xl mx-auto">\n          <h1 className="text-2xl font-bold">${projectIdea}</h1>\n          <p className="text-blue-100 mt-1">${domain}</p>\n        </div>\n      </header>\n\n      <nav className="bg-white shadow-sm border-b">\n        <div className="max-w-6xl mx-auto flex gap-6 px-6 py-3">\n${navLinks}\n        </div>\n      </nav>\n\n      <main className="max-w-6xl mx-auto p-6">\n        {loading ? (\n          <div className="text-center py-12 text-gray-500">로딩 중...</div>\n        ) : (\n          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\n            {items.map(item => (\n              <div key={item.id} className="bg-white p-6 rounded-lg shadow">\n                <h3 className="font-semibold text-gray-900">{item.title}</h3>\n                <p className="text-gray-600 text-sm mt-2">{item.description}</p>\n              </div>\n            ))}\n          </div>\n        )}\n      </main>\n    </div>\n  );\n}`;
}

function buildInfraContent(projectIdea: string, awsServices: string[]): string {
  const resources = awsServices.map(svc => {
    const name = svc.split(' ')[0].replace(/[^a-zA-Z]/g, '');
    const desc = svc.includes('(') ? svc.split('(')[1].replace(')', '') : svc;
    return `  # ${svc}\n  ${name}Resource:\n    Type: AWS::${svc.split(' ')[0]}\n    Properties:\n      Tags:\n        - Key: Project\n          Value: !Ref ProjectName\n        - Key: Environment\n          Value: !Ref Environment\n        - Key: Purpose\n          Value: ${desc}`;
  }).join('\n\n');

  return `# AWS 인프라 설계 - ${projectIdea}\n# Generated by AI-DLC Infrastructure Design\nAWSTemplateFormatVersion: '2010-09-09'\nDescription: ${projectIdea} - AWS Infrastructure\n\nParameters:\n  Environment:\n    Type: String\n    Default: production\n    AllowedValues: [dev, staging, production]\n  ProjectName:\n    Type: String\n    Default: ${projectIdea.replace(/\s/g, '-').toLowerCase()}\n\nResources:\n\n${resources}\n\nOutputs:\n  ApiEndpoint:\n    Description: API Gateway Endpoint URL\n    Value: !Sub 'https://api.example.com/\${Environment}'\n  Region:\n    Description: Deployment Region\n    Value: !Ref AWS::Region`;
}

function buildDeployContent(domain: string, nfrFocus: string): string {
  return `# 배포 계획서\n## ${domain}\n\n---\n\n## 1. CI/CD 파이프라인\n\nGitHub Actions -> AWS CodePipeline -> CloudFormation\n\n### 파이프라인 단계\n1. **Source**: GitHub main 브랜치 push 트리거\n2. **Build**: npm install + npm run build + npm test\n3. **Test**: 단위 테스트 + 통합 테스트 + E2E 테스트\n4. **Deploy-Dev**: 개발 환경 자동 배포\n5. **Approval**: 스테이징 배포 수동 승인\n6. **Deploy-Staging**: 스테이징 환경 배포\n7. **Deploy-Prod**: 프로덕션 Blue/Green 배포\n\n## 2. 환경 구성\n\n| 환경 | 용도 | 자동 배포 |\n|------|------|----------|\n| dev | 개발/테스트 | O |\n| staging | QA/UAT | 승인 후 |\n| prod | 프로덕션 | 승인 후 |\n\n## 3. 모니터링 및 알림\n\n- **CloudWatch Alarms**: 에러율 > 1%, 응답시간 > 1s\n- **X-Ray Tracing**: 분산 추적 활성화\n- **CloudWatch Logs**: 구조화 로깅 + 로그 인사이트\n- **비용 알림**: 월 예산 초과 시 SNS 알림\n\n## 4. 롤백 전략\n\n- Blue/Green 배포로 즉시 롤백 가능\n- CloudFormation 스택 롤백 자동화\n- DB 마이그레이션 롤백 스크립트 준비\n\n## 5. 프로덕션 체크리스트\n\n- [ ] ${nfrFocus} 검증 완료\n- [ ] 부하 테스트 통과 (1,000 동시 사용자)\n- [ ] 보안 스캔 통과 (OWASP Top 10)\n- [ ] 백업/복구 테스트 완료\n- [ ] 모니터링 대시보드 구성\n- [ ] 장애 대응 런북 작성\n- [ ] DNS 및 SSL 인증서 설정\n\n---\nAI-DLC 워크플로우 완료!`;
}
