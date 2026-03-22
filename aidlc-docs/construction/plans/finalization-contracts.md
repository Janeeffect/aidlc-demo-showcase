# Contract/Interface Definition for Unit 5: 마무리 (Finalization)

## Unit Context
- **Stories**: US-F01 (이메일 리포트 모의 구현 유지)
- **Dependencies**: Unit 1~4 완료 (리팩토링, 핵심 기능, 품질 개선, 다국어 기반)
- **Database Entities**: 없음 (기존 유지)

## 수정 대상 컴포넌트 (src/app/result/page.tsx 내부)

### EstimateTab 컴포넌트
- 현재: 하드코딩 한국어 텍스트 (~15개)
- 변경: `useTranslation()` hook 사용, `t('result.estimate.xxx')` 키로 교체
- 번역 키: ko.ts/en.ts에 이미 정의됨 (`result.estimate.*`)
- 특수 처리:
  - `translateRole()` -> locale 기반 동적 번역 (`t('result.estimate.roles.xxx')` 또는 locale 분기)
  - `translateSeniority()` -> locale 기반 동적 번역
  - 복잡도 표시: `t('result.estimate.complexityHigh/Medium/Low')`
  - 단위 텍스트: `t('result.estimate.savedDays')` 등

### AIDLCOutputsTab 컴포넌트
- 현재: 하드코딩 한국어 제목/설명 (~3개)
- 변경: `useTranslation()` hook 사용, `t('result.aidlcOutputs.xxx')` 키로 교체
- 번역 키: ko.ts/en.ts에 이미 정의됨 (`result.aidlcOutputs.*`)
- 특수 처리: 산출물 본문 콘텐츠는 한국어 유지 (데모 콘텐츠 특성)

### KiroIntroTab 컴포넌트
- 현재: 하드코딩 한국어 텍스트 (~20개)
- 변경: `useTranslation()` hook 사용, `t('result.kiro.xxx')` 키로 교체
- 번역 키: ko.ts/en.ts에 이미 정의됨 (`result.kiro.*`)
- 추가 필요 키: 세부 텍스트 (플랜 상세, 기능 상세, 비교표 항목, 보안 항목)

### EmailReportModal 컴포넌트
- 현재: 하드코딩 한국어 텍스트 (~12개)
- 변경: `useTranslation()` hook 사용, `t('result.email.xxx')` 키로 교체
- 번역 키: ko.ts/en.ts에 이미 정의됨 (`result.email.*`)
- 특수 처리: 성공 메시지의 `{email}` placeholder -> `t('result.email.successDesc').replace('{email}', formData.email)`

### translateRole() / translateSeniority() 함수
- 현재: 하드코딩 Record 매핑
- 변경: `useTranslation()`의 locale을 받아 locale === 'en'이면 원문 반환, 'ko'이면 한국어 반환
- 인터페이스 변경: `translateRole(role: string, locale: Locale): string`

## 추가 필요 번역 키

### ko.ts 추가 키
```typescript
result.estimate.roles: {
  'Full-stack Developer': '풀스택 개발자',
  'Frontend Developer': '프론트엔드 개발자',
  'Backend Developer': '백엔드 개발자',
  'UI/UX Designer': 'UI/UX 디자이너',
  'QA Engineer': 'QA 엔지니어',
  'DevOps Engineer': 'DevOps 엔지니어',
  'Tech Lead': '기술 리드',
}
result.estimate.seniority: {
  'Junior': '주니어',
  'Mid-level': '미드레벨',
  'Senior': '시니어',
}
result.estimate.days: '일'
result.estimate.persons: '명'
result.estimate.monthly: '/월'
result.estimate.approxMinutes: '~5분'

result.kiro.freePlan: '기본 기능'
result.kiro.proPlan: 'Pro 플랜'
result.kiro.freeFeatures: ['월 50회 AI 요청', '기본 코드 생성', '커뮤니티 지원']
result.kiro.proFeatures: ['무제한 AI 요청', 'AI-DLC 전체 기능', '우선 지원']
result.kiro.featureItems: [
  { title: 'AWS Knowledge Base 연동', desc: '...' },
  { title: '원클릭 AWS 배포', desc: '...' },
  { title: '코드 학습 불필요', desc: '...' },
  { title: '엔터프라이즈 보안', desc: '...' },
]
result.kiro.comparisonHeaders: { feature: '기능', kiro: 'Kiro', others: '기존 AI 에디터' }
result.kiro.comparisonItems: [...]
result.kiro.securityItems: [...]

result.email.emailPlaceholder: 'email@company.com'
result.email.namePlaceholder: '홍길동'
result.email.companyPlaceholder: '회사명'
result.email.reportItems: [...]
```

### en.ts 추가 키
동일 구조, 영어 값

## 테스트 인터페이스

### 신규 테스트 파일: `src/__tests__/ResultI18n.test.tsx`
- EstimateTab 다국어 렌더링 검증
- AIDLCOutputsTab 다국어 렌더링 검증
- KiroIntroTab 다국어 렌더링 검증
- EmailReportModal 다국어 렌더링 검증
- translateRole/translateSeniority locale 분기 검증
