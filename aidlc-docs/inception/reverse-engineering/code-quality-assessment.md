# Code Quality Assessment

## Test Coverage

- **Overall**: Good (8개 테스트 스위트, 131개 테스트 통과)
- **Unit Tests**: 구현됨 - Jest + @testing-library/react
  - 페이지 테스트: StartPage, DemoPage, ResultPage
  - 컴포넌트 테스트: MVPPreview, AWSArchitecture, BusinessWorkflow
  - 서비스 테스트: EstimateService
  - Context 테스트: DemoSessionContext
- **Integration Tests**: 미구현
- **E2E Tests**: 미구현

## Code Quality Indicators

- **Linting**: 구성됨 (ESLint + eslint-config-next)
- **TypeScript Strict Mode**: 활성화 (`"strict": true` in tsconfig.json)
- **Code Style**: 일관적
  - Kiro 디자인 시스템 색상 토큰 일관 사용
  - 컴포넌트 파일 구조 통일 (default export + 내부 헬퍼)
  - 'use client' 지시어 일관 사용
- **Documentation**: Fair
  - 코드 내 주석: 최소한 (주요 함수에 한줄 주석)
  - README.md: 존재
  - API 문서: 미작성 (타입 정의로 대체)
  - 인라인 타입 정의: 양호 (src/types/ 디렉토리)

## Technical Debt

### 높은 우선순위
1. **uuid 패키지 중복 사용**: `src/app/api/demo/start/route.ts`에서 `uuid` 패키지 사용, `DemoSessionContext`에서는 `crypto.randomUUID()` 사용. 통일 필요.
2. **In-memory 로그 저장**: `src/app/api/log/route.ts`에서 배열에 로그 저장. 서버 재시작 시 데이터 손실. Production 환경에서는 DB 필요.
3. **이메일 전송 미구현**: `src/app/api/demo/send-report/route.ts`에서 콘솔 로그만 기록. AWS SES 등 실제 이메일 서비스 연동 필요.

### 중간 우선순위
4. **Animation 컴포넌트 미사용**: `src/components/animation/` 디렉토리의 3개 파일 (AnimationOrchestrator, MousePointer, TypingEffect)이 어디서도 import되지 않음. 제거 또는 활용 필요.
5. **API Route estimate 중복 로직**: `src/app/api/demo/estimate/route.ts`와 `src/services/EstimateService.ts`에 유사한 복잡도 분석 로직이 중복 존재.
6. **SSE 스트리밍 템플릿 기반**: `src/app/api/demo/stream/route.ts`가 하드코딩된 템플릿 사용. 실제 LLM 연동 시 대폭 수정 필요.

### 낮은 우선순위
7. **DemoPage 파일 크기**: `src/app/demo/page.tsx`가 매우 큼 (500+ 라인). detectScenario, generateDemoSteps 등을 별도 모듈로 분리 권장.
8. **MVPPreview 파일 크기**: `src/components/ui/MVPPreview.tsx`가 매우 큼 (600+ 라인). 산업별 MVP 컴포넌트를 별도 파일로 분리 권장.
9. **하드코딩된 산업 시나리오**: detectScenario 함수의 키워드 매칭이 하드코딩. 설정 파일이나 DB로 외부화 가능.

## Patterns and Anti-patterns

### Good Patterns
- **useReducer + Context**: 복잡한 상태 관리를 예측 가능하게 처리
- **타입 안전성**: TypeScript strict mode + 명시적 타입 정의
- **컴포넌트 분리**: IDE 레이아웃을 독립적 하위 컴포넌트로 구성
- **동적 Import**: Mermaid.js를 클라이언트 사이드에서만 로드하여 SSR 호환
- **Suspense 활용**: ResultPage에서 useSearchParams를 Suspense로 래핑
- **파일 트리 중복 방지**: addFileToTree 헬퍼에서 기존 파일 업데이트 로직
- **runIdRef 취소 메커니즘**: 비동기 단계 진행 시 이전 실행 취소

### Anti-patterns
- **God Component**: DemoPage가 시나리오 감지, 단계 생성, 실행, UI를 모두 담당
- **중복 로직**: estimate API route와 EstimateService에 유사한 복잡도 분석
- **미사용 코드**: animation 컴포넌트 3개가 import되지 않음
- **Magic Numbers**: 타이핑 딜레이 (50ms, 100ms 등)가 하드코딩
- **In-memory 저장소**: 로그 API가 배열 사용 (서버리스 환경에서 문제)

## Security Assessment

