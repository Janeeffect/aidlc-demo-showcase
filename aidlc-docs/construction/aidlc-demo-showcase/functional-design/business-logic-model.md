# Business Logic Model - Unit 4: 신규 기능 (New Features)

## 1. i18n 시스템 로직

### 1.1 LanguageContext 초기화 흐름

```
앱 로드 (layout.tsx)
  -> LanguageProvider 마운트
  -> localStorage.getItem('aidlc-locale') 조회
  -> 값이 있으면 해당 locale 설정
  -> 값이 없으면 기본값 'ko' 설정
  -> children에 context 제공
```

### 1.2 언어 전환 흐름

```
사용자가 LanguageToggle 클릭
  -> setLocale(newLocale) 호출
  -> LanguageContext state 업데이트 (locale 변경)
  -> localStorage.setItem('aidlc-locale', newLocale)
  -> React re-render -> 모든 t() 호출이 새 locale의 번역 반환
  -> UI 즉시 업데이트 (페이지 새로고침 없음)
```

### 1.3 번역 키 조회 로직 (t 함수)

```typescript
function t(key: string): string {
  // 1. 현재 locale에 해당하는 번역 맵 선택
  const translations = locale === 'ko' ? koTranslations : enTranslations;
  
  // 2. dot notation으로 중첩 키 탐색
  const keys = key.split('.');
  let result: unknown = translations;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key; // fallback: 키 문자열 반환
    }
  }
  
  // 3. 문자열이면 반환, 아니면 키 반환
  return typeof result === 'string' ? result : key;
}
```

### 1.4 LanguageToggle 컴포넌트 로직

```
LanguageToggle 렌더링
  -> useTranslation()으로 현재 locale 조회
  -> locale === 'ko' ? "EN" 버튼 표시 : "KO" 버튼 표시
  -> 클릭 시 setLocale(locale === 'ko' ? 'en' : 'ko')
```

표시 형식: 현재 언어의 반대 언어를 버튼에 표시
- 한국어 모드일 때: "EN" 버튼 (영어로 전환)
- 영어 모드일 때: "KO" 버튼 (한국어로 전환)

### 1.5 기존 페이지 다국어 적용 패턴

각 페이지에서 하드코딩된 한국어 텍스트를 `t()` 호출로 교체:

```typescript
// Before
<label>어떤 서비스를 만들고 싶으세요?</label>

// After
const { t } = useTranslation();
<label>{t('start.inputLabel')}</label>
```

적용 대상 페이지별 주요 텍스트:

**StartPage**:
- 입력 레이블, placeholder, 버튼 텍스트
- 산업 카테고리명, 예시 텍스트
- "시작하는 중..." 로딩 텍스트

**DemoPage**:
- "처음으로", "이전 단계", "다음 단계", "결과 보기" 버튼
- "진행 중..." 로딩 텍스트
- "Loading Kiro..." fallback 텍스트
- 시스템 메시지 (분석 중, 생성 중, 완료)

**ResultPage**:
- 6개 탭명 (MVP 미리보기, AWS 아키텍처, ...)
- 헤더 텍스트 ("완료", "데모로 돌아가기", "처음으로")
- EstimateTab 레이블 (예상 기간, 복잡도, 팀 규모, ...)
- EmailReportModal 텍스트
- KiroIntroTab 텍스트
- AIDLCOutputsTab 텍스트
- "다른 프로젝트 시도하기", "리포트 이메일로 받기" 버튼

**ResultSummary**:
- "축하합니다", "AI-DLC로 MVP를 완성했습니다"
- "AI-DLC 소요 시간", "기존 방식 예상"
- "배 빠른 개발", "Production 예상 정보"
- "예상 기간", "예상 인원", "팀 구성"
- "QR 코드를 스캔하여 더 알아보세요"
- "처음으로 돌아가기"

---

## 2. 관리자 대시보드 로직

### 2.1 인증 흐름

```
사용자가 /admin 접속
  -> sessionStorage.getItem('aidlc-admin-auth') 확인
  -> 인증됨 -> 대시보드 표시
  -> 미인증 -> 비밀번호 입력 화면 표시
     -> 비밀번호 입력 후 확인 클릭
     -> 입력값 === (NEXT_PUBLIC_ADMIN_PASSWORD || "admin2026")
        -> 일치: sessionStorage.setItem('aidlc-admin-auth', 'true'), 대시보드 표시
        -> 불일치: 에러 메시지 표시, 재시도 허용
```

### 2.2 데이터 로드 흐름

```
대시보드 마운트 (인증 후)
  -> setLoading(true)
  -> GET /api/log 호출
  -> 성공: setStatistics(data), setLoading(false)
  -> 실패: setError(message), setLoading(false)

새로고침 버튼 클릭
  -> 동일 흐름 반복
```

### 2.3 /api/log GET 확장 로직

기존 통계에 3개 집계 데이터를 추가:

