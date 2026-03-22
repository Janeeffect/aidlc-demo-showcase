# Contract/Interface Definition for CR Cycle 3

## Unit Context
- **CRs**: CR-05, CR-06, CR-07, CR-08, CR-09, CR-10
- **Dependencies**: 기존 코드베이스 (Brownfield)
- **Database Entities**: 없음 (프론트엔드 전용)

---

## CR-05: 파일 탐색기 콘텐츠 연동 수정

### demo/page.tsx - DemoPageContent
- `handleFileClick(path: string) -> void`: 파일 클릭 시 해당 파일의 고유 콘텐츠를 에디터에 표시
  - Args: path - 파일 경로
  - Returns: void (상태 업데이트)
  - 규칙: fileContentsMap 우선 조회, demoSteps fallback

### hooks/useRunStep.ts - RunStepCallbacks
- `onFileAdd(file: FileTreeNode, fileContent: string) -> void`: 파일 추가 시 콘텐츠도 함께 전달
  - Args: file - 파일 노드, fileContent - 파일 콘텐츠
  - Returns: void

---

## CR-06: MousePointer 삭제

### 삭제 대상
- `MousePointer.tsx` - 전체 파일 삭제
- `MousePointerHighlight.test.tsx` - 전체 파일 삭제
- demo/page.tsx 내 MousePointer import/사용 제거 (있는 경우)

---

## CR-07: 채팅 대화 깊이 강화

### utils/demoStepGenerator.ts - generateDemoSteps()
- `generateDemoSteps(projectIdea: string, scenarioId?: string) -> DemoStep[]`: 7개 단계, 각 단계 8~12개 메시지
  - Args: projectIdea, scenarioId
  - Returns: DemoStep[] (chatSequence 확장)

---

## CR-08: 결과 화면 품질 강화

### result/page.tsx - AIDLCOutputsTab
- `AIDLCOutputsTab({ projectIdea, scenarioId }: Props) -> JSX`: scenarioId 기반 산출물 분기
  - Args: projectIdea, scenarioId (신규 prop)
  - Returns: JSX

---

## CR-09: 안내 문구 수정

### hooks/useRunStep.ts
- 완료 메시지 content: "우측 상단의" 으로 변경

---

## CR-10: 성능 최적화

### app/layout.tsx
- Google Fonts -> next/font/local 전환

### app/page.tsx
- framer-motion 최적화 (CSS 애니메이션 대체 또는 dynamic import)
