'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Position } from '@/types/animation';

interface MousePointerProps {
  position: Position;
  isClicking: boolean;
  isVisible: boolean;
}

export default function MousePointer({ 
  position, 
  isClicking, 
  isVisible 
}: MousePointerProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      initial={{ x: position.x, y: position.y }}
      animate={{ 
        x: position.x, 
        y: position.y,
        scale: isClicking ? 0.9 : 1,
      }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
    >
      {/* Cursor SVG */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87c.89 0 1.33-1.08.7-1.71L6.35 2.65c-.31-.31-.85-.09-.85.56Z"
          fill="white"
          stroke="black"
          strokeWidth="1.5"
        />
      </svg>

      {/* Click Effect */}
      {isClicking && (
        <motion.div
          className="absolute top-0 left-0 w-8 h-8 rounded-full bg-kiro-accent/30"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
}
