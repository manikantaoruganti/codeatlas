// import React, { useState } from 'react';
// import { Navigation } from '@/components/Navigation';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { compilerService } from '@/services/api';
// import { Play, Loader2, Terminal } from 'lucide-react';
// import { toast } from 'sonner';
// import Editor from '@monaco-editor/react';

// export const Compiler = () => {
//   const [language, setLanguage] = useState('python');
//   const [code, setCode] = useState('# Write your code here\nprint("Hello, CodeAtlas!")');
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const languages = [
//     { value: 'python', label: 'Python', starter: '# Write your code here\nprint("Hello, World!")' },
//     { value: 'javascript', label: 'JavaScript', starter: '// Write your code here\nconsole.log("Hello, World!");' },
//     { value: 'go', label: 'Go', starter: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
//     { value: 'bash', label: 'Bash', starter: '#!/bin/bash\n# Write your script here\necho "Hello, World!"' },
//     { value: 'java', label: 'Java', starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
//     { value: 'cpp', label: 'C++', starter: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
//     { value: 'rust', label: 'Rust', starter: 'fn main() {\n    println!("Hello, World!");\n}' },
//     { value: 'sql', label: 'SQL', starter: '-- Write your SQL query\nSELECT "Hello, World!" as greeting;' },
//   ];

//   const getEditorLanguage = (lang) => {
//     const map = {
//       python: 'python',
//       javascript: 'javascript',
//       go: 'go',
//       bash: 'shell',
//       java: 'java',
//       cpp: 'cpp',
//       rust: 'rust',
//       sql: 'sql',
//     };
//     return map[lang] || 'plaintext';
//   };

//   const handleLanguageChange = (newLang) => {
//     setLanguage(newLang);
//     const langConfig = languages.find((l) => l.value === newLang);
//     if (langConfig) {
//       setCode(langConfig.starter);
//     }
//     setOutput('');
//   };

//   const handleRun = async () => {
//     setLoading(true);
//     setOutput('');

//     try {
//       const result = await compilerService.executeCode(language, code, input);

//       if (result.success) {
//         setOutput(`✓ Execution successful (${result.execution_time}s)\n\n${result.output}`);
//         toast.success('Code executed successfully!');
//       } else {
//         setOutput(`✗ Execution failed\n\n${result.error || result.output}`);
//         toast.error('Execution failed');
//       }
//     } catch (error) {
//       console.error('Execution error:', error);
//       setOutput(`✗ Error: ${error.message}`);
//       toast.error('Execution error: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <Navigation variant="app" />

//       <div className="pt-24 pb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* Header */}
//           <div className="mb-8">
//             <div className="flex items-center space-x-3 mb-4">
//               <Terminal className="w-8 h-8 text-electric-blue" />
//               <h1
//                 className="text-3xl sm:text-4xl font-black"
//                 style={{ fontFamily: 'Chivo, sans-serif' }}
//                 data-testid="compiler-title"
//               >
//                 Code Compiler
//               </h1>
//             </div>
//             <p className="text-lg text-muted-foreground" data-testid="compiler-description">
//               Write and execute code in multiple languages
//             </p>
//           </div>

//           {/* Controls */}
//           <div className="glass-card p-6 rounded-md mb-6">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
//               <div className="flex items-center space-x-4">
//                 <label className="text-sm uppercase tracking-widest" data-testid="language-select-label">
//                   Language:
//                 </label>
//                 <Select value={language} onValueChange={handleLanguageChange}>
//                   <SelectTrigger className="w-[180px] bg-black/20 border-white/10" data-testid="language-select">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent className="bg-surface border-border">
//                     {languages.map((lang) => (
//                       <SelectItem key={lang.value} value={lang.value} data-testid={`language-option-${lang.value}`}>
//                         {lang.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <Button
//                 onClick={handleRun}
//                 disabled={loading || !code}
//                 className="bg-neon-green hover:bg-green-600 text-black btn-hover"
//                 data-testid="run-code-button"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="mr-2 w-4 h-4 animate-spin" />
//                     Running...
//                   </>
//                 ) : (
//                   <>
//                     <Play className="mr-2 w-4 h-4" />
//                     Run Code
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Editor and Output */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Code Editor */}
//             <div>
//               <div className="mb-2">
//                 <label className="text-sm uppercase tracking-widest" data-testid="code-editor-label">
//                   Code Editor
//                 </label>
//               </div>
//               <div className="monaco-wrapper" style={{ height: '500px' }} data-testid="code-editor">
//                 <Editor
//                   height="100%"
//                   language={getEditorLanguage(language)}
//                   value={code}
//                   onChange={(value) => setCode(value || '')}
//                   theme="vs-dark"
//                   options={{
//                     minimap: { enabled: false },
//                     fontSize: 14,
//                     lineNumbers: 'on',
//                     scrollBeyondLastLine: false,
//                     automaticLayout: true,
//                   }}
//                 />
//               </div>

