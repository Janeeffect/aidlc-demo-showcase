import ko from '@/i18n/ko';
import en from '@/i18n/en';

// 재귀적으로 모든 leaf 키를 추출
function extractKeys(obj: unknown, prefix = ''): string[] {
  const keys: string[] = [];
  if (obj && typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'string') {
        keys.push(fullKey);
      } else if (typeof value === 'object' && value !== null) {
        keys.push(...extractKeys(value, fullKey));
      }
    }
  }
  return keys;
}

const REQUIRED_NAMESPACES = ['common', 'start', 'demo', 'result', 'admin'];

describe('Translation Coverage', () => {
  // TC-NF-010: 한국어 번역 맵에 모든 필수 키가 존재한다
  test('TC-NF-010: 한국어 번역 맵에 모든 필수 네임스페이스가 존재한다', () => {
    for (const ns of REQUIRED_NAMESPACES) {
      expect(ko).toHaveProperty(ns);
      expect(typeof ko[ns]).toBe('object');
    }
    // 주요 키 존재 확인
    const koKeys = extractKeys(ko);
    expect(koKeys).toContain('start.inputLabel');
    expect(koKeys).toContain('demo.nextStep');
    expect(koKeys).toContain('result.tabs.mvp');
    expect(koKeys).toContain('admin.title');
    expect(koKeys).toContain('common.error.sendFailed');
  });

  // TC-NF-011: 영어 번역 맵이 한국어와 동일한 키 구조를 가진다
  test('TC-NF-011: 영어 번역 맵이 한국어와 동일한 키 구조를 가진다', () => {
    const koKeys = extractKeys(ko).sort();
    const enKeys = extractKeys(en).sort();
    expect(enKeys).toEqual(koKeys);
  });
});
