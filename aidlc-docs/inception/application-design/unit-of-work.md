# Unit of Work Definitions

## Architecture Context
- **Type**: Next.js 14 모놀리식 (단일 서비스, 단일 배포)
- **Decomposition**: 기능 영역별 논리적 모듈 (5개 Unit)
- **Each Unit**: 독립적으로 구현/테스트 가능하지만, 동일 코드베이스 내 존재

---

## Unit 1: 코드 정리 (Code Cleanup)

### 목적
기존 코드베이스의 기술 부채 해소 및 리팩토링. 이후 Unit들의 기반 작업.

### 요구사항
- REQ-B02: 미사용 API Route 정리 + log 연동
- REQ-B03: DemoPage 전면 리팩토링

### 범위
**생성할 파일**:
- `src/utils/scenarioDetector.ts` - detectScenario 분리
- `src/data/scenarios.ts` - 시나리오 데이터 외부화
- `src/utils/demoStepGenerator.ts` - generateDemoSteps 분리
- `src/hooks/useDemoProgress.ts` - 데모 진행 커스텀 훅
- `src/hooks/useRunStep.ts` - runStep 커스텀 훅

**수정할 파일**:
- `src/app/demo/page.tsx` - 200 라인 이하로 축소
- `src/services/LogService.ts` - 실제 호출 연동
- `src/app/page.tsx` - LogService.logStart() 호출 추가
- `src/app/result/page.tsx` - LogService.logComplete() 호출 추가
- `src/app/api/log/route.ts` - 관리자 대시보드 데이터 제공 확장

**삭제할 파일**:
- `src/app/api/demo/stream/route.ts`
- `src/app/api/demo/estimate/route.ts`
- `src/services/AIService.ts`

### 관련 User Stories
US-B01, US-B02, US-B03, US-B04, US-I01, US-I02, US-I03

### 완료 기준
- DemoPage 200 라인 이하
- 기존 131개 테스트 통과
- LogService가 실제로 /api/log를 호출
- 미사용 API Route 및 AIService 삭제됨

---

## Unit 2: 핵심 기능 (Core Features)

### 목적
Animation 컴포넌트를 DemoPage에 통합하고, 에러 핸들링을 개선.

### 요구사항
- REQ-B01: Animation 컴포넌트 DemoPage 통합
- REQ-B06: 에러 핸들링 부분 개선

### 범위
**수정할 파일**:
- `src/components/animation/AnimationOrchestrator.tsx` - DemoPage 통합
- `src/components/animation/MousePointer.tsx` - DemoPage 통합
- `src/components/animation/TypingEffect.tsx` - CodeEditor 통합
- `src/hooks/useRunStep.ts` - Animation 시퀀스 트리거 추가
- `src/components/kiro-ide/KiroIDELayout.tsx` - MousePointer 오버레이
- `src/app/demo/page.tsx` - Animation 통합
- `src/app/result/page.tsx` - 이메일 에러 메시지 표시
- `src/app/api/demo/start/route.ts` - 에러 응답 통일
- `src/app/api/demo/send-report/route.ts` - 에러 응답 통일
- `src/app/api/log/route.ts` - 에러 응답 통일
- `src/utils/demoStepGenerator.ts` - animationSequence 생성 추가

### 관련 User Stories
US-A01 ~ US-A07, US-D01, US-D02

### 완료 기준
- 마우스 포인터가 데모 중 파일 클릭, 채팅 타이핑, 버튼 클릭 등을 시뮬레이션
- AnimationOrchestrator가 단계별 시퀀스를 관리
- 이메일 전송 실패 시 에러 메시지 표시
- 모든 API 에러 응답 형식 통일

### 의존성
- Unit 1 완료 필수 (리팩토링된 DemoPage, useRunStep 훅)

---

## Unit 3: 품질 개선 (Quality Improvement)

### 목적
접근성 표준 개선 및 전면 성능 최적화.

### 요구사항
- REQ-B04: 접근성 표준 개선
- REQ-B07: 전면 성능 최적화

