# Contract/Interface Definition - Unit 3: 품질 개선

## Unit Context
- **Stories**: US-C01~C06 (접근성), US-E01~E05 (성능)
- **Dependencies**: Unit 1, Unit 2 완료
- **Project Type**: Brownfield (Next.js 14 + TypeScript)

---

## 접근성 계약 (Accessibility Contracts)

### 시작 페이지 접근성 (page.tsx)
- 산업 카드 예시 버튼: `aria-label` 추가
- 텍스트 입력: `aria-label="프로젝트 아이디어 입력"` 추가
- 시작 버튼: 이미 텍스트 있으므로 추가 불필요
- 전체 카드 영역: 키보드 Tab 순서 자연스럽게 유지

### 결과 페이지 탭 접근성 (result/page.tsx)
- 탭 컨테이너: `role="tablist"`
- 각 탭 버튼: `role="tab"`, `aria-selected`, `id="tab-{id}"`, `aria-controls="tabpanel-{id}"`
- 각 탭 패널: `role="tabpanel"`, `aria-labelledby="tab-{id}"`, `id="tabpanel-{id}"`, `tabIndex={0}`
- 키보드: Enter/Space로 탭 전환

### 데모 페이지 접근성 (demo/page.tsx)
- 채팅 메시지 영역: `aria-live="polite"`, `role="log"`

### KiroIDELayout 접근성
- 메인 컨테이너: `role="main"`, `aria-label="Kiro IDE"`
- 파일 탐색기 영역: `role="tree"`, `aria-label="파일 탐색기"`
- 코드 편집기 영역: `role="region"`, `aria-label="코드 편집기"`
- 채팅 영역: `role="log"`, `aria-live="polite"`, `aria-label="채팅 메시지"`

### 색상 대비 (globals.css)
- `--kiro-text-muted`: `#8888a0` -> `#a0a0b8`
- 포커스 링: `:focus-visible { outline: 2px solid var(--kiro-purple); outline-offset: 2px; }`
- 비활성 텍스트 클래스: `#4a4a5a` -> `#6a6a7a`, `#3a3a4a` -> `#5a5a6a`

---

## 성능 계약 (Performance Contracts)

### MVPPreview 코드 스플리팅
- `src/components/ui/mvp-previews/EcommerceMVP.tsx`: `export { EcommerceUserMVP, EcommerceAdminMVP }`
- `src/components/ui/mvp-previews/BookingMVP.tsx`: `export { BookingUserMVP, BookingAdminMVP }`
- `src/components/ui/mvp-previews/LearningMVP.tsx`: `export { LearningUserMVP, LearningAdminMVP }`
- `src/components/ui/mvp-previews/ChatMVP.tsx`: `export { ChatUserMVP, ChatAdminMVP }`
- `src/components/ui/mvp-previews/DashboardMVP.tsx`: `export { DashboardUserMVP, DashboardAdminMVP }`
- `src/components/ui/MVPPreview.tsx`: Next.js `dynamic()` import로 각 산업별 컴포넌트 로드, `ssr: false`, loading shimmer

### PhaseIndicator 메모이제이션
- `phaseConfigs`: `useMemo(() => [...], [])`
- `PhaseIndicator`: `React.memo()` 래핑
- export: `export default React.memo(PhaseIndicatorInner)`

### 이미지 최적화
- `src/app/page.tsx` KiroLogo: `<img>` -> `<Image>` (next/image)
- `src/components/kiro-ide/KiroIDELayout.tsx` KiroIcon: `<img>` -> `<Image>` (next/image)
- props: `src="/kiro.jpg"`, `alt="Kiro AI 어시스턴트"`, `width`, `height`

### AWSArchitectureDiagram shimmer 로딩
- 로딩 중: shimmer 스켈레톤 (기존 "다이어그램 로딩중..." 텍스트 대체)
- 렌더링 완료: opacity fade-in

### Bundle Analyzer
- `@next/bundle-analyzer` devDependency 설치
- `next.config.js`: `withBundleAnalyzer` 조건부 래핑
- `package.json`: `"analyze"` script 추가
