'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CodeEditorProps {
  content: string;
  language?: string;
  isTyping?: boolean;
  typingSpeed?: number;
  onTypingComplete?: () => void;
}

export default function CodeEditor({
  content,
  language = 'markdown',
  isTyping = false,
  typingSpeed = 30,
  onTypingComplete,
}: CodeEditorProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedContent(content);
      setCurrentIndex(content.length);
      return;
    }

    // Reset when content changes
    setDisplayedContent('');
    setCurrentIndex(0);
  }, [content, isTyping]);

  useEffect(() => {
    if (!isTyping || currentIndex >= content.length) {
      if (isTyping && currentIndex >= content.length) {
        onTypingComplete?.();
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedContent(content.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
      
      // Auto-scroll to bottom
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [content, currentIndex, isTyping, typingSpeed, onTypingComplete]);

  const lines = displayedContent.split('\n');

  return (
    <div 
      ref={containerRef}
      className="h-full overflow-auto bg-kiro-editor p-4 font-mono text-sm"
    >
      <div className="flex">
        {/* Line Numbers */}
        <div className="pr-4 text-right text-kiro-text-dim select-none border-r border-kiro-border mr-4">
          {lines.map((_, index) => (
            <div key={index} className="leading-6">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <pre className="whitespace-pre-wrap leading-6">
            <code className={`language-${language}`}>
              {highlightSyntax(displayedContent, language)}
            </code>
            {isTyping && currentIndex < content.length && (
              <span className="inline-block w-2 h-5 bg-kiro-text animate-cursor-blink ml-0.5" />
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}

function highlightSyntax(content: string, language: string): React.ReactNode {
  // Simple syntax highlighting
  if (language === 'markdown') {
    return content.split('\n').map((line, i) => {
      let highlighted: React.ReactNode = line;

      // Headers
      if (line.startsWith('# ')) {
        highlighted = <span className="text-kiro-accent font-bold">{line}</span>;
      } else if (line.startsWith('## ')) {
        highlighted = <span className="text-kiro-accent">{line}</span>;
      } else if (line.startsWith('### ')) {
        highlighted = <span className="text-kiro-success">{line}</span>;
      }
      // Bold
      else if (line.includes('**')) {
        highlighted = line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <span key={j} className="text-kiro-warning font-bold">{part}</span>;
          }
          return part;
        });
      }
      // List items
      else if (line.trim().startsWith('- ')) {
        highlighted = <span className="text-kiro-text">{line}</span>;
      }
      // Code blocks
      else if (line.startsWith('```')) {
        highlighted = <span className="text-kiro-success">{line}</span>;
      }

      return (
        <React.Fragment key={i}>
          {highlighted}
          {i < content.split('\n').length - 1 && '\n'}
        </React.Fragment>
      );
    });
  }

  // TypeScript/JavaScript highlighting
  if (language === 'typescript' || language === 'javascript') {
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'from', 'interface', 'type', 'class', 'extends', 'implements'];
    
    return content.split('\n').map((line, i) => {
      let highlighted: React.ReactNode = line;

      // Comments
      if (line.trim().startsWith('//')) {
        highlighted = <span className="text-kiro-text-dim">{line}</span>;
      }
      // Strings
      else if (line.includes("'") || line.includes('"') || line.includes('`')) {
        highlighted = line.split(/('.*?'|".*?"|`.*?`)/).map((part, j) => {
          if ((part.startsWith("'") && part.endsWith("'")) ||
              (part.startsWith('"') && part.endsWith('"')) ||
              (part.startsWith('`') && part.endsWith('`'))) {
            return <span key={j} className="text-kiro-warning">{part}</span>;
          }
          return part;
        });
      }

      return (
        <React.Fragment key={i}>
          {highlighted}
          {i < content.split('\n').length - 1 && '\n'}
        </React.Fragment>
      );
    });
  }

  return content;
}
