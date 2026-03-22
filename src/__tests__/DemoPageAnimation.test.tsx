/**
 * DemoPage Animation Integration Tests
 * TC-CF-016: DemoPage에 AnimationOrchestrator가 통합되었는지 확인
 * CR-06: MousePointer 삭제 반영
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

import AnimationOrchestrator from '@/components/animation/AnimationOrchestrator';
import { AnimationSequence } from '@/types/animation';

// DemoSessionContext mock
jest.mock('@/contexts/DemoSessionContext', () => ({
  useDemoSession: () => ({
    state: {
      currentPhase: 'INCEPTION',
      currentStage: 'requirements',
      isComplete: false,
      animationProgress: 0,
      files: [],
    },
  }),
}));

describe('DemoPage Animation 통합', () => {
  it('TC-CF-016: AnimationOrchestrator가 sequence와 함께 렌더링된다', () => {
    const testSequence: AnimationSequence = {
      id: 'seq-0',
      phase: 'INCEPTION',
      stage: 'requirements',
      steps: [
        { id: 'anim-1', type: 'move', target: 'chat-input', duration: 400 },
        { id: 'anim-2', type: 'click', target: 'send-button', duration: 200 },
      ],
    };

    // CR-06: MousePointer 삭제됨 - AnimationOrchestrator는 SVG를 렌더링하지 않음
    const { container } = render(
      <AnimationOrchestrator
        sequence={testSequence}
        speed={1}
        autoStart={true}
      />
    );

    // MousePointer 삭제 후 SVG가 없어야 함
    const svg = container.querySelector('svg');
    expect(svg).toBeNull();
  });

  it('TC-CF-016b: sequence가 null이면 정상 렌더링된다', () => {
    const { container } = render(
      <AnimationOrchestrator
        sequence={null}
        speed={1}
        autoStart={false}
      />
    );

    // sequence=null이어도 에러 없이 렌더링
    expect(container).toBeTruthy();
  });
});
