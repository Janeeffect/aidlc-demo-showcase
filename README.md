# AI-DLC Demo Showcase

AWS Summit 부스용 AI-DLC(AI-Driven Development Lifecycle) 데모 쇼케이스 웹앱입니다.

## 🎯 개요

사용자가 프로젝트 아이디어를 입력하면, Kiro IDE 환경에서 AI-DLC 전체 과정(Inception → Construction → Operations)이 마우스 포인터 애니메이션과 타이핑 효과로 자동 진행되는 것을 시각적으로 보여주는 데모 애플리케이션입니다.

## ✨ 주요 기능

- **Kiro IDE 시뮬레이션**: 실제 IDE와 유사한 레이아웃 (파일 탐색기, 에디터, 터미널)
- **마우스 포인터 애니메이션**: 파일 클릭, 이동 등 모든 동작을 시각화
- **타이핑 효과**: AI 응답이 실시간으로 타이핑되는 효과
- **MVP 미리보기**: 생성된 프로젝트의 동적 UI 미리보기
- **AWS 아키텍처 다이어그램**: 프로젝트에 필요한 AWS 서비스 시각화
- **Production 예상 정보**: AI가 분석한 개발 기간, 팀 구성, 비용 예상

## 🛠 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **AI**: OpenAI/Anthropic API (선택적)

## 🚀 시작하기

### 필수 조건

- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 변수 (선택적)

AI 기능을 사용하려면 `.env.local` 파일을 생성하세요:

```env
OPENAI_API_KEY=your_openai_api_key
# 또는
ANTHROPIC_API_KEY=your_anthropic_api_key
```

> AI API 키가 없어도 Mock 데이터로 데모가 동작합니다.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 시작 페이지 (아이디어 입력)
│   ├── demo/page.tsx       # 데모 페이지 (AI-DLC 진행)
│   ├── result/page.tsx     # 결과 페이지 (MVP + 요약)
│   └── api/                # API Routes
│
├── components/
│   ├── kiro-ide/           # Kiro IDE 시뮬레이션 컴포넌트
│   ├── animation/          # 애니메이션 시스템
│   └── ui/                 # 공통 UI 컴포넌트
│
├── contexts/               # React Context (상태 관리)
├── services/               # 서비스 레이어 (AI, 로깅 등)
└── types/                  # TypeScript 타입 정의
```

## 🎮 사용 방법

1. **시작 페이지**: 프로젝트 아이디어를 입력하거나 예시 프로젝트 선택
2. **데모 페이지**: AI-DLC 과정이 자동으로 진행되는 것을 관람
3. **결과 페이지**: MVP 미리보기, AWS 아키텍처, Production 예상 정보 확인

## 📝 라이선스

MIT License

## 🤝 기여

이 프로젝트는 AWS Summit 데모용으로 제작되었습니다.
