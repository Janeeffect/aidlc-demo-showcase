# Integration Test Instructions

## Purpose
페이지 간 네비게이션, API 연동, 상태 전달이 올바르게 동작하는지 검증합니다.

## Test Scenarios

### Scenario 1: Start → Demo 페이지 전환
- **Description**: 사용자가 아이디어 입력 후 데모 페이지로 이동
- **Setup**: 개발 서버 실행
- **Test Steps**:
  1. `http://localhost:3000` 접속
  2. 프로젝트 아이디어 입력
  3. "시작하기" 버튼 클릭
  4. 데모 페이지로 이동 확인
- **Expected Results**: 
  - URL이 `/demo?idea=...`로 변경
  - DemoSessionContext에 아이디어 저장
  - 애니메이션 시작
- **Cleanup**: 없음

### Scenario 2: Demo → Result 페이지 전환
- **Description**: 데모 완료 후 결과 페이지로 이동
- **Setup**: 데모 페이지에서 애니메이션 완료
- **Test Steps**:
  1. 데모 애니메이션 완료 대기
  2. 자동으로 결과 페이지 이동
  3. MVP 미리보기 표시 확인
- **Expected Results**:
  - URL이 `/result`로 변경
  - MVP 컴포넌트 렌더링
  - AWS 아키텍처 다이어그램 표시
  - Production 예상 정보 표시

### Scenario 3: API 연동 테스트
- **Description**: Demo Stream API가 SSE로 데이터 전송
- **Setup**: 개발 서버 실행
- **Test Steps**:
  1. `/api/demo/start` POST 요청
  2. `/api/demo/stream` GET 요청 (SSE)
  3. 스트리밍 데이터 수신 확인
- **Expected Results**:
  - 세션 ID 반환
  - SSE 이벤트 수신
  - Phase/Stage 데이터 포함

### Scenario 4: 로깅 API 테스트
- **Description**: 사용자 입력이 로그에 저장
- **Setup**: 개발 서버 실행
- **Test Steps**:
  1. 시작 페이지에서 아이디어 입력
  2. `/api/log` POST 요청 확인
  3. 로그 파일/콘솔 확인
- **Expected Results**:
  - 로그에 사용자 입력 기록
  - 타임스탬프 포함

## Setup Integration Test Environment

### 1. Start Development Server
```bash
npm run dev
```

### 2. Configure Test Environment
```bash
# 테스트용 환경 변수 (선택적)
export NODE_ENV=test
```

## Run Integration Tests

### Manual Testing
1. 브라우저에서 `http://localhost:3000` 접속
2. 위 시나리오들을 순서대로 실행
3. 각 단계에서 예상 결과 확인

### Automated Testing (Playwright/Cypress)
```bash
# Playwright 설치 (선택적)
npm install --save-dev @playwright/test

# E2E 테스트 실행
npx playwright test
```

## Verify Service Interactions
- **API 응답 시간**: < 500ms
- **SSE 연결**: 안정적 유지
- **상태 전달**: Context를 통해 올바르게 전달

## Cleanup
```bash
# 개발 서버 종료
Ctrl + C
```
