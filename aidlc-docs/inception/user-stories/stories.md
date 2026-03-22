# User Stories

## Story Format
```
As a [persona], I want to [action], so that [benefit].
Acceptance Criteria:
- Given [context], When [action], Then [result]
```

---

# Persona 1: 방문객 (Summit Visitor) Stories

## Epic A: 데모 체험 개선 (REQ-B01 Animation 통합)

### US-A01: 마우스 포인터 시각화
**As a** 방문객, **I want to** 데모 진행 중 가상 마우스 포인터가 화면에 표시되는 것을 보고 싶다, **so that** AI가 실제로 IDE를 조작하는 것처럼 느낄 수 있다.

**Priority**: High | **Estimate**: M | **REQ**: REQ-B01

**Acceptance Criteria**:
- Given 데모가 진행 중일 때, When 새로운 단계가 시작되면, Then 마우스 포인터가 화면에 표시된다
- Given 마우스 포인터가 표시될 때, When 이동 중이면, Then 부드러운 ease-in-out 애니메이션으로 이동한다
- Given 마우스 포인터가 표시될 때, When 요소를 클릭하면, Then 클릭 시각적 피드백(ripple/scale)이 표시된다

### US-A02: 파일 탐색기 클릭 시뮬레이션
**As a** 방문객, **I want to** 마우스 포인터가 파일 탐색기에서 파일을 클릭하는 동작을 보고 싶다, **so that** 어떤 파일이 생성/편집되는지 직관적으로 이해할 수 있다.

**Priority**: High | **Estimate**: M | **REQ**: REQ-B01

**Acceptance Criteria**:
- Given 새 파일이 생성될 때, When 마우스 포인터가 파일 탐색기로 이동하면, Then 해당 파일 위치를 클릭하는 동작이 시뮬레이션된다
- Given 파일이 클릭되면, When 에디터에 파일 내용이 표시될 때, Then 파일 탐색기에서 해당 파일이 하이라이트된다

### US-A03: 채팅 입력 타이핑 시뮬레이션
**As a** 방문객, **I want to** 마우스 포인터가 채팅 입력창으로 이동하고 타이핑하는 동작을 보고 싶다, **so that** AI와 대화하는 과정이 자연스럽게 느껴진다.

**Priority**: High | **Estimate**: M | **REQ**: REQ-B01

**Acceptance Criteria**:
- Given 채팅 메시지가 입력될 때, When 마우스 포인터가 채팅 입력창으로 이동하면, Then 타이핑 애니메이션이 시작된다
- Given 타이핑이 완료되면, When 전송 버튼이 있으면, Then 마우스 포인터가 전송 버튼을 클릭하는 동작을 시뮬레이션한다

### US-A04: 버튼 클릭 시뮬레이션
**As a** 방문객, **I want to** 마우스 포인터가 "다음 단계" 버튼 등을 클릭하는 동작을 보고 싶다, **so that** 데모 진행이 자동으로 이루어지는 것을 시각적으로 확인할 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B01

**Acceptance Criteria**:
- Given 단계가 완료되면, When 다음 단계로 진행할 때, Then 마우스 포인터가 "다음 단계" 버튼으로 이동하여 클릭한다
- Given 버튼 클릭 시, When 클릭 애니메이션이 재생되면, Then 버튼의 hover/active 상태가 시각적으로 표시된다

### US-A05: 탭 전환 시뮬레이션
**As a** 방문객, **I want to** 마우스 포인터가 에디터 탭을 전환하는 동작을 보고 싶다, **so that** 여러 파일 간 전환이 자연스럽게 보인다.

**Priority**: Low | **Estimate**: S | **REQ**: REQ-B01

**Acceptance Criteria**:
- Given 다른 파일로 전환할 때, When 마우스 포인터가 탭 영역으로 이동하면, Then 해당 탭을 클릭하는 동작이 시뮬레이션된다

### US-A06: 스크롤 시뮬레이션
**As a** 방문객, **I want to** 긴 코드/문서에서 마우스 포인터가 스크롤하는 동작을 보고 싶다, **so that** 전체 내용이 있다는 것을 인지할 수 있다.

**Priority**: Low | **Estimate**: S | **REQ**: REQ-B01

**Acceptance Criteria**:
- Given 에디터 콘텐츠가 화면을 초과할 때, When 콘텐츠 표시가 완료되면, Then 마우스 포인터가 에디터 영역에서 스크롤 동작을 시뮬레이션한다

