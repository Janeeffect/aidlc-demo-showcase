# Integration Test Instructions - CR Cycle 3

## Purpose
CR-05~CR-10 변경사항이 기존 기능과 올바르게 통합되는지 검증.

## Test Scenarios

### Scenario 1: 시나리오 선택 -> 데모 -> 결과 E2E 흐름
- **Description**: Screen 1에서 시나리오 선택 후 Screen 2 데모 진행, Screen 3 결과 확인
- **Setup**: `npx next start -p 3001`
- **Test Steps**:
  1. http://localhost:3001 접속
  2. "온라인 쇼핑몰" 클릭 -> "시작" 버튼
  3. 데모 페이지에서 각 단계 진행 (chatSequence 8개+ 확인)
  4. 파일 탐색기에서 파일 클릭 시 콘텐츠 변경 확인 (CR-05)
  5. MousePointer 애니메이션 미표시 확인 (CR-06)
  6. 완료 메시지 "우측 상단" 문구 확인 (CR-09)
  7. 결과 페이지에서 AWS 아키텍처 탭 -> CloudWatch 서비스 확인 (CR-08)
  8. 비즈니스 워크플로우 탭 -> 에러 핸들링 단계 확인 (CR-08)
- **Expected Results**: 모든 단계에서 시나리오별 고유 콘텐츠 표시
- **Cleanup**: 서버 종료

### Scenario 2: 다른 시나리오 선택 시 콘텐츠 분리 확인
- **Description**: fintech 시나리오 선택 후 ecommerce와 다른 콘텐츠 확인
- **Test Steps**:
  1. "결제 게이트웨이" 클릭 -> "시작"
  2. 데모 진행 -> 결과 페이지
  3. AWS 아키텍처: KMS, CloudTrail, Aurora 등 금융 서비스 확인
  4. 비즈니스 워크플로우: 송금 처리 시퀀스 확인
- **Expected Results**: ecommerce와 완전히 다른 콘텐츠

### Scenario 3: 초기 로딩 성능 확인 (CR-10)
- **Description**: 첫 화면 로딩 시간 측정
- **Test Steps**:
  1. 브라우저 DevTools Network 탭 열기
  2. http://localhost:3001 접속
  3. DOMContentLoaded, Load 시간 확인
  4. Google Fonts 외부 요청 없음 확인
- **Expected Results**: 외부 폰트 요청 0건, 로딩 시간 단축

## Manual Verification Checklist
- [ ] 파일 탐색기 클릭 시 콘텐츠 변경됨 (CR-05)
- [ ] MousePointer 애니메이션 없음 (CR-06)
- [ ] 각 단계 채팅 메시지 8개 이상 (CR-07)
- [ ] 결과 화면 보안/모니터링 서비스 표시 (CR-08)
- [ ] 완료 메시지 "우측 상단" 표시 (CR-09)
- [ ] Google Fonts 외부 요청 없음 (CR-10)
