# AI-DLC Demo Showcase - Services

## 서비스 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              React Components                        │   │
│  │   StartPage → DemoPage → ResultPage                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│                           │ HTTP / SSE                       │
│                           ▼                                  │
├─────────────────────────────────────────────────────────────┤
│                    Next.js API Routes                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ /api/demo/   │ │ /api/demo/   │ │  /api/log    │        │
│  │    start     │ │   stream     │ │              │        │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘        │
│         │                │                │                  │
│         ▼                ▼                ▼                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Services Layer                      │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │ AIService   │ │ Estimate    │ │ LogService  │   │   │
│  │  │             │ │ Service     │ │             │   │   │
│  │  └──────┬──────┘ └─────────────┘ └──────┬──────┘   │   │
│  │         │                               │          │   │
│  └─────────┼───────────────────────────────┼──────────┘   │
│            │                               │               │
├────────────┼───────────────────────────────┼───────────────┤
│            ▼                               ▼               │
│     ┌─────────────┐                 ┌─────────────┐       │
│     │  LLM API    │                 │  Log Store  │       │
│     │  (External) │                 │  (File/DB)  │       │
│     └─────────────┘                 └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. AIService

### 목적
LLM API와 연동하여 AI-DLC 각 Phase/Stage의 콘텐츠를 동적으로 생성

### 책임
- Phase별 프롬프트 구성 및 관리
- LLM API 스트리밍 호출
- 응답 파싱 및 구조화
- MVP 코드 및 AWS 아키텍처 생성

### 구현 상세

```typescript
class AIService {
  private llmClient: LLMClient;
  
  // Phase별 프롬프트 템플릿
  private prompts = {
    INCEPTION: {
      requirements: (idea: string) => `
        사용자가 "${idea}" 서비스를 만들고 싶어합니다.
        이 서비스의 핵심 요구사항을 분석해주세요.
        - 주요 기능 3-5개
        - 사용자 유형
        - 핵심 데이터 모델
        간결하게 markdown 형식으로 작성해주세요.
      `,
      design: (idea: string) => `
        "${idea}" 서비스의 애플리케이션 설계를 해주세요.
        - 주요 컴포넌트 구조
        - API 엔드포인트
        - 데이터 흐름
        간결하게 markdown 형식으로 작성해주세요.
      `
    },
    CONSTRUCTION: {
      code: (idea: string) => `
        "${idea}" 서비스의 MVP React 컴포넌트를 생성해주세요.
        - 간단한 UI 컴포넌트
        - Tailwind CSS 스타일링
        - 기본 인터랙션
        실행 가능한 React 코드로 작성해주세요.
      `
    },
    OPERATIONS: {
      infrastructure: (idea: string) => `
        "${idea}" 서비스의 AWS 아키텍처를 설계해주세요.
        - 사용할 AWS 서비스 목록
        - 서비스 간 연결 관계
        - 간단한 배포 계획
        JSON 형식으로 서비스 목록과 연결을 반환해주세요.
      `
    }
  };

  // 스트리밍 응답 생성
  async *streamResponse(
    projectIdea: string,
    phase: Phase,
    stage: Stage
  ): AsyncGenerator<AIChunk> {
    const prompt = this.getPrompt(projectIdea, phase, stage);
    const stream = await this.llmClient.stream(prompt);
    
    for await (const chunk of stream) {
      yield {
        type: 'text',
        content: chunk.text
      };
    }
  }

  // MVP 코드 생성
  async generateMVPCode(projectIdea: string): Promise<string> {
    const prompt = this.prompts.CONSTRUCTION.code(projectIdea);
    const response = await this.llmClient.complete(prompt);
    return this.extractCode(response);
  }

  // AWS 아키텍처 생성
  async generateAWSArchitecture(projectIdea: string): Promise<AWSArchitecture> {
    const prompt = this.prompts.OPERATIONS.infrastructure(projectIdea);
    const response = await this.llmClient.complete(prompt);
    return this.parseArchitecture(response);
  }
}
```

### 의존성
- LLM API Client (OpenAI, Anthropic, Bedrock 등)

---

## 2. EstimateService

### 목적
프로젝트 복잡도를 분석하여 Production 예상 일정/인력 정보 계산

