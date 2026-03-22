# Domain Entities - Unit 4: 신규 기능 (New Features)

## 1. i18n 시스템 엔티티

### Locale (신규 - src/i18n/index.ts)
```typescript
type Locale = 'ko' | 'en';
```

### TranslationMap (신규 - src/i18n/ko.ts, en.ts)
```typescript
// 혼합 네임스페이스: 페이지별 + common 공유 키
interface TranslationMap {
  // common (공유)
  common: {
    appTitle: string;        // "AI-DLC Demo" (양쪽 동일)
    poweredBy: string;       // "Powered by Kiro"
    summit: string;          // "AWS Summit 2026"
    loading: string;         // "로딩 중..." | "Loading..."
    confirm: string;         // "확인" | "OK"
    cancel: string;          // "취소" | "Cancel"
    error: {
      sendFailed: string;    // "전송에 실패했습니다. 다시 시도해주세요."
      logFailed: string;     // "로그 기록에 실패했습니다"
      noIdea: string;        // "프로젝트 아이디어가 없습니다"
    };
  };

  // start (StartPage)
  start: {
    inputLabel: string;      // "어떤 서비스를 만들고 싶으세요?"
    placeholder: string;     // "예: 온라인 쇼핑몰"
    startButton: string;     // "AI-DLC 시작하기"
    starting: string;        // "시작하는 중..."
    industryTitle: string;   // "산업별 예시"
    industryDesc: string;    // "예시를 클릭하면 자동으로 입력됩니다"
    categories: Record<string, {
      name: string;
      examples: string[];
    }>;
  };

  // demo (DemoPage)
  demo: {
    backToStart: string;     // "← 처음으로"
    prevStep: string;        // "← 이전 단계"
    nextStep: string;        // "다음 단계 →"
    viewResult: string;      // "결과 보기"
    inProgress: string;      // "진행 중..."
    loadingKiro: string;     // "Loading Kiro..."
    // 채팅 시스템 메시지 (Q4=B: 일부 번역)
    systemMessages: {
      analyzing: string;     // "분석 중입니다..." | "Analyzing..."
      generating: string;    // "생성 중입니다..." | "Generating..."
      complete: string;      // "완료되었습니다" | "Complete"
    };
  };

  // result (ResultPage)
  result: {
    backToDemo: string;      // "← 데모로 돌아가기"
    backToStart: string;     // "처음으로"
    complete: string;        // "완료" | "Complete"
    tryAnother: string;      // "다른 프로젝트 시도하기"
    emailReport: string;     // "리포트 이메일로 받기"
    resultLoading: string;   // "결과 로딩 중..."
    tabs: {
      mvp: string;           // "MVP 미리보기"
      architecture: string;  // "AWS 아키텍처"
      workflow: string;      // "비즈니스 워크플로우"
      estimate: string;      // "프로젝트 예상"
      aidlc: string;         // "AI-DLC 산출물"
      kiro: string;          // "Kiro 소개"
    };
    estimate: {
      aiSavings: string;     // "AI-DLC 시간 절감 효과"
      savedDays: string;     // "AI로 절감한 시간"
      speedUp: string;       // "개발 속도 향상"
      demoTime: string;      // "AI-DLC 소요 시간"
      schedule: string;      // "개발 일정"
      expectedDuration: string; // "예상 기간"
      complexity: string;    // "복잡도"
      teamSize: string;      // "팀 규모"
      costEstimate: string;  // "비용 예상"
      devCost: string;       // "개발 비용"
      infraCost: string;     // "인프라 비용"
      teamComposition: string; // "권장 팀 구성"
      techStack: string;     // "기술 스택"
      complexityHigh: string;
      complexityMedium: string;
      complexityLow: string;
    };
    email: {
      title: string;         // "리포트 이메일로 받기"
      desc: string;          // "AI-DLC 결과 리포트를..."
      emailLabel: string;    // "이메일 주소 *"
      nameLabel: string;     // "이름 *"
      companyLabel: string;  // "회사명 *"
      reportIncludes: string; // "리포트에 포함되는 내용:"
      submitButton: string;  // "리포트 받기"
      submitting: string;    // "전송 중..."
      successTitle: string;  // "전송 완료"
      successDesc: string;   // "리포트가 {email}로 전송되었습니다"
    };
    aidlcOutputs: {
      title: string;         // "AI-DLC 산출물"
      desc: string;          // "클릭하여 AI가 생성한 산출물을 확인하세요"
    };
    kiro: {
      subtitle: string;      // "AWS의 AI 기반 통합 개발 환경"
      plans: string;         // "구독 플랜"
      free: string;          // "무료"
      pro: string;           // "$19/월"
      features: string;      // "Kiro만의 특장점"
      comparison: string;    // "다른 AI 에디터와 비교"
      security: string;      // "보안 및 프라이버시"
      getStarted: string;    // "Kiro 시작하기"
    };
  };

  // admin (AdminPage)
  admin: {
    title: string;           // "관리자 대시보드"
    totalSessions: string;   // "총 세션"
    completedSessions: string; // "완료된 세션"
    completionRate: string;  // "완료율"
    avgDuration: string;     // "평균 소요 시간"
    recentSessions: string;  // "최근 세션"
    popularIdeas: string;    // "인기 프로젝트 아이디어"
    industryDist: string;    // "산업별 분포"
    sessionTrend: string;    // "세션 추이"
    refresh: string;         // "새로고침"
    noData: string;          // "데이터가 없습니다"
    table: {
      timestamp: string;     // "시간"
      projectIdea: string;   // "프로젝트 아이디어"
      status: string;        // "상태"
      duration: string;      // "소요 시간"
      completed: string;     // "완료"
      inProgress: string;    // "진행 중"
    };
    password: {
      title: string;         // "관리자 인증"
      placeholder: string;   // "비밀번호를 입력하세요"
      submit: string;        // "확인"
      error: string;         // "비밀번호가 올바르지 않습니다"
    };
  };
}
```

