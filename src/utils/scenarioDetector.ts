// ScenarioDetector - 사용자 입력 기반 산업 시나리오 감지
import { ScenarioDefinition, SCENARIOS, DEFAULT_SCENARIO } from '@/data/scenarios';

/**
 * 시나리오별 매칭 점수 계산
 * 앞쪽 키워드(인덱스 0~2)는 가중치 1.5, 나머지는 1.0
 */
export function calculateMatchScore(idea: string, scenario: ScenarioDefinition): number {
  const lowerIdea = idea.toLowerCase();
  let score = 0;

  scenario.keywords.forEach((keyword, index) => {
    if (lowerIdea.includes(keyword)) {
      score += index < 3 ? 1.5 : 1.0;
    }
  });

  return score;
}

/**
 * scenarioId로 직접 시나리오를 조회한다.
 * 매칭되는 시나리오가 없으면 DEFAULT_SCENARIO를 반환한다.
 */
export function getScenarioById(scenarioId: string): ScenarioDefinition {
  const found = SCENARIOS.find(s => s.id === scenarioId);
  return found || DEFAULT_SCENARIO;
}

/**
 * 사용자 입력 텍스트를 분석하여 최적의 산업 시나리오를 반환
 */
export function detectScenario(idea: string): ScenarioDefinition {
  const lowerIdea = idea.toLowerCase();

  let bestScenario: ScenarioDefinition = DEFAULT_SCENARIO;
  let bestScore = 0;

  for (const scenario of SCENARIOS) {
    const score = calculateMatchScore(lowerIdea, scenario);
    if (score > bestScore || (score === bestScore && score > 0 && scenario.priority < bestScenario.priority)) {
      bestScore = score;
      bestScenario = scenario;
    }
  }

  return bestScore > 0 ? bestScenario : DEFAULT_SCENARIO;
}
