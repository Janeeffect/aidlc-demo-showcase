import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');
  const phase = searchParams.get('phase');
  const stage = searchParams.get('stage');
  const projectIdea = searchParams.get('projectIdea');

  if (!sessionId || !phase || !stage || !projectIdea) {
    return new Response('Missing parameters', { status: 400 });
  }

  // Create a streaming response
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Generate content based on phase and stage
        const content = generateContent(phase, stage, projectIdea);
        
        // Stream content character by character (simulating AI streaming)
        for (let i = 0; i < content.length; i++) {
          const chunk = content[i];
          const data = JSON.stringify({ type: 'text', content: chunk });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          
          // Small delay for streaming effect
          await new Promise(resolve => setTimeout(resolve, 10));
        }

        // Send done signal
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done', content: '' })}\n\n`));
        controller.close();
      } catch (error) {
        console.error('Streaming error:', error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

function generateContent(phase: string, stage: string, projectIdea: string): string {
  const templates: Record<string, Record<string, string>> = {
    INCEPTION: {
      requirements: `# Requirements Analysis

## 프로젝트: ${projectIdea}

### 핵심 요구사항
- 사용자 친화적인 인터페이스
- 빠른 응답 속도
- 모바일 최적화

### 기능 요구사항
1. 메인 기능 구현
2. 사용자 인증
3. 데이터 저장 및 조회
`,
      design: `# Application Design

## 컴포넌트 구조

### Frontend
- Pages: Home, Main, Settings
- Components: Header, Footer, Card

### Backend
- API Routes
- Services
- Database
`,
    },
    CONSTRUCTION: {
      code: `// Generated code for ${projectIdea}
import React from 'react';

export default function App() {
  return (
    <div className="app">
      <h1>${projectIdea}</h1>
    </div>
  );
}
`,
    },
    OPERATIONS: {
      infrastructure: `# AWS Infrastructure

## Services
- Lambda
- API Gateway
- DynamoDB
- S3
- CloudFront
`,
      deployment: `# Deployment Plan

## CI/CD Pipeline
1. GitHub Actions
2. AWS CodePipeline
3. Automated Testing

✅ Ready for deployment!
`,
    },
  };

  return templates[phase]?.[stage] || `# ${phase} - ${stage}\n\nContent for ${projectIdea}`;
}
