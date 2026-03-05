import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { analysisService } from '@/services/api';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const Workspace = () => {
  const [projectName, setProjectName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (!projectName) {
      setProjectName(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !projectName) {
      toast.error('Please select a file and provide a project name');
      return;
    }

    setLoading(true);
    try {
      const result = await analysisService.analyzeUpload(selectedFile, projectName);
      toast.success('Analysis complete!');
      navigate('/dashboard', { state: { analysis: result } });
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation variant="app" />

      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl sm:text-5xl font-black mb-4"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="workspace-title"
            >
              Code Analysis Workspace
            </h1>
            <p className="text-lg text-muted-foreground" data-testid="workspace-description">
              Upload your code files or projects for comprehensive analysis
            </p>
          </div>

          {/* Project Name Input */}
          <div className="glass-card p-8 rounded-md mb-8" data-testid="project-name-card">
            <Label htmlFor="project-name" className="text-sm uppercase tracking-widest mb-2 block" data-testid="project-name-label">
              Project Name
            </Label>
            <Input
              id="project-name"
              type="text"
              placeholder="Enter project name..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-black/20 border-white/10 focus:border-electric-blue"
              data-testid="project-name-input"
            />
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <FileUpload onFileSelect={handleFileSelect} />
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="glass-card p-6 rounded-md mb-8" data-testid="selected-file-info">
              <p className="text-sm text-muted-foreground mb-1">Selected File:</p>
              <p className="font-mono text-electric-blue" data-testid="selected-file-name">
                {selectedFile.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1" data-testid="selected-file-size">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={loading || !selectedFile || !projectName}
            className="w-full bg-electric-blue hover:bg-blue-600 btn-hover py-6 text-lg"
            data-testid="analyze-button"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze Code
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-card p-6 rounded-md text-center" data-testid="info-card-1">
              <p className="text-3xl font-black text-electric-blue mb-2" data-testid="supported-languages-count">
                8
              </p>
              <p className="text-sm text-muted-foreground">Supported Languages</p>
            </div>
            <div className="glass-card p-6 rounded-md text-center" data-testid="info-card-2">
              <p className="text-3xl font-black text-neon-green mb-2" data-testid="metrics-count">
                15+
              </p>
              <p className="text-sm text-muted-foreground">Code Metrics</p>
            </div>
            <div className="glass-card p-6 rounded-md text-center" data-testid="info-card-3">
              <p className="text-3xl font-black text-signal-amber mb-2" data-testid="analysis-speed">
                &lt;5s
              </p>
              <p className="text-sm text-muted-foreground">Average Analysis Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};