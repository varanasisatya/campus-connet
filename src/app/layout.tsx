import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { CursorTracker } from '@/components/CursorTracker';
import { AuthSessionProvider } from '@/components/AuthSessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Campus Connect AI | Smart Campus Ecosystem',
  description: 'AI-powered smart campus ecosystem with intelligent event recommendations, analytics dashboards, and smart lost & found matching.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} bg-[#020617] text-white min-h-screen antialiased selection:bg-blue-500/30`}>
        <a href="#main-content" className="fixed left-3 top-3 z-[10000] -translate-y-20 rounded-full bg-lime-300 px-4 py-2 text-sm font-black text-black transition focus:translate-y-0">Skip to main content</a>
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <CursorTracker />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
          }}
        />
      </body>
    </html>
  );
}