### 범위
**생성할 파일**:
- `src/components/ui/mvp-previews/EcommerceMVP.tsx`
- `src/components/ui/mvp-previews/BookingMVP.tsx`
- `src/components/ui/mvp-previews/LearningMVP.tsx`
- `src/components/ui/mvp-previews/ChatMVP.tsx`
- `src/components/ui/mvp-previews/DashboardMVP.tsx`

**수정할 파일**:
- `src/components/kiro-ide/FileExplorer.tsx` - 키보드 네비게이션, aria
- `src/components/kiro-ide/PhaseIndicator.tsx` - useMemo, aria
- `src/components/kiro-ide/KiroIDELayout.tsx` - 랜드마크 role
- `src/components/ui/MVPPreview.tsx` - 산업별 분리 + lazy loading
- `src/components/ui/AWSArchitectureDiagram.tsx` - shimmer 로딩
- `src/app/page.tsx` - 접근성 (aria-label, 키보드)
- `src/app/demo/page.tsx` - aria-live, 키보드
- `src/app/result/page.tsx` - 탭 키보드 네비게이션
- `src/app/globals.css` - 포커스 링, 색상 대비 수정
- `src/app/layout.tsx` - Image 컴포넌트 (kiro.jpg)

**설정 파일**:
- `next.config.js` - @next/bundle-analyzer 설정

### 관련 User Stories
US-C01 ~ US-C06, US-E01 ~ US-E05

### 완료 기준
- 키보드만으로 전체 데모 플로우 진행 가능
- 스크린 리더로 채팅 메시지 업데이트 읽힘
- 색상 대비 WCAG AA (4.5:1) 이상
- MVPPreview 산업별 lazy loading 동작
- PhaseIndicator 메모이제이션 적용
- bundle-analyzer 설정 완료

### 의존성
- Unit 1 완료 필수 (리팩토링된 컴포넌트 구조)

---

## Unit 4: 신규 기능 (New Features)

### 목적
관리자 대시보드와 다국어 지원 추가.

### 요구사항
- REQ-B08: 관리자 대시보드
- REQ-B09: 다국어 지원 (한/영)

### 범위
**생성할 파일**:
- `src/app/admin/page.tsx` - 관리자 대시보드
- `src/contexts/LanguageContext.tsx` - 언어 상태 Context
- `src/i18n/ko.ts` - 한국어 번역
- `src/i18n/en.ts` - 영어 번역
- `src/i18n/index.ts` - useTranslation 훅
- `src/components/ui/LanguageToggle.tsx` - 언어 전환 토글

**수정할 파일**:
- `src/app/layout.tsx` - LanguageProvider 래핑
- `src/app/page.tsx` - 다국어 적용
- `src/app/demo/page.tsx` - 다국어 적용
- `src/app/result/page.tsx` - 다국어 적용
- `src/components/ui/ResultSummary.tsx` - 다국어 적용

### 관련 User Stories
US-G01 ~ US-G06, US-H01 ~ US-H04, US-J01, US-J02

### 완료 기준
- /admin 접속 시 대시보드 표시 (통계, 로그, 차트)
- 모든 페이지에서 한/영 전환 가능
- 언어 설정 localStorage 영속화
- 페이지 새로고침 후 언어 유지

### 의존성
- Unit 1 완료 필수 (log 연동)
- Unit 3 완료 권장 (접근성 적용된 컴포넌트에 다국어 추가)

---

## Unit 5: 마무리 (Finalization)

### 목적
이메일 기능 유지 확인, 통합 테스트, 최종 검증.

### 요구사항
- REQ-B05: 이메일 리포트 모의 구현 유지

### 범위
**검증 항목**:
- 이메일 리포트 모의 전송 정상 동작 확인
- 전체 데모 플로우 E2E 검증 (시작 -> 데모 -> 결과)
- 관리자 대시보드 데이터 정합성 확인
- 다국어 전환 전체 페이지 검증
- 기존 테스트 + 신규 테스트 전체 통과
- 빌드 성공 확인

### 관련 User Stories
US-F01

### 완료 기준
- 모든 테스트 통과
- `npm run build` 성공
- 전체 데모 플로우 정상 동작

### 의존성
- Unit 1~4 모두 완료 필수
