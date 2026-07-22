import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const GlassCard = ({ children, className, delay = 0, hoverEffect = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay, ease: 'easeOut' }}
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'glass-card rounded-xl p-6 relative overflow-hidden',
        hoverEffect && 'hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8),0_0_20px_rgba(37,99,235,0.15)] hover:border-blue-500/30',
        className
      )}
      {...props}
    >
      {/* Subtle top reflection line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};
