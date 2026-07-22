import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyState = ({ title = 'No results found', description = 'Try adjusting your filters or search query.', action, icon: Icon = AlertCircle }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 glass-card rounded-xl border border-zinc-800/80 min-h-[300px]">
      <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 mb-4">
        <Icon className="w-8 h-8 opacity-60" />
      </div>
      <h3 className="text-lg font-bold text-zinc-200">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mt-2 leading-relaxed">{description}</p>
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};
