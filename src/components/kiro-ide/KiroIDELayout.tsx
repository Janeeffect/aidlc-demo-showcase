'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileTreeNode } from '@/types/demo';
import FileExplorer from './FileExplorer';
import PhaseIndicator from './PhaseIndicator';

interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
}

interface KiroIDELayoutProps {
  files: FileTreeNode[];
  activeFile: string | null;
  editorContent: string;
  onFileClick?: (path: string) => void;
  isTyping?: boolean;
  isAnimating?: boolean;
  chatMessages: ChatMessage[];
}

export default function KiroIDELayout({
  files,
  activeFile,
  editorContent,
  onFileClick,
  isTyping = false,
  isAnimating = false,
  chatMessages,
}: KiroIDELayoutProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-[#e4e4ed] font-sans">
      {/* Title Bar */}
      <div className="flex items-center h-9 bg-[#12121a] border-b border-[#2a2a3a] px-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-2">
          <KiroIcon size={18} />
          <span className="text-sm font-medium text-[#e4e4ed]">Kiro</span>
          <span className="text-xs text-[#8888a0] ml-2">AI-DLC Demo</span>
        </div>
      </div>

      {/* Phase Indicator */}
      <PhaseIndicator />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: File Explorer */}
        <div className="w-56 bg-[#12121a] border-r border-[#2a2a3a] flex flex-col">
          <div className="px-3 py-2 text-[11px] uppercase text-[#8888a0] font-semibold tracking-wide">
            탐색기
          </div>
          <div className="flex-1 overflow-auto">
            <FileExplorer files={files} selectedFile={activeFile} onFileClick={onFileClick} />
          </div>
        </div>

        {/* Center: Document Preview */}
        <div className="flex-1 flex flex-col bg-[#0a0a0f] border-r border-[#2a2a3a]">
          {activeFile && (
            <div className="h-9 bg-[#12121a] border-b border-[#2a2a3a] flex items-center">
              <div className="flex items-center px-4 h-full bg-[#0a0a0f] border-r border-[#2a2a3a] text-sm">
                <span className="text-[#e4e4ed]">{activeFile.split('/').pop()}</span>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-auto p-6">
            {activeFile ? (
              <MarkdownPreview content={editorContent} isTyping={isTyping} />
            ) : (
              <div className="flex items-center justify-center h-full text-[#8888a0]">
                <p>파일을 선택하세요</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Chat Panel */}
        <div className="w-80 bg-[#12121a] flex flex-col">
          <div className="px-4 py-3 border-b border-[#2a2a3a] flex items-center gap-2">
            <KiroIcon size={14} />
            <span className="text-sm font-medium text-[#e4e4ed]">Kiro Chat</span>
          </div>
          <div ref={chatContainerRef} className="flex-1 overflow-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-[#8888a0] text-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-[#7c5cfc] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-[#7c5cfc] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-[#7c5cfc] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Kiro가 응답 중...</span>
              </div>
            )}
            {!isTyping && isAnimating && (
              <div className="flex items-center gap-2 text-[#8888a0] text-sm">
                <div className="w-3 h-3 border-2 border-[#7c5cfc] border-t-transparent rounded-full animate-spin" />
                <span>단계 진행 중...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] flex items-center px-4 text-[11px] text-white">
        <div className="flex items-center gap-4">
          <span>Kiro</span>
          <span>main</span>
          {isAnimating && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
              처리 중
            </span>
          )}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>Markdown</span>
        </div>
      </div>
    </div>
  );
}

function KiroIcon({ size = 20 }: { size?: number }) {
  return (
    <img src="/kiro.jpg" alt="Kiro" width={size} height={size} className="rounded-sm object-contain" />
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isAI = message.type === 'ai';
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="text-center text-[11px] text-[#8888a0] py-2 border-b border-[#2a2a3a]">
        {message.content}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className="max-w-[90%]">
        {isAI && (
          <div className="flex items-center gap-2 mb-1">
            <KiroIcon size={12} />
            <span className="text-[11px] text-[#8888a0]">Kiro</span>
          </div>
        )}
        <div className={`px-3 py-2 rounded-lg text-sm leading-relaxed ${isAI ? 'bg-[#1a1a25] text-[#e4e4ed] border border-[#2a2a3a]' : 'bg-gradient-to-r from-[#7c5cfc] to-[#4a9eff] text-white'}`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </motion.div>
  );
}

function MarkdownPreview({ content, isTyping }: { content: string; isTyping: boolean }) {
  const lines = content.split('\n');
  return (
    <div className="text-sm leading-relaxed font-sans">
      {lines.map((line, index) => {
        if (line.startsWith('# ')) return <h1 key={index} className="text-xl font-semibold text-[#e4e4ed] mb-4 mt-6 first:mt-0">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-lg font-semibold text-[#e4e4ed] mb-3 mt-5">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={index} className="text-base font-medium text-[#e4e4ed] mb-2 mt-4">{line.slice(4)}</h3>;
        if (line.startsWith('---')) return <hr key={index} className="border-[#2a2a3a] my-4" />;
        if (line.startsWith('- ')) return <li key={index} className="text-[#e4e4ed] ml-4 mb-1 list-disc">{line.slice(2)}</li>;
        if (line.match(/^\d+\. /)) return <li key={index} className="text-[#e4e4ed] ml-4 mb-1 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
        if (line.startsWith('|')) {
          const cells = line.split('|').filter(c => c.trim());
          if (line.includes('---')) return null;
          return (<div key={index} className="flex border-b border-[#2a2a3a]">{cells.map((cell, i) => (<div key={i} className="flex-1 px-2 py-1 text-[#e4e4ed] text-xs">{cell.trim()}</div>))}</div>);
        }
        if (line.includes('**')) {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (<p key={index} className="text-[#e4e4ed] mb-2">{parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)}</p>);
        }
        if (!line.trim()) return <div key={index} className="h-2" />;
        return <p key={index} className="text-[#e4e4ed] mb-2">{line}</p>;
      })}
      {isTyping && <span className="inline-block w-2 h-4 bg-[#7c5cfc] animate-pulse ml-1" />}
    </div>
  );
}