//               {/* Input */}
//               <div className="mt-4">
//                 <label className="text-sm uppercase tracking-widest mb-2 block" data-testid="input-label">
//                   Input (Optional)
//                 </label>
//                 <Textarea
//                   placeholder="Provide input data for your program..."
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   className="bg-black/20 border-white/10 focus:border-electric-blue font-mono"
//                   rows={4}
//                   data-testid="input-textarea"
//                 />
//               </div>
//             </div>

//             {/* Output */}
//             <div>
//               <div className="mb-2">
//                 <label className="text-sm uppercase tracking-widest" data-testid="output-label">
//                   Output
//                 </label>
//               </div>
//               <div
//                 className="bg-charcoal border border-border rounded-md p-4 font-mono text-sm overflow-auto"
//                 style={{ height: '584px' }}
//                 data-testid="output-console"
//               >
//                 {output ? (
//                   <pre className="whitespace-pre-wrap">{output}</pre>
//                 ) : (
//                   <p className="text-muted-foreground">Output will appear here...</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Info Banner */}
//           <div className="mt-8 glass-card p-6 rounded-md" data-testid="compiler-info">
//             <p className="text-sm text-muted-foreground">
//               <strong>Note:</strong> Python, JavaScript, Go, and Bash are fully supported. Java, C++, and Rust require
//               compiler installation on the server. Execution timeout is 5 seconds.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// import React, { useState } from 'react';
// import { Navigation } from '@/components/Navigation';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import { compilerService } from '@/services/api';
// import { Play, Loader2, Terminal } from 'lucide-react';
// import { toast } from 'sonner';
// import Editor from '@monaco-editor/react';

// export const Compiler = () => {
//   const [language, setLanguage] = useState('python');
//   const [code, setCode] = useState('# Write your code here\nprint("Hello, CodeAtlas!")');
//   const [input, setInput] = useState('');
//   const [output, setOutput] = useState('');
//   const [loading, setLoading] = useState(false);

//   const languages = [
//     { value: 'python', label: 'Python', starter: '# Write your code here\nprint("Hello, World!")' },
//     { value: 'javascript', label: 'JavaScript', starter: '// Write your code here\nconsole.log("Hello, World!");' },
//     { value: 'go', label: 'Go', starter: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
//     { value: 'bash', label: 'Bash', starter: '#!/bin/bash\n# Write your script here\necho "Hello, World!"' },
//     { value: 'java', label: 'Java', starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
//     { value: 'cpp', label: 'C++', starter: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}' },
//     { value: 'rust', label: 'Rust', starter: 'fn main() {\n    println!("Hello, World!");\n}' },
//     { value: 'sql', label: 'SQL', starter: '-- Write your SQL query\nSELECT "Hello, World!" as greeting;' },
//   ];

