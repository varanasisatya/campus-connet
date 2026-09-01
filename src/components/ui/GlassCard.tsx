'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  hoverEffect?: boolean;
}

export const GlassCard = ({ className, hoverEffect = true, children, ...props }: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : {}}
      className={cn(
        'glass-card p-6 overflow-hidden relative',
        className
      )}
      {...props}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
      {children as React.ReactNode}
    </motion.div>
  );
};
