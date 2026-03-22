import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import AWSArchitectureDiagram from '@/components/ui/AWSArchitectureDiagram';
import BusinessWorkflowDiagram from '@/components/ui/BusinessWorkflowDiagram';
import { calculateEstimate } from '@/services/EstimateService';

describe('AWSArchitectureDiagram scenarioId 분기', () => {
  test('TC-CR-013: scenarioId=fintech 전달 시 금융 아키텍처 서비스 표시', () => {
    const { container } = render(
      <AWSArchitectureDiagram projectIdea="결제 서비스" scenarioId="fintech" />
    );
    // 금융 관련 서비스가 텍스트에 포함되어야 함
    const text = container.textContent || '';
    expect(text).toContain('KMS');
  });

  test('TC-CR-013b: scenarioId=ecommerce 전달 시 이커머스 아키텍처 서비스 표시', () => {
    const { container } = render(
      <AWSArchitectureDiagram projectIdea="온라인 쇼핑몰" scenarioId="ecommerce" />
    );
    const text = container.textContent || '';
    expect(text).toContain('SQS');
  });

  test('TC-CR-013c: scenarioId 없이 호출 시 기존 키워드 분기 fallback', () => {
    const { container } = render(
      <AWSArchitectureDiagram projectIdea="온라인 쇼핑몰" />
    );
    // 렌더링 에러 없이 정상 동작
    expect(container).toBeTruthy();
  });
});

describe('BusinessWorkflowDiagram scenarioId 분기', () => {
  test('TC-CR-014: scenarioId=fintech 전달 시 송금 시퀀스 표시', () => {
    const { container } = render(
      <BusinessWorkflowDiagram projectIdea="결제 서비스" scenarioId="fintech" />
    );
    const text = container.textContent || '';
    expect(text).toContain('송금');
  });

  test('TC-CR-014b: scenarioId=ecommerce 전달 시 주문 시퀀스 표시', () => {
    const { container } = render(
      <BusinessWorkflowDiagram projectIdea="온라인 쇼핑몰" scenarioId="ecommerce" />
    );
    const text = container.textContent || '';
    expect(text).toContain('주문');
  });
});

describe('EstimateService scenarioId 분기', () => {
  test('TC-CR-015: scenarioId=ecommerce 전달 시 고정 Estimate 반환', () => {
    const result = calculateEstimate('온라인 쇼핑몰', 'ecommerce');
    expect(result.developmentDays).toBe(75);
    expect(result.teamSize).toBe(8);
    expect(result.complexity).toBe('high');
  });

  test('TC-CR-016: 동일 scenarioId로 반복 호출 시 동일 결과', () => {
    const result1 = calculateEstimate('온라인 쇼핑몰', 'ecommerce');
    const result2 = calculateEstimate('온라인 쇼핑몰', 'ecommerce');
    expect(result1.developmentDays).toBe(result2.developmentDays);
    expect(result1.teamSize).toBe(result2.teamSize);
    expect(result1.aiSavedDays).toBe(result2.aiSavedDays);
    expect(result1.aiSavedPercentage).toBe(result2.aiSavedPercentage);
  });

  test('TC-CR-017: scenarioId 없이 호출 시 기존 키워드 분석 fallback', () => {
    const result = calculateEstimate('온라인 쇼핑몰');
    // 기존 로직: 키워드 분석 기반 결과 반환
    expect(result.developmentDays).toBeGreaterThan(0);
    expect(result.teamSize).toBeGreaterThan(0);
  });

  test('TC-CR-015b: scenarioId=fintech 전달 시 고정 Estimate 반환', () => {
    const result = calculateEstimate('결제 서비스', 'fintech');
    expect(result.developmentDays).toBe(90);
    expect(result.teamSize).toBe(10);
    expect(result.complexity).toBe('high');
  });
});
