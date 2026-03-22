# Functional Design Plan - Unit 1: 코드 정리 (Code Cleanup)

## Unit Context
- **요구사항**: REQ-B02 (미사용 API Route 정리 + log 연동), REQ-B03 (DemoPage 전면 리팩토링)
- **User Stories**: US-B01, US-B02, US-B03, US-B04, US-I01, US-I02, US-I03
- **완료 기준**: DemoPage 200 라인 이하, 기존 131개 테스트 통과, LogService 실제 호출, 미사용 파일 삭제

---

## Plan Steps

- [x] Step 1: ScenarioDetector 비즈니스 로직 모델링
- [x] Step 2: DemoStepGenerator 비즈니스 로직 모델링
- [x] Step 3: useDemoProgress Hook 상태 관리 모델링
- [x] Step 4: useRunStep Hook 실행 로직 모델링
- [x] Step 5: LogService 연동 비즈니스 규칙 정의
- [x] Step 6: 미사용 코드 삭제 규칙 정의
- [x] Step 7: DemoPage 축소 후 구조 정의
- [x] Step 8: Domain Entity 정의
- [x] Step 9: 아티팩트 생성 (business-logic-model.md, business-rules.md, domain-entities.md)

---

## Questions

### Q1. 시나리오 데이터 외부화 형식
현재 `detectScenario()` 함수 내에 8개 산업 시나리오 데이터가 하드코딩되어 있습니다. 외부화할 때 데이터 구조를 어떻게 관리할까요?

A) 단일 파일 (`src/data/scenarios.ts`)에 모든 시나리오를 배열/맵으로 관리
B) 산업별 개별 파일 (`src/data/scenarios/ecommerce.ts`, `fintech.ts` 등)로 분리
C) JSON 파일 (`src/data/scenarios.json`)로 외부화하여 런타임 로드

[Answer]:추천해줘

### Q2. 키워드 매칭 로직 개선
현재 `detectScenario()`는 단순 `includes()` 기반 키워드 매칭입니다. 리팩토링 시 매칭 로직을 어떻게 할까요?

A) 현재 방식 유지 (단순 includes 매칭) - 데모 용도로 충분
B) 키워드 가중치 기반 매칭 (여러 키워드 매칭 시 가장 많이 매칭된 시나리오 선택)
C) 정규식 기반 매칭으로 개선 (유사 키워드 그룹핑)

[Answer]:추천해줘, 단순데모여도 aidlc 메커니즘이 진짜대단하다는것을보여주고싶은 데모여서 엄청 정교화되었으면해

### Q3. LogService 호출 시점과 실패 처리
LogService가 실제로 `/api/log`를 호출할 때, 네트워크 실패 시 데모 진행에 영향을 줄까요?

A) Fire-and-forget: 로그 실패해도 데모 진행에 영향 없음 (catch 후 무시)
B) 실패 시 콘솔 경고만 출력하고 데모 계속 진행
C) 실패 시 재시도 1회 후 포기, 데모 계속 진행

[Answer]:summit진행장소가 network 가 엄청 불안해 사람이 많이몰려서 그런것 같아.어떻게할까추천해줘.

### Q4. DemoPage에서 분리된 모듈 간 의존성 방향
리팩토링 후 모듈 간 의존성을 어떻게 설계할까요?

A) DemoPage -> useDemoProgress -> useRunStep -> DemoStepGenerator -> ScenarioDetector (단방향 체인)
B) DemoPage가 모든 모듈을 직접 import하고 조합 (flat 구조)
C) DemoPage -> useDemoProgress (상태) + useRunStep (실행), useRunStep -> DemoStepGenerator -> ScenarioDetector (계층 구조)

[Answer]:추천해줘

### Q5. 시나리오 데이터의 `data/scenarios.ts` 내 시나리오 키워드 정의 방식
현재 키워드가 함수 내부 if-else 체인에 있습니다. 외부화 시 키워드를 어떻게 구조화할까요?

A) 각 시나리오에 `keywords: string[]` 필드 추가 (예: `['쇼핑', '이커머스', '상품']`)
B) 별도 키워드 맵 (`Record<string, string[]>`) 관리
C) 시나리오 객체 내 `keywords` + `priority` 필드로 매칭 우선순위까지 관리

[Answer]:추천해줘

### Q6. 삭제 대상 파일의 테스트 영향
`stream/route.ts`, `estimate/route.ts`, `AIService.ts` 삭제 시 기존 131개 테스트에 이 파일들을 참조하는 테스트가 있을 수 있습니다. 어떻게 처리할까요?

A) 관련 테스트도 함께 삭제 (미사용 코드의 테스트이므로)
B) 테스트를 새로운 모듈 (ScenarioDetector, DemoStepGenerator 등)에 대한 테스트로 교체
C) 기존 테스트 삭제 + 신규 모듈 테스트는 Code Generation 단계에서 작성

[Answer]:추천해줘

