# Business Logic Model - Unit 3: 품질 개선 (Quality Improvement)

## 1. 접근성 로직 모델

### 1.1 키보드 네비게이션 (US-C01, US-C02)

범위: 시작 페이지 + 결과 페이지 탭 (핵심 사용자 경로)

#### 시작 페이지 (page.tsx)
- 산업 카드 선택: Tab으로 카드 간 이동, Enter/Space로 선택
- 텍스트 입력 필드: Tab으로 포커스 이동
- "시작하기" 버튼: Tab 도달 후 Enter로 실행
- 포커스 순서: 산업 카드들 -> 텍스트 입력 -> 시작 버튼

#### 결과 페이지 탭 (result/page.tsx)
- 탭 전환: Tab으로 탭 헤더 간 이동, Enter/Space로 탭 활성화
- 탭 패널 내부: Tab으로 콘텐츠 요소 탐색
- aria-selected, role="tab", role="tabpanel", role="tablist" 적용

### 1.2 스크린 리더 지원 (US-C04)

#### 채팅 메시지 업데이트
- 채팅 영역에 aria-live="polite" 적용
- 새 메시지 추가 시 스크린 리더가 자동으로 읽음
- role="log" 적용으로 채팅 영역 의미 전달

### 1.3 ARIA 레이블 (US-C05)

#### 적용 대상
- KiroIDELayout: role="main", aria-label="Kiro IDE"
- FileExplorer: role="tree", aria-label="파일 탐색기"
- CodeEditor: role="region", aria-label="코드 편집기"
- PhaseIndicator: role="progressbar", aria-valuenow, aria-valuemin, aria-valuemax
- 모든 버튼: aria-label (아이콘만 있는 버튼 포함)
- 모든 입력 필드: aria-label 또는 연결된 label

### 1.4 색상 대비 개선 (US-C06)

범위: 전면 개선 (핵심 텍스트 + 보조 텍스트 + 포커스 링)

#### 색상 변경 맵
| 현재 색상 | 용도 | 대비비 (vs #0a0a0f) | 변경 후 | 대비비 |
|-----------|------|---------------------|---------|--------|
| #8888a0 | 보조 텍스트 (--kiro-text-muted) | ~3.8:1 | #a0a0b8 | ~5.2:1 |
| #4a4a5a | 비활성 텍스트 | ~2.1:1 | #6a6a7a | ~3.2:1 |
| #3a3a4a | 미완료 아이콘 | ~1.7:1 | #5a5a6a | ~2.8:1 |
| #e4e4ed | 본문 텍스트 | ~14:1 | 유지 | ~14:1 |

#### 포커스 링 스타일
- 모든 인터랙티브 요소에 포커스 링 적용
- 스타일: 2px solid #7c5cfc, offset 2px
- :focus-visible 사용 (마우스 클릭 시 미표시)

---

## 2. 성능 로직 모델

### 2.1 이미지 최적화 (US-E01)

#### Next.js Image 컴포넌트 교체
- 대상: kiro.jpg (KiroIDELayout, ChatBubble에서 사용)
- `<img>` -> `<Image>` 교체
- props: width, height, alt, priority (above-the-fold인 경우)
- 자동 WebP 변환, 반응형 크기 조정

### 2.2 컴포넌트 메모이제이션 (US-E02)

#### PhaseIndicator 최적화 (선택: B)
- phaseConfigs 배열: useMemo로 메모이제이션 (의존성: 없음, 상수)
- PhaseIndicator 컴포넌트: React.memo 래핑
- 의존성: currentPhase, currentStage, animationProgress
- 내부 계산 함수(isStageCompleted, isCurrentStage)는 현재 수준 유지

### 2.3 MVPPreview 코드 스플리팅 (US-E03)

#### 전략: C (산업별 분리 + 전체 lazy load)

##### 파일 분리
```
src/components/ui/mvp-previews/
  EcommerceMVP.tsx   (EcommerceUserMVP + EcommerceAdminMVP)
  BookingMVP.tsx     (BookingUserMVP + BookingAdminMVP)
  LearningMVP.tsx    (LearningUserMVP + LearningAdminMVP)
  ChatMVP.tsx        (ChatUserMVP + ChatAdminMVP)
  DashboardMVP.tsx   (DashboardUserMVP + DashboardAdminMVP)
```

##### 로딩 전략
- MVPPreview.tsx: Next.js dynamic() import로 각 산업별 컴포넌트 로드
- loading 컴포넌트: shimmer 스켈레톤 UI 표시
- ssr: false (클라이언트 전용 렌더링)

### 2.4 Mermaid 로딩 UX (US-E04)

#### AWSArchitectureDiagram shimmer 로딩
- Mermaid 렌더링 전: shimmer 스켈레톤 표시
- 렌더링 완료 후: fade-in 전환
- 에러 시: 텍스트 대체 표시

### 2.5 번들 분석 도구 (US-E05)

#### 설정 (선택: A)
- @next/bundle-analyzer 패키지 설치
- next.config.js에 조건부 래핑: ANALYZE=true 환경변수
- npm script 추가: "analyze": "ANALYZE=true next build"