### US-A07: Animation Orchestrator 통합
**As a** 방문객, **I want to** 모든 애니메이션이 단계별로 자연스럽게 연결되어 진행되길 원한다, **so that** 끊김 없는 데모 체험을 할 수 있다.

**Priority**: High | **Estimate**: L | **REQ**: REQ-B01

**Acceptance Criteria**:
- Given 데모가 진행 중일 때, When 각 단계의 애니메이션 시퀀스가 실행되면, Then 마우스 이동 -> 클릭 -> 타이핑 -> 파일 생성 순서로 자연스럽게 연결된다
- Given 애니메이션 시퀀스가 실행 중일 때, When 이전 단계로 돌아가면, Then 현재 애니메이션이 취소되고 이전 단계 상태로 복원된다

---

## Epic B: 코드 품질 개선 (REQ-B03 DemoPage 리팩토링)

### US-B01: 시나리오 감지 모듈 분리
**As a** 방문객, **I want to** 산업 시나리오 감지가 정확하게 동작하길 원한다, **so that** 내 프로젝트 아이디어에 맞는 데모를 볼 수 있다.

**Priority**: High | **Estimate**: M | **REQ**: REQ-B03

**Acceptance Criteria**:
- Given detectScenario가 별도 모듈로 분리되었을 때, When 사용자가 아이디어를 입력하면, Then 기존과 동일하게 8개 산업 시나리오 중 하나가 감지된다
- Given 시나리오 데이터가 외부화되었을 때, When 새 산업 시나리오를 추가하면, Then DemoPage 수정 없이 설정 파일만 변경하면 된다

### US-B02: 데모 단계 생성 모듈 분리
**As a** 방문객, **I want to** 7단계 데모가 안정적으로 생성되길 원한다, **so that** 모든 AI-DLC 과정을 빠짐없이 체험할 수 있다.

**Priority**: High | **Estimate**: M | **REQ**: REQ-B03

**Acceptance Criteria**:
- Given generateDemoSteps가 별도 모듈로 분리되었을 때, When 시나리오가 감지되면, Then 7개 데모 단계가 올바르게 생성된다
- Given 각 단계에 chatSequence와 fileContent가 포함될 때, When 단계가 실행되면, Then 채팅 메시지와 파일 내용이 정확히 표시된다

### US-B03: 데모 진행 커스텀 훅
**As a** 방문객, **I want to** 데모 진행이 매끄럽게 동작하길 원한다, **so that** 단계 간 전환이 자연스럽다.

**Priority**: High | **Estimate**: M | **REQ**: REQ-B03

**Acceptance Criteria**:
- Given useDemoProgress 훅이 분리되었을 때, When 데모가 진행되면, Then 상태 관리(currentStep, isAnimating, stepCompleted)가 정확히 동작한다
- Given useRunStep 훅이 분리되었을 때, When runStep이 실행되면, Then 취소 메커니즘(runIdRef)이 정상 동작한다

### US-B04: DemoPage 크기 축소
**As a** 방문객, **I want to** 데모 페이지가 빠르게 로드되길 원한다, **so that** 대기 시간 없이 데모를 시작할 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B03

**Acceptance Criteria**:
- Given 리팩토링이 완료되었을 때, When DemoPage 파일을 확인하면, Then 200 라인 이하로 축소되어 있다
- Given 모든 모듈이 분리되었을 때, When 기존 131개 테스트를 실행하면, Then 모두 통과한다

---

## Epic C: 접근성 개선 (REQ-B04)

### US-C01: 키보드 네비게이션 - 시작 페이지
**As a** 방문객, **I want to** 키보드만으로 시작 페이지를 사용할 수 있다, **so that** 마우스 없이도 데모를 시작할 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B04

**Acceptance Criteria**:
- Given 시작 페이지에서, When Tab 키를 누르면, Then 입력 필드 -> 산업 예시 -> 시작 버튼 순서로 포커스가 이동한다
- Given 산업 예시에 포커스가 있을 때, When Enter 키를 누르면, Then 해당 예시가 입력 필드에 채워진다

### US-C02: 키보드 네비게이션 - 결과 페이지 탭
**As a** 방문객, **I want to** 키보드로 결과 페이지의 탭을 전환할 수 있다, **so that** 모든 결과를 편리하게 확인할 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B04

