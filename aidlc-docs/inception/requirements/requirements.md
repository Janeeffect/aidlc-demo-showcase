# AI-DLC Demo Showcase 요구사항 정의서 (Brownfield)

## 1. 프로젝트 개요

### 1.1 Intent Analysis
| 항목 | 분석 결과 |
|------|----------|
| **User Request** | 기존 AI-DLC Demo Showcase 코드베이스 개선 및 확장 |
| **Request Type** | Enhancement (기존 시스템 개선/확장) |
| **Scope** | System-wide |
| **Complexity** | Moderate |
| **Project Type** | Brownfield (기존 코드베이스 존재) |

### 1.2 현재 시스템 상태
- Next.js 14 + TypeScript + Tailwind CSS + Framer Motion 기반 웹앱
- 3개 페이지 (시작/데모/결과), 11개 컴포넌트, 5개 API Route, 3개 서비스
- 8개 테스트 스위트, 131개 테스트 통과
- 7개 산업 시나리오 분기 (이커머스, 핀테크, 헬스케어, 교육, 물류, SaaS, 채팅)

### 1.3 개선 목표
RE에서 발견된 기술 부채 해소, 미사용 코드 정리/활용, 새로운 기능 추가를 통해 AWS Summit 부스 데모의 완성도를 높인다.

---

## 2. 기술 스택 (변경 없음)

| 영역 | 기술 |
|------|------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript (strict mode) |
| **UI Library** | React 18 |
| **Styling** | Tailwind CSS 3.4 |
| **Animation** | Framer Motion 11 |
| **Diagram** | Mermaid 11 |
| **Testing** | Jest 30 + @testing-library/react 16 |
| **Deployment** | Vercel (권장) |

---

## 3. 기능 요구사항 (변경/추가 사항)

### 3.1 [신규] Animation 컴포넌트 활용 (REQ-B01)
**우선순위**: High
**관련 RE 발견**: Animation 컴포넌트 3개 미사용

**기능 요구사항**:
- 기존 `src/components/animation/` 디렉토리의 AnimationOrchestrator, MousePointer, TypingEffect를 DemoPage에 통합
- 마우스 포인터 애니메이션: 가상 마우스 커서가 파일 탐색기에서 파일 클릭, 채팅 입력 등의 동작을 시뮬레이션
- 타이핑 효과: 기존 CodeEditor의 타이핑 효과와 Animation TypingEffect를 통합하여 일관된 타이핑 애니메이션 제공
- AnimationOrchestrator: 단계별 애니메이션 시퀀스를 관리하여 자연스러운 데모 진행

**수용 기준**:
- DemoPage에서 마우스 포인터가 화면에 표시되고 파일/버튼을 클릭하는 동작이 시뮬레이션됨
- 애니메이션이 채팅 메시지 및 파일 생성과 동기화됨
- 기존 131개 테스트가 깨지지 않음

### 3.2 [변경] 미사용 API Route 정리 (REQ-B02)
**우선순위**: Medium
**관련 RE 발견**: stream/estimate/log API 미사용

**기능 요구사항**:
- `GET /api/demo/stream` 삭제 (DemoPage가 클라이언트 사이드에서 직접 콘텐츠 생성)
- `POST /api/demo/estimate` 삭제 (ResultPage가 클라이언트 사이드 EstimateService 사용)
- `POST/GET /api/log` 실제 연동: DemoPage/ResultPage에서 LogService를 통해 세션 시작/완료 로그 기록
- AIService 정리: 미사용 시 삭제 또는 향후 LLM 연동을 위한 인터페이스만 유지

**수용 기준**:
- stream, estimate API Route 파일 삭제됨
- log API가 실제로 호출되어 세션 데이터가 기록됨
- 관리자 대시보드에서 로그 데이터 조회 가능

### 3.3 [변경] DemoPage 전면 리팩토링 (REQ-B03)
**우선순위**: High
**관련 RE 발견**: God Component 안티패턴 (500+ 라인)

**기능 요구사항**:
- `detectScenario` 함수를 `src/services/ScenarioService.ts` 또는 `src/utils/scenarioDetector.ts`로 분리
- `generateDemoSteps` 함수를 별도 모듈로 분리
- 산업별 시나리오 데이터를 별도 설정 파일로 외부화
- DemoPage 내부 상태 관리 로직을 커스텀 훅 (`useDemoProgress` 등)으로 추출
- `runStep` 로직을 커스텀 훅으로 분리

**수용 기준**:
- DemoPage가 200 라인 이하로 축소
- 각 분리된 모듈이 독립적으로 테스트 가능
- 기존 동작과 동일하게 작동

### 3.4 [변경] 접근성 표준 개선 (REQ-B04)
**우선순위**: Medium
**관련 RE 발견**: 접근성 미흡 (aria 속성 미사용, 키보드 네비게이션 미지원)

