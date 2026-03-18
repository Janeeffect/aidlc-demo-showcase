// EstimateService - 프로젝트 복잡도에 따른 동적 예상 계산

export interface ProjectEstimate {
  developmentDays: number;
  teamSize: number;
  teamComposition: TeamMember[];
  estimatedCost: CostEstimate;
  techStack: string[];
  complexity: 'low' | 'medium' | 'high';
  aiSavedDays: number;
  aiSavedPercentage: number;
}

export interface TeamMember {
  role: string;
  count: number;
  seniorityLevel: string;
}

export interface CostEstimate {
  monthly: { min: number; max: number };
  development: { min: number; max: number };
  currency: string;
}

// 키워드 기반 복잡도 분석
function analyzeComplexity(idea: string): {
  complexity: 'low' | 'medium' | 'high';
  features: string[];
  scale: number;
} {
  const ideaLower = idea.toLowerCase();
  let complexityScore = 0;
  const features: string[] = [];

  // 기능 복잡도 키워드
  const highComplexityKeywords = [
    { keyword: '실시간', feature: 'Real-time Processing', score: 3 },
    { keyword: 'real-time', feature: 'Real-time Processing', score: 3 },
    { keyword: '결제', feature: 'Payment Integration', score: 3 },
    { keyword: 'payment', feature: 'Payment Integration', score: 3 },
    { keyword: 'ai', feature: 'AI/ML Integration', score: 3 },
    { keyword: '인공지능', feature: 'AI/ML Integration', score: 3 },
    { keyword: '머신러닝', feature: 'Machine Learning', score: 3 },
    { keyword: '추천', feature: 'Recommendation System', score: 2 },
    { keyword: '분석', feature: 'Analytics Dashboard', score: 2 },
    { keyword: 'analytics', feature: 'Analytics Dashboard', score: 2 },
    { keyword: '대시보드', feature: 'Dashboard', score: 2 },
  ];

  const mediumComplexityKeywords = [
    { keyword: '로그인', feature: 'User Authentication', score: 1 },
    { keyword: 'login', feature: 'User Authentication', score: 1 },
    { keyword: '회원', feature: 'User Management', score: 1 },
    { keyword: '알림', feature: 'Notification System', score: 2 },
    { keyword: 'notification', feature: 'Notification System', score: 2 },
    { keyword: '검색', feature: 'Search Functionality', score: 1 },
    { keyword: 'search', feature: 'Search Functionality', score: 1 },
    { keyword: '채팅', feature: 'Chat System', score: 2 },
    { keyword: 'chat', feature: 'Chat System', score: 2 },
    { keyword: '게시판', feature: 'Board/Forum', score: 1 },
    { keyword: '댓글', feature: 'Comment System', score: 1 },
  ];

  const simpleKeywords = [
    { keyword: '블로그', feature: 'Blog', score: 0 },
    { keyword: 'blog', feature: 'Blog', score: 0 },
    { keyword: '포트폴리오', feature: 'Portfolio', score: 0 },
    { keyword: 'portfolio', feature: 'Portfolio', score: 0 },
    { keyword: '랜딩', feature: 'Landing Page', score: 0 },
    { keyword: 'landing', feature: 'Landing Page', score: 0 },
    { keyword: '할일', feature: 'Todo App', score: 0 },
    { keyword: 'todo', feature: 'Todo App', score: 0 },
  ];

  // 키워드 분석
  [...highComplexityKeywords, ...mediumComplexityKeywords, ...simpleKeywords].forEach(item => {
    if (ideaLower.includes(item.keyword)) {
      complexityScore += item.score;
      if (!features.includes(item.feature)) {
        features.push(item.feature);
      }
    }
  });

  // 규모 키워드
  let scale = 1;
  if (ideaLower.includes('대규모') || ideaLower.includes('enterprise') || ideaLower.includes('엔터프라이즈')) {
    scale = 2;
    complexityScore += 3;
  } else if (ideaLower.includes('중규모') || ideaLower.includes('medium')) {
    scale = 1.5;
    complexityScore += 1;
  }

  // 복잡도 결정
  let complexity: 'low' | 'medium' | 'high';
  if (complexityScore >= 5) {
    complexity = 'high';
  } else if (complexityScore >= 2) {
    complexity = 'medium';
  } else {
    complexity = 'low';
  }

  return { complexity, features, scale };
}

