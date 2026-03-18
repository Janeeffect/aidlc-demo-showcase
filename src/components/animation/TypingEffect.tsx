'use client';

import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number; // ms per character
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
}

export default function TypingEffect({
  text,
  speed = 50,
  onComplete,
  className = '',
  showCursor = true,
}: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex >= text.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [text, currentIndex, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <span className="inline-block w-2 h-5 bg-current animate-cursor-blink ml-0.5" />
      )}
    </span>
  );
}

// Hook for typing effect
export function useTypingEffect(
  text: string,
  speed: number = 50,
  autoStart: boolean = true
) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isTyping || currentIndex >= text.length) {
      if (currentIndex >= text.length) {
        setIsComplete(true);
        setIsTyping(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [text, currentIndex, speed, isTyping]);

  const start = () => {
    setIsTyping(true);
  };

  const pause = () => {
    setIsTyping(false);
  };

  const reset = () => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
    setIsTyping(false);
  };

  const complete = () => {
    setDisplayedText(text);
    setCurrentIndex(text.length);
    setIsComplete(true);
    setIsTyping(false);
  };

  return {
    displayedText,
    isTyping,
    isComplete,
    progress: text.length > 0 ? (currentIndex / text.length) * 100 : 0,
    start,
    pause,
    reset,
    complete,
  };
}
