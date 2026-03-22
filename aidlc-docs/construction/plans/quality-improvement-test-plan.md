# Test Plan - Unit 3: 품질 개선

## Unit Overview
- **Unit**: quality-improvement
- **Stories**: US-C01~C06, US-E01~E05
- **Requirements**: REQ-B04 (접근성), REQ-B07 (성능)

---

## 접근성 테스트

### 시작 페이지 키보드/접근성 (US-C01, US-C05)
- **TC-QI-001**: 시작 페이지 입력 필드에 aria-label 존재
  - Given: 시작 페이지 렌더링
  - When: 입력 필드 확인
  - Then: aria-label="프로젝트 아이디어 입력" 존재
  - Status: ⬜ Not Started

- **TC-QI-002**: 산업 예시 버튼 키보드 접근 가능
  - Given: 시작 페이지 렌더링
  - When: 예시 버튼에 포커스
  - Then: 버튼이 포커스 가능하고 Enter로 클릭 가능
  - Status: ⬜ Not Started

### 결과 페이지 탭 접근성 (US-C02)
- **TC-QI-003**: 탭 컨테이너에 role="tablist" 존재
  - Given: 결과 페이지 렌더링
  - When: 탭 영역 확인
  - Then: role="tablist" 속성 존재
  - Status: ⬜ Not Started

- **TC-QI-004**: 각 탭에 role="tab"과 aria-selected 존재
  - Given: 결과 페이지 렌더링
  - When: 탭 버튼 확인
  - Then: role="tab", aria-selected="true/false" 존재
  - Status: ⬜ Not Started

- **TC-QI-005**: 탭 패널에 role="tabpanel"과 aria-labelledby 존재
  - Given: 결과 페이지 렌더링
  - When: 활성 탭 패널 확인
  - Then: role="tabpanel", aria-labelledby 존재
  - Status: ⬜ Not Started

- **TC-QI-006**: 키보드로 탭 전환 가능
  - Given: 탭에 포커스
  - When: Enter 키 누름
  - Then: 해당 탭 활성화
  - Status: ⬜ Not Started

### 채팅 스크린 리더 (US-C04)
- **TC-QI-007**: 채팅 영역에 aria-live="polite" 존재
  - Given: KiroIDELayout 렌더링
  - When: 채팅 컨테이너 확인
  - Then: aria-live="polite" 속성 존재
  - Status: ⬜ Not Started

### ARIA 레이블 (US-C05)
- **TC-QI-008**: KiroIDELayout에 role="main" 존재
  - Given: KiroIDELayout 렌더링
  - When: 메인 컨테이너 확인
  - Then: role="main", aria-label="Kiro IDE" 존재
  - Status: ⬜ Not Started

- **TC-QI-009**: 파일 탐색기에 role="tree" 존재
  - Given: KiroIDELayout 렌더링
  - When: 파일 탐색기 영역 확인
  - Then: role="tree", aria-label 존재
  - Status: ⬜ Not Started

### 색상 대비 (US-C06)
- **TC-QI-010**: --kiro-text-muted 색상이 #a0a0b8
  - Given: globals.css 로드
  - When: CSS 변수 확인
  - Then: --kiro-text-muted 값이 #a0a0b8
  - Status: ⬜ Not Started

- **TC-QI-011**: 포커스 링 스타일 존재
  - Given: globals.css 로드
  - When: :focus-visible 규칙 확인
  - Then: outline 스타일 정의됨
  - Status: ⬜ Not Started

---

## 성능 테스트

### MVPPreview 코드 스플리팅 (US-E03)
- **TC-QI-012**: MVPPreview가 dynamic import 사용
  - Given: MVPPreview.tsx
  - When: 산업별 컴포넌트 로드
  - Then: Next.js dynamic()으로 lazy load
  - Status: ⬜ Not Started

- **TC-QI-013**: 산업별 MVP 파일이 분리되어 존재
  - Given: mvp-previews/ 디렉토리
  - When: 파일 확인
  - Then: 5개 산업별 파일 존재 (EcommerceMVP, BookingMVP, LearningMVP, ChatMVP, DashboardMVP)
  - Status: ⬜ Not Started

- **TC-QI-014**: MVPPreview 로딩 시 shimmer 스켈레톤 표시
  - Given: MVPPreview 렌더링
  - When: 컴포넌트 로딩 중
  - Then: shimmer 클래스가 있는 로딩 UI 표시
  - Status: ⬜ Not Started

### PhaseIndicator 메모이제이션 (US-E02)
- **TC-QI-015**: PhaseIndicator가 React.memo로 래핑
  - Given: PhaseIndicator 컴포넌트
  - When: 동일 props로 리렌더
  - Then: 리렌더 발생하지 않음
  - Status: ⬜ Not Started

- **TC-QI-016**: phaseConfigs가 useMemo로 메모이제이션
  - Given: PhaseIndicator 렌더링
  - When: 리렌더 발생
  - Then: phaseConfigs 참조 동일
  - Status: ⬜ Not Started

### 이미지 최적화 (US-E01)
- **TC-QI-017**: 시작 페이지 KiroLogo가 Next.js Image 사용
  - Given: 시작 페이지 렌더링
  - When: Kiro 로고 확인
  - Then: next/image Image 컴포넌트 사용, alt 텍스트 존재
  - Status: ⬜ Not Started

- **TC-QI-018**: KiroIDELayout KiroIcon이 Next.js Image 사용
  - Given: KiroIDELayout 렌더링
  - When: Kiro 아이콘 확인
  - Then: next/image Image 컴포넌트 사용, alt 텍스트 존재
  - Status: ⬜ Not Started

### Mermaid 로딩 UX (US-E04)
- **TC-QI-019**: AWSArchitectureDiagram 로딩 시 shimmer 표시
  - Given: AWSArchitectureDiagram 렌더링
  - When: Mermaid 로딩 중
  - Then: shimmer 스켈레톤 표시
  - Status: ⬜ Not Started

### Bundle Analyzer (US-E05)
- **TC-QI-020**: next.config.js에 bundle-analyzer 설정 존재
  - Given: next.config.js
  - When: ANALYZE=true
  - Then: withBundleAnalyzer 래핑 적용
  - Status: ⬜ Not Started

---

## Requirements Coverage
| Requirement ID | Test Cases | Status |
|---------------|------------|--------|
| REQ-B04 | TC-QI-001~011 | ⬜ Pending |
| REQ-B07 | TC-QI-012~020 | ⬜ Pending |
