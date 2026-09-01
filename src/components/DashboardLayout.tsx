'use client';

import { Sidebar } from './Sidebar';
import { motion } from 'framer-motion';
import { AIChatBot } from './ai/AIChatBot';
import { CampusToolbar } from './CampusToolbar';
import { useCampusSync } from '@/hooks/useCampusSync';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  useCampusSync();
  return (
    <div className="min-h-screen bg-[#08070d] flex">
      <Sidebar />
      <main id="main-content" className="relative min-h-screen flex-1 overflow-x-hidden pb-20 md:ml-40 md:pb-0">
        <div className="mx-auto max-w-[1500px] p-3 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
        <CampusToolbar />
        <AIChatBot />
      </main>
    </div>
  );
}
