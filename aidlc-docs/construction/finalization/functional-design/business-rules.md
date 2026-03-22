# Business Rules - Unit 5: 마무리 (Finalization)

## 1. 다국어 적용 규칙

### BR-FIN-001: 하위 컴포넌트 다국어 일관성
- 모든 사용자 대면 텍스트는 `t()` 함수를 통해 렌더링
- 데모 콘텐츠(AIDLCOutputsTab 산출물 본문)는 한국어 유지
- KiroIntroTab 비교표의 기능명은 다국어 적용, 체크마크/아이콘은 유지

### BR-FIN-002: translateRole/translateSeniority 다국어 전환
- locale === 'ko': 한국어 역할명/직급명 반환
- locale === 'en': 영어 원문 반환
- 매핑에 없는 값: 원문 그대로 반환 (fallback)

### BR-FIN-003: EmailReportModal 다국어
- 폼 레이블, 버튼 텍스트, 성공/에러 메시지 모두 t() 적용
- 성공 메시지의 `{email}` placeholder는 실제 이메일로 치환
- placeholder 텍스트도 다국어 적용

## 2. 이메일 리포트 규칙 (REQ-B05 유지)

### BR-FIN-004: 이메일 리포트 모의 구현
- POST /api/demo/send-report는 항상 성공 응답 반환
- 응답 형식: `{ success: true, message: string, logId: string }`
- 에러 시: `{ success: false, message: string }` (status 500)
- API 인터페이스는 향후 SES 연동 시 변경 불필요

## 3. 통합 검증 규칙

### BR-FIN-005: 전체 테스트 통과
- 기존 28 suites + 신규 테스트 전체 PASS
- next build SUCCESS
- 모든 static pages 정상 생성