**Acceptance Criteria**:
- Given 결과 페이지 탭에 포커스가 있을 때, When 좌/우 화살표 키를 누르면, Then 이전/다음 탭으로 포커스가 이동한다
- Given 탭에 포커스가 있을 때, When Enter 키를 누르면, Then 해당 탭이 활성화된다

### US-C03: 키보드 네비게이션 - 파일 탐색기
**As a** 방문객, **I want to** 키보드로 파일 탐색기를 탐색할 수 있다, **so that** 데모 중 파일 구조를 직접 확인할 수 있다.

**Priority**: Low | **Estimate**: M | **REQ**: REQ-B04

**Acceptance Criteria**:
- Given 파일 탐색기에 포커스가 있을 때, When 상/하 화살표 키를 누르면, Then 이전/다음 파일로 포커스가 이동한다
- Given 폴더에 포커스가 있을 때, When Enter 키를 누르면, Then 폴더가 확장/축소된다

### US-C04: 스크린 리더 지원 - 채팅 메시지
**As a** 방문객, **I want to** 스크린 리더로 채팅 메시지 업데이트를 들을 수 있다, **so that** 시각 장애가 있어도 데모 진행을 따라갈 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B04

**Acceptance Criteria**:
- Given 채팅 영역에 aria-live="polite"가 설정되었을 때, When 새 메시지가 추가되면, Then 스크린 리더가 메시지 내용을 읽어준다
- Given 각 채팅 메시지에 role이 설정되었을 때, When 스크린 리더가 탐색하면, Then AI/User/System 메시지를 구분할 수 있다

### US-C05: ARIA 레이블 추가
**As a** 방문객, **I want to** 모든 인터랙티브 요소에 설명이 있길 원한다, **so that** 보조 기술로 각 요소의 목적을 이해할 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B04

**Acceptance Criteria**:
- Given 모든 버튼에 aria-label이 있을 때, When 스크린 리더가 버튼을 읽으면, Then 버튼의 목적이 명확히 전달된다
- Given 주요 영역에 role 속성이 있을 때, When 스크린 리더가 랜드마크를 탐색하면, Then navigation, main, complementary 영역이 구분된다

### US-C06: 색상 대비 개선
**As a** 방문객, **I want to** 텍스트가 배경과 충분한 대비를 가지길 원한다, **so that** 밝은 환경에서도 텍스트를 읽을 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B04

**Acceptance Criteria**:
- Given --kiro-text-muted 색상이 수정되었을 때, When WCAG 대비 검사를 하면, Then 4.5:1 이상의 대비율을 만족한다
- Given 포커스 링이 커스텀 설정되었을 때, When 요소에 포커스가 있으면, Then Kiro 보라색 포커스 링이 명확히 표시된다

---

## Epic D: 에러 핸들링 개선 (REQ-B06)

### US-D01: 이메일 전송 실패 피드백
**As a** 방문객, **I want to** 이메일 전송이 실패했을 때 알림을 받고 싶다, **so that** 다시 시도하거나 다른 방법을 선택할 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B06

**Acceptance Criteria**:
- Given 이메일 전송 요청이 실패했을 때, When 에러 응답을 받으면, Then "전송에 실패했습니다. 다시 시도해주세요." 메시지가 표시된다
- Given 에러 메시지가 표시될 때, When 3초가 지나면, Then 메시지가 자동으로 사라진다

### US-D02: API 에러 응답 통일
**As a** 방문객, **I want to** 에러 발생 시 일관된 메시지를 받고 싶다, **so that** 혼란 없이 상황을 이해할 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B06

**Acceptance Criteria**:
- Given 모든 API Route에서, When 에러가 발생하면, Then `{ success: false, message: string, error?: string }` 형식으로 응답한다
- Given 에러 메시지가 한국어/영어로 제공될 때, When 현재 언어 설정에 따라, Then 해당 언어의 에러 메시지가 표시된다

---

## Epic E: 성능 최적화 (REQ-B07)

### US-E01: 이미지 최적화
**As a** 방문객, **I want to** 페이지가 빠르게 로드되길 원한다, **so that** 대기 없이 데모를 시작할 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B07

**Acceptance Criteria**:
- Given kiro.jpg에 Next.js Image 컴포넌트가 적용되었을 때, When 페이지를 로드하면, Then 자동 최적화(WebP 변환, 크기 조정)가 적용된다

### US-E02: 컴포넌트 메모이제이션
**As a** 방문객, **I want to** 데모 진행 중 UI가 부드럽게 동작하길 원한다, **so that** 끊김 없는 애니메이션을 볼 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B07

