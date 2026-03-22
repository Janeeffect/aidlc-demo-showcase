# CR Cycle 3 - Business Logic Model

## CR-05: 탐색기 파일별 콘텐츠 연동 수정

### 근본 원인 분석

현재 `handleFileClick` 로직:
```typescript
const handleFileClick = (path: string) => {
  setActiveFile(path);
  const matchedStep = demoSteps.find(step => step.fileName === path);
  if (matchedStep) {
    setEditorContent(matchedStep.fileContent);
    return;
  }
  if (fileContentsMap[path]) setEditorContent(fileContentsMap[path]);
};
```

**문제점**: `demoSteps.find(step => step.fileName === path)`는 7개 단계의 `fileName`만 매칭.
그러나 탐색기에 표시되는 파일은 `addFile()`로 추가된 파일들이며, 이들의 `path`가 `demoSteps[i].fileName`과 정확히 일치해야 함.

**실제 근본 원인**: `useRunStep`에서 `callbacks.onFileAdd()`로 파일을 추가할 때 `step.fileName`을 path로 사용하므로 매칭 자체는 가능. 그러나 `fileContentsMap`에 콘텐츠가 저장되지 않는 문제:
- `onFileAdd` 콜백에서 `setFileContentsMap(prev => ({ ...prev, [file.path]: '' }))`로 빈 문자열 저장
- `onActiveFile` 콜백에서 `setFileContentsMap(prev => ({ ...prev, [path]: editorContent }))`로 현재 editorContent 저장
- 결과: 모든 파일이 마지막으로 설정된 editorContent를 공유

### 수정 비즈니스 로직

1. `fileContentsMap`을 `demoSteps` 기반으로 초기화
2. `onFileAdd` 시점에 해당 step의 `fileContent`를 즉시 저장
3. `handleFileClick`에서 `fileContentsMap` 우선 조회 후 `demoSteps` fallback

```
handleFileClick(path):
  1. setActiveFile(path)
  2. IF fileContentsMap[path] exists AND non-empty:
       setEditorContent(fileContentsMap[path])
  3. ELSE IF demoSteps.find(step.fileName === path):
       setEditorContent(matchedStep.fileContent)
  4. ELSE:
       setEditorContent("파일 내용을 불러올 수 없습니다")
```

**핵심 수정**: `onFileAdd` 콜백에서 step의 fileContent를 함께 저장

---

## CR-06: MousePointer 기능 전체 삭제

### 삭제 대상

| 파일 | 유형 | 조치 |
|------|------|------|
| `src/components/animation/MousePointer.tsx` | 컴포넌트 | 파일 삭제 |
| `src/__tests__/MousePointerHighlight.test.tsx` | 테스트 | 파일 삭제 |
| `src/app/demo/page.tsx` | 사용처 | MousePointer import/사용 제거 |
| `src/types/animation.ts` | 타입 | Position 타입 (다른 곳에서 사용 여부 확인 후 결정) |

### 의존성 분석

- `MousePointer.tsx`는 `Position` 타입과 `framer-motion` 사용
- `demo/page.tsx`에서 현재 MousePointer를 import하지 않음 (CR-02에서 추가했으나 이미 제거된 상태일 수 있음)
- `AnimationOrchestrator`에서 MousePointer 참조 여부 확인 필요

---

## CR-07: 채팅 대화 깊이 강화

### 현재 구조 분석

현재 `generateDemoSteps()`는 7개 단계, 각 단계당 2~7개 메시지 (대부분 3~4개).
총 메시지 수: 약 25개.

### 목표 구조

각 단계별 8개 이상 메시지. 하이브리드 방식:
- **템플릿 기반 동적 생성**: 시나리오 데이터(domain, userTypes, mainFeatures 등)를 활용한 동적 메시지
- **핵심 단계 하드코딩**: 시나리오별 고유 문장 (질문-확인-반영 다회전 대화)

### 대화 패턴 설계

각 단계별 대화 패턴:

```
Step 1 (요구사항 분석) - 10+ 메시지:
  system: "AI-DLC 워크플로우를 시작합니다"
  ai: 프로젝트 분석 시작 안내 (도메인 판별)
  ai: Q1 질문
  user: Q1 답변
  ai: Q1 답변 분석 + 추가 확인
  ai: Q2 질문
  user: Q2 답변
  ai: Q2 답변 반영 + 엣지케이스 논의
  ai: 요구사항 정리 요약
  ai: 요구사항 문서 생성 완료 안내

Step 2 (사용자 스토리) - 8+ 메시지:
  system: "사용자 스토리 정의 단계"
  ai: 페르소나 분석 시작
  ai: Q3 질문
  user: Q3 답변
  ai: 답변 기반 스토리 초안
  ai: 인수 기준 제안
  ai: 우선순위 정리
  ai: 스토리 문서 생성 완료

Step 3 (애플리케이션 설계) - 8+ 메시지:
  system: "애플리케이션 설계 단계"
  ai: 아키텍처 분석 시작
  ai: 기술 스택 선정 근거
  ai: 컴포넌트 구조 제안
  ai: API 엔드포인트 설계
  ai: 데이터 모델 설계
  ai: 트레이드오프 검토
  ai: 설계 문서 생성 완료

Step 4 (NFR 설계) - 8+ 메시지:
  system: "CONSTRUCTION 단계 진입"
  ai: NFR 분석 시작
  ai: 성능 요구사항 정의
  ai: 보안 아키텍처 설계
  ai: 확장성 전략
  ai: 모니터링/관측성 설계
  ai: 비용 최적화 전략
  ai: NFR 문서 생성 완료

Step 5 (코드 생성) - 8+ 메시지:
  system: "코드 생성 시작"
  ai: TDD 방식 선택 안내
  ai: 프로젝트 구조 생성
  ai: 핵심 컴포넌트 구현
  ai: API 라우트 설정
  ai: 테스트 코드 작성
  ai: 코드 리뷰 결과
  ai: 코드 생성 완료

Step 6 (인프라 설계) - 8+ 메시지:
  system: "OPERATIONS 단계 진입"
  ai: AWS 인프라 분석
  ai: 서비스 선정 근거
  ai: 네트워크 아키텍처
  ai: 보안 그룹 설정
  ai: 비용 예측
  ai: 모니터링 설정
  ai: 인프라 템플릿 생성 완료

Step 7 (배포 계획) - 8+ 메시지:
  system: "배포 계획 생성"
  ai: CI/CD 파이프라인 설계
  ai: 환경별 배포 전략
  ai: Blue/Green 배포 설정
  ai: 롤백 전략
  ai: 프로덕션 체크리스트
  ai: 모니터링 대시보드
  ai: AI-DLC 워크플로우 완료
```

