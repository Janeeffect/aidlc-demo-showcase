# Unit Test Execution

## Test Framework
- **Framework**: Jest + React Testing Library
- **Coverage Tool**: Jest Coverage

## Setup Testing Environment

### 1. Install Test Dependencies
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

### 2. Configure Jest
`jest.config.js` 생성:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

### 3. Create Jest Setup
`jest.setup.js` 생성:
```javascript
import '@testing-library/jest-dom'
```

## Run Unit Tests

### 1. Execute All Unit Tests
```bash
npm test
```

### 2. Execute with Coverage
```bash
npm test -- --coverage
```

### 3. Watch Mode (개발 중)
```bash
npm test -- --watch
```

## Test Categories

### Component Tests
- KiroIDELayout 렌더링
- FileExplorer 파일 트리 표시
- CodeEditor 타이핑 효과
- MousePointer 애니메이션
- MVPPreview 동적 렌더링

### Service Tests
- AIService API 호출
- LogService 로그 저장
- EstimateService 계산 로직

### Context Tests
- DemoSessionContext 상태 관리

## Expected Results
- **Total Tests**: ~20개
- **Expected Coverage**: 70%+
- **Test Report Location**: `coverage/` 디렉토리

## Fix Failing Tests
1. 테스트 출력에서 실패 원인 확인
2. 해당 컴포넌트/서비스 코드 수정
3. 테스트 재실행
