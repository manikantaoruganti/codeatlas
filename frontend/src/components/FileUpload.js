import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const FileUpload = ({ onFileSelect, accept = '.py,.js,.java,.cpp,.go,.rs,.sql,.sh,.zip' }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileSummary, setSelectedFileSummary] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setErrorMsg(null);
      if (rejectedFiles && rejectedFiles.length > 0) {
        setErrorMsg('Unsupported file format. Please upload source code or ZIP archives.');
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setIsUploading(true);
        setUploadProgress(0);

        // Mock upload progress animation
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setIsUploading(false);
              onFileSelect(file);
              // Store summary details
              setSelectedFileSummary({
                name: file.name,
                size: (file.size / 1024).toFixed(1),
                type: file.name.endsWith('.zip') ? 'ZIP Repository Archive' : 'Single Source File'
              });
              return 100;
            }
            return prev + 10;
          });
        }, 80);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, ext) => {
      acc[`text/${ext.replace('.', '')}`] = [ext];
      acc['application/zip'] = ['.zip'];
      return acc;
    }, {}),
    multiple: false,
  });

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 relative overflow-hidden select-none ${
          isDragActive
            ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_20px_rgba(37,99,235,0.1)]'
            : 'border-zinc-800/80 hover:border-blue-500/50 bg-zinc-950/40 hover:bg-zinc-900/10'
        }`}
        data-testid="file-upload-dropzone"
      >
        <input {...getInputProps()} data-testid="file-upload-input" />
        
        {/* Subtle grid accent inside the dropzone */}
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className={`p-4 rounded-full border transition-all duration-300 ${
            isDragActive 
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
          }`}>
            {isDragActive ? (
              <FileCode className="w-8 h-8 animate-bounce" />
            ) : (
              <Upload className="w-8 h-8 group-hover:text-blue-400 transition-colors" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-200" data-testid="file-upload-text">
              {isDragActive ? 'Drop your repository here...' : 'Drag & drop a ZIP archive or code file'}
            </p>
            <p className="text-xs text-zinc-500 mt-2" data-testid="file-upload-hint">
              Supports Python, JavaScript, Java, C++, Go, Rust, SQL, Bash
            </p>
          </div>
        </div>
      </div>

      {/* Progress & Error States */}
      {isUploading && (
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-zinc-400">Processing file pipelines...</span>
            <span className="text-blue-400">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-1 bg-zinc-900" />
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center space-x-2.5 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Selected File Summary badge */}
      {selectedFileSummary && !isUploading && (
        <div className="p-4 rounded-xl border border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-200">{selectedFileSummary.name}</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                {selectedFileSummary.type} • {selectedFileSummary.size} KB
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs text-emerald-400 font-semibold gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ready</span>
          </div>
        </div>
      )}
    </div>
  );
};