### 구현 방식

`demoStepGenerator.ts`의 `generateDemoSteps()` 함수에서:
1. 각 단계의 `chatSequence` 배열을 8~12개 메시지로 확장
2. 시나리오 데이터(s.domain, s.mainFeatures, s.techStack 등)를 활용한 동적 메시지 생성
3. 핵심 질문-답변 구간은 시나리오별 고유 문장 유지

---

## CR-08: 결과 화면 산출물 품질 강화

### 현재 상태

- AWSArchitectureDiagram: scenarioId 기반 Mermaid 다이어그램 (기본 구조)
- BusinessWorkflowDiagram: scenarioId 기반 시퀀스 다이어그램 (기본 구조)
- EstimateService: scenarioId 기반 견적 (기본 데이터)
- AIDLCOutputsTab: 하드코딩된 5개 산출물 (시나리오 무관)
- KiroIntroTab: 정적 콘텐츠
- MVPPreview: 키워드 기반 MVP 프리뷰 (scenarioId 미사용)

### Product-Ready 강화 전략

#### 1. AWSArchitectureDiagram 강화
- 기존 Mermaid 다이어그램에 보안/모니터링/비용 최적화 레이어 추가
- 서비스별 상세 설명 섹션 추가

#### 2. BusinessWorkflowDiagram 강화
- 예외 처리 흐름 추가
- 에러 핸들링 시퀀스 추가
- 유효성 검증 단계 추가

#### 3. EstimateService 강화
- 리스크 요소 섹션 추가
- 상세 비용 분석 (AWS 서비스별)
- 개발 단계별 일정 분석

#### 4. AIDLCOutputsTab 강화
- scenarioId 기반 시나리오별 산출물 콘텐츠 분기
- 각 산출물 내용을 실제 구현 가능한 수준으로 상세화

#### 5. KiroIntroTab 강화
- 시나리오별 활용 사례 추가

#### 6. MVPPreview 강화
- scenarioId 기반 분기 추가 (현재 키워드 기반)

---

## CR-09: 채팅 안내 문구 수정

### 변경 위치

`src/hooks/useRunStep.ts` 라인 ~88:
```typescript
content: stepIdx < demoSteps.length - 1
  ? `${step.label} 완료 -- 아래 "다음 단계" 버튼을 눌러주세요`
  : `${step.label} 완료 -- 아래 "결과 보기" 버튼을 눌러주세요`,
```

### 변경 내용
```
수정 전: "아래 "다음 단계" 버튼을 눌러주세요"
수정 후: "우측 상단의 "다음 단계" 버튼을 눌러주세요"

수정 전: "아래 "결과 보기" 버튼을 눌러주세요"
수정 후: "우측 상단의 "결과 보기" 버튼을 눌러주세요"
```

---

## CR-10: 초기 화면 로딩 속도 개선

### 성능 병목 분석

1. **Google Fonts (Inter)**: `next/font/google`로 로드 - 네트워크 의존적
   - layout.tsx에서 `Inter({ subsets: ['latin'] })` 사용
   - Summit 현장 네트워크 불안정 시 폰트 로딩 지연

2. **framer-motion 번들**: page.tsx에서 직접 import
   - `motion`, `AnimatePresence` 등 전체 번들 로드
   - 첫 페이지에서 6개 카테고리 x 5개 예시 = 30개 버튼 애니메이션

3. **dev server 첫 컴파일**: 11.2초 확인됨 (production build에서는 해결)

### 최적화 전략

1. **Google Fonts -> next/font/local 전환**
   - Inter 폰트 파일을 로컬에 포함
   - 네트워크 의존성 제거

2. **framer-motion dynamic import**
   - 첫 페이지(page.tsx)에서 framer-motion을 dynamic import
   - 또는 CSS 애니메이션으로 대체 (간단한 fade-in/slide-in)

3. **이미지 최적화**
   - kiro.jpg 사이즈 확인 및 최적화
   - next/image의 priority 속성 활용

4. **Production build 확인**
   - `next build` 후 `next start`로 실제 성능 측정
   - dev server 컴파일 시간은 production과 무관
