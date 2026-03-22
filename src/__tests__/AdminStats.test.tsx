import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
import AdminPage from '@/app/admin/page';

// sessionStorage mock
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

// localStorage mock
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

const mockStatsWithData = {
  totalSessions: 42,
  completedSessions: 35,
  completionRate: 83.3,
  averageDuration: 185000,
  recentLogs: [
    { timestamp: '2026-03-22T10:30:00Z', projectIdea: 'AI 챗봇', completed: true, durationMs: 120000 },
    { timestamp: '2026-03-22T11:00:00Z', projectIdea: '이커머스 플랫폼', completed: false, durationMs: 60000 },
  ],
  industryDistribution: [{ industry: 'IT', count: 10, percentage: 50 }],
  sessionTrend: [{ hour: '10시', count: 5 }],
  popularIdeas: [{ idea: 'AI 챗봇', count: 8 }],
};

const mockStatsEmpty = {
  totalSessions: 0,
  completedSessions: 0,
  completionRate: 0,
  averageDuration: 0,
  recentLogs: [],
  industryDistribution: [],
  sessionTrend: [],
  popularIdeas: [],
};

function setupFetchMock(data: unknown) {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve(data) })
  ) as jest.Mock;
}

async function renderAuthenticatedAdmin() {
  const user = userEvent.setup();
  setupFetchMock(mockStatsWithData);
  render(<LanguageProvider><AdminPage /></LanguageProvider>);
  const input = screen.getByPlaceholderText(/비밀번호/i);
  const button = screen.getByRole('button', { name: /확인/i });
  await user.type(input, 'admin2026');
  await user.click(button);
  await waitFor(() => {
    expect(screen.getByText(/관리자 대시보드/i)).toBeInTheDocument();
  });
}

beforeEach(() => {
  sessionStorageMock.clear();
  localStorageMock.clear();
  jest.clearAllMocks();
});

describe('Admin Statistics Display', () => {
  // TC-NF-015: 통계 카드 4개를 표시한다
  test('TC-NF-015: 통계 카드 4개를 표시한다', async () => {
    await renderAuthenticatedAdmin();
    // 총 세션
    expect(screen.getByText('42')).toBeInTheDocument();
    // 완료 세션
    expect(screen.getByText('35')).toBeInTheDocument();
    // 완료율
    expect(screen.getByText('83.3%')).toBeInTheDocument();
    // 평균 시간 (185000ms = 3m 5s)
    expect(screen.getByText('3m 5s')).toBeInTheDocument();
  });

  // TC-NF-016: 최근 세션 테이블을 표시한다
  test('TC-NF-016: 최근 세션 테이블을 표시한다', async () => {
    await renderAuthenticatedAdmin();
    // 테이블이 존재하는지 확인
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    // 테이블 헤더 컬럼 확인 (columnheader role)
    const headers = screen.getAllByRole('columnheader');
    expect(headers.length).toBe(4);
    // 테이블 내 프로젝트 아이디어 (중복 가능하므로 getAllByText 사용)
    const chatbotCells = screen.getAllByText('AI 챗봇');
    expect(chatbotCells.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('이커머스 플랫폼')).toBeInTheDocument();
    // 상태 표시
    const completedEl = screen.getByText('완료');
    expect(completedEl).toBeInTheDocument();
    expect(screen.getByText('진행 중')).toBeInTheDocument();
  });

  // TC-NF-017: 데이터가 없을 때 빈 상태 메시지를 표시한다
  test('TC-NF-017: 데이터가 없을 때 빈 상태 메시지를 표시한다', async () => {
    const user = userEvent.setup();
    setupFetchMock(mockStatsEmpty);
    render(<LanguageProvider><AdminPage /></LanguageProvider>);
    const input = screen.getByPlaceholderText(/비밀번호/i);
    const button = screen.getByRole('button', { name: /확인/i });
    await user.type(input, 'admin2026');
    await user.click(button);
    await waitFor(() => {
      expect(screen.getByText(/관리자 대시보드/i)).toBeInTheDocument();
    });
    // 빈 상태 메시지 (여러 섹션에서 "데이터가 없습니다" 표시)
    const noDataMessages = screen.getAllByText(/데이터가 없습니다/i);
    expect(noDataMessages.length).toBeGreaterThanOrEqual(1);
  });
});
