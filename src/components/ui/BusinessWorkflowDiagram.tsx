'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface SequenceStep {
  from: string;
  to: string;
  action: string;
  response?: string;
}

interface BusinessWorkflowDiagramProps {
  projectIdea: string;
  scenarioId?: string;
}

const SCENARIO_SEQUENCES: Record<string, { actors: string[]; steps: SequenceStep[]; title: string }> = {
  ecommerce: {
    title: '주문 처리 시퀀스',
    actors: ['고객', '프론트엔드', 'API Gateway', 'Lambda', 'DynamoDB', 'SQS', '결제PG'],
    steps: [
      { from: '고객', to: '프론트엔드', action: '주문 요청' },
      { from: '프론트엔드', to: 'API Gateway', action: 'POST /orders' },
      { from: 'API Gateway', to: 'Lambda', action: '주문 생성' },
      { from: 'Lambda', to: 'DynamoDB', action: '재고 확인 조회' },
      { from: 'DynamoDB', to: 'Lambda', action: '재고 확인', response: 'available' },
      { from: 'Lambda', to: 'DynamoDB', action: '주문 정보 저장' },
      { from: 'Lambda', to: '결제PG', action: '결제 요청' },
      { from: '결제PG', to: 'Lambda', action: '결제 승인', response: 'approved' },
      { from: 'Lambda', to: 'SQS', action: '배송 처리 큐 등록' },
      { from: 'Lambda', to: '프론트엔드', action: '주문 완료 응답' },
      { from: '결제PG', to: 'Lambda', action: '결제 실패 시 롤백' },
      { from: 'Lambda', to: 'DynamoDB', action: '주문 취소 + 재고 복원' },
      { from: 'Lambda', to: '프론트엔드', action: '에러 응답 + 재시도 안내' },
    ],
  },
  fintech: {
    title: '송금 처리 시퀀스',
    actors: ['사용자', '프론트엔드', 'API Gateway', 'Lambda', 'Aurora', 'KMS', 'Step Functions'],
    steps: [
      { from: '사용자', to: '프론트엔드', action: '송금 요청' },
      { from: '프론트엔드', to: 'API Gateway', action: 'POST /transfers' },
      { from: 'API Gateway', to: 'Lambda', action: '송금 검증' },
      { from: 'Lambda', to: 'KMS', action: '데이터 암호화' },
      { from: 'KMS', to: 'Lambda', action: '암호화 완료', response: 'encrypted' },
      { from: 'Lambda', to: 'Step Functions', action: '송금 워크플로우 시작' },
      { from: 'Step Functions', to: 'Aurora', action: '잔액 확인' },
      { from: 'Aurora', to: 'Step Functions', action: '잔액 충분', response: 'sufficient' },
      { from: 'Step Functions', to: 'Aurora', action: '잔액 차감 + 입금' },
      { from: 'Aurora', to: 'Step Functions', action: '트랜잭션 완료', response: 'committed' },
      { from: 'Step Functions', to: 'Lambda', action: '감사 로그 기록' },
      { from: 'Step Functions', to: '프론트엔드', action: '송금 완료 응답' },
      { from: 'Aurora', to: 'Step Functions', action: '잔액 부족 시 실패', response: 'insufficient' },
      { from: 'Step Functions', to: '프론트엔드', action: '에러 응답 + 잔액 안내' },
    ],
  },
  healthcare: {
    title: '원격 진료 시퀀스',
    actors: ['환자', '프론트엔드', 'API Gateway', 'Lambda', 'Aurora', 'Chime SDK', 'SES'],
    steps: [
      { from: '환자', to: '프론트엔드', action: '진료 예약' },
      { from: '프론트엔드', to: 'API Gateway', action: 'POST /appointments' },
      { from: 'API Gateway', to: 'Lambda', action: '예약 처리' },
      { from: 'Lambda', to: 'Aurora', action: '의사 스케줄 확인' },
      { from: 'Aurora', to: 'Lambda', action: '가용 시간', response: 'available' },
      { from: 'Lambda', to: 'Aurora', action: '예약 저장' },
      { from: 'Lambda', to: 'Chime SDK', action: '화상 세션 생성' },
      { from: 'Chime SDK', to: 'Lambda', action: '세션 URL', response: 'session_url' },
      { from: 'Lambda', to: 'SES', action: '예약 확인 이메일' },
      { from: 'Lambda', to: '프론트엔드', action: '예약 완료 응답' },
      { from: 'Aurora', to: 'Lambda', action: '스케줄 충돌 시 실패', response: 'conflict' },
      { from: 'Lambda', to: '프론트엔드', action: '대체 시간 제안 응답' },
    ],
  },
  education: {
    title: '강의 수강 시퀀스',
    actors: ['학습자', '프론트엔드', 'API Gateway', 'Lambda', 'DynamoDB', 'S3', 'CloudFront'],
    steps: [
      { from: '학습자', to: '프론트엔드', action: '강의 선택' },
      { from: '프론트엔드', to: 'API Gateway', action: 'GET /courses/:id' },
      { from: 'API Gateway', to: 'Lambda', action: '강의 정보 조회' },
      { from: 'Lambda', to: 'DynamoDB', action: '진도 데이터 조회' },
      { from: 'Lambda', to: '프론트엔드', action: '강의 정보 응답' },
      { from: '프론트엔드', to: 'CloudFront', action: '영상 스트리밍 요청' },
      { from: 'CloudFront', to: 'S3', action: '영상 파일 조회' },
      { from: 'S3', to: '학습자', action: '영상 스트리밍' },
    ],
  },
  logistics: {
    title: '배송 추적 시퀀스',
    actors: ['고객', '프론트엔드', 'API Gateway', 'Lambda', 'DynamoDB', 'IoT Core', 'SNS'],
    steps: [
      { from: '고객', to: '프론트엔드', action: '배송 추적 요청' },
      { from: '프론트엔드', to: 'API Gateway', action: 'GET /tracking/:id' },
      { from: 'API Gateway', to: 'Lambda', action: '추적 정보 조회' },
      { from: 'Lambda', to: 'DynamoDB', action: '배송 상태 조회' },
      { from: 'IoT Core', to: 'Lambda', action: 'GPS 위치 업데이트' },
      { from: 'Lambda', to: 'DynamoDB', action: '위치 정보 저장' },
      { from: 'Lambda', to: 'SNS', action: '도착 알림 발송' },
      { from: 'Lambda', to: '프론트엔드', action: '실시간 위치 응답' },
    ],
  },
  saas: {
    title: '프로젝트 협업 시퀀스',
    actors: ['팀원', '프론트엔드', 'API Gateway', 'Lambda', 'DynamoDB', 'AppSync'],
    steps: [
      { from: '팀원', to: '프론트엔드', action: '태스크 업데이트' },
      { from: '프론트엔드', to: 'API Gateway', action: 'PUT /tasks/:id' },
      { from: 'API Gateway', to: 'Lambda', action: '태스크 처리' },
      { from: 'Lambda', to: 'DynamoDB', action: '태스크 저장' },
      { from: 'Lambda', to: 'AppSync', action: '실시간 동기화' },
      { from: 'AppSync', to: '프론트엔드', action: '보드 업데이트 브로드캐스트' },
    ],
  },
  chat: {
    title: '실시간 채팅 시퀀스',
    actors: ['사용자A', '프론트엔드', 'API Gateway', 'Lambda', 'DynamoDB', '사용자B'],
    steps: [
      { from: '사용자A', to: '프론트엔드', action: '메시지 입력' },
      { from: '프론트엔드', to: 'API Gateway', action: 'WebSocket 전송' },
      { from: 'API Gateway', to: 'Lambda', action: '메시지 처리 요청' },
      { from: 'Lambda', to: 'DynamoDB', action: '메시지 저장' },
      { from: 'DynamoDB', to: 'Lambda', action: '저장 완료', response: 'ACK' },
      { from: 'Lambda', to: 'API Gateway', action: '브로드캐스트 요청' },
      { from: 'API Gateway', to: '사용자B', action: '실시간 메시지 전달' },
    ],
  },
};

