import '@testing-library/jest-dom';
import { LogService } from '@/services/LogService';

// fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'logged' }) })
) as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LogService Extension', () => {
  // TC-NF-023: logStart에 industry를 전달할 수 있다
  test('TC-NF-023: logStart에 industry를 전달할 수 있다', async () => {
    const service = new LogService('');
    await service.logStart('session-1', 'AI 챗봇', '이커머스 플랫폼');
    expect(fetch).toHaveBeenCalledTimes(1);
    const callArgs = (fetch as jest.Mock).mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.industry).toBe('이커머스 플랫폼');
    expect(body.sessionId).toBe('session-1');
    expect(body.projectIdea).toBe('AI 챗봇');
    expect(body.completed).toBe(false);
  });
});
