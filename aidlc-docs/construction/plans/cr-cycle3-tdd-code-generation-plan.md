# TDD Code Generation Plan for CR Cycle 3

## Unit Context
- **Workspace Root**: C:\Users\jhyojin\Downloads\aidlc-workshop\aidlc-workshop
- **Project Type**: Brownfield (Next.js 14 + TypeScript)
- **CRs**: CR-05~CR-10

---

### Plan Step 0: 사전 준비
- [x] 0.1: MousePointer.tsx 파일 삭제 (CR-06)
- [x] 0.2: MousePointerHighlight.test.tsx 파일 삭제 (CR-06)
- [x] 0.3: demo/page.tsx에서 MousePointer 관련 import/사용 제거 확인 (CR-06)
- [x] 0.4: 기존 테스트 전체 실행하여 baseline 확인

### Plan Step 1: CR-05 파일 탐색기 콘텐츠 연동 (TDD)
- [x] 1.1: handleFileClick 콘텐츠 매핑 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-001 (파일 클릭 시 고유 콘텐츠 표시) 테스트 작성
  - [x] GREEN: handleFileClick + onFileAdd 로직 수정
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
- [x] 1.2: 파일 전환 콘텐츠 변경 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-002 (다른 파일 클릭 시 콘텐츠 전환) 테스트 작성
  - [x] GREEN: 구현 확인
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
- [x] 1.3: onFileAdd fileContent 저장 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-003 (onFileAdd 시 fileContent 저장) 테스트 작성
  - [x] GREEN: useRunStep 콜백 수정
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인

### Plan Step 2: CR-07 채팅 대화 깊이 강화 (TDD)
- [x] 2.1: 메시지 수 검증 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-006 (각 단계별 최소 8개 메시지) 테스트 작성
  - [x] GREEN: demoStepGenerator.ts chatSequence 확장
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
- [x] 2.2: 다회전 대화 구조 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-007 (user 메시지 2개 이상) 테스트 작성
  - [x] GREEN: 구현 확인
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
- [x] 2.3: 시나리오별 고유 콘텐츠 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-008 (시나리오별 다른 ai 메시지) 테스트 작성
  - [x] GREEN: 구현 확인
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인

### Plan Step 3: CR-08 결과 화면 품질 강화 (TDD)
- [x] 3.1: AIDLCOutputsTab scenarioId 분기 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-009 테스트 작성
  - [x] GREEN: AIDLCOutputsTab에 scenarioId prop 추가 및 분기 구현
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
- [x] 3.2: AWSArchitectureDiagram 강화 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-010 테스트 작성
  - [x] GREEN: 보안/모니터링 레이어 추가
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
- [x] 3.3: BusinessWorkflowDiagram 강화 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-011 테스트 작성
  - [x] GREEN: 예외 처리/에러 핸들링 시퀀스 추가
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인

### Plan Step 4: CR-09 안내 문구 수정 (TDD)
- [x] 4.1: 완료 메시지 문구 변경 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-012 테스트 작성
  - [x] GREEN: useRunStep.ts 문구 수정
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인

### Plan Step 5: CR-10 성능 최적화
- [x] 5.1: Google Fonts -> local font 전환 - RED-GREEN-REFACTOR
  - [x] RED: TC-C3-013 테스트 작성
  - [x] GREEN: layout.tsx 수정
  - [x] REFACTOR: 코드 정리
  - [x] VERIFY: 테스트 통과 확인
- [x] 5.2: framer-motion 최적화 (page.tsx)
  - [x] 구현: local font 전환으로 외부 리소스 의존 제거
  - [x] VERIFY: 빌드 성공 확인

### Plan Step 6: 최종 검증
- [x] 6.1: 전체 테스트 실행 (기존 + 신규)
- [x] 6.2: next build 성공 확인
- [x] 6.3: 회귀 테스트 결과 확인
- [x] 6.4: code-summary.md 생성
