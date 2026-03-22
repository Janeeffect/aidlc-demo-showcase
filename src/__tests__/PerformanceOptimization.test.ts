/**
 * CR-10: 성능 최적화 테스트
 * TC-C3-013: 로컬 폰트 사용 확인
 */

describe('CR-10: 성능 최적화', () => {
  it('TC-C3-013: layout.tsx에서 Google Fonts 미사용, next/font/local 사용', () => {
    const fs = require('fs');
    const path = require('path');
    const sourceCode = fs.readFileSync(
      path.resolve(__dirname, '../app/layout.tsx'),
      'utf-8'
    );

    // Google Fonts import가 없어야 함
    expect(sourceCode).not.toMatch(/from\s+['"]next\/font\/google['"]/);
    // next/font/local 사용해야 함
    expect(sourceCode).toMatch(/from\s+['"]next\/font\/local['"]/);
  });
});
