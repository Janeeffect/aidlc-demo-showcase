# Build Instructions - CR Cycle 3

## Prerequisites
- **Build Tool**: Next.js 14.2.0 + npm
- **Node.js**: v18+ (LTS)
- **Dependencies**: package.json 참조
- **Environment Variables**: 없음 (클라이언트 전용 앱)
- **System Requirements**: Windows 10+, 4GB RAM, 1GB 디스크

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build All Units
```bash
npx next build
```

### 3. Verify Build Success
- **Expected Output**: "Creating an optimized production build ... Compiled successfully"
- **Build Artifacts**: `.next/` 디렉토리
- **Static Pages**: /, /demo, /result, /admin, /_not-found (10/10)
- **Dynamic Routes**: /api/demo/send-report, /api/demo/start, /api/log

### 4. Start Production Server (수동)
```bash
npx next start -p 3001
```

## Troubleshooting

### Build Fails with Module Not Found
- **Cause**: 삭제된 MousePointer.tsx를 참조하는 코드 잔존
- **Solution**: `import MousePointer` 검색 후 제거

### Build Fails with Font Error
- **Cause**: `public/fonts/inter-latin.woff2` 파일 누락
- **Solution**: 폰트 파일 존재 확인, 없으면 Google Fonts에서 다운로드
