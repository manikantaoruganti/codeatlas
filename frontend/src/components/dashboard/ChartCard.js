import React from 'react';
import { GlassCard } from './GlassCard';

export const ChartCard = ({ title, description, children, action }) => {
  return (
    <GlassCard hoverEffect={false} className="border border-zinc-800/80">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-zinc-100">{title}</h3>
          {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full relative">
        {children}
      </div>
    </GlassCard>
  );
};
