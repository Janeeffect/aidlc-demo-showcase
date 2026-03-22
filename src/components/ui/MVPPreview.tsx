'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

interface MVPPreviewProps {
  projectIdea: string;
}

// Shimmer loading skeleton
function MVPLoadingSkeleton() {
  return (
    <div className="h-full flex flex-col bg-gray-50 animate-pulse">
      <div className="h-14 bg-gray-200 shimmer" />
      <div className="flex-1 p-4 space-y-3">
        <div className="h-8 bg-gray-200 rounded shimmer w-3/4" />
        <div className="h-24 bg-gray-200 rounded shimmer" />
        <div className="h-24 bg-gray-200 rounded shimmer" />
        <div className="h-16 bg-gray-200 rounded shimmer w-1/2" />
      </div>
    </div>
  );
}

// Dynamic imports for code splitting - inline object literals required by Next.js SWC
const EcommerceUser = dynamic(() => import('./mvp-previews/EcommerceMVP').then(m => ({ default: m.EcommerceUserMVP })), { loading: () => <MVPLoadingSkeleton />, ssr: false });
const EcommerceAdmin = dynamic(() => import('./mvp-previews/EcommerceMVP').then(m => ({ default: m.EcommerceAdminMVP })), { loading: () => <MVPLoadingSkeleton />, ssr: false });
const BookingUser = dynamic(() => import('./mvp-previews/BookingMVP').then(m => ({ default: m.BookingUserMVP })), { loading: () => <MVPLoadingSkeleton />, ssr: false });
const BookingAdmin = dynamic(() => import('./mvp-previews/BookingMVP').then(m => ({ default: m.BookingAdminMVP })), { loading: () => <MVPLoadingSkeleton />, ssr: false });
const LearningUser = dynamic(() => import('./mvp-previews/LearningMVP').then(m => ({ default: m.LearningUserMVP })), { loading: () => <MVPLoadingSkeleton />, ssr: false });
const LearningAdmin = dynamic(() => import('./mvp-previews/LearningMVP').then(m => ({ default: m.LearningAdminMVP })), { loading: () => <MVPLoadingSkeleton />, ssr: false });
const ChatUser = dynamic(() => import('./mvp-previews/ChatMVP').then(m => ({ default: m.ChatUserMVP })), { loading: () => <MVPLoadingSkeleton />, ssr: false });
const ChatAdmin = dynamic(() => import('./mvp-previews/ChatMVP').then(m => ({ default: m.ChatAdminMVP })), { loading: () => <MVPLoadingSkeleton />, ssr: false });
const DashboardUser = dynamic(() => import('./mvp-previews/DashboardMVP').then(m => ({ default: m.DashboardUserMVP })), { loading: () => <MVPLoadingSkeleton />, ssr: false });
const DashboardAdmin = dynamic(() => import('./mvp-previews/DashboardMVP').then(m => ({ default: m.DashboardAdminMVP })), { loading: () => <MVPLoadingSkeleton />, ssr: false });

export default function MVPPreview({ projectIdea }: MVPPreviewProps) {
  const [activeDevice, setActiveDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [activePersona, setActivePersona] = useState<'user' | 'admin'>('user');

  const getPersonaLabels = () => {
    const idea = projectIdea.toLowerCase();
    if (idea.includes('쇼핑') || idea.includes('이커머스') || idea.includes('주문')) {
      return { user: '고객', admin: '판매자' };
    }
    if (idea.includes('예약') || idea.includes('booking') || idea.includes('진료')) {
      return { user: '고객', admin: '서비스 제공자' };
    }
    if (idea.includes('교육') || idea.includes('강의') || idea.includes('학습')) {
      return { user: '학습자', admin: '강사' };
    }
    if (idea.includes('채팅') || idea.includes('협업')) {
      return { user: '팀원', admin: '관리자' };
    }
    return { user: '사용자', admin: '관리자' };
  };

  const labels = getPersonaLabels();

  const renderMVPContent = () => {
    const idea = projectIdea.toLowerCase();
    
    if (idea.includes('쇼핑') || idea.includes('상품') || idea.includes('주문') || idea.includes('이커머스')) {
      return activePersona === 'user' ? <EcommerceUser /> : <EcommerceAdmin />;
    }
    if (idea.includes('예약') || idea.includes('booking') || idea.includes('진료')) {
      return activePersona === 'user' ? <BookingUser /> : <BookingAdmin />;
    }
    if (idea.includes('교육') || idea.includes('강의') || idea.includes('학습') || idea.includes('lms')) {
      return activePersona === 'user' ? <LearningUser /> : <LearningAdmin />;
    }
    if (idea.includes('채팅') || idea.includes('chat') || idea.includes('협업')) {
      return activePersona === 'user' ? <ChatUser /> : <ChatAdmin />;
    }
    return activePersona === 'user' ? <DashboardUser title={projectIdea} /> : <DashboardAdmin title={projectIdea} />;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Persona & Device Toggle */}
      <div className="flex gap-6 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActivePersona('user')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activePersona === 'user' ? 'bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white' : 'bg-[#2a2a3a] text-[#e4e4ed]'
            }`}
          >
            {labels.user}
          </button>
          <button
            onClick={() => setActivePersona('admin')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activePersona === 'admin' ? 'bg-gradient-to-r from-[#22c55e] to-[#4ade80] text-white' : 'bg-[#2a2a3a] text-[#e4e4ed]'
            }`}
          >
            {labels.admin}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveDevice('mobile')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeDevice === 'mobile' ? 'bg-[#7c5cfc] text-white' : 'bg-[#2a2a3a] text-[#e4e4ed]'
            }`}
          >
            모바일
          </button>
          <button
            onClick={() => setActiveDevice('desktop')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              activeDevice === 'desktop' ? 'bg-[#7c5cfc] text-white' : 'bg-[#2a2a3a] text-[#e4e4ed]'
            }`}
          >
            데스크톱
          </button>
        </div>
      </div>

      <motion.div layout className={`bg-[#000] rounded-2xl p-1 ${activeDevice === 'mobile' ? 'w-[320px]' : 'w-full max-w-4xl'}`}>
        <div className="bg-[#1a1a1a] rounded-t-xl px-4 py-1.5 flex items-center justify-between">
          {activeDevice === 'mobile' ? (
            <div className="w-full flex justify-center"><div className="w-16 h-1 bg-[#333] rounded-full" /></div>
          ) : (
            <>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className={`text-xs ${activePersona === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
                {activePersona === 'user' ? labels.user : labels.admin} 화면
              </span>
              <div className="w-12" />
            </>
          )}
        </div>
        <div className={`bg-white rounded-b-xl overflow-hidden ${activeDevice === 'mobile' ? 'h-[560px]' : 'h-[480px]'}`}>
          {renderMVPContent()}
        </div>
      </motion.div>
      <p className="mt-4 text-[#b0b0c0] text-sm">실제 작동하는 MVP - 두 페르소나 모두 테스트 가능</p>
    </div>
  );
}