**기능 요구사항**:
- 모든 인터랙티브 요소에 `aria-label` 추가
- 채팅 메시지 영역에 `aria-live="polite"` 적용 (실시간 업데이트 스크린 리더 전달)
- 파일 탐색기, 결과 페이지 탭에 키보드 네비게이션 지원 (Arrow keys, Enter, Tab)
- 커스텀 포커스 링 스타일 설정 (Kiro 디자인 시스템에 맞는 보라색 포커스 링)
- 색상 대비 검토: `--kiro-text-muted` (#8888a0) on `--kiro-bg` (#0a0a0f) 대비율 확인 및 수정
- 주요 랜드마크에 `role` 속성 추가 (navigation, main, complementary)

**수용 기준**:
- 키보드만으로 전체 데모 플로우 진행 가능
- 스크린 리더로 채팅 메시지 업데이트가 읽힘
- 색상 대비가 WCAG AA 기준 (4.5:1) 이상

### 3.5 [유지] 이메일 리포트 모의 구현 (REQ-B05)
**우선순위**: Low
**관련 RE 발견**: 이메일 전송 미구현

**기능 요구사항**:
- 현재 모의 구현 유지 (성공 응답 반환)
- 향후 AWS SES 연동을 위한 인터페이스 구조는 유지

### 3.6 [변경] 에러 핸들링 부분 개선 (REQ-B06)
**우선순위**: Medium
**관련 RE 발견**: 에러 핸들링 미흡

**기능 요구사항**:
- 이메일 전송 실패 시 사용자에게 토스트/알림 메시지 표시
- API 에러 응답 형식 통일: `{ success: boolean, message: string, error?: string }`
- 사용자에게 보이는 모든 에러에 대해 친화적인 한국어 메시지 제공

**수용 기준**:
- 이메일 전송 실패 시 "전송에 실패했습니다. 다시 시도해주세요." 메시지 표시
- 모든 API Route의 에러 응답 형식이 통일됨

### 3.7 [변경] 전면 성능 최적화 (REQ-B07)
**우선순위**: Medium
**관련 RE 발견**: 번들 크기, 메모이제이션 부재, Image 미사용

**기능 요구사항**:
- `kiro.jpg`에 Next.js `Image` 컴포넌트 적용 (자동 최적화)
- PhaseIndicator의 `phaseConfigs` 배열을 `useMemo`로 메모이제이션
- MVPPreview.tsx를 산업별 하위 컴포넌트로 분리하여 코드 스플리팅 가능하게 구성
- Mermaid 동적 import 유지, 로딩 상태 UI 개선 (shimmer 효과)
- 번들 분석 도구 설정 (`@next/bundle-analyzer`)

**수용 기준**:
- Lighthouse Performance 점수 개선 (측정 가능한 수준)
- MVPPreview가 산업별 lazy loading 가능
- 불필요한 리렌더링 감소

### 3.8 [신규] 관리자 대시보드 (REQ-B08)
**우선순위**: Medium

**기능 요구사항**:
- `/admin` 경로에 관리자 대시보드 페이지 추가
- 데모 통계 표시: 총 세션 수, 완료율, 평균 소요 시간
- 방문객 입력 분석: 인기 프로젝트 아이디어 목록, 산업별 분포
- 최근 세션 로그 테이블 (타임스탬프, 아이디어, 완료 여부, 소요 시간)
- 간단한 차트 시각화 (세션 추이, 산업별 분포)
- log API 데이터 기반으로 동작

**수용 기준**:
- `/admin` 접속 시 대시보드 표시
- 실시간 데이터 반영 (페이지 새로고침 시)
- 기본적인 통계 차트 표시

### 3.9 [신규] 다국어 지원 (REQ-B09)
**우선순위**: Medium

**기능 요구사항**:
- 한국어/영어 전환 지원
- 언어 전환 토글 UI (헤더 또는 시작 페이지)
- 번역 대상: UI 텍스트, 버튼 레이블, 안내 메시지, 에러 메시지
- 산업 시나리오 콘텐츠는 한국어 유지 (데모 콘텐츠 특성상)
- i18n 라이브러리 사용 (next-intl 또는 react-i18next)

**수용 기준**:
- 시작 페이지에서 언어 전환 가능
- 전환 시 모든 UI 텍스트가 해당 언어로 표시
- 페이지 새로고침 후에도 언어 설정 유지 (localStorage)

---

## 4. 비기능 요구사항 (변경/추가 사항)

### 4.1 성능 (변경)
- 첫 화면 로딩 3초 이내 (유지)
- Mermaid 다이어그램 로딩 시 shimmer 효과로 체감 대기 시간 최소화
- MVPPreview 산업별 lazy loading으로 초기 번들 크기 감소

### 4.2 접근성 (신규)
- WCAG AA 수준 색상 대비 (4.5:1 이상)
- 키보드 전용 네비게이션 지원
- 스크린 리더 호환 (aria-live, aria-label, role)
- 커스텀 포커스 표시기

### 4.3 유지보수성 (신규)
- DemoPage 200 라인 이하 (리팩토링 후)
- 모듈별 단일 책임 원칙 준수
- 산업 시나리오 데이터 외부화로 확장 용이성 확보

### 4.4 국제화 (신규)
- 한국어/영어 2개 언어 지원
- 언어 설정 localStorage 영속화

---

## 5. 변경 영향 분석

### 5.1 영향받는 파일 (기존)
| 파일 | 변경 유형 | 관련 요구사항 |
|------|----------|-------------|
| `src/app/demo/page.tsx` | 대폭 수정 (리팩토링 + Animation 통합) | REQ-B01, REQ-B03 |
| `src/components/animation/*` | 수정 (DemoPage 통합) | REQ-B01 |
| `src/components/kiro-ide/PhaseIndicator.tsx` | 수정 (메모이제이션) | REQ-B07 |
| `src/components/ui/MVPPreview.tsx` | 분리 (산업별 하위 컴포넌트) | REQ-B07 |
| `src/components/ui/AWSArchitectureDiagram.tsx` | 수정 (로딩 UI 개선) | REQ-B07 |
| `src/app/result/page.tsx` | 수정 (에러 핸들링, 접근성, 다국어) | REQ-B04, REQ-B06, REQ-B09 |
| `src/app/page.tsx` | 수정 (접근성, 다국어, 로그 연동) | REQ-B02, REQ-B04, REQ-B09 |
| `src/app/layout.tsx` | 수정 (다국어 Provider) | REQ-B09 |
| `src/app/globals.css` | 수정 (포커스 링, 색상 대비) | REQ-B04 |
| `src/services/LogService.ts` | 수정 (실제 호출 연동) | REQ-B02 |
| `src/app/api/demo/send-report/route.ts` | 수정 (에러 응답 통일) | REQ-B06 |
| `src/app/api/demo/start/route.ts` | 수정 (에러 응답 통일) | REQ-B06 |
| `src/app/api/log/route.ts` | 수정 (관리자 대시보드 데이터 제공) | REQ-B02, REQ-B08 |

### 5.2 삭제 대상 파일
| 파일 | 사유 | 관련 요구사항 |
|------|------|-------------|
| `src/app/api/demo/stream/route.ts` | 미사용 API Route | REQ-B02 |
| `src/app/api/demo/estimate/route.ts` | 미사용 API Route | REQ-B02 |
| `src/services/AIService.ts` | 미사용 서비스 (향후 LLM 연동 시 재생성) | REQ-B02 |

### 5.3 신규 생성 파일
| 파일 | 목적 | 관련 요구사항 |
|------|------|-------------|
| `src/utils/scenarioDetector.ts` | detectScenario 분리 | REQ-B03 |
| `src/utils/demoStepGenerator.ts` | generateDemoSteps 분리 | REQ-B03 |
| `src/hooks/useDemoProgress.ts` | 데모 진행 커스텀 훅 | REQ-B03 |
| `src/hooks/useRunStep.ts` | runStep 커스텀 훅 | REQ-B03 |
| `src/app/admin/page.tsx` | 관리자 대시보드 | REQ-B08 |
| `src/i18n/` (디렉토리) | 다국어 설정 및 번역 파일 | REQ-B09 |
| `src/components/ui/mvp-previews/` (디렉토리) | 산업별 MVP 하위 컴포넌트 | REQ-B07 |

---

## 6. 제외 범위 (Out of Scope)

- 실제 AWS SES 이메일 전송 연동 (향후 구현)
- 실제 LLM/AI API 연동 (향후 구현)
- 데이터베이스 영구 저장 (In-memory 유지)
- 사용자 인증/로그인 (관리자 대시보드 포함)
- 모바일 반응형 디자인 (부스 전용)
- E2E 테스트 구현

---

## 7. 요구사항 요약

| ID | 요구사항 | 우선순위 | 유형 |
|----|---------|---------|------|
| REQ-B01 | Animation 컴포넌트 DemoPage 통합 | High | 신규 |
| REQ-B02 | 미사용 API Route 정리 + log 연동 | Medium | 변경 |
| REQ-B03 | DemoPage 전면 리팩토링 | High | 변경 |
| REQ-B04 | 접근성 표준 개선 | Medium | 변경 |
| REQ-B05 | 이메일 리포트 모의 구현 유지 | Low | 유지 |
| REQ-B06 | 에러 핸들링 부분 개선 | Medium | 변경 |
| REQ-B07 | 전면 성능 최적화 | Medium | 변경 |
| REQ-B08 | 관리자 대시보드 | Medium | 신규 |
| REQ-B09 | 다국어 지원 (한/영) | Medium | 신규 |
