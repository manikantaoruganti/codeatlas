import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, FileCode } from 'lucide-react';

export const FileUpload = ({ onFileSelect, accept = '.py,.js,.java,.cpp,.go,.rs,.sql,.sh,.zip' }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
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
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-12 text-center cursor-pointer transition-smooth ${
        isDragActive
          ? 'border-electric-blue bg-electric-blue/5'
          : 'border-border hover:border-electric-blue/50'
      }`}
      data-testid="file-upload-dropzone"
    >
      <input {...getInputProps()} data-testid="file-upload-input" />
      <div className="flex flex-col items-center space-y-4">
        {isDragActive ? (
          <FileCode className="w-16 h-16 text-electric-blue" />
        ) : (
          <Upload className="w-16 h-16 text-muted-foreground" />
        )}
        <div>
          <p className="text-lg font-medium" data-testid="file-upload-text">
            {isDragActive ? 'Drop your file here' : 'Drop a file or ZIP to analyze'}
          </p>
          <p className="text-sm text-muted-foreground mt-2" data-testid="file-upload-hint">
            Supports Python, JavaScript, Java, C++, Go, Rust, SQL, Bash
          </p>
        </div>
      </div>
    </div>
  );
};