**Acceptance Criteria**:
- Given PhaseIndicator에 useMemo가 적용되었을 때, When 데모가 진행되면, Then phaseConfigs 배열이 불필요하게 재생성되지 않는다

### US-E03: MVPPreview 코드 스플리팅
**As a** 방문객, **I want to** 결과 페이지가 빠르게 로드되길 원한다, **so that** 데모 완료 후 즉시 결과를 확인할 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B07

**Acceptance Criteria**:
- Given MVPPreview가 산업별 하위 컴포넌트로 분리되었을 때, When 결과 페이지를 로드하면, Then 현재 산업의 MVP 컴포넌트만 로드된다
- Given lazy loading이 적용되었을 때, When 다른 산업 탭으로 전환하면, Then 해당 컴포넌트가 동적으로 로드된다

### US-E04: Mermaid 로딩 UX 개선
**As a** 방문객, **I want to** 다이어그램 로딩 중 시각적 피드백을 보고 싶다, **so that** 페이지가 멈춘 것이 아님을 알 수 있다.

**Priority**: Low | **Estimate**: S | **REQ**: REQ-B07

**Acceptance Criteria**:
- Given Mermaid가 동적 로드 중일 때, When 다이어그램 영역이 표시되면, Then shimmer 효과가 표시된다
- Given Mermaid 로드가 완료되면, When 다이어그램이 렌더링되면, Then shimmer가 사라지고 다이어그램이 표시된다

### US-E05: 번들 분석 도구 설정
**As a** 방문객, **I want to** 앱이 최적화된 번들 크기로 제공되길 원한다, **so that** 빠른 초기 로딩을 경험할 수 있다.

**Priority**: Low | **Estimate**: S | **REQ**: REQ-B07

**Acceptance Criteria**:
- Given @next/bundle-analyzer가 설정되었을 때, When `ANALYZE=true npm run build`를 실행하면, Then 번들 분석 리포트가 생성된다

---

## Epic F: 이메일 리포트 유지 (REQ-B05)

### US-F01: 이메일 리포트 모의 전송
**As a** 방문객, **I want to** 이메일 리포트 전송 버튼을 클릭하면 성공 메시지를 보고 싶다, **so that** 리포트가 전송된 것으로 인지할 수 있다.

**Priority**: Low | **Estimate**: S | **REQ**: REQ-B05

**Acceptance Criteria**:
- Given 이메일 폼을 작성하고 전송 버튼을 클릭했을 때, When API가 성공 응답을 반환하면, Then "리포트가 이메일로 전송되었습니다." 메시지가 표시된다
- Given 현재 모의 구현 상태에서, When 향후 SES 연동이 필요할 때, Then API 인터페이스 변경 없이 백엔드만 수정하면 된다

---

## Epic G: 다국어 지원 (REQ-B09)

### US-G01: 언어 전환 토글 UI
**As a** 방문객, **I want to** 모든 페이지에서 한국어/영어를 전환할 수 있다, **so that** 편한 언어로 데모를 체험할 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B09

**Acceptance Criteria**:
- Given 헤더에 언어 전환 토글이 있을 때, When 토글을 클릭하면, Then 한국어 <-> 영어로 전환된다
- Given 언어가 전환되었을 때, When 다른 페이지로 이동하면, Then 선택한 언어가 유지된다

### US-G02: 언어 설정 영속화
**As a** 방문객, **I want to** 선택한 언어가 페이지 새로고침 후에도 유지되길 원한다, **so that** 매번 언어를 다시 선택하지 않아도 된다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B09

**Acceptance Criteria**:
- Given 언어를 영어로 설정했을 때, When 페이지를 새로고침하면, Then 영어 상태가 유지된다
- Given localStorage에 언어 설정이 저장될 때, When 새 세션을 시작하면, Then 저장된 언어 설정이 적용된다

### US-G03: UI 텍스트 번역 - 시작 페이지
**As a** 방문객, **I want to** 시작 페이지의 모든 텍스트가 선택한 언어로 표시되길 원한다, **so that** 언어 장벽 없이 데모를 시작할 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B09

**Acceptance Criteria**:
- Given 영어가 선택되었을 때, When 시작 페이지를 보면, Then 제목, 설명, 입력 placeholder, 버튼 텍스트가 영어로 표시된다
- Given 산업 예시 카테고리가 표시될 때, When 영어 모드이면, Then 카테고리명과 예시 텍스트가 영어로 표시된다

