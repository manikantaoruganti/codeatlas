import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { compilerService } from '@/services/api';
import { Play, Loader2, Terminal, Code, Cpu, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '@/components/ui/resizable';
import { TerminalPanel } from '@/components/dashboard/TerminalPanel';
import { GlassCard } from '@/components/dashboard/GlassCard';

export const Compiler = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('# Write your code here\nprint("Hello, CodeAtlas AI!")');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const languages = [
    { value: 'python', label: 'Python', starter: '# Write your code here\nprint("Hello, World!")' },
    { value: 'javascript', label: 'JavaScript', starter: '// Write your code here\nconsole.log("Hello, World!");' },
    { value: 'go', label: 'Go', starter: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
    { value: 'bash', label: 'Bash', starter: '#!/bin/bash\necho "Hello, World!"' },
    { value: 'java', label: 'Java', starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
    { value: 'cpp', label: 'C++', starter: '#include <iostream>\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}' },
    { value: 'rust', label: 'Rust', starter: 'fn main() {\n    println!("Hello, World!");\n}' },
    { value: 'c', label: 'C', starter: '#include <stdio.h>\nint main() {\n    printf("Hello, World!");\n    return 0;\n}' },
    { value: 'typescript', label: 'TypeScript', starter: 'console.log("Hello World");' },
    { value: 'csharp', label: 'C#', starter: 'using System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}' },
    { value: 'kotlin', label: 'Kotlin', starter: 'fun main() {\n    println("Hello, World!")\n}' },
    { value: 'swift', label: 'Swift', starter: 'print("Hello, World!")' },
    { value: 'ruby', label: 'Ruby', starter: 'puts "Hello, World!"' },
    { value: 'php', label: 'PHP', starter: '<?php\necho "Hello, World!";' },
    { value: 'r', label: 'R', starter: 'cat("Hello, World!\\n")' },
    { value: 'scala', label: 'Scala', starter: 'object Main extends App {\n    println("Hello, World!")\n}' }
  ];

  const getEditorLanguage = (lang) => ({
    python: 'python', javascript: 'javascript', go: 'go', bash: 'shell',
    java: 'java', cpp: 'cpp', rust: 'rust', c: 'c', typescript: 'typescript',
    csharp: 'csharp', kotlin: 'kotlin', swift: 'swift', ruby: 'ruby',
    php: 'php', r: 'r', scala: 'scala'
  }[lang] || 'plaintext');

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const langConfig = languages.find((l) => l.value === newLang);
    if (langConfig) setCode(langConfig.starter);
    setOutput('');
    setStats(null);
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput('');
    setStats(null);
    try {
      const result = await compilerService.executeCode(language, code, input);
      if (result.success) {
        setOutput(`✓ Execution successful (${result.execution_time}s)\n\n${result.output}`);
        setStats({
          time: result.execution_time,
          status: 'success'
        });
        toast.success('Code executed successfully!');
      } else {
        setOutput(`✗ Execution failed\n\n${result.error || result.output}`);
        setStats({
          status: 'failed',
          error: result.error
        });
        toast.error('Execution failed');
      }
    } catch (error) {
      setOutput(`✗ Error: ${error.message}`);
      setStats({
        status: 'error',
        error: error.message
      });
      toast.error('Execution error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-zinc-950 flex flex-col justify-between">
      <Navigation variant="app" />

      {/* Main Container */}
      <main className="md:pl-64 w-full min-w-0 pt-24 pb-12 flex-1 flex flex-col justify-between">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-zinc-100">
              <Terminal className="w-5 h-5 text-blue-500" />
              <h1 className="text-2xl font-extrabold" data-testid="compiler-title">Compiler IDE</h1>
            </div>
            <p className="text-xs text-zinc-500" data-testid="compiler-description">
              Compile and run snippets inside a secure multi-language playground.
            </p>
          </div>

          {/* Action and Select controls */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-850 px-3 py-1.5 rounded-lg shrink-0">
              <span className="text-[10px] uppercase font-bold text-zinc-500" data-testid="language-select-label">Language:</span>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[130px] h-7 bg-transparent border-none text-xs font-semibold text-zinc-200 focus:ring-0" data-testid="language-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-zinc-850 text-zinc-300">
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} data-testid={`language-option-${lang.value}`}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleRun} 
              disabled={loading} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 h-9 text-xs shadow-[0_0_12px_rgba(16,185,129,0.15)] flex-1 sm:flex-none"
              data-testid="run-code-button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-3.5 h-3.5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 w-3.5 h-3.5" />
                  Run Code
                </>
              )}
            </Button>
          </div>
        </div>

        {/* IDE Split Panels */}
        <div className="flex-1 min-h-[550px] relative rounded-xl border border-zinc-800/80 overflow-hidden bg-zinc-950/40">
          <ResizablePanelGroup direction="horizontal">
            {/* Left: Code Editor and Inputs */}
            <ResizablePanel defaultSize={55} minSize={30}>
              <div className="h-full flex flex-col p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500" data-testid="code-editor-label">Source Editor</span>
                  <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 font-mono">
                    <Code className="w-3.5 h-3.5 text-blue-500" />
                    <span>{getEditorLanguage(language)}</span>
                  </div>
                </div>
                
                {/* Editor canvas */}
                <div className="flex-1 min-h-[300px] border border-zinc-900 rounded-lg overflow-hidden relative" data-testid="code-editor">
                  <Editor
                    height="100%"
                    language={getEditorLanguage(language)}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 12 },
                      fontFamily: 'JetBrains Mono',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>

                {/* Input arguments panel */}
                <div className="space-y-2">
                  <Label htmlFor="input-arg" className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider" data-testid="input-label">
                    Standard Input (Stdin)
                  </Label>
                  <Textarea 
                    id="input-arg"
                    placeholder="Input params to feed to code logic..." 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    rows={3}
                    className="bg-zinc-950/60 border-zinc-900 focus:border-blue-500 text-zinc-200 font-mono text-xs"
                    data-testid="input-textarea"
                  />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="bg-zinc-900 w-[1px]" />

            {/* Right: Terminal logs panel */}
            <ResizablePanel defaultSize={45} minSize={20}>
              <div className="h-full p-4 flex flex-col justify-between" data-testid="output-console">
                <TerminalPanel 
                  output={output} 
                  loading={loading} 
                  onClear={() => setOutput('')} 
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Diagnostic specs */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4" data-testid="compiler-info">
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              <div>
                <span className="text-[10px] text-zinc-500 font-bold block uppercase">Compute Time</span>
                <span className="text-xs font-mono text-zinc-200 mt-0.5 block">{stats.time ? `${stats.time}s` : 'N/A'}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-zinc-500 font-bold block uppercase">Execution State</span>
                <span className="text-xs font-semibold capitalize text-emerald-400 mt-0.5 block">{stats.status}</span>
              </div>
            </div>
          </div>
        )}
      </div>

        <footer className="py-6 border-t border-zinc-900 text-center text-xs text-zinc-600">
          <p>© 2026 CodeAtlas AI • Integrated Dev Sandbox Platform</p>
        </footer>
      </main>
    </div>
  );
};
