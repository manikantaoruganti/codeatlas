import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { HealthScore } from '@/components/HealthScore';
import { MetricsCard } from '@/components/MetricsCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileCode, AlertTriangle, Target, GitBranch, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (location.state?.analysis) {
      setAnalysis(location.state.analysis);
    } else {
      toast.error('No analysis data found');
      navigate('/workspace');
    }
  }, [location, navigate]);

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-electric-blue" />
      </div>
    );
  }

  const smellsByType = analysis.smells.reduce((acc, smell) => {
    acc[smell.type] = (acc[smell.type] || 0) + 1;
    return acc;
  }, {});

  const smellsData = Object.entries(smellsByType).map(([name, value]) => ({ name, value }));

  const complexityData = analysis.files.map((f) => ({
    name: f.filename.split('/').pop(),
    complexity: f.complexity,
    loc: f.loc,
  }));

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#2563EB', '#8B5CF6'];

  return (
    <div className="min-h-screen">
      <Navigation variant="app" />

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="ghost"
                onClick={() => navigate('/workspace')}
                className="mb-4"
                data-testid="back-to-workspace-button"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Workspace
              </Button>
              <h1
                className="text-3xl sm:text-4xl font-black"
                style={{ fontFamily: 'Chivo, sans-serif' }}
                data-testid="dashboard-title"
              >
                {analysis.project_name}
              </h1>
              <p className="text-muted-foreground mt-2" data-testid="analysis-timestamp">
                Analyzed on {new Date(analysis.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Health Score */}
          <div className="mb-8">
            <HealthScore score={analysis.health_index} />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricsCard
              title="Total Files"
              value={analysis.total_files}
              icon={FileCode}
              subtitle={`${analysis.total_loc} lines of code`}
            />
            <MetricsCard
              title="Avg Complexity"
              value={analysis.avg_complexity}
              icon={Target}
              subtitle="Cyclomatic complexity"
            />
            <MetricsCard
              title="Code Smells"
              value={analysis.smells.length}
              icon={AlertTriangle}
              subtitle={`${analysis.smells.filter((s) => s.severity === 'high').length} high severity`}
            />
            <MetricsCard
              title="Hotspots"
              value={analysis.hotspots.filter((h) => h.priority === 'critical' || h.priority === 'high').length}
              icon={GitBranch}
              subtitle="Critical & high priority"
            />
          </div>

          {/* Tabs for detailed views */}
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="glass-card" data-testid="dashboard-tabs">
              <TabsTrigger value="overview" data-testid="tab-overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="smells" data-testid="tab-smells">
                Code Smells
              </TabsTrigger>
              <TabsTrigger value="hotspots" data-testid="tab-hotspots">
                Hotspots
              </TabsTrigger>
              <TabsTrigger value="refactor" data-testid="tab-refactor">
                Refactor Strategy
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Complexity Chart */}
                <div className="glass-card p-6 rounded-md" data-testid="complexity-chart">
                  <h3 className="text-lg font-bold mb-4">File Complexity</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={complexityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
                      <XAxis dataKey="name" tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#A1A1AA', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ background: '#121214', border: '1px solid #27272A', borderRadius: '0.5rem' }}
                      />
                      <Bar dataKey="complexity" fill="#2563EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Smell Distribution */}
                <div className="glass-card p-6 rounded-md" data-testid="smell-distribution">
                  <h3 className="text-lg font-bold mb-4">Code Smell Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={smellsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {smellsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#121214', border: '1px solid #27272A', borderRadius: '0.5rem' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="smells" className="mt-8">
              <div className="glass-card p-6 rounded-md" data-testid="smells-list">
                <h3 className="text-lg font-bold mb-4">Detected Code Smells</h3>
                <div className="space-y-4">
                  {analysis.smells.map((smell, index) => (
                    <div
                      key={index}
                      className="p-4 bg-surface rounded border-l-4 border-l-signal-amber"
                      data-testid={`smell-item-${index}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`smell-badge ${smell.severity}`} data-testid={`smell-severity-${index}`}>
                              {smell.severity}
                            </span>
                            <span className="font-bold" data-testid={`smell-type-${index}`}>
                              {smell.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2" data-testid={`smell-file-${index}`}>
                            {smell.file} (Line {smell.line})
                          </p>
                          <p className="text-sm mb-2" data-testid={`smell-message-${index}`}>
                            {smell.message}
                          </p>
                          <p className="text-sm text-neon-green" data-testid={`smell-suggestion-${index}`}>
                            → {smell.suggestion}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hotspots" className="mt-8">
              <div className="glass-card p-6 rounded-md" data-testid="hotspots-list">
                <h3 className="text-lg font-bold mb-4">Code Hotspots</h3>
                <div className="space-y-4">
                  {analysis.hotspots.map((hotspot, index) => (
                    <div
                      key={index}
                      className={`p-4 bg-surface rounded border-l-4 ${
                        hotspot.priority === 'critical'
                          ? 'border-l-destructive'
                          : hotspot.priority === 'high'
                          ? 'border-l-signal-amber'
                          : 'border-l-neon-green'
                      }`}
                      data-testid={`hotspot-item-${index}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold font-mono" data-testid={`hotspot-file-${index}`}>
                          {hotspot.file}
                        </span>
                        <span
                          className={`text-2xl font-black ${
                            hotspot.risk_score >= 70
                              ? 'text-destructive'
                              : hotspot.risk_score >= 50
                              ? 'text-signal-amber'
                              : 'text-neon-green'
                          }`}
                          data-testid={`hotspot-score-${index}`}
                        >
                          {hotspot.risk_score}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div data-testid={`hotspot-priority-${index}`}>
                          <span className="text-muted-foreground">Priority:</span> {hotspot.priority}
                        </div>
                        <div data-testid={`hotspot-complexity-${index}`}>
                          <span className="text-muted-foreground">Complexity:</span> {hotspot.complexity}
                        </div>
                        <div data-testid={`hotspot-smells-${index}`}>
                          <span className="text-muted-foreground">Smells:</span> {hotspot.smells_count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="refactor" className="mt-8">
              <div className="glass-card p-6 rounded-md" data-testid="refactor-actions-list">
                <h3 className="text-lg font-bold mb-4">Refactoring Recommendations</h3>
                <div className="space-y-4">
                  {analysis.refactor_actions.map((action, index) => (
                    <div
                      key={index}
                      className="p-4 bg-surface rounded"
                      data-testid={`refactor-action-${index}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                action.priority === 'critical'
                                  ? 'bg-destructive/20 text-destructive'
                                  : action.priority === 'high'
                                  ? 'bg-signal-amber/20 text-signal-amber'
                                  : 'bg-neon-green/20 text-neon-green'
                              }`}
                              data-testid={`refactor-priority-${index}`}
                            >
                              {action.priority}
                            </span>
                            <span className="font-bold" data-testid={`refactor-action-title-${index}`}>
                              {action.action}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2" data-testid={`refactor-file-${index}`}>
                            File: {action.file}
                          </p>
                          <p className="text-sm mb-2" data-testid={`refactor-description-${index}`}>
                            {action.description}
                          </p>
                          <div className="flex space-x-4 text-xs">
                            <span data-testid={`refactor-impact-${index}`}>
                              <span className="text-muted-foreground">Impact:</span> {action.impact}
                            </span>
                            <span data-testid={`refactor-effort-${index}`}>
                              <span className="text-muted-foreground">Effort:</span> {action.effort}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};