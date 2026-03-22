/**
 * API Error Response Tests
 * TC-CF-010~012: API 에러 응답 통일 형식 테스트
 *
 * jsdom 환경에서 NextRequest/NextResponse를 mock하여 테스트
 */

// next/server mock
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: (body: any, init?: { status?: number }) => ({
      json: async () => body,
      status: init?.status || 200,
    }),
  },
}));

function mockRequest(body: unknown) {
  return { json: async () => body } as any;
}

function mockBadRequest() {
  return { json: async () => { throw new Error('Unexpected token'); } } as any;
}

describe('API 에러 응답 통일', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it('TC-CF-010: /api/demo/start 빈 projectIdea 에러가 { success: false, message } 형식이다', async () => {
    const { POST } = require('@/app/api/demo/start/route');
    const res = await POST(mockRequest({ projectIdea: '' }));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({
      success: false,
      message: '프로젝트 아이디어를 입력해주세요',
    });
  });

  it('TC-CF-011: /api/demo/send-report 에러 응답이 { success: false, message } 형식이다', async () => {
    const { POST } = require('@/app/api/demo/send-report/route');
    const res = await POST(mockBadRequest());
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(typeof data.message).toBe('string');
  });

  it('TC-CF-012: /api/log POST 에러 응답이 { success: false, message } 형식이다', async () => {
    const { POST } = require('@/app/api/log/route');
    const res = await POST(mockBadRequest());
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data).toEqual({
      success: false,
      message: '로그 기록에 실패했습니다',
    });
  });
});
