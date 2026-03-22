# Component Inventory

## Application Packages

### Pages (3개)
- `src/app/page.tsx` - StartPage: 시작 페이지, 아이디어 입력 및 산업별 예시
- `src/app/demo/page.tsx` - DemoPage: 데모 진행 페이지, AI-DLC 7단계 시뮬레이션
- `src/app/result/page.tsx` - ResultPage: 결과 페이지, 6개 탭 (MVP/AWS/워크플로우/예상/산출물/Kiro)

### Layout
- `src/app/layout.tsx` - RootLayout: DemoSessionProvider 래핑, Inter 폰트, 메타데이터

### Kiro IDE Components (4개)
- `src/components/kiro-ide/KiroIDELayout.tsx` - IDE 전체 레이아웃 (타이틀바, 탐색기, 에디터, 채팅)
- `src/components/kiro-ide/FileExplorer.tsx` - 파일 트리 탐색기 (재귀적 렌더링)
- `src/components/kiro-ide/CodeEditor.tsx` - 코드 에디터 (타이핑 효과, 구문 하이라이팅)
- `src/components/kiro-ide/PhaseIndicator.tsx` - AI-DLC 진행 상태 표시 바

### Animation Components (3개 - 현재 미사용)
- `src/components/animation/AnimationOrchestrator.tsx` - 애니메이션 시퀀스 관리
- `src/components/animation/MousePointer.tsx` - 마우스 포인터 애니메이션
- `src/components/animation/TypingEffect.tsx` - 타이핑 효과 애니메이션

### UI Components (4개)
- `src/components/ui/MVPPreview.tsx` - MVP 미리보기 (5개 산업별 분기, 2개 페르소나)
- `src/components/ui/AWSArchitectureDiagram.tsx` - AWS 아키텍처 Mermaid 다이어그램 (6개 산업별)
- `src/components/ui/BusinessWorkflowDiagram.tsx` - 비즈니스 워크플로우 SVG 시퀀스 다이어그램
- `src/components/ui/ResultSummary.tsx` - 결과 요약 + QR 코드

## State Management
- `src/contexts/DemoSessionContext.tsx` - 전역 상태 관리 (useReducer, 10개 액션)

## Service Layer (3개)
- `src/services/AIService.ts` - AI 스트리밍 서비스 (SSE 파싱, AsyncGenerator)
- `src/services/EstimateService.ts` - 프로젝트 예상 계산 (클라이언트 사이드)
- `src/services/LogService.ts` - 로그 서비스 (HTTP 클라이언트)

## API Routes (5개)
- `src/app/api/demo/start/route.ts` - POST: 세션 시작
- `src/app/api/demo/stream/route.ts` - GET: SSE 스트리밍
- `src/app/api/demo/estimate/route.ts` - POST: 예상 계산
- `src/app/api/demo/send-report/route.ts` - POST: 이메일 리포트
- `src/app/api/log/route.ts` - POST/GET: 로그 기록/조회

## Type Definitions (3개)
- `src/types/demo.ts` - 핵심 도메인 타입
- `src/types/api.ts` - API 요청/응답 타입
- `src/types/animation.ts` - 애니메이션 관련 타입

## Infrastructure Packages
- 없음 (CDK/Terraform/CloudFormation 미사용)

## Shared Packages
- 없음 (모놀리식 구조)

## Test Packages (8개)
- `src/__tests__/StartPage.test.tsx` - Unit: 시작 페이지
- `src/__tests__/DemoPage.test.tsx` - Unit: 데모 페이지
- `src/__tests__/ResultPage.test.tsx` - Unit: 결과 페이지
- `src/__tests__/DemoSessionContext.test.tsx` - Unit: Context
- `src/__tests__/EstimateService.test.ts` - Unit: EstimateService
- `src/__tests__/MVPPreview.test.tsx` - Unit: MVP 미리보기
- `src/__tests__/AWSArchitecture.test.ts` - Unit: AWS 아키텍처
- `src/__tests__/BusinessWorkflow.test.ts` - Unit: 비즈니스 워크플로우

## Total Count
- **Total Source Files**: 27개
- **Application (Pages)**: 3개
- **Layout**: 1개
- **Components**: 11개 (IDE 4 + Animation 3 + UI 4)
- **Context**: 1개
- **Services**: 3개
- **API Routes**: 5개
- **Types**: 3개
- **Tests**: 8개
- **Config Files**: 6개 (package.json, tsconfig.json, tailwind.config.js, next.config.js, postcss.config.js, jest.config.js)
- **Infrastructure**: 0개
- **Shared**: 0개
