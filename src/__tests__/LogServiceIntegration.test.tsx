/**
 * LogService Integration Tests
 * TC-CU-028: StartPage에서 logStart 호출 확인
 * TC-CU-029: ResultPage에서 logComplete 호출 확인
 * TC-CU-030: LogService 실패 시 데모 진행 무영향
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { logService } from '@/services/LogService';

// Mock next/navigation
const mockPush = jest.fn();
const mockBack = jest.fn();
const mockSearchParams = new URLSearchParams('idea=온라인 쇼핑몰');

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  useSearchParams: () => mockSearchParams,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterDomProps(props)}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...filterDomProps(props)}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

function filterDomProps(props: any) {
  const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
  return rest;
}

// Mock DemoSessionContext
const mockInitSession = jest.fn();
jest.mock('@/contexts/DemoSessionContext', () => ({
  useDemoSession: () => ({
    state: {
      sessionId: 'test-session-123',
      projectIdea: '온라인 쇼핑몰',
      startTime: new Date('2026-03-22T10:00:00Z'),
    },
    initSession: mockInitSession,
  }),
}));

// Mock LogService
jest.mock('@/services/LogService', () => ({
  logService: {
    logStart: jest.fn().mockResolvedValue(undefined),
    logComplete: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock fetch globally
global.fetch = jest.fn().mockResolvedValue({ ok: true });

// Mock EstimateService
jest.mock('@/services/EstimateService', () => ({
  calculateEstimate: () => ({
    developmentDays: 30,
    complexity: 'medium',
    teamSize: 3,
    aiSavedDays: 10,
    aiSavedPercentage: 33,
    estimatedCost: { development: { min: 10000, max: 20000 }, monthly: { min: 100, max: 500 } },
    techStack: ['Next.js', 'TypeScript'],
    teamComposition: [],
  }),
}));

describe('TC-CU-028: StartPage에서 logStart 호출 확인', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('시작 버튼 클릭 시 logService.logStart가 fire-and-forget으로 호출된다', async () => {
    const StartPage = require('@/app/page').default;
    
    await act(async () => {
      render(<StartPage />);
    });

    const input = screen.getByPlaceholderText('예: 온라인 쇼핑몰');
    await act(async () => {
      fireEvent.change(input, { target: { value: '온라인 쇼핑몰' } });
    });

    const button = screen.getByText('AI-DLC 시작하기');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(logService.logStart).toHaveBeenCalledWith(
      expect.any(String),
      '온라인 쇼핑몰',
      undefined
    );
  });
});

describe('TC-CU-029: ResultPage에서 logComplete 호출 확인', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('페이지 마운트 시 logService.logComplete가 fire-and-forget으로 호출된다', async () => {
    const ResultPage = require('@/app/result/page').default;

    await act(async () => {
      render(<ResultPage />);
    });

    expect(logService.logComplete).toHaveBeenCalledWith(
      expect.any(String),
      '온라인 쇼핑몰',
      expect.any(Number)
    );
  });
});

describe('TC-CU-030: LogService 실패 시 데모 진행 무영향', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logStart 실패해도 데모 페이지로 정상 라우팅된다', async () => {
    (logService.logStart as jest.Mock).mockRejectedValue(new Error('Network error'));

    const StartPage = require('@/app/page').default;

    await act(async () => {
      render(<StartPage />);
    });

    const input = screen.getByPlaceholderText('예: 온라인 쇼핑몰');
    await act(async () => {
      fireEvent.change(input, { target: { value: '온라인 쇼핑몰' } });
    });

    const button = screen.getByText('AI-DLC 시작하기');
    await act(async () => {
      fireEvent.click(button);
    });

    // logStart 실패해도 라우팅은 정상 진행
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/demo?idea=')
    );
  });
});
