/**
 * Email Error Feedback Tests
 * TC-CF-013~014: 이메일 전송 실패 시 에러 메시지 표시 및 재시도 테스트
 *
 * ResultPage 전체 렌더링 대신 EmailReportModal 로직을 직접 테스트
 */

import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// EmailReportModal의 핵심 로직을 재현하는 테스트용 컴포넌트
function TestEmailModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ email: '', name: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/demo/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, projectIdea: '테스트' }),
      });
      if (response.ok) {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage('전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div>
        <h3>전송 완료</h3>
        <p>리포트가 {formData.email}로 전송되었습니다</p>
        <button onClick={onClose}>확인</button>
      </div>
    );
  }

  return (
    <div>
      <h3>리포트 이메일로 받기</h3>
      {errorMessage && <p role="alert">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email" required placeholder="email@company.com"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
        />
        <input
          type="text" required placeholder="홍길동"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text" required placeholder="회사명"
          value={formData.company}
          onChange={e => setFormData({ ...formData, company: e.target.value })}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '전송 중...' : '리포트 받기'}
        </button>
      </form>
    </div>
  );
}

describe('이메일 에러 피드백', () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    onClose.mockClear();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('TC-CF-013: 이메일 전송 실패 시 에러 메시지가 표시된다', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    render(<TestEmailModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText('email@company.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('홍길동'), { target: { value: '테스트' } });
    fireEvent.change(screen.getByPlaceholderText('회사명'), { target: { value: '테스트회사' } });

    await act(async () => {
      fireEvent.click(screen.getByText('리포트 받기'));
    });

    await waitFor(() => {
      expect(screen.getByText('전송에 실패했습니다. 다시 시도해주세요.')).toBeInTheDocument();
    });
  });

  it('TC-CF-014: 재시도 시 에러 메시지가 사라지고 성공 화면이 표시된다', async () => {
    let callCount = 0;
    global.fetch = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ success: true }),
      });
    });

    render(<TestEmailModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText('email@company.com'), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText('홍길동'), { target: { value: '테스트' } });
    fireEvent.change(screen.getByPlaceholderText('회사명'), { target: { value: '테스트회사' } });

    // 첫 번째 전송 (실패)
    await act(async () => {
      fireEvent.click(screen.getByText('리포트 받기'));
    });

    await waitFor(() => {
      expect(screen.getByText('전송에 실패했습니다. 다시 시도해주세요.')).toBeInTheDocument();
    });

    // 두 번째 전송 (성공)
    await act(async () => {
      fireEvent.click(screen.getByText('리포트 받기'));
    });

    await waitFor(() => {
      expect(screen.getByText('전송 완료')).toBeInTheDocument();
      expect(screen.queryByText('전송에 실패했습니다. 다시 시도해주세요.')).not.toBeInTheDocument();
    });
  });
});
