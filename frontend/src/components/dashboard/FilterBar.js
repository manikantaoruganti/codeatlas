import React from 'react';
import { cn } from '@/lib/utils';

export const FilterBar = ({ options, activeValue, onChange, label = 'Filter By:' }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {label && <span className="text-zinc-500 font-semibold uppercase tracking-wider mr-1">{label}</span>}
      <div className="flex flex-wrap gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800/80">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-3 py-1.5 rounded-md font-medium transition-all duration-200 uppercase tracking-wide text-[10px]',
              activeValue === opt.value
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};
