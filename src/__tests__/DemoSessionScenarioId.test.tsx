import '@testing-library/jest-dom';
import React from 'react';
import { render, act } from '@testing-library/react';
import { DemoSessionProvider, useDemoSession } from '@/contexts/DemoSessionContext';

function TestComponent() {
  const { state, setScenarioId } = useDemoSession();
  return (
    <div>
      <span data-testid="scenarioId">{state.scenarioId}</span>
      <button onClick={() => setScenarioId('ecommerce')}>set</button>
    </div>
  );
}

describe('DemoSessionContext scenarioId', () => {
  test('TC-CR-007: SET_SCENARIO_ID 액션으로 scenarioId 설정', () => {
    const { getByTestId, getByText } = render(
      <DemoSessionProvider>
        <TestComponent />
      </DemoSessionProvider>
    );

    expect(getByTestId('scenarioId').textContent).toBe('');

    act(() => {
      getByText('set').click();
    });

    expect(getByTestId('scenarioId').textContent).toBe('ecommerce');
  });
});
