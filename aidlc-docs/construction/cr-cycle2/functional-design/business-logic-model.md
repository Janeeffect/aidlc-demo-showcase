# CR Cycle 2 - Business Logic Model

## 1. 시나리오 End-to-End 전달 흐름

```
Screen 1 (StartPage)
  |-- 사용자가 산업 카테고리에서 예시 클릭
  |-- setProjectIdea(example), setSelectedIndustry(category.name)
  |-- handleStart() 호출
  |     |-- scenarioId 결정: detectScenario(projectIdea).id
  |     |-- router.push(`/demo?idea=${projectIdea}&scenario=${scenarioId}`)
  v
Screen 2 (DemoPage)
  |-- searchParams.get('scenario') || detectScenario(idea).id
  |-- DemoSessionContext.setScenarioId(scenarioId)
  |-- generateDemoSteps(projectIdea, scenarioId)
  |-- 시나리오별 고유 chatSequence, fileContent 사용
  |-- 완료 시: router.push(`/result?idea=${idea}&scenario=${scenarioId}`)
  v
Screen 3 (ResultPage)
  |-- searchParams.get('scenario') || detectScenario(idea).id
  |-- scenarioId 기반 6개 탭 콘텐츠 분기
```

---

## 2. Screen 1 변경 로직

### handleStart() 수정

```
기존: router.push(`/demo?idea=${encodeURIComponent(projectIdea)}`)
변경: 
  1. scenarioId = detectScenario(projectIdea).id
  2. router.push(`/demo?idea=${encodeURIComponent(projectIdea)}&scenario=${scenarioId}`)
```

scenarioId를 Screen 1에서 결정하여 URL에 명시적으로 전달. 이후 Screen 2, 3에서 재감지 불필요.

---

## 3. Screen 2 변경 로직

### 3.1 scenarioId 획득

```
const scenarioId = searchParams.get('scenario') || detectScenario(projectIdea).id;
```

### 3.2 DemoStepGenerator 호출 변경

```
기존: const demoSteps = useMemo(() => generateDemoSteps(projectIdea), [projectIdea]);
변경: const demoSteps = useMemo(() => generateDemoSteps(projectIdea, scenarioId), [projectIdea, scenarioId]);
```

### 3.3 generateDemoSteps 내부 로직

```
function generateDemoSteps(projectIdea: string, scenarioId?: string): DemoStep[] {
  // scenarioId가 있으면 직접 조회
  const s = scenarioId 
    ? (SCENARIOS.find(sc => sc.id === scenarioId) || detectScenario(projectIdea))
    : detectScenario(projectIdea);
  
  // 시나리오별 AI 메시지 차별화
  // 사용자 응답은 s.questions 기반 공통
  // 파일 콘텐츠는 s 데이터 기반 생성 (기존 template builder 활용)
}
```

### 3.4 파일 탐색기 콘텐츠 연동 수정

```
기존 handleFileClick:
  setActiveFile(path);
  if (fileContentsMap[path]) setEditorContent(fileContentsMap[path]);

변경 handleFileClick:
  setActiveFile(path);
  // 1순위: demoSteps에서 fileName 매칭
  const matchedStep = demoSteps.find(step => step.fileName === path);
  if (matchedStep) {
    setEditorContent(matchedStep.fileContent);
    return;
  }
  // 2순위: fileContentsMap (보조)
  if (fileContentsMap[path]) {
    setEditorContent(fileContentsMap[path]);
  }
```

### 3.5 결과 페이지 이동 변경

```
기존: router.push(`/result?idea=${encodeURIComponent(projectIdea)}`)
변경: router.push(`/result?idea=${encodeURIComponent(projectIdea)}&scenario=${scenarioId}`)
```

---

## 4. Screen 3 변경 로직

### 4.1 scenarioId 획득

```
const scenarioId = searchParams.get('scenario') || detectScenario(projectIdea).id;
const scenario = SCENARIOS.find(sc => sc.id === scenarioId) || DEFAULT_SCENARIO;
```

### 4.2 탭별 scenarioId 전달

```
<MVPPreview projectIdea={projectIdea} />                    // 기존 유지 (이미 구현됨)
<AWSArchitectureDiagram projectIdea={projectIdea} scenarioId={scenarioId} />
<BusinessWorkflowDiagram projectIdea={projectIdea} scenarioId={scenarioId} />
<EstimateTab estimate={estimate} />                          // estimate 계산 시 scenarioId 사용
<AIDLCOutputsTab projectIdea={projectIdea} scenarioId={scenarioId} />
<KiroIntroTab scenarioId={scenarioId} />
```

### 4.3 Estimate 계산 변경

```
기존: const result = calculateEstimate(projectIdea);
변경: const result = calculateEstimate(projectIdea, scenarioId);
```

---

## 5. AWSArchitectureDiagram 변경 로직

### scenarioId 기반 다이어그램 선택

```
기존: generateMermaidDiagram(idea) - 키워드 기반 if/else 분기
변경: generateMermaidDiagram(idea, scenarioId)
  - scenarioId가 있으면 시나리오별 매핑 테이블에서 직접 선택
  - scenarioId가 없으면 기존 키워드 분기 fallback
```

시나리오별 아키텍처 매핑:

