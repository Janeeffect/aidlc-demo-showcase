# Business Rules - Unit 3: 품질 개선 (Quality Improvement)

## 접근성 규칙

### BR-ACC-01: 키보드 포커스 순서
- 모든 인터랙티브 요소는 논리적 순서로 Tab 이동 가능해야 함
- 시작 페이지: 산업 카드 -> 텍스트 입력 -> 시작 버튼
- 결과 페이지: 탭 헤더들 -> 활성 탭 패널 콘텐츠

### BR-ACC-02: 키보드 활성화
- 모든 클릭 가능한 요소는 Enter 또는 Space로도 활성화 가능
- 산업 카드: onKeyDown에서 Enter/Space 처리
- 탭 헤더: onKeyDown에서 Enter/Space로 탭 전환

### BR-ACC-03: 포커스 가시성
- :focus-visible 시 2px solid #7c5cfc 포커스 링 표시
- offset: 2px (요소와 포커스 링 사이 간격)
- 마우스 클릭 시 포커스 링 미표시 (:focus-visible만 사용)
- outline-color는 --kiro-purple 변수 사용

### BR-ACC-04: 스크린 리더 채팅 알림
- 채팅 메시지 컨테이너: aria-live="polite"
- 새 메시지 추가 시 스크린 리더가 최신 메시지만 읽음
- role="log"로 채팅 영역 의미 전달

### BR-ACC-05: ARIA 레이블 필수
- 아이콘만 있는 버튼: aria-label 필수
- 입력 필드: aria-label 또는 htmlFor 연결된 label 필수
- 랜드마크 영역: role + aria-label 필수

### BR-ACC-06: 색상 대비 최소 기준
- 본문 텍스트: WCAG AA 4.5:1 이상
- 대형 텍스트 (18px+ 또는 14px+ bold): 3:1 이상
- UI 컴포넌트/그래픽: 3:1 이상
- --kiro-text-muted: #8888a0 -> #a0a0b8 (4.5:1 이상 달성)

### BR-ACC-07: 결과 페이지 탭 접근성
- role="tablist" on 탭 컨테이너
- role="tab" on 각 탭 헤더, aria-selected="true/false"
- role="tabpanel" on 각 탭 패널, aria-labelledby로 탭 헤더 연결
- 탭 패널: tabIndex={0}으로 포커스 가능

---

## 성능 규칙

### BR-PERF-01: MVPPreview 코드 스플리팅
- 산업별 MVP 컴포넌트는 별도 파일로 분리
- Next.js dynamic()으로 lazy load (ssr: false)
- loading 상태: shimmer 스켈레톤 UI 표시
- 각 산업별 파일은 User + Admin MVP를 함께 포함

### BR-PERF-02: PhaseIndicator 메모이제이션
- phaseConfigs: useMemo([], []) - 상수이므로 빈 의존성 배열
- PhaseIndicator: React.memo 래핑
- React.memo 비교: currentPhase, currentStage, animationProgress 변경 시만 리렌더

### BR-PERF-03: 이미지 최적화
- kiro.jpg: Next.js Image 컴포넌트 사용
- width/height 명시 (레이아웃 시프트 방지)
- alt 텍스트 필수: "Kiro AI 어시스턴트"
- KiroIDELayout 내 이미지: priority={false} (below-the-fold)

### BR-PERF-04: Mermaid 로딩 UX
- 로딩 중: shimmer 스켈레톤 (높이 고정)
- 렌더링 완료: opacity 0->1 fade-in (300ms)
- 에러 시: "다이어그램을 불러올 수 없습니다" 텍스트 표시

### BR-PERF-05: 번들 분석 설정
- @next/bundle-analyzer devDependency로 설치
- ANALYZE 환경변수가 true일 때만 활성화
- next.config.js: withBundleAnalyzer 조건부 래핑
- package.json scripts: "analyze" 추가
