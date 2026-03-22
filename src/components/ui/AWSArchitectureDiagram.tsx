'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AWSArchitectureDiagramProps {
  projectIdea: string;
  scenarioId?: string;
}

const SCENARIO_ARCHITECTURE: Record<string, { diagram: string; description: string; services: string[] }> = {
  ecommerce: {
    diagram: `flowchart LR
    subgraph Client["클라이언트"]
        U["고객"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
        COG["Cognito<br/>인증"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>주문 처리"]
        SF["Step Functions<br/>워크플로우"]
    end
    subgraph Data["데이터 레이어"]
        DDB["DynamoDB<br/>주문 데이터"]
        S3["S3<br/>상품 이미지"]
        EC["ElastiCache<br/>상품 캐시"]
    end
    subgraph Queue["메시징"]
        SQS["SQS<br/>주문 큐"]
    end
    subgraph Security["보안"]
        SM["Secrets Manager"]
    end
    subgraph Monitoring["모니터링"]
        CW["CloudWatch<br/>메트릭/알람"]
        XR["X-Ray<br/>분산 추적"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    APIGW --> COG
    APIGW --> L1
    L1 --> DDB
    L1 --> EC
    L1 --> SQS
    L1 --> SM
    SF --> L1
    CF --> S3
    L1 --> CW
    L1 --> XR
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Data fill:#e8f5e9
    style Queue fill:#e1f5fe
    style Security fill:#ffebee
    style Monitoring fill:#f3e5f5`,
    description: '안전한 결제 처리 이커머스 서버리스 아키텍처',
    services: ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'Step Functions', 'DynamoDB', 'S3', 'ElastiCache', 'SQS', 'Secrets Manager', 'CloudWatch', 'X-Ray'],
  },
  fintech: {
    diagram: `flowchart LR
    subgraph Client["클라이언트"]
        U["사용자"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
        COG["Cognito<br/>인증"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>송금 처리"]
        SF["Step Functions<br/>워크플로우"]
    end
    subgraph Data["데이터 레이어"]
        AUR["Aurora<br/>금융 데이터"]
        DDB["DynamoDB<br/>거래 로그"]
    end
    subgraph Security["보안"]
        KMS["KMS<br/>암호화"]
        CT["CloudTrail<br/>감사"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    APIGW --> COG
    APIGW --> L1
    L1 --> AUR
    L1 --> DDB
    L1 --> KMS
    SF --> L1
    L1 --> CT
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Data fill:#e8f5e9
    style Security fill:#ffebee`,
    description: '금융 보안 규정 준수 서버리스 아키텍처',
    services: ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'Step Functions', 'Aurora', 'DynamoDB', 'KMS', 'CloudTrail'],
  },
  healthcare: {
    diagram: `flowchart LR
    subgraph Client["클라이언트"]
        U["환자"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
        COG["Cognito<br/>인증"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>진료 관리"]
        L2["Lambda<br/>처방 처리"]
    end
    subgraph Data["데이터 레이어"]
        AUR["Aurora<br/>진료 기록"]
        S3["S3<br/>의료 영상"]
    end
    subgraph Video["화상 진료"]
        CHM["Chime SDK"]
    end
    subgraph Notification["알림"]
        SES["SES<br/>이메일"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    APIGW --> COG
    APIGW --> L1
    L1 --> AUR
    L1 --> S3
    L1 --> L2
    L1 --> CHM
    L2 --> SES
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Data fill:#e8f5e9
    style Video fill:#e0f2f1
    style Notification fill:#f3e5f5`,
    description: '헬스케어 원격 진료 서버리스 아키텍처',
    services: ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'Aurora', 'S3', 'Chime SDK', 'SES'],
  },
  education: {
    diagram: `flowchart LR
    subgraph Client["클라이언트"]
        U["학습자"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront<br/>스트리밍"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
        COG["Cognito<br/>인증"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>학습 관리"]
    end
    subgraph Data["데이터 레이어"]
        DDB["DynamoDB<br/>학습 데이터"]
        S3["S3<br/>강의 콘텐츠"]
    end
    subgraph Media["미디어"]
        MC["MediaConvert<br/>인코딩"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    CF --> S3
    APIGW --> COG
    APIGW --> L1
    L1 --> DDB
    S3 --> MC
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Data fill:#e8f5e9
    style Media fill:#ede7f6`,
    description: '대용량 영상 스트리밍 교육 플랫폼 아키텍처',
    services: ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'DynamoDB', 'S3', 'MediaConvert'],
  },
  logistics: {
    diagram: `flowchart LR
    subgraph Client["클라이언트"]
        U["고객"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>배송 관리"]
    end
    subgraph Data["데이터 레이어"]
        DDB["DynamoDB<br/>배송 데이터"]
    end
    subgraph Location["위치 서비스"]
        LS["Location Service<br/>지도"]
        IOT["IoT Core<br/>GPS"]
    end
    subgraph Notification["알림"]
        SNS["SNS<br/>푸시 알림"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    APIGW --> L1
    L1 --> DDB
    L1 --> LS
    IOT --> L1
    L1 --> SNS
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Data fill:#e8f5e9
    style Location fill:#e0f2f1
    style Notification fill:#f3e5f5`,
    description: '실시간 배송 추적 물류 IoT 아키텍처',
    services: ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Lambda', 'DynamoDB', 'Location Service', 'IoT Core', 'SNS'],
  },
  saas: {
    diagram: `flowchart LR
    subgraph Client["클라이언트"]
        U["팀원"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
        COG["Cognito<br/>인증"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>비즈니스 로직"]
    end
    subgraph Realtime["실시간"]
        AS["AppSync<br/>실시간 동기화"]
    end
    subgraph Data["데이터 레이어"]
        DDB["DynamoDB<br/>프로젝트 데이터"]
        EC["ElastiCache<br/>캐시"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    APIGW --> COG
    APIGW --> L1
    L1 --> DDB
    L1 --> EC
    AS --> L1
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Realtime fill:#e0f2f1
    style Data fill:#e8f5e9`,
    description: 'SaaS 실시간 협업 서버리스 아키텍처',
    services: ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'AppSync', 'DynamoDB', 'ElastiCache'],
  },
};

