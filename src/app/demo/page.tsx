'use client';

import React, { useState, useEffect, Suspense, useMemo, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDemoSession } from '@/contexts/DemoSessionContext';
import KiroIDELayout from '@/components/kiro-ide/KiroIDELayout';
import { ChatMessage, DemoStep } from '@/types/demo';
import { generateDemoSteps } from '@/utils/demoStepGenerator';
import { detectScenario } from '@/utils/scenarioDetector';
import { useDemoProgress } from '@/hooks/useDemoProgress';
import { useRunStep, RunStepCallbacks } from '@/hooks/useRunStep';
import AnimationOrchestrator from '@/components/animation/AnimationOrchestrator';
import { AnimationSequence } from '@/types/animation';
import { useTranslation } from '@/i18n';
import LanguageToggle from '@/components/ui/LanguageToggle';

function DemoPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectIdea = searchParams.get('idea') || '';
  const scenarioId = searchParams.get('scenario') || detectScenario(projectIdea).id;

  const { state, setPhase, setStage, addFile, setProgress, setScenarioId } = useDemoSession();
  const { t } = useTranslation();

  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [fileContentsMap, setFileContentsMap] = useState<Record<string, string>>({});
  const [currentAnimSequence, setCurrentAnimSequence] = useState<AnimationSequence | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [chatSpeed, setChatSpeed] = useState(1); // 0.5x ~ 3x

  const demoSteps = useMemo(() => generateDemoSteps(projectIdea, scenarioId), [projectIdea, scenarioId]);

  // CR-05 fix: editorContent를 activeFile + fileContentsMap에서 파생
  const editorContent = useMemo(() => {
    if (!activeFile) return '';
    // fileContentsMap에 키가 존재하면 (빈 문자열 포함) 해당 값 사용
    if (activeFile in fileContentsMap) return fileContentsMap[activeFile];
    // fallback: demoSteps에서 매칭
    const matched = demoSteps.find(step => step.fileName === activeFile);
    return matched?.fileContent || '';
  }, [activeFile, fileContentsMap, demoSteps]);

  const onComplete = useCallback(() => {
    setIsNavigating(true);
    router.push(`/result?idea=${encodeURIComponent(projectIdea)}&scenario=${scenarioId}`);
  }, [router, projectIdea, scenarioId]);

  const {
    currentStep, isAnimating, stepCompleted, isLastStep, canGoNext, canGoPrev,
    handleNextStep, handlePrevStep, setIsAnimating, setStepCompleted,
  } = useDemoProgress(demoSteps.length, onComplete);

  const allMessagesRef = useRef<ChatMessage[]>([]);

  const callbacks: RunStepCallbacks = useMemo(() => ({
    onChatReset: (msgs) => { allMessagesRef.current = msgs; setChatMessages([...msgs]); },
    onChatMessage: (msg) => { allMessagesRef.current = [...allMessagesRef.current, msg]; setChatMessages([...allMessagesRef.current]); },
    onFileAdd: (file) => {
      addFile(file);
      // CR-05: 해당 step의 fileContent를 즉시 저장
      const matchedStep = demoSteps.find(step => step.fileName === file.path);
      if (matchedStep) {
        setFileContentsMap(prev => ({ ...prev, [file.path]: matchedStep.fileContent }));
      }
    },
    onEditorContent: (content, fileName) => {
      // CR-05 fix: fileContentsMap에 저장하여 파일별 콘텐츠 유지
      if (fileName) {
        setFileContentsMap(prev => ({ ...prev, [fileName]: content }));
      }
    },
    onActiveFile: (path) => { setActiveFile(path); },
    onPhaseChange: (phase, stage) => { setPhase(phase); setStage(stage); },
    onProgress: (p) => { setProgress(p); },
    onStepComplete: () => { setStepCompleted(true); setCurrentAnimSequence(demoSteps[currentStep]?.animationSequence || null); },
    onAnimatingChange: (v) => { setIsAnimating(v); },
    onTypingChange: (v) => { setIsTyping(v); },
  }), [addFile, setPhase, setStage, setProgress, setStepCompleted, setIsAnimating, demoSteps, currentStep]);

  const { runStep } = useRunStep(demoSteps, callbacks, chatSpeed);

  // 첫 진입 시 자동 시작
  const hasStarted = useRef(false);
  useEffect(() => {
    if (!projectIdea) { router.push('/'); return; }
    if (!hasStarted.current) {
      hasStarted.current = true;
      setScenarioId(scenarioId);
      runStep(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectIdea]);

  // 단계 전환 시 runStep 호출
  useEffect(() => {
    if (hasStarted.current && currentStep > 0) {
      runStep(currentStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleFileClick = (path: string) => {
    setActiveFile(path);
    // CR-05 fix: editorContent는 useMemo로 activeFile + fileContentsMap에서 자동 파생
  };

  const handleBack = () => { router.push('/'); };

  if (!projectIdea) return null;

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <div className="bg-[#12121a] border-b border-[#2a2a3a] px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={handleBack} className="px-4 py-2 text-sm text-[#b0b0c0] hover:text-[#e4e4ed] transition-colors">
            {t('demo.backToStart')}
          </button>
          {canGoPrev && (
            <>
              <div className="w-px h-4 bg-[#2a2a3a]" />
              <button onClick={handlePrevStep} className="px-4 py-2 text-sm text-[#b0b0c0] hover:text-[#e4e4ed] transition-colors">
                {t('demo.prevStep')}
              </button>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#b0b0c0]">
            {currentStepData?.label} ({currentStep + 1}/{demoSteps.length})
          </span>
          <div className="flex gap-1">
            {demoSteps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                i < currentStep ? 'bg-[#4a9eff]' : i === currentStep ? 'bg-[#7c5cfc]' : 'bg-[#2a2a3a]'
              }`} />
            ))}
          </div>
          <LanguageToggle />
          {/* 속도 조절기 */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#8888a0]">속도</span>
            <select
              value={chatSpeed}
              onChange={(e) => setChatSpeed(Number(e.target.value))}
              className="bg-[#0a0a0f] text-[#e4e4ed] text-xs px-1.5 py-1 rounded border border-[#2a2a3a] focus:outline-none focus:border-[#7c5cfc]"
              aria-label="대화 속도 조절"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
          </div>
          <button
            onClick={handleNextStep}
            disabled={!canGoNext}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              !canGoNext
                ? 'bg-[#2a2a3a] text-[#666] cursor-not-allowed'
                : isLastStep
                  ? 'bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-white hover:from-[#16a34a] hover:to-[#22c55e] animate-pulse'
                  : 'bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white hover:from-[#6b4beb] hover:to-[#3a8eef] animate-pulse'
            }`}
          >
            {isAnimating ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('demo.inProgress')}
              </span>
            ) : isLastStep ? t('demo.viewResult') : t('demo.nextStep')}
          </button>
        </div>
      </div>
      <KiroIDELayout
        files={state.files}
        activeFile={activeFile}
        editorContent={editorContent}
        onFileClick={handleFileClick}
        isTyping={isTyping}
        isAnimating={isAnimating}
        chatMessages={chatMessages}
      />
      <AnimationOrchestrator
        sequence={currentAnimSequence}
        speed={1.5}
        autoStart={true}
      />
      {isNavigating && (
        <div className="fixed inset-0 bg-[#0a0a0f]/80 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#7c5cfc] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#e4e4ed] text-sm">결과 페이지로 이동 중...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#7c5cfc] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-[#e4e4ed]">Loading Kiro...</div>
        </div>
      </div>
    }>
      <DemoPageContent />
    </Suspense>
  );
}
