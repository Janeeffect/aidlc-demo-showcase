'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { ProductionEstimate, TeamMember } from '@/types/demo';

interface ResultSummaryProps {
  demoMinutes: number;
  estimate: ProductionEstimate;
  qrCodeUrl?: string;
  onReset: () => void;
}

export default function ResultSummary({
  demoMinutes,
  estimate,
  qrCodeUrl = 'https://aws.amazon.com/ko/developer/generative-ai/',
  onReset,
}: ResultSummaryProps) {
  return (
    <div className="bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-xl p-6 text-[#e4e4ed]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-2">축하합니다</h2>
        <p className="text-[#8888a0]">AI-DLC로 MVP를 완성했습니다</p>
      </motion.div>

      {/* Time Comparison */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1a1a25] rounded-lg p-6 mb-6 border border-[#2a2a3a]"
      >
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-[#8888a0] text-sm mb-1">AI-DLC 소요 시간</p>
            <p className="text-4xl font-bold text-[#4a9eff]">
              {demoMinutes}분
            </p>
          </div>
          <div>
            <p className="text-[#8888a0] text-sm mb-1">기존 방식 예상</p>
            <p className="text-4xl font-bold text-[#ff9900]">
              {estimate.traditionalDays}일
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold kiro-gradient-text">
            {Math.round((estimate.traditionalDays * 8 * 60) / demoMinutes)}배 빠른 개발
          </p>
        </div>
      </motion.div>

      {/* Production Estimate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#1a1a25] rounded-lg p-6 mb-6 border border-[#2a2a3a]"
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          Production 예상 정보
        </h3>

        <div className="space-y-4">
          {/* Duration */}
          <div className="flex justify-between items-center">
            <span className="text-[#8888a0]">예상 기간</span>
            <span className="font-bold text-lg">{estimate.estimatedDuration}</span>
          </div>

          {/* Team Size */}
          <div className="flex justify-between items-center">
            <span className="text-[#8888a0]">예상 인원</span>
            <span className="font-bold text-lg">{estimate.estimatedTeamSize}명</span>
          </div>

          {/* Team Composition */}
          <div>
            <p className="text-[#8888a0] mb-2">팀 구성</p>
            <div className="grid grid-cols-2 gap-2">
              {estimate.teamComposition.map((member, index) => (
                <div 
                  key={index}
                  className="bg-[#12121a] rounded-lg p-3 flex items-center gap-2 border border-[#2a2a3a]"
                >
                  <span className="text-xl">{getRoleIcon(member.role)}</span>
                  <div>
                    <p className="font-medium text-sm">{member.role}</p>
                    <p className="text-xs text-[#8888a0]">{member.count}명</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* QR Code & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="bg-white p-4 rounded-lg mb-4">
          <QRCodeSVG value={qrCodeUrl} size={120} />
        </div>
        <p className="text-[#8888a0] text-sm mb-6">
          QR 코드를 스캔하여 더 알아보세요
        </p>

        <button
          onClick={onReset}
          className="w-full bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] hover:from-[#6b4beb] hover:to-[#3a8eef] text-white py-4 rounded-lg 
            font-bold text-lg transition-all"
        >
          처음으로 돌아가기
        </button>
      </motion.div>
    </div>
  );
}

function getRoleIcon(role: string): string {
  const roleIcons: Record<string, string> = {
    '프론트엔드': '🎨',
    'Frontend': '🎨',
    '백엔드': '⚙️',
    'Backend': '⚙️',
    '디자이너': '🖌️',
    'Designer': '🖌️',
    'PM': '📋',
    'Project Manager': '📋',
    'DevOps': '🔧',
    'QA': '🔍',
    'Full Stack': '💻',
    '풀스택': '💻',
  };

  return roleIcons[role] || '👤';
}
