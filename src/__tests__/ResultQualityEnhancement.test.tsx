/**
 * CR-08: 결과 화면 품질 강화 테스트
 * TC-C3-009: AIDLCOutputsTab scenarioId 기반 분기
 * TC-C3-010: AWSArchitectureDiagram 보안/모니터링 레이어
 * TC-C3-011: BusinessWorkflowDiagram 예외 처리 포함
 */

import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => <div ref={ref} {...props}>{children}</div>),
    g: React.forwardRef(({ children, ...props }: any, ref: any) => <g ref={ref} {...props}>{children}</g>),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock mermaid
jest.mock('mermaid', () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    render: jest.fn().mockResolvedValue({ svg: '<svg></svg>' }),
  },
}));

// Mock i18n
jest.mock('@/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'ko',
  }),
}));

import AWSArchitectureDiagram from '@/components/ui/AWSArchitectureDiagram';
import BusinessWorkflowDiagram from '@/components/ui/BusinessWorkflowDiagram';

describe('CR-08: 결과 화면 품질 강화', () => {
  describe('TC-C3-010: AWSArchitectureDiagram 보안/모니터링 레이어', () => {
    it('fintech 시나리오에 보안 서비스(KMS, CloudTrail, WAF) 포함', () => {
      render(<AWSArchitectureDiagram projectIdea="결제 게이트웨이" scenarioId="fintech" />);

      // 보안 관련 서비스가 서비스 목록에 표시되어야 함
      expect(screen.getByText('KMS')).toBeInTheDocument();
      expect(screen.getByText('CloudTrail')).toBeInTheDocument();
      expect(screen.getByText('WAF')).toBeInTheDocument();
    });

    it('ecommerce 시나리오에 모니터링 서비스 포함', () => {
      render(<AWSArchitectureDiagram projectIdea="온라인 쇼핑몰" scenarioId="ecommerce" />);

      // ecommerce에도 보안/모니터링 서비스가 포함되어야 함
      expect(screen.getByText('WAF')).toBeInTheDocument();
      expect(screen.getByText('CloudWatch')).toBeInTheDocument();
    });
  });

  describe('TC-C3-011: BusinessWorkflowDiagram 예외 처리 포함', () => {
    it('ecommerce 시나리오에 에러 핸들링 단계 포함', () => {
      render(<BusinessWorkflowDiagram projectIdea="온라인 쇼핑몰" scenarioId="ecommerce" />);

      // 예외 처리 또는 에러 핸들링 관련 텍스트가 있어야 함
      const svgText = document.querySelector('svg')?.textContent || '';
      const hasErrorHandling = svgText.includes('실패') || svgText.includes('에러') || svgText.includes('롤백') || svgText.includes('재시도');
      expect(hasErrorHandling).toBe(true);
    });

    it('fintech 시나리오에 보안 검증 단계 포함', () => {
      render(<BusinessWorkflowDiagram projectIdea="결제 게이트웨이" scenarioId="fintech" />);

      const svgText = document.querySelector('svg')?.textContent || '';
      const hasSecurityStep = svgText.includes('검증') || svgText.includes('암호화') || svgText.includes('감사');
      expect(hasSecurityStep).toBe(true);
    });
  });
});