```typescript
// 산업별 분포 계산
function calculateIndustryDistribution(logs: DemoLog[]): IndustryDistribution[] {
  const industryMap = new Map<string, number>();
  logs.forEach(log => {
    const industry = log.industry || '기타';
    industryMap.set(industry, (industryMap.get(industry) || 0) + 1);
  });
  
  const total = logs.length;
  return Array.from(industryMap.entries())
    .map(([industry, count]) => ({
      industry,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

// 세션 추이 계산 (시간대별)
function calculateSessionTrend(logs: DemoLog[]): SessionTrend[] {
  const hourMap = new Map<string, number>();
  logs.forEach(log => {
    const hour = new Date(log.timestamp).getHours();
    const hourStr = `${hour.toString().padStart(2, '0')}:00`;
    hourMap.set(hourStr, (hourMap.get(hourStr) || 0) + 1);
  });
  
  return Array.from(hourMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour.localeCompare(b.hour));
}

// 인기 아이디어 추출 (상위 5개)
function extractPopularIdeas(logs: DemoLog[]): PopularIdea[] {
  const ideaMap = new Map<string, number>();
  logs.forEach(log => {
    const normalized = log.projectIdea.trim().toLowerCase();
    ideaMap.set(normalized, (ideaMap.get(normalized) || 0) + 1);
  });
  
  return Array.from(ideaMap.entries())
    .map(([idea, count]) => ({ idea, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
```

### 2.4 AdminPage UI 구조

```
AdminPage
  |-- 인증 화면 (미인증 시)
  |   |-- 비밀번호 입력 필드
  |   +-- 확인 버튼 + 에러 메시지
  |
  +-- 대시보드 (인증 후)
      |-- 헤더 (제목 + LanguageToggle + 새로고침 버튼 + 홈 링크)
      |-- 통계 카드 4개 (총 세션, 완료 세션, 완료율, 평균 시간)
      |-- 2열 레이아웃
      |   |-- 좌: 산업별 분포 (CSS 수평 바 차트)
      |   +-- 우: 세션 추이 (CSS 수직 바 차트)
      |-- 인기 아이디어 목록 (상위 5개)
      +-- 최근 세션 테이블 (최근 10개)
```

### 2.5 CSS-only 바 차트 로직

**수평 바 차트 (산업별 분포)**:
```
각 산업에 대해:
  barWidth = (count / maxCount) * 100 + '%'
  <div style={{ width: barWidth }} />
  호버 시 title 속성으로 정확한 수치 표시
```

**수직 바 차트 (세션 추이)**:
```
각 시간대에 대해:
  barHeight = (count / maxCount) * 100 + '%'
  <div style={{ height: barHeight }} />
  하단에 시간 레이블 표시
```

---

## 3. LogService 확장 로직

### 3.1 logStart 확장

StartPage에서 logStart 호출 시 industry 필드를 추가:

```typescript
// StartPage에서
import { detectScenario } from '@/utils/scenarioDetector';

const scenario = detectScenario(projectIdea);
logService.logStart(sessionId, projectIdea, scenario.domain).catch(() => {});
```

LogService.logStart 시그니처 확장:
```typescript
async logStart(sessionId: string, projectIdea: string, industry?: string): Promise<void>
```

### 3.2 /api/log POST 확장

industry 필드를 DemoLog에 저장:
```typescript
const log: DemoLog = {
  id: `log-${Date.now()}`,
  sessionId,
  projectIdea,
  completed,
  durationMs,
  timestamp: new Date().toISOString(),
  industry: body.industry || undefined,  // [NEW]
};
```

---

## 4. 모듈 의존성

```
layout.tsx
  +-- LanguageProvider (NEW - children 래핑)
      +-- DemoSessionProvider (기존)
          +-- Pages

StartPage
  +-- useTranslation() (NEW)
  +-- LanguageToggle (NEW)
  +-- logService.logStart(sessionId, idea, industry) (확장)

DemoPage
  +-- useTranslation() (NEW)
  +-- LanguageToggle (NEW)

ResultPage
  +-- useTranslation() (NEW)
  +-- LanguageToggle (NEW)
  +-- ResultSummary (useTranslation 적용)

AdminPage (NEW)
  +-- useTranslation() (NEW)
  +-- LanguageToggle (NEW)
  +-- GET /api/log (확장된 통계)
  +-- sessionStorage (인증)

/api/log
  +-- POST: industry 필드 추가 저장
  +-- GET: industryDistribution, sessionTrend, popularIdeas 집계 추가

src/i18n/
  +-- ko.ts (한국어 번역 맵)
  +-- en.ts (영어 번역 맵)
  +-- index.ts (useTranslation 훅)

src/contexts/LanguageContext.tsx
  +-- LanguageProvider
  +-- useLanguage (내부 훅)

src/components/ui/LanguageToggle.tsx
  +-- useTranslation()
```