//   const getEditorLanguage = (lang) => ({
//     python: 'python',
//     javascript: 'javascript',
//     go: 'go',
//     bash: 'shell',
//     java: 'java',
//     cpp: 'cpp',
//     rust: 'rust',
//     sql: 'sql',
//   }[lang] || 'plaintext');

//   const handleLanguageChange = (newLang) => {
//     setLanguage(newLang);
//     const langConfig = languages.find((l) => l.value === newLang);
//     if (langConfig) setCode(langConfig.starter);
//     setOutput('');
//   };

//   const handleRun = async () => {
//     setLoading(true);
//     setOutput('');
//     try {
//       const result = await compilerService.executeCode(language, code, input);
//       if (result.success) {
//         setOutput(`✓ Execution successful (${result.execution_time}s)\n\n${result.output}`);
//         toast.success('Code executed successfully!');
//       } else {
//         setOutput(`✗ Execution failed\n\n${result.error || result.output}`);
//         toast.error('Execution failed');
//       }
//     } catch (error) {
//       setOutput(`✗ Error: ${error.message}`);
//       toast.error('Execution error: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       <Navigation variant="app" />
//       <div className="pt-24 pb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//           {/* Header */}
//           <div className="mb-8">
//             <div className="flex items-center space-x-3 mb-4">
//               <Terminal className="w-8 h-8 text-electric-blue" />
//               <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Chivo, sans-serif' }}>Code Compiler</h1>
//             </div>
//             <p className="text-lg text-muted-foreground">Write and execute code in multiple languages</p>
//           </div>

//           {/* Controls */}
//           <div className="glass-card p-6 rounded-md mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
//             <div className="flex items-center space-x-4">
//               <label className="text-sm uppercase tracking-widest">Language:</label>
//               <Select value={language} onValueChange={handleLanguageChange}>
//                 <SelectTrigger className="w-[180px] bg-black/20 border-white/10">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent className="bg-surface border-border">
//                   {languages.map((lang) => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
//                 </SelectContent>
//               </Select>
//             </div>
//             <Button onClick={handleRun} disabled={loading} className="bg-neon-green hover:bg-green-600 text-black btn-hover">
//               {loading ? (<><Loader2 className="mr-2 w-4 h-4 animate-spin"/>Running...</>) : (<><Play className="mr-2 w-4 h-4"/>Run Code</>)}
//             </Button>
//           </div>

//           {/* Editor and Output */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div>
//               <Editor
//                 height="500px"
//                 language={getEditorLanguage(language)}
//                 value={code}
//                 onChange={(value) => setCode(value || '')}
//                 theme="vs-dark"
//                 options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
//               />
//               <div className="mt-4">
//                 <label className="text-sm uppercase tracking-widest mb-2 block">Input (Optional)</label>
//                 <Textarea
//                   placeholder="Provide input data for your program..."
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   className="bg-black/20 border-white/10 focus:border-electric-blue font-mono"
//                   rows={4}
//                 />
//               </div>
//             </div>
//             <div>
//               <label className="text-sm uppercase tracking-widest mb-2 block">Output</label>
//               <div className="bg-charcoal border border-border rounded-md p-4 font-mono text-sm overflow-auto" style={{ height: '584px' }}>
//                 {output ? <pre className="whitespace-pre-wrap">{output}</pre> : <p className="text-muted-foreground">Output will appear here...</p>}
//               </div>
//             </div>
//           </div>