export function calculateEstimate(projectIdea: string): ProjectEstimate {
  const { complexity, features, scale } = analyzeComplexity(projectIdea);
  
  // 기본 개발 일수 (복잡도별)
  const baseDays = {
    low: { min: 14, max: 30 },
    medium: { min: 30, max: 60 },
    high: { min: 60, max: 120 },
  };

  // 랜덤 변동 추가 (±20%)
  const randomFactor = 0.8 + Math.random() * 0.4;
  const dayRange = baseDays[complexity];
  const developmentDays = Math.round(
    (dayRange.min + (dayRange.max - dayRange.min) * Math.random()) * scale * randomFactor
  );

  // AI 절감 효과 (30-50%)
  const aiSavedPercentage = 30 + Math.round(Math.random() * 20);
  const aiSavedDays = Math.round(developmentDays * (aiSavedPercentage / 100));

  // 팀 구성
  const teamComposition: TeamMember[] = [];
  
  if (complexity === 'low') {
    teamComposition.push(
      { role: 'Full-stack Developer', count: 1 + Math.floor(Math.random() * 2), seniorityLevel: 'Mid-level' },
      { role: 'UI/UX Designer', count: 1, seniorityLevel: 'Junior' },
    );
  } else if (complexity === 'medium') {
    teamComposition.push(
      { role: 'Frontend Developer', count: 1 + Math.floor(Math.random() * 2), seniorityLevel: 'Mid-level' },
      { role: 'Backend Developer', count: 1 + Math.floor(Math.random() * 2), seniorityLevel: 'Mid-level' },
      { role: 'UI/UX Designer', count: 1, seniorityLevel: 'Mid-level' },
      { role: 'QA Engineer', count: 1, seniorityLevel: 'Junior' },
    );
  } else {
    teamComposition.push(
      { role: 'Tech Lead', count: 1, seniorityLevel: 'Senior' },
      { role: 'Frontend Developer', count: 2 + Math.floor(Math.random() * 2), seniorityLevel: 'Mid-level' },
      { role: 'Backend Developer', count: 2 + Math.floor(Math.random() * 2), seniorityLevel: 'Mid-level' },
      { role: 'DevOps Engineer', count: 1, seniorityLevel: 'Senior' },
      { role: 'UI/UX Designer', count: 1 + Math.floor(Math.random() * 2), seniorityLevel: 'Senior' },
      { role: 'QA Engineer', count: 1 + Math.floor(Math.random() * 2), seniorityLevel: 'Mid-level' },
    );
  }

  const teamSize = teamComposition.reduce((sum, member) => sum + member.count, 0);

  // 비용 계산 (USD 기준)
  const monthlyInfraCost = {
    low: { min: 30, max: 100 },
    medium: { min: 100, max: 500 },
    high: { min: 500, max: 2000 },
  };

  const devCostPerDay = teamSize * 400; // 평균 일당
  const developmentCost = {
    min: Math.round(developmentDays * devCostPerDay * 0.8),
    max: Math.round(developmentDays * devCostPerDay * 1.2),
  };

  // 기술 스택
  const techStack = ['Next.js', 'TypeScript', 'Tailwind CSS', 'AWS Lambda', 'DynamoDB'];
  if (features.includes('Real-time Processing') || features.includes('Chat System')) {
    techStack.push('WebSocket', 'API Gateway WebSocket');
  }
  if (features.includes('AI/ML Integration') || features.includes('Machine Learning')) {
    techStack.push('Amazon Bedrock', 'SageMaker');
  }
  if (features.includes('Payment Integration')) {
    techStack.push('Stripe', 'AWS Secrets Manager');
  }
  if (features.includes('Search Functionality')) {
    techStack.push('OpenSearch');
  }

  return {
    developmentDays,
    teamSize,
    teamComposition,
    estimatedCost: {
      monthly: monthlyInfraCost[complexity],
      development: developmentCost,
      currency: 'USD',
    },
    techStack,
    complexity,
    aiSavedDays,
    aiSavedPercentage,
  };
}

export default { calculateEstimate };
