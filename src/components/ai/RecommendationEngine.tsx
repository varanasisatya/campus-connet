'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface RecommendationEngineProps {
  onComplete: () => void;
  title?: string;
  duration?: number;
}

export function RecommendationEngine({ onComplete, title = "Curating your personalized feed...", duration = 2000 }: RecommendationEngineProps) {
  const [isCalculating, setIsCalculating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCalculating(false);
      setTimeout(onComplete, 500); // Give time for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isCalculating && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          className="w-full mb-8"
        >
          <GlassCard className="p-8 border-purple-500/30 flex flex-col items-center justify-center text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="relative w-16 h-16 mb-4"
            >
              <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 opacity-50" />
              <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-500 opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
            </motion.div>
            
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              Campus AI Engine
            </h3>
            <p className="text-slate-400 text-sm">
              {title}
            </p>
            
            {/* Fake progress bar */}
            <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: duration / 1000, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
