# API Documentation

## REST APIs

### 실제 사용 현황

| API Route | 실제 호출 위치 | 상태 |
|-----------|---------------|------|
| POST /api/demo/start | StartPage (`page.tsx`) | 호출됨 (실패해도 무시) |
| GET /api/demo/stream | 없음 | 미사용 (DemoPage가 클라이언트 사이드에서 직접 콘텐츠 생성) |
| POST /api/demo/estimate | 없음 | 미사용 (ResultPage가 클라이언트 사이드 EstimateService 사용) |
| POST /api/demo/send-report | ResultPage EmailReportModal | 호출됨 |
| POST/GET /api/log | 없음 (LogService 존재하나 호출 코드 없음) | 미사용 |

**참고**: `/api/demo/stream`과 `/api/demo/estimate`는 초기 설계에서 서버 사이드 처리를 위해 만들어졌으나, 현재는 클라이언트 사이드에서 직접 처리하는 방식으로 변경됨. AIService도 실제로 호출되지 않으며, DemoPage의 `generateDemoSteps()`가 모든 콘텐츠를 클라이언트에서 생성함.

### POST /api/demo/start
- **Purpose**: 새 데모 세션을 시작하고 고유 세션 ID를 반환
- **Request**:
  ```json
  {
    "projectIdea": "온라인 쇼핑몰"
  }
  ```
- **Response** (200):
  ```json
  {
    "sessionId": "uuid-v4-string",
    "status": "started"
  }
  ```
- **Error** (400): `{ "error": "Project idea is required" }`
- **Error** (500): `{ "error": "Failed to start demo" }`
- **Notes**: uuid 패키지로 세션 ID 생성, 콘솔 로그만 기록

### GET /api/demo/stream
- **Purpose**: AI 응답을 SSE(Server-Sent Events)로 스트리밍
- **Query Parameters**:
  - `sessionId` (required): 세션 ID
  - `phase` (required): INCEPTION | CONSTRUCTION | OPERATIONS
  - `stage` (required): requirements | design | code | infrastructure | deployment
  - `projectIdea` (required): 프로젝트 아이디어 텍스트
- **Response**: `text/event-stream`
  ```
  data: {"type":"text","content":"#"}
  data: {"type":"text","content":" "}
  data: {"type":"done","content":""}
  ```
- **AIChunk Types**: `text` | `code` | `file` | `done`
- **Notes**: 템플릿 기반 콘텐츠 생성, 문자 단위 스트리밍 (10ms 딜레이)

### POST /api/demo/estimate
- **Purpose**: 프로젝트 복잡도를 분석하고 개발 예상 정보를 반환
- **Request**:
  ```json
  {
    "sessionId": "uuid",
    "projectIdea": "온라인 쇼핑몰",
    "requirements": "...",
    "design": "..."
  }
  ```
- **Response** (200):
  ```json
  {
    "traditionalDays": 14,
    "teamComposition": [
      { "role": "프론트엔드", "count": 2, "reason": "UI 개발" }
    ],
    "estimatedDuration": "약 2주",
    "estimatedTeamSize": 4,
    "mvpCode": "...",
    "awsArchitecture": {
      "services": [{ "id": "lambda", "name": "Lambda", "icon": "...", "x": 350, "y": 50 }],
      "connections": [{ "from": "apigateway", "to": "lambda", "label": "Invoke" }]
    }
  }
  ```
- **Notes**: 키워드 기반 복잡도 분석 (simple/moderate/complex), AWS 아키텍처 및 MVP 코드 동적 생성

### POST /api/demo/send-report
- **Purpose**: 데모 결과 리포트를 이메일로 전송 (현재 로그만 기록)
- **Request**:
  ```json
  {
    "email": "user@company.com",
    "name": "홍길동",
    "company": "회사명",
    "projectIdea": "온라인 쇼핑몰",
    "outputs": ["requirements.md", "user-stories.md"],
    "estimate": { ... }
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "리포트가 이메일로 전송되었습니다.",
    "logId": "LOG-1234567890"
  }
  ```
- **Notes**: 실제 이메일 전송 미구현, 콘솔 로그만 기록

### POST /api/log
- **Purpose**: 데모 세션 로그를 기록
- **Request**:
  ```json
  {
    "sessionId": "uuid",
    "projectIdea": "온라인 쇼핑몰",
    "completed": true,
    "durationMs": 120000
  }
  ```
- **Response** (200): `{ "status": "logged" }`

### GET /api/log
- **Purpose**: 로그 통계를 조회
- **Response** (200):
  ```json
  {
    "totalSessions": 10,
    "completedSessions": 8,
    "completionRate": 80,
    "averageDuration": 95000,
    "recentLogs": [...]
  }
  ```
- **Notes**: In-memory 배열 저장 (서버 재시작 시 초기화)

## Internal APIs (Client-Side Services)

### AIService
- **Methods**:
  - `streamResponse(sessionId, phase, stage, projectIdea)`: AsyncGenerator<AIChunk> - SSE 스트리밍 파싱
  - `generateContent(phase, stage, projectIdea)`: Promise<string> - 비스트리밍 콘텐츠 생성
  - `buildPrompt(projectIdea, phase, stage)`: string - LLM 프롬프트 생성 (미래 확장용)
- **Singleton**: `aiService` 인스턴스 export

### EstimateService
- **Methods**:
  - `calculateEstimate(projectIdea)`: ProjectEstimate - 키워드 기반 복잡도 분석 및 예상 계산
- **Internal Functions**:
  - `analyzeComplexity(idea)`: 복잡도 점수 산출 (high/medium/low)
- **Notes**: 클라이언트 사이드에서 직접 실행 (API 호출 불필요)

### LogService
- **Methods**:
  - `saveLog(log)`: Promise<void> - 로그 저장
  - `getStatistics()`: Promise<LogStatistics> - 통계 조회
  - `logStart(sessionId, projectIdea)`: Promise<void> - 데모 시작 기록
  - `logComplete(sessionId, projectIdea, durationMs)`: Promise<void> - 데모 완료 기록
- **Singleton**: `logService` 인스턴스 export

## Data Models

### DemoSessionState
- `sessionId`: string - 세션 고유 ID
- `projectIdea`: string - 프로젝트 아이디어
- `currentPhase`: Phase - 현재 Phase (INCEPTION/CONSTRUCTION/OPERATIONS)
- `currentStage`: Stage - 현재 Stage
- `files`: FileTreeNode[] - 파일 트리
- `aiResponses`: AIResponse[] - AI 응답 이력
- `animationProgress`: number - 애니메이션 진행률 (0-100)
- `isComplete`: boolean - 데모 완료 여부
- `startTime`: Date - 시작 시간
- `result`: DemoResult | null - 최종 결과

### FileTreeNode
- `name`: string - 파일/폴더 이름
- `path`: string - 경로
- `type`: 'file' | 'folder'
- `children?`: FileTreeNode[] - 하위 노드
- `isExpanded?`: boolean - 폴더 확장 상태
- `isNew?`: boolean - 새로 생성된 파일 표시

### ProjectEstimate (EstimateService)
- `developmentDays`: number - 예상 개발 일수
- `teamSize`: number - 팀 규모
- `teamComposition`: TeamMember[] - 팀 구성
- `estimatedCost`: CostEstimate - 비용 예상
- `techStack`: string[] - 기술 스택
- `complexity`: 'low' | 'medium' | 'high'
- `aiSavedDays`: number - AI 절감 일수
- `aiSavedPercentage`: number - AI 절감 비율
