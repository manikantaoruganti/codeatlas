import React from 'react';
import { cn } from '@/lib/utils';

export const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (variant === 'kpi') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-6 border border-zinc-800/80 h-32 relative overflow-hidden">
            <div className="h-3 w-20 rounded bg-zinc-800 shimmer mb-4" />
            <div className="h-8 w-28 rounded bg-zinc-800 shimmer mb-2" />
            <div className="h-3.5 w-40 rounded bg-zinc-800 shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-4">
        {items.map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-5 border border-zinc-800/80 flex items-start space-x-4 relative overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-zinc-800 shimmer shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 rounded bg-zinc-800 shimmer" />
              <div className="h-3 w-2/3 rounded bg-zinc-800 shimmer" />
              <div className="h-3 w-1/2 rounded bg-zinc-800 shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card variant
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {items.map((_, i) => (
        <div key={i} className="glass-card rounded-xl p-6 border border-zinc-800/80 h-[300px] relative overflow-hidden">
          <div className="h-4 w-1/4 rounded bg-zinc-800 shimmer mb-6" />
          <div className="h-[200px] w-full rounded bg-zinc-800 shimmer" />
        </div>
      ))}
    </div>
  );
};
