'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useDemoSession } from '@/contexts/DemoSessionContext';
import { Phase, Stage } from '@/types/demo';

interface OutputItem { id: string; name: string; }
interface StageConfig { id: Stage; label: string; outputs: OutputItem[]; }
interface PhaseConfig { id: Phase; label: string; stages: StageConfig[]; }

export default function PhaseIndicator() {
  const { state } = useDemoSession();
  const { currentPhase, currentStage, animationProgress } = state;

  const phaseConfigs: PhaseConfig[] = [
    {
      id: 'INCEPTION', label: 'INCEPTION',
      stages: [
        { id: 'requirements', label: '요구사항', outputs: [
          { id: 'r1', name: '시스템 요구사항' }, { id: 'r2', name: '기능 정의' },
          { id: 'r3', name: '비기능 요구사항' }, { id: 'r4', name: '인수 기준' },
        ]},
        { id: 'design', label: '설계', outputs: [
          { id: 'd1', name: '시스템 구조' }, { id: 'd2', name: '개발 단위' },
          { id: 'd3', name: '비즈니스 로직' }, { id: 'd4', name: 'API 명세' },
        ]},
      ],
    },
    {
      id: 'CONSTRUCTION', label: 'CONSTRUCTION',
      stages: [
        { id: 'code', label: '코드 생성', outputs: [
          { id: 'c1', name: '품질 속성 설계' }, { id: 'c2', name: '프론트엔드' },
          { id: 'c3', name: '백엔드' }, { id: 'c4', name: '품질 검증' },
        ]},
      ],
    },
    {
      id: 'OPERATIONS', label: 'OPERATIONS',
      stages: [
        { id: 'infrastructure', label: '인프라', outputs: [
          { id: 'i1', name: '인프라 설계' }, { id: 'i2', name: 'AWS 아키텍처' }, { id: 'i3', name: 'IaC 템플릿' },
        ]},
        { id: 'deployment', label: '운영', outputs: [
          { id: 'o1', name: 'CI/CD' }, { id: 'o2', name: '모니터링' }, { id: 'o3', name: '운영 체계' },
        ]},
      ],
    },
  ];

  const currentPhaseIndex = phaseConfigs.findIndex(p => p.id === currentPhase);
  const totalStages = phaseConfigs.reduce((acc, p) => acc + p.stages.length, 0);
  const completedStages = phaseConfigs.slice(0, currentPhaseIndex).reduce((acc, p) => acc + p.stages.length, 0) +
    (phaseConfigs[currentPhaseIndex]?.stages.findIndex(s => s.id === currentStage) ?? 0);
  const overallProgress = Math.round(((completedStages + animationProgress / 100) / totalStages) * 100);

  const isStageCompleted = (phaseIdx: number, stageIdx: number) => {
    if (phaseIdx < currentPhaseIndex) return true;
    if (phaseIdx === currentPhaseIndex) return stageIdx < (phaseConfigs[currentPhaseIndex]?.stages.findIndex(s => s.id === currentStage) ?? 0);
    return false;
  };

  const isCurrentStage = (phaseIdx: number, stageIdx: number) => {
    if (phaseIdx !== currentPhaseIndex) return false;
    return stageIdx === (phaseConfigs[currentPhaseIndex]?.stages.findIndex(s => s.id === currentStage) ?? 0);
  };

  return (
    <div className="bg-[#12121a] border-b border-[#2a2a3a] px-3 py-2">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-xs font-medium kiro-gradient-text">AI-DLC</span>
        <div className="flex-1 h-1 bg-[#2a2a3a] rounded-full overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff]" initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }} />
        </div>
        <span className="text-sm font-bold text-[#9d85fc]">{overallProgress}%</span>
      </div>

      <div className="flex gap-2">
        {phaseConfigs.map((phase, phaseIdx) => {
          const isActive = phase.id === currentPhase;
          const isPast = currentPhaseIndex > phaseIdx;
          
          return (
            <div key={phase.id} className={`flex-1 p-1.5 rounded border text-[9px] ${
              isActive ? 'bg-[#1a1a25] border-[#7c5cfc]/50' :
              isPast ? 'bg-[#1a1a25] border-[#4a9eff]/30' : 'bg-[#0a0a0f] border-[#2a2a3a] opacity-50'
            }`}>
              <div className="flex items-center gap-1 mb-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isPast ? 'bg-[#4a9eff]' : isActive ? 'bg-[#7c5cfc]' : 'bg-[#4a4a5a]'}`} />
                <span className={`font-semibold ${isActive ? 'text-[#9d85fc]' : isPast ? 'text-[#4a9eff]' : 'text-[#4a4a5a]'}`}>
                  {phase.label}
                </span>
              </div>

              <div className="flex gap-1">
                {phase.stages.map((stage, stageIdx) => {
                  const completed = isStageCompleted(phaseIdx, stageIdx);
                  const current = isCurrentStage(phaseIdx, stageIdx);
                  return (
                    <div key={stage.id} className="flex-1">
                      <div className={`flex items-center gap-0.5 mb-0.5 ${
                        current ? 'text-[#e4e4ed]' : completed ? 'text-[#4a9eff]' : 'text-[#4a4a5a]'
                      }`}>
                        <span>{completed ? '✓' : current ? '▶' : '○'}</span>
                        <span className="font-medium truncate">{stage.label}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-1 gap-y-0">
                        {stage.outputs.map((output, outputIdx) => {
                          const outputCompleted = completed || (current && animationProgress > (outputIdx + 1) * 25);
                          return (
                            <div key={output.id} className={`truncate ${outputCompleted ? 'text-[#4a9eff]' : 'text-[#3a3a4a]'}`}>
                              {outputCompleted ? '✓' : '○'} {output.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
