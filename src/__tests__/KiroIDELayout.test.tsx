/**
 * KiroIDELayout Tests
 * TC-CF-015: data-animation-target 속성 존재 확인
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// framer-motion mock
jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: any, ref: any) => {
      const { initial, animate, exit, whileHover, whileTap, transition, layout, ...rest } = props;
      return <div ref={ref} {...rest}>{children}</div>;
    }),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// DemoSessionContext mock
jest.mock('@/contexts/DemoSessionContext', () => ({
  useDemoSession: () => ({
    state: {
      currentPhase: 'INCEPTION',
      currentStage: 'requirements',
      isComplete: false,
      animationProgress: 0,
    },
  }),
}));

import KiroIDELayout from '@/components/kiro-ide/KiroIDELayout';

const mockFiles = [
  { name: 'requirements.md', path: 'aidlc-docs/requirements.md', type: 'file' as const },
];

const mockChat = [
  { id: '1', type: 'ai' as const, content: '테스트 메시지' },
];

describe('KiroIDELayout data-animation-target', () => {
  it('TC-CF-015: 주요 요소에 data-animation-target 속성이 존재한다', () => {
    const { container } = render(
      <KiroIDELayout
        files={mockFiles}
        activeFile="aidlc-docs/requirements.md"
        editorContent="# 테스트"
        chatMessages={mockChat}
      />
    );

    const targets = ['chat-input', 'editor-content', 'send-button'];
    targets.forEach(target => {
      const el = container.querySelector(`[data-animation-target="${target}"]`);
      expect(el).not.toBeNull();
    });
  });
});
