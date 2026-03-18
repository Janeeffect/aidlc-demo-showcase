import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { DemoSessionProvider, useDemoSession } from '@/contexts/DemoSessionContext';
import { FileTreeNode } from '@/types/demo';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DemoSessionProvider>{children}</DemoSessionProvider>
);

describe('DemoSessionContext', () => {
  describe('초기 상태', () => {
    it('기본 상태값이 올바르게 설정되어야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      expect(result.current.state.currentPhase).toBe('INCEPTION');
      expect(result.current.state.currentStage).toBe('requirements');
      expect(result.current.state.isComplete).toBe(false);
      expect(result.current.state.animationProgress).toBe(0);
      expect(result.current.state.projectIdea).toBe('');
    });
  });

  describe('initSession', () => {
    it('세션을 초기화하면 projectIdea가 설정되어야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      act(() => { result.current.initSession('온라인 쇼핑몰'); });
      expect(result.current.state.projectIdea).toBe('온라인 쇼핑몰');
      expect(result.current.state.sessionId).toBeTruthy();
    });

    it('초기화 시 aidlc-docs 폴더가 생성되어야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      act(() => { result.current.initSession('테스트'); });
      const aidlcFolder = result.current.state.files.find(f => f.name === 'aidlc-docs');
      expect(aidlcFolder).toBeTruthy();
      expect(aidlcFolder?.type).toBe('folder');
    });
  });

  describe('setPhase / setStage', () => {
    it('Phase를 변경할 수 있어야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      act(() => { result.current.setPhase('CONSTRUCTION'); });
      expect(result.current.state.currentPhase).toBe('CONSTRUCTION');
    });

    it('Stage를 변경할 수 있어야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      act(() => { result.current.setStage('design'); });
      expect(result.current.state.currentStage).toBe('design');
    });
  });

  describe('addFile - 중복 방지', () => {
    it('파일을 추가할 수 있어야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      act(() => { result.current.initSession('테스트'); });
      
      act(() => {
        result.current.addFile({
          name: 'test.md',
          path: 'test.md',
          type: 'file',
          isNew: true,
        });
      });
      
      const file = result.current.state.files.find(f => f.name === 'test.md');
      expect(file).toBeTruthy();
    });

    it('같은 이름의 파일을 중복 추가하면 하나만 존재해야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      act(() => { result.current.initSession('테스트'); });
      
      // 같은 파일 두 번 추가
      act(() => {
        result.current.addFile({ name: 'dup.md', path: 'dup.md', type: 'file', isNew: true });
      });
      act(() => {
        result.current.addFile({ name: 'dup.md', path: 'dup.md', type: 'file', isNew: true });
      });
      
      const matches = result.current.state.files.filter(f => f.name === 'dup.md');
      expect(matches.length).toBe(1);
    });

    it('중첩 경로의 파일을 추가하면 폴더가 자동 생성되어야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      // 빈 상태에서 시작
      act(() => { result.current.initSession('테스트'); });
      
      act(() => {
        result.current.addFile({
          name: 'requirements.md',
          path: 'aidlc-docs/inception/requirements.md',
          type: 'file',
          isNew: true,
        });
      });
      
      const aidlcFolder = result.current.state.files.find(f => f.name === 'aidlc-docs');
      expect(aidlcFolder).toBeTruthy();
      expect(aidlcFolder?.type).toBe('folder');
    });
  });

  describe('setProgress', () => {
    it('진행률을 설정할 수 있어야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      act(() => { result.current.setProgress(50); });
      expect(result.current.state.animationProgress).toBe(50);
    });
  });

  describe('completeDemo', () => {
    it('데모를 완료 상태로 변경할 수 있어야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      act(() => { result.current.completeDemo(); });
      expect(result.current.state.isComplete).toBe(true);
    });
  });

  describe('resetSession', () => {
    it('세션을 리셋하면 초기 상태로 돌아가야 한다', () => {
      const { result } = renderHook(() => useDemoSession(), { wrapper });
      act(() => { result.current.initSession('테스트'); });
      act(() => { result.current.setPhase('CONSTRUCTION'); });
      act(() => { result.current.setProgress(80); });
      act(() => { result.current.resetSession(); });
      
      expect(result.current.state.projectIdea).toBe('');
      expect(result.current.state.currentPhase).toBe('INCEPTION');
      expect(result.current.state.animationProgress).toBe(0);
    });
  });
});