| scenarioId | 아키텍처 패턴 | 핵심 서비스 |
|------------|--------------|------------|
| ecommerce | 이커머스 서버리스 | API GW, Lambda, DynamoDB, SQS, S3 |
| fintech | 금융 보안 아키텍처 | API GW+WAF, Lambda, Aurora, KMS, Step Functions |
| healthcare | 헬스케어 플랫폼 | API GW, Lambda, Aurora, S3, Chime SDK |
| education | 교육 스트리밍 | API GW, Lambda, DynamoDB, S3, MediaConvert, CloudFront |
| logistics | 물류 IoT | API GW, Lambda, DynamoDB, Location Service, IoT Core |
| saas | SaaS 실시간 협업 | API GW, Lambda, DynamoDB, AppSync, ElastiCache |
| chat | 실시간 메시징 | API GW WebSocket, Lambda, DynamoDB, ElastiCache, SNS |
| default | 범용 서버리스 | API GW, Lambda, DynamoDB, Cognito, S3 |

---

## 6. BusinessWorkflowDiagram 변경 로직

### scenarioId 기반 시퀀스 선택

```
기존: generateSequence(idea) - 키워드 기반 if/else 분기
변경: generateSequence(idea, scenarioId)
  - scenarioId가 있으면 시나리오별 매핑 테이블에서 직접 선택
  - scenarioId가 없으면 기존 키워드 분기 fallback
```

시나리오별 시퀀스 매핑:

| scenarioId | 시퀀스 제목 | 핵심 액터 |
|------------|-----------|----------|
| ecommerce | 주문 처리 시퀀스 | 고객, 프론트엔드, API GW, Lambda, DynamoDB, SQS, 결제PG |
| fintech | 송금 처리 시퀀스 | 사용자, 프론트엔드, API GW, Lambda, Aurora, KMS, Step Functions |
| healthcare | 원격 진료 시퀀스 | 환자, 프론트엔드, API GW, Lambda, Aurora, Chime SDK, SES |
| education | 강의 수강 시퀀스 | 학습자, 프론트엔드, API GW, Lambda, DynamoDB, S3, CloudFront |
| logistics | 배송 추적 시퀀스 | 고객, 프론트엔드, API GW, Lambda, DynamoDB, IoT Core, SNS |
| saas | 프로젝트 협업 시퀀스 | 팀원, 프론트엔드, API GW, Lambda, DynamoDB, AppSync |
| chat | 실시간 채팅 시퀀스 | 사용자A, 프론트엔드, API GW, Lambda, DynamoDB, 사용자B |
| default | 서비스 요청 시퀀스 | 사용자, 프론트엔드, API GW, Lambda, DynamoDB |

---

## 7. EstimateService 변경 로직

### scenarioId 기반 고정 템플릿

```
기존: calculateEstimate(projectIdea) - 키워드 분석 + 랜덤 변동
변경: calculateEstimate(projectIdea, scenarioId?)
  - scenarioId가 있으면 SCENARIO_ESTIMATE_TEMPLATES[scenarioId] 반환
  - scenarioId가 없으면 기존 키워드 분석 로직 fallback
```

랜덤 요소 제거: 동일 시나리오는 항상 동일한 Estimate 표시 (부스 데모 일관성).

---

## 8. MousePointer 변경 로직

### 스타일 변경

```
기존:
  - SVG 화살표 커서 (흰색, 24x24)
  - 클릭 시 bg-kiro-accent/30 원형 이펙트

변경:
  - SVG 화살표 커서 유지 (흰색, 24x24)
  - 커서 중심에 노란색 원형 하이라이트 추가:
    - 크기: 40x40px
    - 색상: rgba(255, 215, 0, 0.3)
    - 위치: 커서 SVG 뒤 (z-index 낮게)
    - 펄스 애니메이션: scale 1.0 -> 1.3 -> 1.0, 1.5초 주기, infinite
  - 클릭 이펙트 유지 (기존 동작)
```

---

## 9. 모듈 의존성 변경 요약

```
page.tsx (Screen 1)
  |-- detectScenario() 호출하여 scenarioId 결정
  |-- URL에 scenario param 추가

demo/page.tsx (Screen 2)
  |-- URL에서 scenarioId 획득
  |-- DemoSessionContext.setScenarioId() 호출
  |-- generateDemoSteps(idea, scenarioId) 호출
  |-- handleFileClick: demoSteps 기반 콘텐츠 조회
  |-- result 이동 시 scenario param 유지

result/page.tsx (Screen 3)
  |-- URL에서 scenarioId 획득
  |-- calculateEstimate(idea, scenarioId) 호출
  |-- 각 탭 컴포넌트에 scenarioId 전달

DemoStepGenerator.ts
  |-- generateDemoSteps(idea, scenarioId?) 시그니처 변경
  |-- scenarioId 기반 직접 시나리오 조회

AWSArchitectureDiagram.tsx
  |-- scenarioId prop 추가
  |-- generateMermaidDiagram(idea, scenarioId) 변경

BusinessWorkflowDiagram.tsx
  |-- scenarioId prop 추가
  |-- generateSequence(idea, scenarioId) 변경

EstimateService.ts
  |-- calculateEstimate(idea, scenarioId?) 시그니처 변경
  |-- 시나리오별 고정 템플릿 추가

MousePointer.tsx
  |-- 노란색 원형 하이라이트 div 추가
  |-- 펄스 애니메이션 추가

DemoSessionContext.tsx
  |-- scenarioId 필드 + SET_SCENARIO_ID 액션 추가
```
