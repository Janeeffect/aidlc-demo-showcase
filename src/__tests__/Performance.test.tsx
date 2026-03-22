/**
 * Unit 3: 품질 개선 - 성능 테스트
 * TC-QI-012 ~ TC-QI-020
 */
import React from 'react';
import { render } from '@testing-library/react';
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

let mockImageUsed = false;
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    mockImageUsed = true;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img data-nextimage="true" {...props} />;
  },
}));

// TC-QI-017, TC-QI-018: 이미지 최적화
describe('이미지 최적화 (US-E01)', () => {
  beforeEach(() => { mockImageUsed = false; });

  it('TC-QI-017: 시작 페이지 KiroLogo가 Next.js Image 사용', async () => {
    const { act } = require('@testing-library/react');
    const StartPage = require('@/app/page').default;
    await act(async () => {
      render(<StartPage />);
    });
    expect(mockImageUsed).toBe(true);
  });

  it('TC-QI-018: KiroIDELayout KiroIcon이 Next.js Image 사용', () => {
    const KiroIDELayout = require('@/components/kiro-ide/KiroIDELayout').default;
    const { container } = render(
      <KiroIDELayout files={[]} activeFile={null} editorContent="" chatMessages={[]} />
    );
    const nextImages = container.querySelectorAll('img[data-nextimage="true"]');
    expect(nextImages.length).toBeGreaterThan(0);
  });
});


// TC-QI-015, TC-QI-016: PhaseIndicator 메모이제이션
describe('PhaseIndicator 메모이제이션 (US-E02)', () => {
  it('TC-QI-015: PhaseIndicator가 React.memo로 래핑', () => {
    const PhaseIndicatorModule = require('@/components/kiro-ide/PhaseIndicator');
    const component = PhaseIndicatorModule.default;
    // React.memo 래핑된 컴포넌트는 $$typeof가 Symbol(react.memo)
    // 또는 displayName에 memo가 포함되거나, type 속성이 존재
    expect(
      component.$$typeof?.toString() === 'Symbol(react.memo)' ||
      component.type !== undefined
    ).toBe(true);
  });

  it('TC-QI-016: phaseConfigs가 useMemo로 메모이제이션', () => {
    // PhaseIndicator 소스 코드에서 useMemo 사용 확인
    const srcPath = path.resolve(__dirname, '../components/kiro-ide/PhaseIndicator.tsx');
    const src = fs.readFileSync(srcPath, 'utf-8');
    expect(src).toContain('useMemo');
    // phaseConfigs가 useMemo 안에 있는지 확인
    expect(src).toMatch(/useMemo\s*\(\s*\(\)\s*=>/);
  });
});


// TC-QI-012, TC-QI-013, TC-QI-014: MVPPreview 코드 스플리팅
describe('MVPPreview 코드 스플리팅 (US-E03)', () => {
  it('TC-QI-012: MVPPreview가 dynamic import 사용', () => {
    const srcPath = path.resolve(__dirname, '../components/ui/MVPPreview.tsx');
    const src = fs.readFileSync(srcPath, 'utf-8');
    expect(src).toContain('dynamic(');
  });

  it('TC-QI-013: 산업별 MVP 파일이 분리되어 존재', () => {
    const basePath = path.resolve(__dirname, '../components/ui/mvp-previews');
    expect(fs.existsSync(path.join(basePath, 'EcommerceMVP.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(basePath, 'BookingMVP.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(basePath, 'LearningMVP.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(basePath, 'ChatMVP.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(basePath, 'DashboardMVP.tsx'))).toBe(true);
  });

  it('TC-QI-014: MVPPreview 로딩 시 shimmer 스켈레톤 표시', () => {
    const srcPath = path.resolve(__dirname, '../components/ui/MVPPreview.tsx');
    const src = fs.readFileSync(srcPath, 'utf-8');
    expect(src).toContain('shimmer');
  });
});


// TC-QI-019: AWSArchitectureDiagram shimmer 로딩
describe('Mermaid 로딩 UX (US-E04)', () => {
  it('TC-QI-019: AWSArchitectureDiagram 로딩 시 shimmer 표시', () => {
    const srcPath = path.resolve(__dirname, '../components/ui/AWSArchitectureDiagram.tsx');
    const src = fs.readFileSync(srcPath, 'utf-8');
    expect(src).toContain('shimmer');
  });
});

// TC-QI-020: Bundle Analyzer 설정
describe('Bundle Analyzer (US-E05)', () => {
  it('TC-QI-020: next.config.js에 bundle-analyzer 설정 존재', () => {
    const configPath = path.resolve(__dirname, '../../next.config.js');
    const config = fs.readFileSync(configPath, 'utf-8');
    expect(config).toContain('withBundleAnalyzer');
    expect(config).toContain('ANALYZE');
  });
});