### LanguageContextValue (신규 - src/contexts/LanguageContext.tsx)
```typescript
interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}
```

## 2. 관리자 대시보드 엔티티

### LogStatistics (확장 - /api/log GET 응답)
```typescript
interface LogStatistics {
  totalSessions: number;
  completedSessions: number;
  completionRate: number;       // 0~100 (%)
  averageDuration: number;      // ms
  recentLogs: DemoLog[];        // 최근 10개
  industryDistribution: IndustryDistribution[];  // [NEW]
  sessionTrend: SessionTrend[];                  // [NEW]
  popularIdeas: PopularIdea[];                   // [NEW]
}
```

### IndustryDistribution (신규)
```typescript
interface IndustryDistribution {
  industry: string;    // "이커머스/리테일", "핀테크/금융" 등
  count: number;
  percentage: number;  // 0~100
}
```

### SessionTrend (신규)
```typescript
interface SessionTrend {
  hour: string;        // "09:00", "10:00" 등 (시간대별)
  count: number;
}
```

### PopularIdea (신규)
```typescript
interface PopularIdea {
  idea: string;
  count: number;
}
```

### DemoLog (기존 - src/types/demo.ts, 확장)
```typescript
interface DemoLog {
  id?: string;
  sessionId: string;
  projectIdea: string;
  completed: boolean;
  durationMs: number;
  timestamp: string;
  industry?: string;    // [NEW] 산업 카테고리 (scenarioDetector 결과)
}
```

## 3. 관리자 인증 엔티티

### AdminAuthState (AdminPage 내부)
```typescript
interface AdminAuthState {
  isAuthenticated: boolean;
  passwordInput: string;
  error: string | null;
}
```

## 4. 엔티티 관계도

```
LanguageContext (Provider)
  |-- locale: Locale
  |-- setLocale() -> localStorage 저장
  |-- t() -> TranslationMap 조회
  |
  +-- StartPage (useTranslation)
  +-- DemoPage (useTranslation)
  +-- ResultPage (useTranslation)
  +-- AdminPage (useTranslation)
  +-- LanguageToggle (useTranslation)

AdminPage
  |-- AdminAuthState (비밀번호 인증)
  |-- LogStatistics (GET /api/log)
  |   |-- IndustryDistribution[]
  |   |-- SessionTrend[]
  |   |-- PopularIdea[]
  |   +-- DemoLog[] (recentLogs)
  |
  +-- LanguageToggle

/api/log POST
  |-- DemoLog (industry 필드 추가)
  +-- logs[] (in-memory)

/api/log GET
  |-- logs[] -> LogStatistics 계산
  +-- industryDistribution, sessionTrend, popularIdeas 집계
```
