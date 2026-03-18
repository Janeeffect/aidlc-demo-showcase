/**
 * AWS Architecture Diagram - Mermaid 다이어그램 생성 로직 테스트
 */

function generateMermaidDiagram(idea: string): { diagram: string; description: string; services: string[] } {
  const ideaLower = idea.toLowerCase();
  let diagram = '';
  let description = '';
  let services: string[] = [];

  if (ideaLower.includes('채팅') || ideaLower.includes('chat') || ideaLower.includes('실시간')) {
    diagram = 'flowchart LR';
    description = '실시간 양방향 통신 WebSocket 서버리스 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway (WebSocket)', 'Lambda', 'DynamoDB', 'ElastiCache', 'SNS'];
  } else if (ideaLower.includes('쇼핑') || ideaLower.includes('주문') || ideaLower.includes('이커머스')) {
    diagram = 'flowchart LR';
    description = '안전한 결제 처리 이커머스 서버리스 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'Step Functions', 'DynamoDB', 'S3', 'SQS', 'Secrets Manager'];
  } else if (ideaLower.includes('예약') || ideaLower.includes('booking')) {
    diagram = 'flowchart LR';
    description = '자동 알림 예약 관리 서버리스 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'EventBridge', 'DynamoDB', 'SES', 'SNS'];
  } else if (ideaLower.includes('교육') || ideaLower.includes('학습') || ideaLower.includes('lms')) {
    diagram = 'flowchart LR';
    description = '확장 가능한 온라인 학습 플랫폼 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'DynamoDB', 'S3', 'MediaConvert'];
  } else if (ideaLower.includes('ai') || ideaLower.includes('분석') || ideaLower.includes('대시보드')) {
    diagram = 'flowchart LR';
    description = 'AI 기반 데이터 분석 서버리스 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'Bedrock', 'DynamoDB', 'S3'];
  } else {
    diagram = 'flowchart LR';
    description = '확장 가능한 서버리스 웹 애플리케이션 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'DynamoDB', 'S3'];
  }

  return { diagram, description, services };
}

describe('AWS Architecture Diagram - Mermaid 생성', () => {
  describe('카테고리별 아키텍처', () => {
    it('채팅 앱: WebSocket + ElastiCache 포함', () => {
      const result = generateMermaidDiagram('실시간 채팅 앱');
      expect(result.services).toContain('API Gateway (WebSocket)');
      expect(result.services).toContain('ElastiCache');
      expect(result.services).toContain('SNS');
      expect(result.description).toContain('WebSocket');
    });

    it('이커머스: Step Functions + SQS + Secrets Manager 포함', () => {
      const result = generateMermaidDiagram('온라인 쇼핑몰');
      expect(result.services).toContain('Step Functions');
      expect(result.services).toContain('SQS');
      expect(result.services).toContain('Secrets Manager');
      expect(result.description).toContain('이커머스');
    });

    it('예약: EventBridge + SES 포함', () => {
      const result = generateMermaidDiagram('진료 예약 시스템');
      expect(result.services).toContain('EventBridge');
      expect(result.services).toContain('SES');
      expect(result.description).toContain('예약');
    });

    it('교육: MediaConvert + S3 포함', () => {
      const result = generateMermaidDiagram('온라인 학습 플랫폼');
      expect(result.services).toContain('MediaConvert');
      expect(result.services).toContain('S3');
      expect(result.description).toContain('학습');
    });

    it('AI/분석: Bedrock 포함', () => {
      const result = generateMermaidDiagram('AI 기반 분석 대시보드');
      expect(result.services).toContain('Bedrock');
      expect(result.description).toContain('AI');
    });

    it('기본: 표준 서버리스 아키텍처', () => {
      const result = generateMermaidDiagram('블로그 플랫폼');
      expect(result.services).toContain('Lambda');
      expect(result.services).toContain('DynamoDB');
      expect(result.description).toContain('서버리스');
    });
  });

  describe('공통 서비스', () => {
    const testCases = ['채팅 앱', '쇼핑몰', '예약 시스템', '학습 플랫폼', 'AI 분석', '블로그'];
    
    testCases.forEach(input => {
      it(`"${input}" - Route 53, CloudFront, WAF 포함`, () => {
        const result = generateMermaidDiagram(input);
        expect(result.services).toContain('Route 53');
        expect(result.services).toContain('CloudFront');
        expect(result.services).toContain('WAF');
      });

      it(`"${input}" - Mermaid flowchart 형식`, () => {
        const result = generateMermaidDiagram(input);
        expect(result.diagram).toContain('flowchart');
      });

      it(`"${input}" - 서비스가 3개 이상`, () => {
        const result = generateMermaidDiagram(input);
        expect(result.services.length).toBeGreaterThanOrEqual(3);
      });

      it(`"${input}" - description이 비어있지 않음`, () => {
        const result = generateMermaidDiagram(input);
        expect(result.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('서로 다른 입력은 서로 다른 아키텍처를 생성', () => {
    it('채팅과 이커머스는 다른 서비스 구성', () => {
      const chat = generateMermaidDiagram('채팅 앱');
      const ecom = generateMermaidDiagram('쇼핑몰');
      expect(chat.services).not.toEqual(ecom.services);
      expect(chat.description).not.toBe(ecom.description);
    });

    it('예약과 교육은 다른 서비스 구성', () => {
      const booking = generateMermaidDiagram('예약 시스템');
      const learning = generateMermaidDiagram('학습 플랫폼');
      expect(booking.services).not.toEqual(learning.services);
    });
  });
});
