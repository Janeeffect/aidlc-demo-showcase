'use client';

import React from 'react';
import { useTranslation } from '@/i18n';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className }: LanguageToggleProps) {
  const { locale, setLocale } = useTranslation();

  const handleToggle = () => {
    setLocale(locale === 'ko' ? 'en' : 'ko');
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-3 py-1.5 text-xs font-medium rounded-md border border-[#2a2a3a] bg-[#1a1a25] text-[#b0b0c0] hover:text-[#e4e4ed] hover:bg-[#2a2a3a] transition-all ${className || ''}`}
      aria-label={locale === 'ko' ? 'Switch to English' : '한국어로 전환'}
    >
      {locale === 'ko' ? 'EN' : 'KO'}
    </button>
  );
}
