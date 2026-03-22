import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AdminPage from '@/app/admin/page';

const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: jest.fn((key: string) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      totalSessions: 10, completedSessions: 8, completionRate: 80,
      averageDuration: 100000, recentLogs: [],
      industryDistribution: [], sessionTrend: [], popularIdeas: [],
    }),
  })
) as jest.Mock;

beforeEach(() => {
  sessionStorageMock.clear();
  localStorageMock.clear();
  jest.clearAllMocks();
});

describe('Admin i18n', () => {
  // TC-NF-024: 관리자 대시보드가 다국어를 지원한다
  test('TC-NF-024: 관리자 대시보드가 다국어를 지원한다', async () => {
    // locale을 'en'으로 설정
    localStorageMock.setItem('aidlc-locale', 'en');
    const user = userEvent.setup();
    render(<LanguageProvider><AdminPage /></LanguageProvider>);
    // 영어 비밀번호 화면
    const input = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole('button', { name: /confirm|submit/i });
    await user.type(input, 'admin2026');
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });
    // 영어 레이블 확인
    expect(screen.getByText(/Total Sessions/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed$/i)).toBeInTheDocument();
  });
});
