# Contract/Interface Definition - Unit 4: 신규 기능 (New Features)

## Unit Context
- **Stories**: US-G01~G06 (다국어), US-H01~H04 (관리자 대시보드), US-J01~J02 (데이터 분석)
- **Dependencies**: Unit 1 (LogService 연동), Unit 3 (접근성 적용된 컴포넌트)
- **Database Entities**: DemoLog (industry 필드 추가)

---

## i18n Layer

### Locale Type (src/i18n/index.ts)
```typescript
type Locale = 'ko' | 'en';
```

### useTranslation Hook (src/i18n/index.ts)
```typescript
function useTranslation(): {
  t: (key: string) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}
```
- `t(key)`: dot notation 키로 번역 문자열 반환. 키 없으면 키 자체 반환.
- `locale`: 현재 언어
- `setLocale(locale)`: 언어 변경 + localStorage 저장

### Translation Files (src/i18n/ko.ts, src/i18n/en.ts)
```typescript
// 각 파일은 중첩 객체 구조의 번역 맵을 default export
const translations: Record<string, unknown> = {
  common: { ... },
  start: { ... },
  demo: { ... },
  result: { ... },
  admin: { ... },
};
export default translations;
```

### LanguageContext (src/contexts/LanguageContext.tsx)
```typescript
interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

function LanguageProvider({ children }: { children: React.ReactNode }): JSX.Element
// - 초기값: localStorage 'aidlc-locale' || 'ko'
// - setLocale 시 localStorage 저장
```

### LanguageToggle (src/components/ui/LanguageToggle.tsx)
```typescript
interface LanguageToggleProps {
  className?: string;
}

function LanguageToggle({ className }: LanguageToggleProps): JSX.Element
// - 현재 locale 반대 언어 버튼 표시 ("EN" / "KO")
// - 클릭 시 setLocale 호출
```

---

## Admin Layer

### AdminPage (src/app/admin/page.tsx)
```typescript
function AdminPage(): JSX.Element
// - sessionStorage 기반 비밀번호 인증
// - 인증 후 대시보드 표시
// - GET /api/log로 통계 로드
// - 수동 새로고침 버튼
// - 다국어 지원
```

### AdminPage 내부 함수
```typescript
// 비밀번호 검증
function verifyPassword(input: string): boolean
// - NEXT_PUBLIC_ADMIN_PASSWORD || "admin2026"과 비교

// 시간 포맷팅
function formatDuration(ms: number): string
// - ms를 "X분 Y초" 또는 "Xm Ys" 형태로 변환

// 타임스탬프 포맷팅
function formatTimestamp(isoString: string): string
// - ISO 문자열을 "HH:MM" 형태로 변환
```

---

## API Layer (확장)

### /api/log POST (src/app/api/log/route.ts - 수정)
```typescript
// LogRequest에 industry 필드 추가
interface ExtendedLogRequest extends LogRequest {
  industry?: string;
}
// DemoLog 저장 시 industry 포함
```

### /api/log GET (src/app/api/log/route.ts - 수정)
```typescript
// 응답에 3개 집계 데이터 추가
interface ExtendedLogStatistics extends LogStatistics {
  recentLogs: DemoLog[];
  industryDistribution: IndustryDistribution[];
  sessionTrend: SessionTrend[];
  popularIdeas: PopularIdea[];
}

function calculateIndustryDistribution(logs: DemoLog[]): IndustryDistribution[]
function calculateSessionTrend(logs: DemoLog[]): SessionTrend[]
function extractPopularIdeas(logs: DemoLog[]): PopularIdea[]
```

---

## Service Layer (확장)

### LogService (src/services/LogService.ts - 수정)
```typescript
// logStart 시그니처 확장
async logStart(sessionId: string, projectIdea: string, industry?: string): Promise<void>
```

---

## Type Layer (확장)

### DemoLog (src/types/demo.ts - 수정)
```typescript
interface DemoLog {
  // 기존 필드 유지
  industry?: string;  // [NEW]
}
```

### LogRequest (src/types/api.ts - 수정)
```typescript
interface LogRequest {
  // 기존 필드 유지
  industry?: string;  // [NEW]
}
```

### 신규 타입 (src/types/api.ts에 추가)
```typescript
interface IndustryDistribution {
  industry: string;
  count: number;
  percentage: number;
}

interface SessionTrend {
  hour: string;
  count: number;
}

interface PopularIdea {
  idea: string;
  count: number;
}
```

---

## Page Layer (수정)

### StartPage (src/app/page.tsx - 수정)
- useTranslation() 추가
- LanguageToggle 추가
- 하드코딩 텍스트 -> t() 호출
- logStart에 industry 전달

### DemoPage (src/app/demo/page.tsx - 수정)
- useTranslation() 추가
- LanguageToggle 추가
- 하드코딩 텍스트 -> t() 호출

### ResultPage (src/app/result/page.tsx - 수정)
- useTranslation() 추가
- LanguageToggle 추가
- 하드코딩 텍스트 -> t() 호출

### ResultSummary (src/components/ui/ResultSummary.tsx - 수정)
- useTranslation() 추가
- 하드코딩 텍스트 -> t() 호출

### Layout (src/app/layout.tsx - 수정)
- LanguageProvider 래핑 추가