### US-G04: UI 텍스트 번역 - 데모 페이지
**As a** 방문객, **I want to** 데모 페이지의 UI 요소가 선택한 언어로 표시되길 원한다, **so that** 데모 진행 상황을 이해할 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B09

**Acceptance Criteria**:
- Given 영어가 선택되었을 때, When 데모 페이지를 보면, Then Phase/Stage 레이블, 버튼 텍스트, 안내 메시지가 영어로 표시된다
- Given 데모 콘텐츠(채팅, 파일 내용)는, When 언어와 무관하게, Then 한국어로 유지된다 (데모 콘텐츠 특성)

### US-G05: UI 텍스트 번역 - 결과 페이지
**As a** 방문객, **I want to** 결과 페이지의 탭명, 레이블, 설명이 선택한 언어로 표시되길 원한다, **so that** 결과를 정확히 이해할 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B09

**Acceptance Criteria**:
- Given 영어가 선택되었을 때, When 결과 페이지를 보면, Then 6개 탭명, 프로젝트 예상 레이블, 버튼 텍스트가 영어로 표시된다

### US-G06: 에러 메시지 다국어
**As a** 방문객, **I want to** 에러 메시지도 선택한 언어로 표시되길 원한다, **so that** 문제 상황을 이해할 수 있다.

**Priority**: Low | **Estimate**: S | **REQ**: REQ-B09

**Acceptance Criteria**:
- Given 에러가 발생했을 때, When 현재 언어가 영어이면, Then 영어 에러 메시지가 표시된다

---

# Persona 2: 부스 운영 스태프 (Booth Operator) Stories

## Epic H: 관리자 대시보드 (REQ-B08)

### US-H01: 대시보드 메인 통계
**As a** 부스 운영 스태프, **I want to** 총 세션 수, 완료율, 평균 소요 시간을 한눈에 보고 싶다, **so that** 부스 운영 상황을 실시간으로 파악할 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B08

**Acceptance Criteria**:
- Given /admin 페이지에 접속했을 때, When 대시보드가 로드되면, Then 총 세션 수, 완료율(%), 평균 소요 시간이 카드 형태로 표시된다
- Given 새 세션이 완료되었을 때, When 페이지를 새로고침하면, Then 통계가 업데이트된다

### US-H02: 최근 세션 로그 테이블
**As a** 부스 운영 스태프, **I want to** 최근 세션 로그를 테이블로 보고 싶다, **so that** 방문객들의 데모 진행 상황을 추적할 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B08

**Acceptance Criteria**:
- Given 대시보드에서, When 최근 세션 섹션을 보면, Then 타임스탬프, 프로젝트 아이디어, 완료 여부, 소요 시간이 테이블로 표시된다
- Given 세션 목록이 길 때, When 스크롤하면, Then 최신 세션이 상단에 표시된다

### US-H03: 인기 프로젝트 아이디어 목록
**As a** 부스 운영 스태프, **I want to** 가장 많이 입력된 프로젝트 아이디어를 보고 싶다, **so that** 방문객 관심사를 파악할 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B08

**Acceptance Criteria**:
- Given 대시보드에서, When 인기 아이디어 섹션을 보면, Then 빈도순으로 정렬된 프로젝트 아이디어 목록이 표시된다

### US-H04: 산업별 분포 차트
**As a** 부스 운영 스태프, **I want to** 산업별 데모 분포를 차트로 보고 싶다, **so that** 어떤 산업에 관심이 많은지 시각적으로 파악할 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B08

**Acceptance Criteria**:
- Given 대시보드에서, When 산업별 분포 차트를 보면, Then 이커머스, 핀테크, 헬스케어 등 산업별 세션 수가 차트로 표시된다
- Given 차트가 표시될 때, When 특정 산업을 호버하면, Then 해당 산업의 세션 수와 비율이 툴팁으로 표시된다

---

## Epic I: 로그 연동 (REQ-B02)

### US-I01: 세션 시작 로그 기록
**As a** 부스 운영 스태프, **I want to** 모든 데모 세션 시작이 자동으로 기록되길 원한다, **so that** 방문객 수를 정확히 파악할 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B02

**Acceptance Criteria**:
- Given 방문객이 "시작하기"를 클릭했을 때, When 세션이 시작되면, Then LogService를 통해 세션 시작 로그가 서버에 기록된다
- Given 로그에 sessionId, projectIdea, timestamp가 포함될 때, When 관리자 대시보드에서 조회하면, Then 해당 정보가 표시된다

