import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AdminPage from '@/app/admin/page';

// localStorage / sessionStorage mock
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

// fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      totalSessions: 5,
      completedSessions: 3,
      completionRate: 60,
      averageDuration: 120000,
      recentLogs: [],
      industryDistribution: [],
      sessionTrend: [],
      popularIdeas: [],
    }),
  })
) as jest.Mock;

// Next.js router mock
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}));

function renderAdmin() {
  return render(
    <LanguageProvider>
      <AdminPage />
    </LanguageProvider>
  );
}

beforeEach(() => {
  localStorageMock.clear();
  sessionStorageMock.clear();
  jest.clearAllMocks();
});

describe('Admin Authentication', () => {
  // TC-NF-012: 미인증 시 비밀번호 입력 화면을 표시한다
  test('TC-NF-012: 미인증 시 비밀번호 입력 화면을 표시한다', () => {
    renderAdmin();
    expect(screen.getByPlaceholderText(/비밀번호/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /확인/i })).toBeInTheDocument();
  });

  // TC-NF-013: 올바른 비밀번호로 인증에 성공한다
  test('TC-NF-013: 올바른 비밀번호로 인증에 성공한다', async () => {
    const user = userEvent.setup();
    renderAdmin();
    const input = screen.getByPlaceholderText(/비밀번호/i);
    const button = screen.getByRole('button', { name: /확인/i });
    await user.type(input, 'admin2026');
    await user.click(button);
    // 인증 후 대시보드 제목이 표시되어야 함 (fetch 비동기 대기)
    await waitFor(() => {
      expect(screen.getByText(/관리자 대시보드/i)).toBeInTheDocument();
    });
  });

  // TC-NF-014: 잘못된 비밀번호로 에러 메시지를 표시한다
  test('TC-NF-014: 잘못된 비밀번호로 에러 메시지를 표시한다', async () => {
    renderAdmin();
    const input = screen.getByPlaceholderText(/비밀번호/i);
    const button = screen.getByRole('button', { name: /확인/i });
    await act(async () => {
      await userEvent.type(input, 'wrongpassword');
      await userEvent.click(button);
    });
    expect(screen.getByText(/올바르지 않습니다/i)).toBeInTheDocument();
  });
});
