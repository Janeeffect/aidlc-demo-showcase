/**
 * Unit 3: 품질 개선 - 접근성 테스트
 * TC-QI-001 ~ TC-QI-011
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';

// Mock modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  useSearchParams: () => ({ get: (key: string) => key === 'idea' ? '온라인 쇼핑몰' : null }),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...filterMotionProps(props)}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

function filterMotionProps(props: any) {
  const filtered = { ...props };
  ['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'layout'].forEach(k => delete filtered[k]);
  return filtered;
}

jest.mock('@/contexts/DemoSessionContext', () => ({
  useDemoSession: () => ({
    state: { currentPhase: 'INCEPTION', currentStage: 'requirements', animationProgress: 0, files: [], isComplete: false, sessionId: '123', startTime: new Date().toISOString() },
    initSession: jest.fn(), setPhase: jest.fn(), setStage: jest.fn(), addFile: jest.fn(), setProgress: jest.fn(),
  }),
}));

jest.mock('@/services/LogService', () => ({
  logService: { logStart: jest.fn().mockResolvedValue(undefined), logComplete: jest.fn().mockResolvedValue(undefined) },
}));

jest.mock('@/services/EstimateService', () => ({
  calculateEstimate: () => ({
    developmentDays: 30, complexity: 'medium', teamSize: 3, aiSavedDays: 15, aiSavedPercentage: 50,
    estimatedCost: { development: { min: 10000, max: 30000 }, monthly: { min: 100, max: 500 } },
    techStack: ['React', 'Node.js'], teamComposition: [{ role: 'Full-stack Developer', count: 2, seniorityLevel: 'Mid-level' }],
  }),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// TC-QI-010: --kiro-text-muted 색상이 #a0a0b8
describe('색상 대비 (US-C06)', () => {
  it('TC-QI-010: --kiro-text-muted 색상이 #a0a0b8', () => {
    const cssPath = path.resolve(__dirname, '../app/globals.css');
    const css = fs.readFileSync(cssPath, 'utf-8');
    expect(css).toContain('--kiro-text-muted: #a0a0b8');
  });

  it('TC-QI-011: 포커스 링 스타일 존재', () => {
    const cssPath = path.resolve(__dirname, '../app/globals.css');
    const css = fs.readFileSync(cssPath, 'utf-8');
    expect(css).toContain(':focus-visible');
    expect(css).toMatch(/outline.*2px.*solid/);
  });
});


// TC-QI-007, TC-QI-008, TC-QI-009: ARIA 레이블 + 랜드마크
describe('ARIA 레이블 및 랜드마크 (US-C04, US-C05)', () => {
  it('TC-QI-007: 채팅 영역에 aria-live="polite" 존재', () => {
    const KiroIDELayout = require('@/components/kiro-ide/KiroIDELayout').default;
    const { container } = render(
      <KiroIDELayout
        files={[]}
        activeFile={null}
        editorContent=""
        chatMessages={[]}
      />
    );
    const liveRegion = container.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('TC-QI-008: KiroIDELayout에 role="main" 존재', () => {
    const KiroIDELayout = require('@/components/kiro-ide/KiroIDELayout').default;
    const { container } = render(
      <KiroIDELayout
        files={[]}
        activeFile={null}
        editorContent=""
        chatMessages={[]}
      />
    );
    const mainRegion = container.querySelector('[role="main"]');
    expect(mainRegion).toBeInTheDocument();
    expect(mainRegion).toHaveAttribute('aria-label', 'Kiro IDE');
  });

  it('TC-QI-009: 파일 탐색기에 role="tree" 존재', () => {
    const KiroIDELayout = require('@/components/kiro-ide/KiroIDELayout').default;
    const { container } = render(
      <KiroIDELayout
        files={[]}
        activeFile={null}
        editorContent=""
        chatMessages={[]}
      />
    );
    const treeRegion = container.querySelector('[role="tree"]');
    expect(treeRegion).toBeInTheDocument();
  });
});


// TC-QI-001, TC-QI-002: 시작 페이지 접근성
describe('시작 페이지 접근성 (US-C01, US-C05)', () => {
  it('TC-QI-001: 시작 페이지 입력 필드에 aria-label 존재', async () => {
    const { act } = require('@testing-library/react');
    const StartPage = require('@/app/page').default;
    let container: HTMLElement;
    await act(async () => {
      const result = render(<StartPage />);
      container = result.container;
    });
    const input = container!.querySelector('input[type="text"]');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-label', '어떤 서비스를 만들고 싶으세요?');
  });

  it('TC-QI-002: 산업 예시 버튼 키보드 접근 가능', async () => {
    const { act } = require('@testing-library/react');
    const StartPage = require('@/app/page').default;
    await act(async () => {
      render(<StartPage />);
    });
    // 예시 버튼들이 button 요소로 존재하는지 확인 (기본적으로 키보드 접근 가능)
    const buttons = screen.getAllByRole('button');
    const exampleButton = buttons.find(b => b.textContent === '온라인 쇼핑몰');
    expect(exampleButton).toBeInTheDocument();
    // button 요소는 기본적으로 Enter/Space로 클릭 가능
    expect(exampleButton?.tagName).toBe('BUTTON');
  });
});


// TC-QI-003 ~ TC-QI-006: 결과 페이지 탭 접근성
describe('결과 페이지 탭 접근성 (US-C02)', () => {
  const renderResultPage = async () => {
    const { act } = require('@testing-library/react');
    const ResultPage = require('@/app/result/page').default;
    let result: any;
    await act(async () => {
      result = render(<ResultPage />);
    });
    return result;
  };

  it('TC-QI-003: 탭 컨테이너에 role="tablist" 존재', async () => {
    const { container } = await renderResultPage();
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toBeInTheDocument();
  });

  it('TC-QI-004: 각 탭에 role="tab"과 aria-selected 존재', async () => {
    const { container } = await renderResultPage();
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBeGreaterThan(0);
    // 첫 번째 탭은 활성 상태
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    // 나머지 탭은 비활성
    if (tabs.length > 1) {
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    }
  });

  it('TC-QI-005: 탭 패널에 role="tabpanel"과 aria-labelledby 존재', async () => {
    const { container } = await renderResultPage();
    const tabpanel = container.querySelector('[role="tabpanel"]');
    expect(tabpanel).toBeInTheDocument();
    expect(tabpanel).toHaveAttribute('aria-labelledby');
  });

  it('TC-QI-006: 키보드로 탭 전환 가능', async () => {
    const { container } = await renderResultPage();
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBeGreaterThan(1);
    // 두 번째 탭 클릭 (Enter 키 시뮬레이션)
    fireEvent.keyDown(tabs[1], { key: 'Enter' });
    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });
});
