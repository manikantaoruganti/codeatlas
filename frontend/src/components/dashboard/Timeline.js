import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export const Timeline = ({ items }) => {
  return (
    <div className="relative pl-6 border-l border-zinc-800 space-y-6">
      {items.map((item, index) => (
        <div key={index} className="relative">
          <div className="absolute -left-[31px] top-0.5 bg-zinc-950 p-0.5 rounded-full border border-zinc-800">
            {item.completed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/10" />
            ) : (
              <Circle className="w-4 h-4 text-zinc-600" />
            )}
          </div>
          <div>
            {item.date && <span className="text-[10px] text-zinc-500 font-mono block mb-0.5">{item.date}</span>}
            <h4 className="text-sm font-bold text-zinc-200">{item.title}</h4>
            {item.description && <p className="text-xs text-zinc-400 mt-1">{item.description}</p>}
            {item.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
