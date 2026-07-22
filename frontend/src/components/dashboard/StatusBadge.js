import React from 'react';
import { cn } from '@/lib/utils';

export const StatusBadge = ({ status, className }) => {
  const getBadgeStyle = (val) => {
    const v = (val || '').toLowerCase();
    if (v === 'critical' || v === 'error' || v === 'high' && val === 'critical') {
      return 'bg-red-500/10 text-red-400 border-red-500/35 shadow-[0_0_12px_rgba(239,68,68,0.15)]';
    }
    if (v === 'high') {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/35 shadow-[0_0_12px_rgba(245,158,11,0.15)]';
    }
    if (v === 'medium' || v === 'warning') {
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]';
    }
    if (v === 'low' || v === 'info' || v === 'success') {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
    }
    return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase',
        getBadgeStyle(status),
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current animate-pulse" />
      {status}
    </span>
  );
};
