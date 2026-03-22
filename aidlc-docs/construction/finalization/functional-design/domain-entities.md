# Domain Entities - Unit 5: 마무리 (Finalization)

## 1. 변경 없음

Unit 5에서는 새로운 도메인 엔티티를 추가하지 않습니다.
기존 엔티티(DemoLog, LogRequest, IndustryDistribution 등)를 그대로 사용합니다.

## 2. 다국어 적용 대상 컴포넌트 매핑

### 번역 키 -> 컴포넌트 매핑

| 번역 키 네임스페이스 | 대상 컴포넌트 | 상태 |
|---------------------|-------------|------|
| `result.tabs.*` | ResultPageContent 탭 | Unit 4 완료 |
| `result.estimate.*` | EstimateTab | Unit 5 적용 대상 |
| `result.email.*` | EmailReportModal | Unit 5 적용 대상 |
| `result.aidlcOutputs.*` | AIDLCOutputsTab | Unit 5 적용 대상 |
| `result.kiro.*` | KiroIntroTab | Unit 5 적용 대상 |
| `result.summary.*` | ResultSummary | Unit 5 적용 대상 |

### 기존 번역 키 (ko.ts/en.ts에 이미 정의됨)

모든 번역 키는 Unit 4 Step 3에서 이미 ko.ts/en.ts에 정의 완료.
Unit 5에서는 컴포넌트 코드에 `t()` 호출만 추가하면 됩니다.
