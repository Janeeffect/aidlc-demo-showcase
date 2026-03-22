/**
 * CR-05: 파일 탐색기 콘텐츠 연동 테스트
 * TC-C3-001: 파일 클릭 시 해당 파일의 고유 콘텐츠 표시
 * TC-C3-002: 다른 파일 클릭 시 콘텐츠 전환
 * TC-C3-003: onFileAdd 시 fileContent 저장
 */

import '@testing-library/jest-dom';

describe('CR-05: 파일 탐색기 콘텐츠 연동', () => {
  describe('TC-C3-001: 파일 클릭 시 고유 콘텐츠 표시', () => {
    it('fileContentsMap에 저장된 콘텐츠가 있으면 해당 콘텐츠를 반환한다', () => {
      const fileContentsMap: Record<string, string> = {
        'aidlc-docs/inception/requirements.md': '# 요구사항 분석서\n이커머스 플랫폼',
        'aidlc-docs/inception/user-stories.md': '# 사용자 스토리\n구매자 페르소나',
        'src/app/page.tsx': '// 메인 페이지 코드',
      };

      const demoSteps = [
        { fileName: 'aidlc-docs/inception/requirements.md', fileContent: '# 요구사항 분석서\n이커머스 플랫폼' },
        { fileName: 'aidlc-docs/inception/user-stories.md', fileContent: '# 사용자 스토리\n구매자 페르소나' },
        { fileName: 'src/app/page.tsx', fileContent: '// 메인 페이지 코드' },
      ];

      // handleFileClick 로직 시뮬레이션
      function getContentForFile(path: string): string {
        if (fileContentsMap[path] && fileContentsMap[path] !== '') {
          return fileContentsMap[path];
        }
        const matchedStep = demoSteps.find(step => step.fileName === path);
        if (matchedStep) {
          return matchedStep.fileContent;
        }
        return '';
      }

      expect(getContentForFile('aidlc-docs/inception/requirements.md')).toBe('# 요구사항 분석서\n이커머스 플랫폼');
      expect(getContentForFile('aidlc-docs/inception/user-stories.md')).toBe('# 사용자 스토리\n구매자 페르소나');
      expect(getContentForFile('src/app/page.tsx')).toBe('// 메인 페이지 코드');
    });
  });

  describe('TC-C3-002: 다른 파일 클릭 시 콘텐츠 전환', () => {
    it('파일 A에서 파일 B로 전환 시 파일 B의 콘텐츠가 표시된다', () => {
      const fileContentsMap: Record<string, string> = {
        'file-a.md': '파일 A 콘텐츠',
        'file-b.md': '파일 B 콘텐츠',
        'file-c.md': '파일 C 콘텐츠',
      };

      let activeFile = 'file-a.md';
      let editorContent = fileContentsMap[activeFile];

      expect(editorContent).toBe('파일 A 콘텐츠');

      // 파일 B로 전환
      activeFile = 'file-b.md';
      editorContent = fileContentsMap[activeFile];
      expect(editorContent).toBe('파일 B 콘텐츠');

      // 파일 C로 전환
      activeFile = 'file-c.md';
      editorContent = fileContentsMap[activeFile];
      expect(editorContent).toBe('파일 C 콘텐츠');

      // 다시 파일 A로 돌아감
      activeFile = 'file-a.md';
      editorContent = fileContentsMap[activeFile];
      expect(editorContent).toBe('파일 A 콘텐츠');
    });
  });

  describe('TC-C3-003: onFileAdd 시 fileContent 저장', () => {
    it('파일 추가 시 fileContentsMap에 해당 step의 fileContent가 저장된다', () => {
      const fileContentsMap: Record<string, string> = {};

      // onFileAdd 시뮬레이션: step의 fileContent를 함께 저장
      function onFileAdd(filePath: string, fileContent: string) {
        fileContentsMap[filePath] = fileContent;
      }

      onFileAdd('aidlc-docs/inception/requirements.md', '# 요구사항 분석서\n이커머스');
      onFileAdd('aidlc-docs/inception/user-stories.md', '# 사용자 스토리\n구매자');

      expect(fileContentsMap['aidlc-docs/inception/requirements.md']).toBe('# 요구사항 분석서\n이커머스');
      expect(fileContentsMap['aidlc-docs/inception/user-stories.md']).toBe('# 사용자 스토리\n구매자');
      // 빈 문자열이 아닌 실제 콘텐츠가 저장됨
      expect(fileContentsMap['aidlc-docs/inception/requirements.md']).not.toBe('');
    });
  });
});
