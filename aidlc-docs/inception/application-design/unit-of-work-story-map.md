# Unit of Work - Story Map

## Unit 1: 코드 정리 (7 stories)

| Story ID | Story Title | Epic | Priority |
|----------|------------|------|----------|
| US-B01 | 시나리오 감지 모듈 분리 | B: 코드 품질 | High |
| US-B02 | 데모 단계 생성 모듈 분리 | B: 코드 품질 | High |
| US-B03 | 데모 진행 커스텀 훅 | B: 코드 품질 | High |
| US-B04 | DemoPage 크기 축소 | B: 코드 품질 | Medium |
| US-I01 | 세션 시작 로그 기록 | I: 로그 연동 | Medium |
| US-I02 | 세션 완료 로그 기록 | I: 로그 연동 | Medium |
| US-I03 | 미사용 API Route 삭제 | I: 로그 연동 | Low |

## Unit 2: 핵심 기능 (9 stories)

| Story ID | Story Title | Epic | Priority |
|----------|------------|------|----------|
| US-A01 | 마우스 포인터 시각화 | A: 데모 체험 | High |
| US-A02 | 파일 탐색기 클릭 시뮬레이션 | A: 데모 체험 | High |
| US-A03 | 채팅 입력 타이핑 시뮬레이션 | A: 데모 체험 | High |
| US-A04 | 버튼 클릭 시뮬레이션 | A: 데모 체험 | Medium |
| US-A05 | 탭 전환 시뮬레이션 | A: 데모 체험 | Low |
| US-A06 | 스크롤 시뮬레이션 | A: 데모 체험 | Low |
| US-A07 | Animation Orchestrator 통합 | A: 데모 체험 | High |
| US-D01 | 이메일 전송 실패 피드백 | D: 에러 핸들링 | Medium |
| US-D02 | API 에러 응답 통일 | D: 에러 핸들링 | Medium |

## Unit 3: 품질 개선 (11 stories)

| Story ID | Story Title | Epic | Priority |
|----------|------------|------|----------|
| US-C01 | 키보드 네비게이션 - 시작 페이지 | C: 접근성 | Medium |
| US-C02 | 키보드 네비게이션 - 결과 페이지 탭 | C: 접근성 | Medium |
| US-C03 | 키보드 네비게이션 - 파일 탐색기 | C: 접근성 | Low |
| US-C04 | 스크린 리더 지원 - 채팅 메시지 | C: 접근성 | Medium |
| US-C05 | ARIA 레이블 추가 | C: 접근성 | Medium |
| US-C06 | 색상 대비 개선 | C: 접근성 | Medium |
| US-E01 | 이미지 최적화 | E: 성능 | Medium |
| US-E02 | 컴포넌트 메모이제이션 | E: 성능 | Medium |
| US-E03 | MVPPreview 코드 스플리팅 | E: 성능 | Medium |
| US-E04 | Mermaid 로딩 UX 개선 | E: 성능 | Low |
| US-E05 | 번들 분석 도구 설정 | E: 성능 | Low |

## Unit 4: 신규 기능 (12 stories)

| Story ID | Story Title | Epic | Priority |
|----------|------------|------|----------|
| US-G01 | 언어 전환 토글 UI | G: 다국어 | Medium |
| US-G02 | 언어 설정 영속화 | G: 다국어 | Medium |
| US-G03 | UI 텍스트 번역 - 시작 페이지 | G: 다국어 | Medium |
| US-G04 | UI 텍스트 번역 - 데모 페이지 | G: 다국어 | Medium |
| US-G05 | UI 텍스트 번역 - 결과 페이지 | G: 다국어 | Medium |
| US-G06 | 에러 메시지 다국어 | G: 다국어 | Low |
| US-H01 | 대시보드 메인 통계 | H: 대시보드 | Medium |
| US-H02 | 최근 세션 로그 테이블 | H: 대시보드 | Medium |
| US-H03 | 인기 프로젝트 아이디어 목록 | H: 대시보드 | Medium |
| US-H04 | 산업별 분포 차트 | H: 대시보드 | Medium |
| US-J01 | 세션 추이 차트 | J: 데이터 분석 | Medium |
| US-J02 | 대시보드 다국어 지원 | J: 데이터 분석 | Low |

## Unit 5: 마무리 (1 story + 통합 검증)

| Story ID | Story Title | Epic | Priority |
|----------|------------|------|----------|
| US-F01 | 이메일 리포트 모의 전송 | F: 이메일 | Low |

추가 검증 항목:
- 전체 데모 플로우 E2E 검증
- 기존 + 신규 테스트 전체 통과
- 빌드 성공 확인

---

## Summary

| Unit | Stories | High | Medium | Low |
|------|---------|------|--------|-----|
| Unit 1: 코드 정리 | 7 | 3 | 3 | 1 |
| Unit 2: 핵심 기능 | 9 | 4 | 3 | 2 |
| Unit 3: 품질 개선 | 11 | 0 | 8 | 3 |
| Unit 4: 신규 기능 | 12 | 0 | 10 | 2 |
| Unit 5: 마무리 | 1 | 0 | 0 | 1 |
| **Total** | **40** | **7** | **24** | **9** |

## Coverage Verification

모든 40개 User Stories가 Unit에 할당됨:
- Epic A (7): Unit 2
- Epic B (4): Unit 1
- Epic C (6): Unit 3
- Epic D (2): Unit 2
- Epic E (5): Unit 3
- Epic F (1): Unit 5
- Epic G (6): Unit 4
- Epic H (4): Unit 4
- Epic I (3): Unit 1
- Epic J (2): Unit 4
