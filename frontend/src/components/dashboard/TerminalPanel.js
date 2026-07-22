import React from 'react';
import { Terminal, Copy, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const TerminalPanel = ({ output, loading, onClear }) => {
  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success('Terminal output copied!');
  };

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 overflow-hidden flex flex-col h-full min-h-[400px]">
      {/* Terminal Header */}
      <div className="bg-zinc-900 px-4 py-3 flex items-center justify-between border-b border-zinc-800/60 select-none">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 block" />
          </div>
          <span className="h-4 w-[1px] bg-zinc-800 mx-2 block" />
          <div className="flex items-center space-x-1.5 text-zinc-400 font-mono text-xs">
            <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>bash</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleCopy} 
            disabled={!output}
            className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition disabled:opacity-30"
            title="Copy Output"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onClear} 
            disabled={!output}
            className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-850 transition disabled:opacity-30"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 p-5 font-mono text-sm overflow-auto text-zinc-300 space-y-2 select-text leading-relaxed">
        {loading ? (
          <div className="flex items-center space-x-2 text-zinc-500 animate-pulse">
            <span>$</span>
            <span>Executing compiler pipelines...</span>
            <span className="w-1.5 h-4 bg-zinc-400 inline-block animate-ping" />
          </div>
        ) : output ? (
          <pre className="whitespace-pre-wrap font-mono text-zinc-100">{output}</pre>
        ) : (
          <div className="text-zinc-600 flex flex-col items-center justify-center h-full min-h-[300px] select-none">
            <Terminal className="w-8 h-8 mb-2 opacity-25" />
            <p>Console output will appear here after compilation runs.</p>
          </div>
        )}
      </div>
    </div>
  );
};
