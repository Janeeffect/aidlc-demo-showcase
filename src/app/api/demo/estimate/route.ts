import { NextRequest, NextResponse } from 'next/server';
import { EstimateRequest, EstimateResponse } from '@/types/api';
import { AWSService, ServiceConnection, TeamMember } from '@/types/demo';

export async function POST(request: NextRequest) {
  try {
    const body: EstimateRequest = await request.json();
    const { projectIdea } = body;

    // Analyze project complexity based on keywords
    const complexity = analyzeComplexity(projectIdea);
    
    // Calculate estimates based on complexity
    const estimate = calculateEstimate(complexity, projectIdea);

    return NextResponse.json(estimate);
  } catch (error) {
    console.error('Error calculating estimate:', error);
    return NextResponse.json(
      { error: 'Failed to calculate estimate' },
      { status: 500 }
    );
  }
}

interface ComplexityScore {
  level: 'simple' | 'moderate' | 'complex';
  score: number;
  factors: string[];
}

function analyzeComplexity(projectIdea: string): ComplexityScore {
  const idea = projectIdea.toLowerCase();
  let score = 0;
  const factors: string[] = [];

  // Check for complexity indicators
  const complexKeywords = ['ai', '머신러닝', 'ml', '실시간', 'real-time', '결제', 'payment'];
  const moderateKeywords = ['인증', 'auth', '데이터베이스', 'database', 'api', '검색'];
  const simpleKeywords = ['할일', 'todo', '메모', 'note', '간단한', 'simple'];

  complexKeywords.forEach(keyword => {
    if (idea.includes(keyword)) {
      score += 3;
      factors.push(keyword);
    }
  });

  moderateKeywords.forEach(keyword => {
    if (idea.includes(keyword)) {
      score += 2;
      factors.push(keyword);
    }
  });

  simpleKeywords.forEach(keyword => {
    if (idea.includes(keyword)) {
      score -= 1;
    }
  });

  let level: 'simple' | 'moderate' | 'complex';
  if (score <= 2) {
    level = 'simple';
  } else if (score <= 5) {
    level = 'moderate';
  } else {
    level = 'complex';
  }

  return { level, score, factors };
}

function calculateEstimate(complexity: ComplexityScore, projectIdea: string): EstimateResponse {
  const baseEstimates = {
    simple: { days: 7, team: 2 },
    moderate: { days: 14, team: 4 },
    complex: { days: 30, team: 6 },
  };

  const base = baseEstimates[complexity.level];

  // Team composition based on complexity
  const teamComposition: TeamMember[] = [];
  
  if (complexity.level === 'simple') {
    teamComposition.push(
      { role: '풀스택', count: 1, reason: '소규모 프로젝트' },
      { role: '디자이너', count: 1, reason: 'UI/UX 설계' }
    );
  } else if (complexity.level === 'moderate') {
    teamComposition.push(
      { role: '프론트엔드', count: 2, reason: 'UI 개발' },
      { role: '백엔드', count: 1, reason: 'API 개발' },
      { role: '디자이너', count: 1, reason: 'UI/UX 설계' }
    );
  } else {
    teamComposition.push(
      { role: '프론트엔드', count: 2, reason: 'UI 개발' },
      { role: '백엔드', count: 2, reason: 'API 및 비즈니스 로직' },
      { role: '디자이너', count: 1, reason: 'UI/UX 설계' },
      { role: 'DevOps', count: 1, reason: '인프라 및 배포' }
    );
  }

  // Generate AWS architecture
  const awsArchitecture = generateAWSArchitecture(complexity.level);

  // Generate simple MVP code
  const mvpCode = generateMVPCode(projectIdea);

  // Calculate duration string
  const weeks = Math.ceil(base.days / 7);
  const estimatedDuration = weeks === 1 ? '약 1주' : `약 ${weeks}주`;

  return {
    traditionalDays: base.days,
    teamComposition,
    estimatedDuration,
    estimatedTeamSize: teamComposition.reduce((sum, m) => sum + m.count, 0),
    mvpCode,
    awsArchitecture,
  };
}

function generateAWSArchitecture(complexity: string): { services: AWSService[]; connections: ServiceConnection[] } {
  const services: AWSService[] = [
    { id: 'cloudfront', name: 'CloudFront', icon: '🌐', x: 50, y: 50 },
    { id: 'apigateway', name: 'API Gateway', icon: '🚪', x: 200, y: 50 },
    { id: 'lambda', name: 'Lambda', icon: '⚡', x: 350, y: 50 },
    { id: 'dynamodb', name: 'DynamoDB', icon: '🗄️', x: 350, y: 150 },
    { id: 's3', name: 'S3', icon: '📦', x: 50, y: 150 },
  ];

  if (complexity !== 'simple') {
    services.push({ id: 'cognito', name: 'Cognito', icon: '🔐', x: 200, y: 150 });
  }

  const connections: ServiceConnection[] = [
    { from: 'cloudfront', to: 'apigateway', label: 'HTTPS' },
    { from: 'apigateway', to: 'lambda', label: 'Invoke' },
    { from: 'lambda', to: 'dynamodb', label: 'Read/Write' },
    { from: 'cloudfront', to: 's3', label: 'Static' },
  ];

  if (complexity !== 'simple') {
    connections.push({ from: 'apigateway', to: 'cognito', label: 'Auth' });
  }

  return { services, connections };
}

function generateMVPCode(projectIdea: string): string {
  return `
'use client';

import React, { useState } from 'react';

export default function ${projectIdea.replace(/[^a-zA-Z가-힣]/g, '')}App() {
  const [data, setData] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-2xl font-bold">${projectIdea}</h1>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome!</h2>
          <p>Your MVP is ready.</p>
        </div>
      </main>
    </div>
  );
}
`.trim();
}