function generateMermaidDiagram(idea: string, scenarioId?: string): { diagram: string; description: string; services: string[] } {
  // scenarioId 기반 직접 매핑 우선
  if (scenarioId && SCENARIO_ARCHITECTURE[scenarioId]) {
    return SCENARIO_ARCHITECTURE[scenarioId];
  }

  const ideaLower = idea.toLowerCase();
  let diagram = '';
  let description = '';
  let services: string[] = [];

  if (ideaLower.includes('채팅') || ideaLower.includes('chat') || ideaLower.includes('실시간')) {
    diagram = `flowchart LR
    subgraph Client["클라이언트"]
        U["사용자"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway<br/>WebSocket"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>연결 관리"]
        L2["Lambda<br/>메시지 처리"]
    end
    subgraph Data["데이터 레이어"]
        DDB["DynamoDB<br/>메시지 저장"]
        EC["ElastiCache<br/>세션 캐시"]
    end
    subgraph Notification["알림"]
        SNS["SNS<br/>푸시 알림"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    APIGW --> L1
    L1 --> L2
    L2 --> DDB
    L2 --> EC
    L2 --> SNS
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Data fill:#e8f5e9
    style Notification fill:#f3e5f5`;
    description = '실시간 양방향 통신 WebSocket 서버리스 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway (WebSocket)', 'Lambda', 'DynamoDB', 'ElastiCache', 'SNS'];
  } else if (ideaLower.includes('쇼핑') || ideaLower.includes('주문') || ideaLower.includes('이커머스')) {
    diagram = `flowchart LR
    subgraph Client["클라이언트"]
        U["고객"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
        COG["Cognito<br/>인증"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>주문 처리"]
        SF["Step Functions<br/>워크플로우"]
    end
    subgraph Data["데이터 레이어"]
        DDB["DynamoDB<br/>주문 데이터"]
        S3["S3<br/>상품 이미지"]
    end
    subgraph Queue["메시징"]
        SQS["SQS<br/>주문 큐"]
    end
    subgraph Security["보안"]
        SM["Secrets Manager"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    APIGW --> COG
    APIGW --> L1
    L1 --> DDB
    L1 --> SQS
    L1 --> SM
    SF --> L1
    CF --> S3
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Data fill:#e8f5e9
    style Queue fill:#e1f5fe
    style Security fill:#ffebee`;
    description = '안전한 결제 처리 이커머스 서버리스 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'Step Functions', 'DynamoDB', 'S3', 'SQS', 'Secrets Manager'];
  } else if (ideaLower.includes('예약') || ideaLower.includes('booking')) {
    diagram = `flowchart LR
    subgraph Client["클라이언트"]
        U["고객"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
        COG["Cognito<br/>인증"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>예약 처리"]
        EB["EventBridge<br/>스케줄러"]
    end
    subgraph Data["데이터 레이어"]
        DDB["DynamoDB<br/>예약 데이터"]
    end
    subgraph Notification["알림"]
        SES["SES<br/>이메일 알림"]
        SNS["SNS<br/>푸시 알림"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    APIGW --> COG
    APIGW --> L1
    L1 --> DDB
    EB --> L1
    L1 --> SES
    L1 --> SNS
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Data fill:#e8f5e9
    style Notification fill:#f3e5f5`;
    description = '자동 알림 예약 관리 서버리스 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'EventBridge', 'DynamoDB', 'SES', 'SNS'];
  } else if (ideaLower.includes('교육') || ideaLower.includes('학습') || ideaLower.includes('lms')) {
    diagram = `flowchart LR
    subgraph Client["클라이언트"]
        U["학습자"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
        COG["Cognito<br/>인증"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>학습 관리"]
        L2["Lambda<br/>진도 추적"]
    end
    subgraph Data["데이터 레이어"]
        DDB["DynamoDB<br/>학습 데이터"]
        S3["S3<br/>강의 콘텐츠"]
    end
    subgraph Media["미디어"]
        MC["MediaConvert<br/>비디오 변환"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    CF --> S3
    APIGW --> COG
    APIGW --> L1
    L1 --> DDB
    L1 --> L2
    S3 --> MC
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Data fill:#e8f5e9
    style Media fill:#ede7f6`;
    description = '확장 가능한 온라인 학습 플랫폼 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'DynamoDB', 'S3', 'MediaConvert'];
  } else if (ideaLower.includes('ai') || ideaLower.includes('분석') || ideaLower.includes('대시보드')) {
    diagram = `flowchart LR
    subgraph Client["클라이언트"]
        U["사용자"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
        COG["Cognito<br/>인증"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>데이터 처리"]
    end
    subgraph AI["AI/ML"]
        BR["Bedrock<br/>AI 분석"]
    end
    subgraph Data["데이터 레이어"]
        DDB["DynamoDB<br/>메타데이터"]
        S3["S3<br/>데이터 저장"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    APIGW --> COG
    APIGW --> L1
    L1 --> BR
    L1 --> DDB
    L1 --> S3
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style AI fill:#e0f2f1
    style Data fill:#e8f5e9`;
    description = 'AI 기반 데이터 분석 서버리스 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'Bedrock', 'DynamoDB', 'S3'];
  } else {
    diagram = `flowchart LR
    subgraph Client["클라이언트"]
        U["사용자"]
    end
    subgraph Edge["엣지 레이어"]
        R53["Route 53"]
        CF["CloudFront"]
        WAF["WAF"]
    end
    subgraph API["API 레이어"]
        APIGW["API Gateway"]
        COG["Cognito<br/>인증"]
    end
    subgraph Compute["컴퓨팅"]
        L1["Lambda<br/>비즈니스 로직"]
    end
    subgraph Data["데이터 레이어"]
        DDB["DynamoDB<br/>데이터 저장"]
        S3["S3<br/>파일 저장"]
    end
    U --> R53
    R53 --> CF
    WAF --> CF
    CF --> APIGW
    CF --> S3
    APIGW --> COG
    APIGW --> L1
    L1 --> DDB
    style Client fill:#e3f2fd
    style Edge fill:#fff3e0
    style API fill:#fce4ec
    style Compute fill:#fff8e1
    style Data fill:#e8f5e9`;
    description = '확장 가능한 서버리스 웹 애플리케이션 아키텍처';
    services = ['Route 53', 'CloudFront', 'WAF', 'API Gateway', 'Cognito', 'Lambda', 'DynamoDB', 'S3'];
  }

  return { diagram, description, services };
}

