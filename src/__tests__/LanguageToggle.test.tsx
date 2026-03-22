import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useTranslation } from '@/i18n';

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

// locale 표시용 헬퍼 컴포넌트
function LocaleDisplay() {
  const { locale } = useTranslation();
  return <span data-testid="current-locale">{locale}</span>;
}

function renderToggle() {
  return render(
    <LanguageProvider>
      <LanguageToggle />
      <LocaleDisplay />
    </LanguageProvider>
  );
}

beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
});

describe('LanguageToggle Component', () => {
  // TC-NF-007: 한국어 모드에서 "EN" 버튼을 표시한다
  test('TC-NF-007: 한국어 모드에서 EN 버튼을 표시한다', () => {
    renderToggle();
    const button = screen.getByRole('button');
    expect(button.textContent).toBe('EN');
  });

  // TC-NF-008: 영어 모드에서 "KO" 버튼을 표시한다
  test('TC-NF-008: 영어 모드에서 KO 버튼을 표시한다', async () => {
    renderToggle();
    const button = screen.getByRole('button');
    await act(async () => {
      await userEvent.click(button);
    });
    expect(screen.getByRole('button').textContent).toBe('KO');
  });

  // TC-NF-009: 클릭 시 언어가 전환된다
  test('TC-NF-009: 클릭 시 언어가 전환된다', async () => {
    renderToggle();
    expect(screen.getByTestId('current-locale').textContent).toBe('ko');
    await act(async () => {
      await userEvent.click(screen.getByRole('button'));
    });
    expect(screen.getByTestId('current-locale').textContent).toBe('en');
  });
});
