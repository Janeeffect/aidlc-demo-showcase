# Dependencies

## Internal Dependencies

```
+------------------+     +---------------------+     +------------------+
|                  |     |                     |     |                  |
|  Pages           |---->|  Components         |---->|  Types           |
|  (page.tsx)      |     |  (kiro-ide/, ui/)   |     |  (demo.ts, etc.) |
|                  |     |                     |     |                  |
+--------+---------+     +----------+----------+     +------------------+
         |                          |
         v                          v
+------------------+     +---------------------+
|                  |     |                     |
|  Contexts        |     |  Services           |
|  (DemoSession)   |     |  (AI, Estimate, Log)|
|                  |     |                     |
+------------------+     +----------+----------+
                                    |
                                    v
                         +---------------------+
                         |                     |
                         |  API Routes         |
                         |  (/api/demo/*, /log)|
                         |                     |
                         +---------------------+
```

### Text Alternative
```
Pages -> Components, Contexts, Services, Types
Components -> Types
Services -> API Routes, Types
Contexts -> Types
API Routes -> Types
```

## Page Dependencies

### StartPage (src/app/page.tsx)
- `DemoSessionContext` (Compile): initSession 호출
- `next/navigation` (Compile): useRouter
- `framer-motion` (Compile): motion 컴포넌트
- `/api/demo/start` (Runtime): 세션 시작 API 호출

### DemoPage (src/app/demo/page.tsx)
- `DemoSessionContext` (Compile): 전체 상태 관리
- `KiroIDELayout` (Compile): IDE 레이아웃 렌더링
- `next/navigation` (Compile): useRouter, useSearchParams
- `framer-motion` (Compile): 애니메이션

### ResultPage (src/app/result/page.tsx)
- `MVPPreview` (Compile): MVP 미리보기 컴포넌트
- `AWSArchitectureDiagram` (Compile): AWS 아키텍처 다이어그램
- `BusinessWorkflowDiagram` (Compile): 비즈니스 워크플로우
- `EstimateService` (Compile): calculateEstimate 함수
- `next/navigation` (Compile): useRouter, useSearchParams
- `framer-motion` (Compile): AnimatePresence, motion
- `/api/demo/send-report` (Runtime): 이메일 리포트 API

## Component Dependencies

### KiroIDELayout
- `FileExplorer` (Compile): 파일 탐색기 하위 컴포넌트
- `PhaseIndicator` (Compile): 진행 상태 바
- `FileTreeNode` type (Compile): 파일 트리 타입
- `framer-motion` (Compile): 채팅 버블 애니메이션

### AWSArchitectureDiagram
- `mermaid` (Runtime): 동적 import로 다이어그램 렌더링
- `framer-motion` (Compile): 서비스 태그 애니메이션

### MVPPreview
- `framer-motion` (Compile): 레이아웃 애니메이션
- 내부 10개 하위 컴포넌트 (이커머스User/Admin, 예약User/Admin, 학습User/Admin, 채팅User/Admin, 대시보드User/Admin)

### ResultSummary
- `qrcode.react` (Compile): QRCodeSVG 컴포넌트
- `ProductionEstimate` type (Compile): 예상 데이터 타입

## External Dependencies

### Production Dependencies
| Dependency | Version | Purpose | License |
|-----------|---------|---------|---------|
| next | 14.2.0 | 풀스택 React 프레임워크 | MIT |
| react | 18.3.0 | UI 라이브러리 | MIT |
| react-dom | 18.3.0 | DOM 렌더링 | MIT |
| framer-motion | ^11.0.0 | 애니메이션 라이브러리 | MIT |
| mermaid | ^11.12.3 | 다이어그램 렌더링 | MIT |
| qrcode.react | ^3.1.0 | QR 코드 생성 | ISC |
| uuid | ^9.0.0 | UUID 생성 | MIT |

### Development Dependencies
| Dependency | Version | Purpose | License |
|-----------|---------|---------|---------|
| typescript | ^5.4.0 | TypeScript 컴파일러 | Apache-2.0 |
| tailwindcss | ^3.4.0 | CSS 프레임워크 | MIT |
| postcss | ^8.4.0 | CSS 후처리 | MIT |
| autoprefixer | ^10.4.0 | CSS 벤더 프리픽스 | MIT |
| jest | ^30.2.0 | 테스트 러너 | MIT |
| jest-environment-jsdom | ^30.2.0 | DOM 환경 | MIT |
| ts-jest | ^29.4.6 | TS Jest 트랜스포머 | MIT |
| @testing-library/react | ^16.3.2 | React 테스트 | MIT |
| @testing-library/jest-dom | ^6.9.1 | DOM 매처 | MIT |
| @testing-library/user-event | ^14.6.1 | 이벤트 시뮬레이션 | MIT |
| eslint | ^8.0.0 | 린터 | MIT |
| eslint-config-next | 14.2.0 | Next.js ESLint | MIT |
| @types/node | ^20.0.0 | Node.js 타입 | MIT |
| @types/react | ^18.3.0 | React 타입 | MIT |
| @types/react-dom | ^18.3.0 | React DOM 타입 | MIT |
| @types/jest | ^30.0.0 | Jest 타입 | MIT |
| @types/uuid | ^9.0.0 | UUID 타입 | MIT |
