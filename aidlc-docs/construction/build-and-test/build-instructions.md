# Build Instructions

## Prerequisites
- **Build Tool**: Node.js 18+ / npm 9+
- **Dependencies**: Next.js 14, React 18, TypeScript 5, Tailwind CSS 3, Framer Motion
- **Environment Variables**: (선택적) OPENAI_API_KEY 또는 ANTHROPIC_API_KEY
- **System Requirements**: Windows/macOS/Linux, 4GB RAM, 1GB 디스크 공간

## Build Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (선택적)
AI 기능을 사용하려면 `.env.local` 파일 생성:
```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key
# 또는
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> AI API 키가 없어도 Mock 데이터로 데모가 동작합니다.

### 3. Build Application
```bash
npm run build
```

### 4. Verify Build Success
- **Expected Output**: 
  ```
  ✓ Compiled successfully
  ✓ Linting and checking validity of types
  ✓ Collecting page data
  ✓ Generating static pages
  ```
- **Build Artifacts**: `.next/` 디렉토리에 생성
- **Common Warnings**: ESLint 경고는 무시 가능

## Development Mode

개발 서버 실행:
```bash
npm run dev
```
브라우저에서 `http://localhost:3000` 접속

## Production Mode

프로덕션 서버 실행:
```bash
npm run build
npm run start
```

## Troubleshooting

### Build Fails with Dependency Errors
- **Cause**: node_modules 손상 또는 버전 불일치
- **Solution**: 
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Build Fails with TypeScript Errors
- **Cause**: 타입 정의 오류
- **Solution**: 
  ```bash
  npm run lint
  # 오류 확인 후 수정
  ```

### Port Already in Use
- **Cause**: 3000 포트가 이미 사용 중
- **Solution**: 
  ```bash
  # 다른 포트 사용
  npm run dev -- -p 3001
  ```
