import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  CommandSeparator 
} from '@/components/ui/command';
import { FolderGit, Terminal, Settings as SettingsIcon, LayoutDashboard, HelpCircle, Code } from 'lucide-react';

export const CommandPalette = ({ open, setOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setOpen]);

  const runCommand = (action) => {
    setOpen(false);
    action();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <CommandInput placeholder="Type a command or search page..." className="border-none focus:ring-0 text-zinc-100" />
        <CommandList className="bg-zinc-950 max-h-[300px]">
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Navigation" className="text-zinc-500">
            <CommandItem 
              onSelect={() => runCommand(() => navigate('/workspace'))}
              className="flex items-center gap-2 px-4 py-3 cursor-pointer text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <FolderGit className="w-4 h-4 text-blue-400" />
              <span>Go to Workspace</span>
            </CommandItem>
            <CommandItem 
              onSelect={() => runCommand(() => navigate('/compiler'))}
              className="flex items-center gap-2 px-4 py-3 cursor-pointer text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Go to Compiler IDE</span>
            </CommandItem>
            <CommandItem 
              onSelect={() => runCommand(() => navigate('/settings'))}
              className="flex items-center gap-2 px-4 py-3 cursor-pointer text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <SettingsIcon className="w-4 h-4 text-amber-400" />
              <span>Settings Configuration</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="bg-zinc-850" />

          <CommandGroup heading="Quick Actions" className="text-zinc-500">
            <CommandItem 
              onSelect={() => runCommand(() => {
                navigate('/compiler');
              })}
              className="flex items-center gap-2 px-4 py-3 cursor-pointer text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <Code className="w-4 h-4 text-purple-400" />
              <span>Execute code sandbox</span>
            </CommandItem>
            <CommandItem 
              onSelect={() => runCommand(() => window.open('https://github.com', '_blank'))}
              className="flex items-center gap-2 px-4 py-3 cursor-pointer text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <HelpCircle className="w-4 h-4 text-zinc-400" />
              <span>View GitHub documentation</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </div>
    </CommandDialog>
  );
};
