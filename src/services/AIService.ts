import { Phase, Stage } from '@/types/demo';
import { AIChunk } from '@/types/api';

export class AIService {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  // Stream AI response for a specific phase/stage
  async *streamResponse(
    sessionId: string,
    phase: Phase,
    stage: Stage,
    projectIdea: string
  ): AsyncGenerator<AIChunk> {
    const url = new URL(`${this.baseUrl}/api/demo/stream`);
    url.searchParams.set('sessionId', sessionId);
    url.searchParams.set('phase', phase);
    url.searchParams.set('stage', stage);
    url.searchParams.set('projectIdea', projectIdea);

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Stream failed: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      // Parse SSE events
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            yield data as AIChunk;
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  // Generate content for a phase/stage (non-streaming)
  async generateContent(
    phase: Phase,
    stage: Stage,
    projectIdea: string
  ): Promise<string> {
    const chunks: string[] = [];
    
    for await (const chunk of this.streamResponse('temp', phase, stage, projectIdea)) {
      if (chunk.type === 'text') {
        chunks.push(chunk.content);
      }
    }

    return chunks.join('');
  }

  // Build prompt for AI (for future LLM integration)
  buildPrompt(projectIdea: string, phase: Phase, stage: Stage): string {
    const prompts: Record<Phase, Record<Stage, string>> = {
      INCEPTION: {
        requirements: `사용자가 "${projectIdea}" 서비스를 만들고 싶어합니다. 핵심 요구사항을 분석해주세요.`,
        design: `"${projectIdea}" 서비스의 애플리케이션 설계를 해주세요.`,
        code: '',
        infrastructure: '',
        deployment: '',
      },
      CONSTRUCTION: {
        requirements: '',
        design: '',
        code: `"${projectIdea}" 서비스의 MVP React 컴포넌트를 생성해주세요.`,
        infrastructure: '',
        deployment: '',
      },
      OPERATIONS: {
        requirements: '',
        design: '',
        code: '',
        infrastructure: `"${projectIdea}" 서비스의 AWS 아키텍처를 설계해주세요.`,
        deployment: `"${projectIdea}" 서비스의 배포 계획을 작성해주세요.`,
      },
    };

    return prompts[phase]?.[stage] || '';
  }
}

// Singleton instance
export const aiService = new AIService();
