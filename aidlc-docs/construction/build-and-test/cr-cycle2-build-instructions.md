# CR Cycle 2 - Build Instructions

## Prerequisites
- Node.js 18+
- npm 9+

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build
```bash
npx next build
```

### 3. Verify Build Success
- Expected: "Compiled successfully", "Generating static pages (10/10)"
- Build Artifacts: `.next/` 디렉토리
- Routes: /, /admin, /demo, /result + API routes

## Troubleshooting
- SWC 관련 오류: `next/dynamic` 옵션은 반드시 inline object literal 사용
- Mermaid ESM 오류: Jest 환경에서만 발생 (dynamic import + try/catch로 처리됨)