export default function AWSArchitectureDiagram({ projectIdea, scenarioId }: AWSArchitectureDiagramProps) {
  const { diagram, description, services } = useMemo(() => generateMermaidDiagram(projectIdea, scenarioId), [projectIdea, scenarioId]);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);

  useEffect(() => {
    const renderMermaid = async () => {
      if (containerRef.current) {
        try {
          const mermaid = (await import('mermaid')).default;
          mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
              primaryColor: '#3b82f6',
              primaryTextColor: '#1e1e1e',
              primaryBorderColor: '#60a5fa',
              lineColor: '#6b7280',
              secondaryColor: '#f3f4f6',
              tertiaryColor: '#ffffff',
              fontSize: '14px',
            },
            flowchart: {
              htmlLabels: true,
              curve: 'basis',
              padding: 15,
              nodeSpacing: 50,
              rankSpacing: 60,
            },
          });
          
          renderIdRef.current += 1;
          const uniqueId = `aws-arch-${renderIdRef.current}-${Date.now()}`;
          const { svg } = await mermaid.render(uniqueId, diagram);
          containerRef.current.innerHTML = svg;
          
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.minHeight = '300px';
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          // Fallback: show a text-based architecture list
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div style="padding: 24px; text-align: center; color: #666;">
              <p style="margin-bottom: 12px; font-weight: 600;">AWS 서버리스 아키텍처</p>
              <p style="color: #999; font-size: 14px;">${description}</p>
              <div style="margin-top: 16px; display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;">
                ${services.map(s => `<span style="background: #f0f0f0; padding: 4px 12px; border-radius: 4px; font-size: 13px;">${s}</span>`).join('')}
              </div>
            </div>`;
          }
        }
      }
    };

    renderMermaid();
  }, [diagram, description, services]);

  return (
    <div className="space-y-6">
      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#1a1a25] rounded flex items-center justify-center">
            <span className="text-[#ff9900] font-bold text-sm">AWS</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[#e4e4ed]">AWS 아키텍처</h3>
            <p className="text-sm text-[#8888a0]">{description}</p>
          </div>
        </div>
      </div>
      
      <motion.div 
        className="bg-white rounded-lg border border-[#2a2a3a] p-6 overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          ref={containerRef} 
          className="min-h-[300px] flex items-center justify-center"
        >
          <div className="w-full space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded shimmer w-2/3 mx-auto" />
            <div className="h-40 bg-gray-100 rounded shimmer" />
            <div className="flex justify-center gap-3">
              <div className="h-8 w-24 bg-gray-200 rounded shimmer" />
              <div className="h-8 w-20 bg-gray-200 rounded shimmer" />
              <div className="h-8 w-28 bg-gray-200 rounded shimmer" />
            </div>
            <div className="h-4 bg-gray-200 rounded shimmer w-1/2 mx-auto" />
          </div>
        </div>
      </motion.div>

      <div className="bg-[#12121a] rounded-lg p-4 border border-[#2a2a3a]">
        <h4 className="text-sm font-medium text-[#e4e4ed] mb-3">사용된 AWS 서비스</h4>
        <div className="flex flex-wrap gap-2">
          {services.map((service, i) => (
            <motion.div 
              key={service} 
              className="flex items-center gap-2 bg-[#0a0a0f] px-3 py-1.5 rounded text-xs"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="text-[#ff9900]">●</span>
              <span className="text-[#e4e4ed]">{service}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