//           {/* Info */}
//           <div className="mt-8 glass-card p-6 rounded-md">
//             <p className="text-sm text-muted-foreground">
//               <strong>Note:</strong> Python, JavaScript, Go, and Bash are fully supported. Java, C++, and Rust require
//               compiler installation on the server. Execution timeout is 5 seconds.
//             </p>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { compilerService } from '@/services/api';
import { Play, Loader2, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';

export const Compiler = () => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('# Write your code here\nprint("Hello, CodeAtlas!")');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = [
    { value: 'python', label: 'Python', starter: '# Write your code here\nprint("Hello, World!")' },
    { value: 'javascript', label: 'JavaScript', starter: '// Write your code here\nconsole.log("Hello, World!");' },
    { value: 'go', label: 'Go', starter: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
    { value: 'bash', label: 'Bash', starter: '#!/bin/bash\necho "Hello, World!"' },
    { value: 'java', label: 'Java', starter: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
    { value: 'cpp', label: 'C++', starter: '#include <iostream>\nint main(){std::cout<<"Hello, World!";}' },
    { value: 'rust', label: 'Rust', starter: 'fn main(){println!("Hello, World!");}' },
    { value: 'c', label: 'C', starter: '#include <stdio.h>\nint main(){printf("Hello, World!");}' },
    { value: 'typescript', label: 'TypeScript', starter: 'console.log("Hello World")' },
    { value: 'csharp', label: 'C#', starter: 'using System; class P{static void Main(){Console.WriteLine("Hello");}}' },
    { value: 'kotlin', label: 'Kotlin', starter: 'fun main(){ println("Hello") }' },
    { value: 'swift', label: 'Swift', starter: 'print("Hello")' },
    { value: 'ruby', label: 'Ruby', starter: 'puts "Hello"' },
    { value: 'php', label: 'PHP', starter: '<?php echo "Hello"; ?>' },
    { value: 'r', label: 'R', starter: 'cat("Hello")' },
    { value: 'scala', label: 'Scala', starter: 'object Main extends App{ println("Hello") }' }
  ];

  const getEditorLanguage = (lang) => ({
    python:'python', javascript:'javascript', go:'go', bash:'shell',
    java:'java', cpp:'cpp', rust:'rust', c:'c', typescript:'typescript',
    csharp:'csharp', kotlin:'kotlin', swift:'swift', ruby:'ruby',
    php:'php', r:'r', scala:'scala'
  }[lang] || 'plaintext');

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    const langConfig = languages.find((l) => l.value === newLang);
    if (langConfig) setCode(langConfig.starter);
    setOutput('');
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput('');
    try {
      const result = await compilerService.executeCode(language, code, input);
      if (result.success) {
        setOutput(`✓ Execution successful (${result.execution_time}s)\n\n${result.output}`);
        toast.success('Code executed successfully!');
      } else {
        setOutput(`✗ Execution failed\n\n${result.error || result.output}`);
        toast.error('Execution failed');
      }
    } catch (error) {
      setOutput(`✗ Error: ${error.message}`);
      toast.error('Execution error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation variant="app" />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Terminal className="w-8 h-8 text-electric-blue" />
              <h1 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: 'Chivo, sans-serif' }}>Code Compiler</h1>
            </div>
            <p className="text-lg text-muted-foreground">Write and execute code in multiple languages</p>
          </div>

          <div className="glass-card p-6 rounded-md mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm uppercase tracking-widest">Language:</label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px] bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-surface border-border">
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleRun} disabled={loading} className="bg-neon-green hover:bg-green-600 text-black">
              {loading ? (<><Loader2 className="mr-2 w-4 h-4 animate-spin"/>Running...</>) : (<><Play className="mr-2 w-4 h-4"/>Run Code</>)}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Editor
                height="500px"
                language={getEditorLanguage(language)}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{ minimap:{enabled:false}, fontSize:14, automaticLayout:true }}
              />
              <div className="mt-4">
                <label className="text-sm uppercase tracking-widest mb-2 block">Input (Optional)</label>
                <Textarea value={input} onChange={(e)=>setInput(e.target.value)} rows={4}/>
              </div>
            </div>
            <div>
              <label className="text-sm uppercase tracking-widest mb-2 block">Output</label>
              <div className="bg-charcoal border rounded-md p-4 font-mono text-sm overflow-auto" style={{height:'584px'}}>
                {output ? <pre className="whitespace-pre-wrap">{output}</pre> : <p className="text-muted-foreground">Output will appear here...</p>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
