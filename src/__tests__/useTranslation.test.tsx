import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
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

// 테스트용 컴포넌트
function TestComponent() {
  const { t, locale, setLocale } = useTranslation();
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="translation">{t('start.inputLabel')}</span>
      <span data-testid="missing">{t('nonexistent.key')}</span>
      <button data-testid="switch-en" onClick={() => setLocale('en')}>EN</button>
      <button data-testid="switch-ko" onClick={() => setLocale('ko')}>KO</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <LanguageProvider>
      <TestComponent />
    </LanguageProvider>
  );
}

beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
});

describe('useTranslation Hook', () => {
  // TC-NF-001: 기본 locale이 'ko'이다
  test('TC-NF-001: 기본 locale이 ko이다', () => {
    renderWithProvider();
    expect(screen.getByTestId('locale').textContent).toBe('ko');
  });

  // TC-NF-002: dot notation 키로 한국어 번역을 반환한다
  test('TC-NF-002: 한국어 번역을 반환한다', () => {
    renderWithProvider();
    expect(screen.getByTestId('translation').textContent).toBe('어떤 서비스를 만들고 싶으세요?');
  });

  // TC-NF-003: dot notation 키로 영어 번역을 반환한다
  test('TC-NF-003: 영어 번역을 반환한다', async () => {
    renderWithProvider();
    await act(async () => {
      await userEvent.click(screen.getByTestId('switch-en'));
    });
    expect(screen.getByTestId('translation').textContent).toBe('What service would you like to build?');
  });

  // TC-NF-004: 존재하지 않는 키는 키 문자열을 반환한다
  test('TC-NF-004: 존재하지 않는 키는 키 문자열을 반환한다', () => {
    renderWithProvider();
    expect(screen.getByTestId('missing').textContent).toBe('nonexistent.key');
  });

  // TC-NF-005: setLocale로 언어를 변경할 수 있다
  test('TC-NF-005: setLocale로 언어를 변경할 수 있다', async () => {
    renderWithProvider();
    expect(screen.getByTestId('locale').textContent).toBe('ko');
    await act(async () => {
      await userEvent.click(screen.getByTestId('switch-en'));
    });
    expect(screen.getByTestId('locale').textContent).toBe('en');
  });

  // TC-NF-006: 언어 변경 시 localStorage에 저장된다
  test('TC-NF-006: 언어 변경 시 localStorage에 저장된다', async () => {
    renderWithProvider();
    await act(async () => {
      await userEvent.click(screen.getByTestId('switch-en'));
    });
    expect(localStorageMock.setItem).toHaveBeenCalledWith('aidlc-locale', 'en');
  });
});
