# Technology Stack

## Programming Languages
| Language | Version | Usage |
|----------|---------|-------|
| TypeScript | ^5.4.0 | 전체 소스 코드 (strict mode) |
| CSS | - | Tailwind CSS + 커스텀 CSS (globals.css) |

## Frameworks
| Framework | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2.0 | 풀스택 React 프레임워크 (App Router) |
| React | 18.3.0 | UI 라이브러리 |
| React DOM | 18.3.0 | DOM 렌더링 |
| Tailwind CSS | ^3.4.0 | 유틸리티 기반 CSS 프레임워크 |

## UI/Animation Libraries
| Library | Version | Purpose |
|---------|---------|---------|
| Framer Motion | ^11.0.0 | 선언적 애니메이션 (페이지 전환, 컴포넌트 애니메이션) |
| Mermaid | ^11.12.3 | 텍스트 기반 다이어그램 렌더링 (AWS 아키텍처) |
| qrcode.react | ^3.1.0 | QR 코드 SVG 생성 |

## Build Tools
| Tool | Version | Purpose |
|------|---------|---------|
| npm | (시스템) | 패키지 관리자 |
| PostCSS | ^8.4.0 | CSS 후처리 (Tailwind 빌드) |
| Autoprefixer | ^10.4.0 | CSS 벤더 프리픽스 자동 추가 |
| SWC | (Next.js 내장) | TypeScript/JSX 컴파일러 |

## Testing Tools
| Tool | Version | Purpose |
|------|---------|---------|
| Jest | ^30.2.0 | 테스트 러너 |
| jest-environment-jsdom | ^30.2.0 | DOM 환경 시뮬레이션 |
| ts-jest | ^29.4.6 | TypeScript Jest 트랜스포머 |
| @testing-library/react | ^16.3.2 | React 컴포넌트 테스트 유틸리티 |
| @testing-library/jest-dom | ^6.9.1 | DOM 매처 확장 |
| @testing-library/user-event | ^14.6.1 | 사용자 이벤트 시뮬레이션 |

## Linting
| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | ^8.0.0 | JavaScript/TypeScript 린터 |
| eslint-config-next | 14.2.0 | Next.js ESLint 설정 |

## Runtime Dependencies (미사용 또는 제한적 사용)
| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| uuid | ^9.0.0 | UUID 생성 | API route에서만 사용, Context에서는 crypto.randomUUID() 사용 |

## Infrastructure
- **Hosting**: 미정 (Vercel 또는 자체 서버 배포 가능)
- **CDN**: 없음 (Next.js 내장 정적 파일 서빙)
- **Database**: 없음 (In-memory 로그 저장)
- **CI/CD**: 없음 (수동 배포)

## Design System
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0a0a0f` | 메인 배경 |
| Surface | `#12121a` | 카드, 사이드바 배경 |
| Border | `#2a2a3a` | 테두리 |
| Text Primary | `#e4e4ed` | 주요 텍스트 |
| Text Muted | `#b0b0c0` / `#8888a0` | 보조 텍스트 |
| Accent Primary | `#7c5cfc` | 보라색 액센트 |
| Accent Secondary | `#4a9eff` | 파란색 액센트 |
| Gradient | `#7c5cfc` -> `#4a9eff` | 그라데이션 (버튼, 상태바) |
| AWS Orange | `#ff9900` | AWS 관련 요소 |
