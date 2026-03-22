import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { DemoSessionProvider } from '@/contexts/DemoSessionContext';
import { LanguageProvider } from '@/contexts/LanguageContext';

const inter = localFont({
  src: '../../public/fonts/inter-latin.woff2',
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AI-DLC Demo Showcase',
  description: 'Experience AI-Driven Development Life Cycle in action',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <DemoSessionProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </DemoSessionProvider>
      </body>
    </html>
  );
}
