# Domain Entities - Unit 3: 품질 개선 (Quality Improvement)

## 1. 접근성 엔티티

### FocusRingStyle
포커스 링 CSS 스타일 정의
```
Properties:
  outline: "2px solid var(--kiro-purple)"
  outlineOffset: "2px"
  selector: ":focus-visible"
```

### AriaLandmark
ARIA 랜드마크 매핑
```
KiroIDELayout:
  role: "main"
  aria-label: "Kiro IDE"

FileExplorer:
  role: "tree"
  aria-label: "파일 탐색기"

CodeEditor:
  role: "region"
  aria-label: "코드 편집기"

ChatArea:
  role: "log"
  aria-live: "polite"
  aria-label: "채팅 메시지"
```

### TabAccessibility
결과 페이지 탭 접근성 구조
```
TabContainer:
  role: "tablist"

TabHeader:
  role: "tab"
  aria-selected: boolean
  tabIndex: 0 | -1
  id: "tab-{name}"
  aria-controls: "tabpanel-{name}"

TabPanel:
  role: "tabpanel"
  aria-labelledby: "tab-{name}"
  id: "tabpanel-{name}"
  tabIndex: 0
```

### ColorContrastMap
색상 대비 개선 매핑
```
Changes:
  --kiro-text-muted: "#8888a0" -> "#a0a0b8"
  inactive-text: "#4a4a5a" -> "#6a6a7a"
  incomplete-icon: "#3a3a4a" -> "#5a5a6a"
  
Preserved:
  --kiro-text: "#e4e4ed" (이미 충분)
  --kiro-purple: "#7c5cfc" (포커스 링 색상)
```

---

## 2. 성능 엔티티

### MVPPreviewModule
산업별 MVP 분리 구조
```
Files:
  src/components/ui/mvp-previews/EcommerceMVP.tsx
    exports: EcommerceUserMVP, EcommerceAdminMVP

  src/components/ui/mvp-previews/BookingMVP.tsx
    exports: BookingUserMVP, BookingAdminMVP

  src/components/ui/mvp-previews/LearningMVP.tsx
    exports: LearningUserMVP, LearningAdminMVP

  src/components/ui/mvp-previews/ChatMVP.tsx
    exports: ChatUserMVP, ChatAdminMVP

  src/components/ui/mvp-previews/DashboardMVP.tsx
    exports: DashboardUserMVP, DashboardAdminMVP

Loading:
  strategy: Next.js dynamic() with ssr: false
  fallback: MVPSkeletonLoader (shimmer)
```

### MemoizedPhaseIndicator
PhaseIndicator 메모이제이션 구조
```
Wrapper: React.memo(PhaseIndicator)
Internal:
  phaseConfigs: useMemo(() => [...], [])
  overallProgress: 매 렌더 계산 (가벼운 연산)
  isStageCompleted: 매 렌더 계산 (가벼운 연산)
  isCurrentStage: 매 렌더 계산 (가벼운 연산)
```

### OptimizedImage
Next.js Image 컴포넌트 적용
```
Target: kiro.jpg
Component: next/image Image
Props:
  src: "/kiro.jpg"
  alt: "Kiro AI 어시스턴트"
  width: {context-dependent}
  height: {context-dependent}
  priority: false
  className: {existing classes}
```

### MermaidLoadingState
Mermaid 다이어그램 로딩 상태
```
States:
  loading: shimmer 스켈레톤 표시
  rendered: fade-in 전환 (opacity 0->1, 300ms)
  error: 텍스트 대체 메시지

Skeleton:
  height: 고정 (렌더링 후 높이와 유사)
  background: shimmer 애니메이션
```

### BundleAnalyzerConfig
번들 분석 설정
```
Package: @next/bundle-analyzer (devDependency)
Config:
  enabled: process.env.ANALYZE === 'true'
  openAnalyzer: true
Script:
  "analyze": "ANALYZE=true next build"
```