function generateSequence(idea: string, scenarioId?: string): { actors: string[]; steps: SequenceStep[]; title: string } {
  // scenarioId 기반 직접 매핑 우선
  if (scenarioId && SCENARIO_SEQUENCES[scenarioId]) {
    return SCENARIO_SEQUENCES[scenarioId];
  }

  const ideaLower = idea.toLowerCase();
  
  if (ideaLower.includes('채팅') || ideaLower.includes('chat') || ideaLower.includes('실시간')) {
    return {
      title: '실시간 채팅 시퀀스',
      actors: ['사용자A', '프론트엔드', 'API Gateway', 'Lambda', 'DynamoDB', '사용자B'],
      steps: [
        { from: '사용자A', to: '프론트엔드', action: '메시지 입력' },
        { from: '프론트엔드', to: 'API Gateway', action: 'WebSocket 전송' },
        { from: 'API Gateway', to: 'Lambda', action: '메시지 처리 요청' },
        { from: 'Lambda', to: 'DynamoDB', action: '메시지 저장' },
        { from: 'DynamoDB', to: 'Lambda', action: '저장 완료', response: 'ACK' },
        { from: 'Lambda', to: 'API Gateway', action: '브로드캐스트 요청' },
        { from: 'API Gateway', to: '사용자B', action: '실시간 메시지 전달' },
      ],
    };
  }
  
  if (ideaLower.includes('쇼핑') || ideaLower.includes('주문') || ideaLower.includes('이커머스')) {
    return {
      title: '주문 처리 시퀀스',
      actors: ['고객', '프론트엔드', 'API Gateway', 'Lambda', 'DynamoDB', 'SQS', '결제PG'],
      steps: [
        { from: '고객', to: '프론트엔드', action: '주문 요청' },
        { from: '프론트엔드', to: 'API Gateway', action: 'POST /orders' },
        { from: 'API Gateway', to: 'Lambda', action: '주문 생성' },
        { from: 'Lambda', to: 'DynamoDB', action: '주문 정보 저장' },
        { from: 'Lambda', to: '결제PG', action: '결제 요청' },
        { from: '결제PG', to: 'Lambda', action: '결제 승인', response: 'approved' },
        { from: 'Lambda', to: 'SQS', action: '배송 처리 큐 등록' },
        { from: 'Lambda', to: '프론트엔드', action: '주문 완료 응답' },
      ],
    };
  }
  
  if (ideaLower.includes('예약') || ideaLower.includes('booking') || ideaLower.includes('진료')) {
    return {
      title: '예약 처리 시퀀스',
      actors: ['고객', '프론트엔드', 'API Gateway', 'Lambda', 'DynamoDB', 'EventBridge', 'SES'],
      steps: [
        { from: '고객', to: '프론트엔드', action: '예약 요청' },
        { from: '프론트엔드', to: 'API Gateway', action: 'POST /bookings' },
        { from: 'API Gateway', to: 'Lambda', action: '예약 가능 확인' },
        { from: 'Lambda', to: 'DynamoDB', action: '슬롯 조회' },
        { from: 'DynamoDB', to: 'Lambda', action: '가용 슬롯', response: 'available' },
        { from: 'Lambda', to: 'DynamoDB', action: '예약 저장' },
        { from: 'Lambda', to: 'EventBridge', action: '리마인더 스케줄 등록' },
        { from: 'Lambda', to: 'SES', action: '확인 이메일 발송' },
        { from: 'Lambda', to: '프론트엔드', action: '예약 완료 응답' },
      ],
    };
  }
  
  return {
    title: '서비스 요청 시퀀스',
    actors: ['사용자', '프론트엔드', 'API Gateway', 'Lambda', 'DynamoDB'],
    steps: [
      { from: '사용자', to: '프론트엔드', action: '서비스 요청' },
      { from: '프론트엔드', to: 'API Gateway', action: 'API 호출' },
      { from: 'API Gateway', to: 'Lambda', action: '비즈니스 로직 실행' },
      { from: 'Lambda', to: 'DynamoDB', action: '데이터 조회/저장' },
      { from: 'DynamoDB', to: 'Lambda', action: '결과 반환', response: 'data' },
      { from: 'Lambda', to: 'API Gateway', action: '응답 생성' },
      { from: 'API Gateway', to: '프론트엔드', action: 'JSON 응답' },
      { from: '프론트엔드', to: '사용자', action: 'UI 업데이트' },
    ],
  };
}