### US-I02: 세션 완료 로그 기록
**As a** 부스 운영 스태프, **I want to** 데모 완료 여부와 소요 시간이 기록되길 원한다, **so that** 완료율과 평균 시간을 분석할 수 있다.

**Priority**: Medium | **Estimate**: S | **REQ**: REQ-B02

**Acceptance Criteria**:
- Given 방문객이 결과 페이지에 도달했을 때, When 데모가 완료되면, Then LogService를 통해 완료 로그(completed: true, durationMs)가 기록된다
- Given 방문객이 중간에 이탈했을 때, When 세션이 종료되면, Then 미완료 상태로 기록된다

### US-I03: 미사용 API Route 삭제
**As a** 부스 운영 스태프, **I want to** 불필요한 API가 제거되어 시스템이 깔끔하길 원한다, **so that** 유지보수가 용이하다.

**Priority**: Low | **Estimate**: S | **REQ**: REQ-B02

**Acceptance Criteria**:
- Given stream, estimate API Route가 삭제되었을 때, When 빌드를 실행하면, Then 에러 없이 빌드된다
- Given AIService가 정리되었을 때, When 코드에서 참조를 검색하면, Then 미사용 import가 없다

---

# Persona 3: 마케팅 분석가 (Marketing Analyst) Stories

## Epic J: 데이터 분석 (REQ-B08)

### US-J01: 세션 추이 차트
**As a** 마케팅 분석가, **I want to** 시간대별 세션 추이를 차트로 보고 싶다, **so that** 부스 방문 패턴을 분석할 수 있다.

**Priority**: Medium | **Estimate**: M | **REQ**: REQ-B08

**Acceptance Criteria**:
- Given 대시보드에서, When 세션 추이 차트를 보면, Then 시간대별 세션 수가 라인/바 차트로 표시된다

### US-J02: 대시보드 다국어 지원
**As a** 마케팅 분석가, **I want to** 대시보드도 한국어/영어로 전환할 수 있다, **so that** 영어 보고서 작성 시 영어 화면을 캡처할 수 있다.

**Priority**: Low | **Estimate**: S | **REQ**: REQ-B08, REQ-B09

**Acceptance Criteria**:
- Given 대시보드에서 언어 전환 토글이 있을 때, When 영어로 전환하면, Then 대시보드의 레이블, 차트 제목 등이 영어로 표시된다

---

# Story Summary

| Epic | Stories | Persona | REQ |
|------|---------|---------|-----|
| A: 데모 체험 개선 | US-A01 ~ US-A07 (7개) | 방문객 | REQ-B01 |
| B: 코드 품질 개선 | US-B01 ~ US-B04 (4개) | 방문객 | REQ-B03 |
| C: 접근성 개선 | US-C01 ~ US-C06 (6개) | 방문객 | REQ-B04 |
| D: 에러 핸들링 | US-D01 ~ US-D02 (2개) | 방문객 | REQ-B06 |
| E: 성능 최적화 | US-E01 ~ US-E05 (5개) | 방문객 | REQ-B07 |
| F: 이메일 유지 | US-F01 (1개) | 방문객 | REQ-B05 |
| G: 다국어 지원 | US-G01 ~ US-G06 (6개) | 방문객 | REQ-B09 |
| H: 관리자 대시보드 | US-H01 ~ US-H04 (4개) | 운영 스태프 | REQ-B08 |
| I: 로그 연동 | US-I01 ~ US-I03 (3개) | 운영 스태프 | REQ-B02 |
| J: 데이터 분석 | US-J01 ~ US-J02 (2개) | 분석가 | REQ-B08 |
| **Total** | **40개** | **3 Personas** | **9 REQs** |

## INVEST Criteria Verification

| Criteria | Status | Notes |
|----------|--------|-------|
| **Independent** | Pass | 각 스토리가 독립적으로 구현/테스트 가능 |
| **Negotiable** | Pass | 구현 방식은 유연하게 조정 가능 |
| **Valuable** | Pass | 각 스토리가 사용자에게 명확한 가치 제공 |
| **Estimable** | Pass | S/M/L 추정치 포함 |
| **Small** | Pass | 각 스토리가 1~3일 내 구현 가능한 크기 |
| **Testable** | Pass | Given-When-Then 형식의 수용 기준 포함 |
