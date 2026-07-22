import React from 'react';
import { GitCommit, Play, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';

export const ActivityFeed = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'analysis':
        return <RefreshCw className="w-3.5 h-3.5 text-blue-400" />;
      case 'compile':
        return <Play className="w-3.5 h-3.5 text-emerald-400" />;
      case 'insight':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'alert':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
      default:
        return <GitCommit className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((act, index) => (
        <div key={index} className="flex items-start space-x-3 text-xs">
          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 shrink-0 mt-0.5">
            {getIcon(act.type)}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-200">{act.message}</span>
              <span className="text-[10px] text-zinc-500 font-mono">{act.time}</span>
            </div>
            {act.details && <p className="text-[11px] text-zinc-500 leading-normal">{act.details}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};