### 책임
- 생성된 콘텐츠 기반 복잡도 분석
- 팀 구성 추천
- 예상 기간 계산
- AI 기반 동적 추정

### 구현 상세

```typescript
class EstimateService {
  private aiService: AIService;

  // Production 예상 정보 계산
  async calculateEstimate(
    projectIdea: string,
    generatedContent: GeneratedContent
  ): Promise<ProductionEstimate> {
    // AI를 통한 동적 추정
    const prompt = `
      다음 프로젝트의 Production 개발 예상 정보를 분석해주세요:
      
      프로젝트: ${projectIdea}
      생성된 요구사항: ${generatedContent.requirements}
      생성된 설계: ${generatedContent.design}
      
      다음 형식으로 JSON 응답해주세요:
      {
        "traditionalDays": 예상 개발 일수 (숫자),
        "teamComposition": [
          { "role": "직군명", "count": 인원수, "reason": "필요 이유" }
        ],
        "estimatedDuration": "예상 기간 (예: 약 3주)",
        "estimatedTeamSize": 총 인원수
      }
    `;

    const response = await this.aiService.complete(prompt);
    return JSON.parse(response);
  }

  // 복잡도 분석 (보조)
  analyzeComplexity(content: GeneratedContent): ComplexityScore {
    const factors = {
      featureCount: this.countFeatures(content.requirements),
      componentCount: this.countComponents(content.design),
      integrationPoints: this.countIntegrations(content.design)
    };

    return {
      score: this.calculateScore(factors),
      level: this.determineLevel(factors),
      factors
    };
  }
}
```

### 의존성
- AIService (동적 추정용)

---

## 3. LogService

### 목적
방문객 입력 데이터를 저장하고 분석용 통계 제공

### 책임
- 로그 데이터 저장
- 로그 조회 및 필터링
- 통계 집계

### 구현 상세

```typescript
class LogService {
  private logStore: LogStore; // File or DB

  // 로그 저장
  async saveLog(log: DemoLog): Promise<void> {
    const enrichedLog = {
      ...log,
      timestamp: new Date().toISOString(),
      id: generateId()
    };
    
    await this.logStore.append(enrichedLog);
  }

  // 로그 조회
  async getLogs(filter?: LogFilter): Promise<DemoLog[]> {
    const logs = await this.logStore.readAll();
    
    if (!filter) return logs;
    
    return logs.filter(log => {
      if (filter.startDate && log.timestamp < filter.startDate) return false;
      if (filter.endDate && log.timestamp > filter.endDate) return false;
      if (filter.completed !== undefined && log.completed !== filter.completed) return false;
      return true;
    });
  }

  // 통계 조회
  async getStatistics(): Promise<LogStatistics> {
    const logs = await this.logStore.readAll();
    
    return {
      totalSessions: logs.length,
      completedSessions: logs.filter(l => l.completed).length,
      completionRate: this.calculateCompletionRate(logs),
      averageDuration: this.calculateAverageDuration(logs),
      popularKeywords: this.extractPopularKeywords(logs),
      dailyStats: this.groupByDate(logs)
    };
  }
}
```

### 저장 방식 옵션
1. **파일 기반**: JSON 파일로 로컬 저장 (간단, MVP용)
2. **DB 기반**: SQLite 또는 외부 DB (확장성)

---

## 서비스 간 상호작용

### 데모 플로우 시퀀스

```
1. 사용자 입력 → /api/demo/start
   └─ LogService.saveLog() (세션 시작 기록)

2. AI 스트리밍 → /api/demo/stream
   └─ AIService.streamResponse() (Phase별 콘텐츠 생성)
   
3. 결과 생성 → /api/demo/estimate
   └─ EstimateService.calculateEstimate() (예상 정보 계산)
   └─ AIService.generateMVPCode() (MVP 코드 생성)
   └─ AIService.generateAWSArchitecture() (아키텍처 생성)

4. 데모 완료 → /api/log
   └─ LogService.saveLog() (완료 기록)
```

---

## 환경 설정

```typescript
// 서비스 설정
interface ServiceConfig {
  ai: {
    provider: 'openai' | 'anthropic' | 'bedrock';
    apiKey: string;
    model: string;
    maxTokens: number;
  };
  log: {
    storage: 'file' | 'database';
    filePath?: string;
    dbConnection?: string;
  };
}
```
