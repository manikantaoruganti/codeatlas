import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { FileUpload } from '@/components/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { analysisService } from '@/services/api';
import { Loader2, ArrowRight, Layers, Clock, Calendar, Database, Trash2, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { GlassCard } from '@/components/dashboard/GlassCard';

export const Workspace = () => {
  const [projectName, setProjectName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load recent analyses from local storage
    const stored = localStorage.getItem('recent_analyses');
    if (stored) {
      try {
        setRecentAnalyses(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent analyses', e);
      }
    }
  }, []);

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
      
      // Save to localStorage list of analyses
      const stored = localStorage.getItem('recent_analyses');
      let currentRecents = [];
      if (stored) {
        try {
          currentRecents = JSON.parse(stored);
        } catch (e) {}
      }
      
      // Remove duplicate project name if exists, then prepend
      const filtered = currentRecents.filter(item => item.project_name !== projectName);
      const updated = [result, ...filtered];
      
      localStorage.setItem('recent_analyses', JSON.stringify(updated));
      localStorage.setItem('last_project_name', projectName);

      navigate('/dashboard', { state: { analysis: result } });
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const loadRecent = (analysisItem) => {
    localStorage.setItem('last_project_name', analysisItem.project_name);
    navigate('/dashboard', { state: { analysis: analysisItem } });
  };

  const clearRecent = (e, index) => {
    e.stopPropagation();
    const updated = recentAnalyses.filter((_, i) => i !== index);
    setRecentAnalyses(updated);
    localStorage.setItem('recent_analyses', JSON.stringify(updated));
    toast.success('Project removed from history');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-zinc-950">
      <Navigation variant="app" />

      {/* Decorative aurora glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full filter blur-[120px] pointer-events-none" />

      <main className="md:pl-64 w-full min-w-0 pt-24 pb-12 min-h-screen flex flex-col justify-between">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          {/* Header */}
          <div className="text-center md:text-left space-y-2">
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="workspace-title"
            >
              Workspace Manager
            </h1>
            <p className="text-sm text-zinc-400" data-testid="workspace-description">
              Upload ZIP archives or direct files to compile metric dashboards and trace code smells.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Upload card block */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Name Card */}
              <GlassCard hoverEffect={false} className="border border-zinc-800/80 p-6" data-testid="project-name-card">
                <Label htmlFor="project-name" className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2.5 block" data-testid="project-name-label">
                  Project Title
                </Label>
                <Input
                  id="project-name"
                  type="text"
                  placeholder="e.g. aviation-intelligence"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500 text-zinc-200"
                  data-testid="project-name-input"
                />
              </GlassCard>

              {/* File Upload zone */}
              <FileUpload onFileSelect={handleFileSelect} />

              {/* Selected File Details badge */}
              {selectedFile && (
                <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-center justify-between" data-testid="selected-file-info">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Staged File</span>
                    <span className="font-mono text-xs text-blue-400 font-bold block mt-0.5 truncate max-w-md" data-testid="selected-file-name">
                      {selectedFile.name}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono" data-testid="selected-file-size">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              )}

              {/* Action Button */}
              <Button
                onClick={handleAnalyze}
                disabled={loading || !selectedFile || !projectName}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-6 text-sm shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all"
                data-testid="analyze-button"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Calculating Metrics...
                  </>
                ) : (
                  <>
                    Initialize Analyzer
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Right: History log / metrics */}
            <div className="space-y-6">
              {/* Recent analysis records list */}
              <GlassCard hoverEffect={false} className="border border-zinc-800/80 p-5 flex flex-col h-full min-h-[300px]">
                <div className="flex items-center space-x-2 text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4 border-b border-zinc-900 pb-2 shrink-0">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Recent Analyses</span>
                </div>

                {recentAnalyses.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <Database className="w-8 h-8 text-zinc-700 mb-2" />
                    <p className="text-xs text-zinc-500">No projects analyzed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2 flex-1 overflow-y-auto max-h-[320px] pr-1">
                    {recentAnalyses.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => loadRecent(item)}
                        className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-850 hover:border-blue-500/25 hover:bg-zinc-900 cursor-pointer transition-all duration-200 flex items-center justify-between group"
                      >
                        <div className="overflow-hidden mr-2">
                          <span className="text-xs font-bold text-zinc-300 group-hover:text-blue-400 transition-colors block truncate">
                            {item.project_name}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono mt-0.5 block">
                            Health Score: <span className="font-bold text-emerald-400">{item.health_index?.toFixed(0)}</span>
                          </span>
                        </div>
                        <button
                          onClick={(e) => clearRecent(e, idx)}
                          className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                          title="Remove project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>

          {/* Quick specs section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {[
              { id: 'info-card-1', label: 'Supported Languages', count: '8', style: 'text-blue-400', countId: 'supported-languages-count' },
              { id: 'info-card-2', label: 'Metrics Compiled', count: '15+', style: 'text-emerald-400', countId: 'metrics-count' },
              { id: 'info-card-3', label: 'Engine Speed Latency', count: '<2.5s', style: 'text-amber-400', countId: 'analysis-speed' }
            ].map((card, i) => (
              <GlassCard key={i} hoverEffect={true} className="border border-zinc-850 p-5 text-center" data-testid={card.id}>
                <span className={`text-2xl font-black block mb-1 ${card.style}`} data-testid={card.countId}>
                  {card.count}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
                  {card.label}
                </span>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 py-6 border-t border-zinc-900 w-full text-center text-xs text-zinc-600">
          <p>© 2026 CodeAtlas AI • Premium Developer Observability Platform.</p>
        </footer>
      </main>
    </div>
  );
};