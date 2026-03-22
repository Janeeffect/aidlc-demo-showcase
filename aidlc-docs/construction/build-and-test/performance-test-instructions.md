# Performance Test Instructions - CR Cycle 3

## Purpose
CR-10 성능 최적화 효과 검증. Google Fonts -> local font 전환 후 초기 로딩 성능 측정.

## Performance Requirements
- **First Contentful Paint (FCP)**: < 2초
- **Largest Contentful Paint (LCP)**: < 3초
- **외부 폰트 요청**: 0건
- **Total Blocking Time (TBT)**: < 300ms

## Setup

### 1. Production Build
```bash
npx next build
npx next start -p 3001
```

### 2. Lighthouse 측정
```bash
# Chrome DevTools > Lighthouse 탭
# 또는 CLI:
npx lighthouse http://localhost:3001 --output=json --output-path=./lighthouse-report.json
```

## Test Execution

### 1. 초기 로딩 성능 (Screen 1)
- Chrome DevTools > Network 탭
- Cache 비활성화 (Disable cache)
- http://localhost:3001 접속
- 확인 항목:
  - fonts.googleapis.com 요청 없음
  - fonts.gstatic.com 요청 없음
  - inter-latin.woff2 로컬 로딩 확인
  - DOMContentLoaded < 2초

### 2. 번들 사이즈 확인
- `next build` 출력에서 각 페이지 사이즈 확인
- First Load JS shared: ~88 kB (현재)
- `/` 페이지: ~144 kB (현재)

### 3. 폰트 로딩 전략 확인
- `display: swap` 적용 확인 (FOUT 허용, FOIT 방지)
- 로컬 폰트 파일 크기: ~23 KB (woff2 압축)

## Expected Results
- Google Fonts 외부 요청: 0건
- 폰트 로딩 시간: < 100ms (로컬 파일)
- 네트워크 불안정 환경에서도 폰트 정상 표시
