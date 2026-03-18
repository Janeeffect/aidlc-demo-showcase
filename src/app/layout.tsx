import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DemoSessionProvider } from '@/contexts/DemoSessionContext';

const inter = Inter({ subsets: ['latin'] });

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
          {children}
        </DemoSessionProvider>
      </body>
    </html>
  );
}