export default function BusinessWorkflowDiagram({ projectIdea, scenarioId }: BusinessWorkflowDiagramProps) {
  const { actors, steps, title } = useMemo(() => generateSequence(projectIdea, scenarioId), [projectIdea, scenarioId]);

  const actorWidth = 100;
  const actorGap = 20;
  const totalWidth = actors.length * actorWidth + (actors.length - 1) * actorGap;
  const stepHeight = 50;

  const getActorX = (actorName: string) => {
    const index = actors.indexOf(actorName);
    return index * (actorWidth + actorGap) + actorWidth / 2;
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a]">
        <h3 className="text-lg font-semibold text-[#e4e4ed] mb-2">{title}</h3>
        <p className="text-sm text-[#8888a0]">시스템 컴포넌트 간 상호작용 시퀀스 다이어그램</p>
      </div>

      <div className="bg-[#12121a] rounded-lg p-6 border border-[#2a2a3a] overflow-x-auto">
        <svg width={totalWidth + 40} height={steps.length * stepHeight + 120} className="mx-auto">
          {/* Actor Headers */}
          {actors.map((actor, i) => (
            <g key={actor}>
              <rect
                x={20 + i * (actorWidth + actorGap)}
                y={10}
                width={actorWidth}
                height={36}
                rx={4}
                fill="#1a1a25"
                stroke="#7c5cfc"
                strokeWidth={1}
              />
              <text
                x={20 + i * (actorWidth + actorGap) + actorWidth / 2}
                y={33}
                textAnchor="middle"
                fill="#e4e4ed"
                fontSize={11}
                fontWeight={500}
              >
                {actor}
              </text>
              {/* Lifeline */}
              <line
                x1={20 + getActorX(actor)}
                y1={50}
                x2={20 + getActorX(actor)}
                y2={steps.length * stepHeight + 80}
                stroke="#2a2a3a"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
            </g>
          ))}

          {/* Sequence Steps */}
          {steps.map((step, i) => {
            const fromX = 20 + getActorX(step.from);
            const toX = 20 + getActorX(step.to);
            const y = 70 + i * stepHeight;
            const isLeftToRight = fromX < toX;

            return (
              <motion.g
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 }}
              >
                {/* Arrow Line */}
                <line
                  x1={fromX}
                  y1={y}
                  x2={toX}
                  y2={y}
                  stroke="#4a9eff"
                  strokeWidth={1.5}
                  markerEnd="url(#arrowhead)"
                />
                {/* Arrow Head */}
                <polygon
                  points={isLeftToRight 
                    ? `${toX - 8},${y - 4} ${toX},${y} ${toX - 8},${y + 4}`
                    : `${toX + 8},${y - 4} ${toX},${y} ${toX + 8},${y + 4}`
                  }
                  fill="#4a9eff"
                />
                {/* Action Label */}
                <rect
                  x={(fromX + toX) / 2 - 50}
                  y={y - 18}
                  width={100}
                  height={16}
                  rx={2}
                  fill="#0a0a0f"
                />
                <text
                  x={(fromX + toX) / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fill="#e4e4ed"
                  fontSize={9}
                >
                  {step.action}
                </text>
                {/* Response Label (if exists) */}
                {step.response && (
                  <text
                    x={(fromX + toX) / 2}
                    y={y + 12}
                    textAnchor="middle"
                    fill="#8888a0"
                    fontSize={8}
                    fontStyle="italic"
                  >
                    [{step.response}]
                  </text>
                )}
                {/* Step Number */}
                <circle cx={fromX} cy={y} r={8} fill="#7c5cfc" />
                <text x={fromX} y={y + 3} textAnchor="middle" fill="white" fontSize={8} fontWeight="bold">
                  {i + 1}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="bg-[#12121a] rounded-lg p-4 border border-[#2a2a3a]">
        <h4 className="text-sm font-medium text-[#e4e4ed] mb-3">시퀀스 요약</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#7c5cfc]">{actors.length}</p>
            <p className="text-xs text-[#8888a0]">참여 컴포넌트</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#4a9eff]">{steps.length}</p>
            <p className="text-xs text-[#8888a0]">상호작용 단계</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#9d85fc]">{steps.filter(s => s.response).length}</p>
            <p className="text-xs text-[#8888a0]">응답 포인트</p>
          </div>
        </div>
      </div>
    </div>
  );
}
