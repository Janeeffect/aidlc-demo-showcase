# Unit of Work Dependencies

## 의존성 매트릭스

| Unit | 의존 대상 | 의존 유형 | 필수/권장 |
|------|----------|----------|----------|
| Unit 1: 코드 정리 | 없음 | - | - |
| Unit 2: 핵심 기능 | Unit 1 | 리팩토링된 DemoPage, useRunStep 훅 | 필수 |
| Unit 3: 품질 개선 | Unit 1 | 리팩토링된 컴포넌트 구조 | 필수 |
| Unit 4: 신규 기능 | Unit 1, Unit 3 | log 연동, 접근성 적용된 컴포넌트 | Unit 1 필수, Unit 3 권장 |
| Unit 5: 마무리 | Unit 1~4 | 전체 기능 완료 | 필수 |

## 의존성 다이어그램

```
Unit 1: 코드 정리
    |
    +---> Unit 2: 핵심 기능
    |         |
    |         +---> Unit 5: 마무리
    |
    +---> Unit 3: 품질 개선
    |         |
    |         +---> Unit 4: 신규 기능
    |                   |
    |                   +---> Unit 5: 마무리
    |
    +---> Unit 5: 마무리
```

### Text Alternative
- Unit 1은 기반 작업으로 의존성 없음
- Unit 2, 3은 Unit 1에 의존 (병렬 가능)
- Unit 4는 Unit 1 필수, Unit 3 권장
- Unit 5는 모든 Unit 완료 후 실행

## 병렬 실행 가능성

| 조합 | 병렬 가능 | 비고 |
|------|----------|------|
| Unit 2 + Unit 3 | 가능 | 둘 다 Unit 1에만 의존, 수정 파일 겹침 최소 |
| Unit 2 + Unit 4 | 부분 가능 | Unit 4의 다국어가 Unit 2의 에러 메시지에 영향 |
| Unit 3 + Unit 4 | 부분 가능 | Unit 4의 다국어가 Unit 3의 접근성 컴포넌트에 적용 |

## 공유 파일 충돌 분석

| 파일 | Unit 1 | Unit 2 | Unit 3 | Unit 4 | 충돌 위험 |
|------|--------|--------|--------|--------|----------|
| `src/app/demo/page.tsx` | 리팩토링 | Animation | 접근성 | 다국어 | 높음 (순차 필수) |
| `src/app/page.tsx` | log 연동 | - | 접근성 | 다국어 | 중간 |
| `src/app/result/page.tsx` | log 연동 | 에러 핸들링 | 접근성/탭 | 다국어 | 높음 (순차 필수) |
| `src/app/globals.css` | - | - | 포커스/대비 | - | 낮음 |
| `src/app/layout.tsx` | - | - | Image | Language Provider | 낮음 |

## 권장 실행 순서

```
Phase 1: Unit 1 (코드 정리) - 기반 작업, 단독 실행
    |
Phase 2: Unit 2 (핵심 기능) - Animation + 에러 핸들링
    |
Phase 3: Unit 3 (품질 개선) - 접근성 + 성능
    |
Phase 4: Unit 4 (신규 기능) - 대시보드 + 다국어
    |
Phase 5: Unit 5 (마무리) - 통합 검증
```

순차 실행 권장 이유: `demo/page.tsx`, `result/page.tsx` 등 핵심 파일이 여러 Unit에서 수정되므로, 충돌 방지를 위해 순차 실행이 안전함.