- **인증/인가**: 없음 (데모 앱이므로 불필요)
- **입력 검증**: 기본적 (projectIdea 빈 문자열 체크만)
- **XSS 방지**: React의 기본 이스케이핑에 의존
- **CORS**: Next.js 기본 설정 사용
- **환경 변수**: 사용하지 않음 (외부 서비스 연동 없음)
- **Rate Limiting**: 없음 (AWS Summit 부스 환경에서는 불필요할 수 있음)

## Accessibility Assessment

- **키보드 네비게이션**: 부분적 - 버튼/입력 필드는 기본 포커스 가능, 파일 탐색기/탭은 키보드 전용 네비게이션 미지원
- **스크린 리더**: 미흡 - `aria-label`, `aria-live`, `role` 속성 미사용. 채팅 메시지 실시간 업데이트가 스크린 리더에 전달되지 않음
- **색상 대비**: 부분적 - 다크 테마에서 `#8888a0` (muted text) on `#0a0a0f` (배경)은 WCAG AA 기준 미달 가능성. MVP 미리보기의 흰 배경 컴포넌트는 양호
- **포커스 표시**: 미흡 - 커스텀 포커스 링 미설정, 브라우저 기본 포커스에 의존
- **대체 텍스트**: 부분적 - `kiro.jpg` 이미지에 `alt="Kiro"` 있음, SVG 아이콘에는 대체 텍스트 없음
- **개선 권장**: AWS Summit 부스 환경에서 다양한 방문객 대응을 위해 최소한의 접근성 개선 필요

## Performance Assessment

- **번들 크기 우려**:
  - `mermaid` (^11.12.3): 매우 큰 라이브러리, 동적 import로 완화했으나 첫 로드 시 지연 가능
  - `framer-motion` (^11.0.0): 중간 크기, 모든 페이지에서 사용
  - `MVPPreview.tsx` (600+ 라인): 10개 하위 컴포넌트가 한 파일에 포함, 코드 스플리팅 불가
- **렌더링 성능**:
  - DemoPage: `useMemo`로 `demoSteps` 캐싱 양호
  - PhaseIndicator: 매 렌더링마다 `phaseConfigs` 배열 재생성 (메모이제이션 없음)
  - FileExplorer: 재귀적 렌더링이지만 파일 수가 적어 문제 없음
- **네트워크**: 외부 API 호출 최소 (start API만), 대부분 클라이언트 사이드 처리로 오프라인에서도 데모 가능
- **이미지**: `kiro.jpg`만 사용, Next.js Image 컴포넌트 대신 `<img>` 태그 사용 (최적화 미적용)

## Responsive Design Assessment

- **시작 페이지**: 2/5 + 3/5 고정 비율 레이아웃 (`w-2/5`, `w-3/5`). 모바일에서 좌측 패널이 너무 좁아짐
- **데모 페이지**: `h-screen w-screen overflow-hidden` 고정. 파일 탐색기 `w-56` 고정폭, 채팅 패널 `w-80` 고정폭. 작은 화면에서 에디터 영역이 극도로 좁아짐
- **결과 페이지**: `max-w-6xl mx-auto`로 중앙 정렬, 탭 `overflow-x-auto`로 스크롤 가능. 상대적으로 양호
- **MVP 미리보기**: 모바일/데스크톱 토글 있으나, 실제 뷰포트 반응형이 아닌 컴포넌트 내부 토글
- **전반적 평가**: 부스 환경(고정 화면 크기)에서는 문제 없으나, 다양한 디바이스 대응은 미흡
- **개선 권장**: 부스 전용이므로 현재 수준 유지 가능, 외부 공개 시 반응형 개선 필요

## Error Handling Assessment

- **API 호출 에러**:
  - StartPage: `try-catch` + `.catch(() => {})` - 실패해도 데모 진행 (graceful degradation)
  - ResultPage EmailReportModal: `try-catch` - 실패 시 콘솔 에러만 (사용자 피드백 없음)
- **runStep 에러**: `try-catch`로 감싸져 있음, 에러 시 `isAnimating=false`, `stepCompleted=true`로 복구
- **라우팅 에러**: projectIdea 없으면 StartPage로 리다이렉트 (`router.push('/')`)
- **Mermaid 렌더링 에러**: `try-catch` + fallback HTML (텍스트 기반 서비스 목록)
- **미흡한 부분**:
  - 이메일 전송 실패 시 사용자에게 에러 메시지 미표시
  - 네트워크 오프라인 상태 감지 없음
  - API route 에러 응답이 일관적이지 않음 (`{ error: ... }` vs `{ success: false, message: ... }`)
