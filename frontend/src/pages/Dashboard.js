import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { HealthScore } from '@/components/HealthScore';
import { MetricsCard } from '@/components/MetricsCard';
import { GlassCard } from '@/components/dashboard/GlassCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { Timeline } from '@/components/dashboard/Timeline';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, AreaChart, Area, Legend
} from 'recharts';
import {
  FileCode, AlertTriangle, Target, GitBranch, ArrowLeft,
  Clock, Layers, ChevronDown, ChevronRight, GitCommit,
  Zap, Shield, Code, AlertCircle, CheckCircle2, FileText, Filter
} from 'lucide-react';
import { toast } from 'sonner';

/* ─────────────── CUSTOM CHART TOOLTIP ─────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 shadow-xl text-xs">
      {label && <p className="text-zinc-400 font-mono mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
};

/* ─────────────── SMELL CARD ─────────────── */
const SmellCard = ({ smell, index }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.3 }}
      className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 overflow-hidden"
      data-testid={`smell-item-${index}`}
    >
      <div
        className="p-4 flex items-start justify-between cursor-pointer hover:bg-zinc-900/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <div className="mt-0.5 shrink-0">
            <StatusBadge status={smell.severity} data-testid={`smell-severity-${index}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-200 truncate" data-testid={`smell-type-${index}`}>
              {smell.type}
            </p>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5 truncate" data-testid={`smell-file-${index}`}>
              {smell.file} · Line {smell.line}
            </p>
          </div>
        </div>
        <div className={`text-zinc-500 transition-transform ml-2 mt-1 shrink-0 ${expanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-zinc-900 pt-3">
              <p className="text-xs text-zinc-300 leading-relaxed" data-testid={`smell-message-${index}`}>
                {smell.message}
              </p>
              <div className="flex items-start space-x-2 text-xs text-emerald-400">
                <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span data-testid={`smell-suggestion-${index}`}>{smell.suggestion}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─────────────── HOTSPOT ROW ─────────────── */
const HotspotRow = ({ hotspot, index }) => {
  const score = hotspot.risk_score;
  const scoreColor = score >= 70 ? '#ef4444' : score >= 50 ? '#f59e0b' : '#10b981';
  const barWidth = `${Math.min(score, 100)}%`;

  const priorityBg = {
    critical: 'border-l-red-500 bg-red-500/3',
    high:     'border-l-amber-500 bg-amber-500/3',
    medium:   'border-l-yellow-500 bg-yellow-500/3',
    low:      'border-l-emerald-500 bg-emerald-500/3',
  }[hotspot.priority] || 'border-l-zinc-700';

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.35 }}
      className={`rounded-xl border border-zinc-800/80 border-l-4 ${priorityBg} p-4`}
      data-testid={`hotspot-item-${index}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-mono font-bold text-zinc-200 truncate max-w-[70%]" data-testid={`hotspot-file-${index}`}>
          {hotspot.file}
        </p>
        <span className="text-xl font-black font-mono" style={{ color: scoreColor }} data-testid={`hotspot-score-${index}`}>
          {hotspot.risk_score.toFixed(2)}
        </span>
      </div>

      {/* Mini risk bar */}
      <div className="h-1 bg-zinc-900 rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: barWidth }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: Math.min(index * 0.03, 0.5) }}
          className="h-full rounded-full"
          style={{ backgroundColor: scoreColor }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px] text-zinc-500">
        <div data-testid={`hotspot-priority-${index}`}>
          <span className="block text-[9px] uppercase font-bold mb-0.5">Priority</span>
          <StatusBadge status={hotspot.priority} />
        </div>
        <div data-testid={`hotspot-complexity-${index}`}>
          <span className="block text-[9px] uppercase font-bold mb-0.5">Complexity</span>
          <span className="text-zinc-300 font-semibold">{hotspot.complexity}</span>
        </div>
        <div data-testid={`hotspot-smells-${index}`}>
          <span className="block text-[9px] uppercase font-bold mb-0.5">Smells</span>
          <span className="text-zinc-300 font-semibold">{hotspot.smells_count}</span>
        </div>
      </div>
    </motion.div>
  );
};

/* ─────────────── REFACTOR ACTION CARD ─────────────── */
const RefactorCard = ({ action, index }) => {
  const impactColor = {
    high:   { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
    medium: { text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
    low:    { text: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
  };
  const effortColor = {
    high:   { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20' },
    medium: { text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20' },
    low:    { text: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20' },
  };

  const ic = impactColor[action.impact?.toLowerCase()] || impactColor.medium;
  const ec = effortColor[action.effort?.toLowerCase()]  || effortColor.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.3 }}
      className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-5 space-y-3"
      data-testid={`refactor-action-${index}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <StatusBadge status={action.priority} data-testid={`refactor-priority-${index}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-zinc-200 truncate" data-testid={`refactor-action-title-${index}`}>
              {action.action}
            </p>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5 truncate" data-testid={`refactor-file-${index}`}>
              {action.file}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed" data-testid={`refactor-description-${index}`}>
        {action.description}
      </p>

      <div className="flex items-center gap-2 flex-wrap" data-testid={`refactor-impact-${index}`}>
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${ic.bg} ${ic.text} ${ic.border}`}>
          <Zap className="w-2.5 h-2.5" />
          Impact: {action.impact}
        </span>
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${ec.bg} ${ec.text} ${ec.border}`} data-testid={`refactor-effort-${index}`}>
          <Target className="w-2.5 h-2.5" />
          Effort: {action.effort}
        </span>
      </div>
    </motion.div>
  );
};

/* ─────────────── MAIN DASHBOARD ─────────────── */
export const Dashboard = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [analysis, setAnalysis]           = useState(null);
  const [smellSearch, setSmellSearch]     = useState('');
  const [smellFilter, setSmellFilter]     = useState('all');
  const [hotspotFilter, setHotspotFilter] = useState('all');
  const [fileSearch, setFileSearch]       = useState('');
  const [filePageSize, setFilePageSize]   = useState('ALL');

  useEffect(() => {
    if (location.state?.analysis) {
      setAnalysis(location.state.analysis);
    } else {
      toast.error('No analysis data found');
      navigate('/workspace');
    }
  }, [location, navigate]);

  /* ── Loading state ── */
  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-xs text-zinc-500 font-mono">Loading analysis data…</p>
        </div>
      </div>
    );
  }

  /* ── Derived data ── */
  const smellsByType = analysis.smells.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {});
  const smellsDonut = Object.entries(smellsByType).map(([name, value]) => ({ name, value }));

  const complexityData = analysis.files.map((f) => ({
    name: f.filename.split('/').pop().substring(0, 16),
    complexity: f.complexity,
    loc: f.loc,
  }));

  const radarData = [
    { subject: 'Maintainability', A: Math.max(10, 100 - analysis.avg_complexity * 3) },
    { subject: 'Reliability',     A: Math.max(10, analysis.health_index) },
    { subject: 'Security',        A: Math.max(15, 100 - analysis.smells.filter(s => s.severity === 'high').length * 8) },
    { subject: 'Complexity',      A: Math.max(10, 100 - analysis.avg_complexity * 2) },
    { subject: 'Duplication',     A: Math.max(20, 90 - analysis.smells.length * 2) },
  ];

  /* Rendering ALL files in the complexity AreaChart without truncating */
  const areaData = complexityData.map((d) => ({
    name: d.name,
    complexity: d.complexity,
    loc: Math.round(d.loc / 10),
  }));

  const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  /* ── Smell filter logic ── */
  const filteredSmells = analysis.smells.filter((s) => {
    const matchFilter = smellFilter === 'all' || s.severity === smellFilter;
    const matchSearch = smellSearch === '' ||
      s.type.toLowerCase().includes(smellSearch.toLowerCase()) ||
      s.file.toLowerCase().includes(smellSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  /* ── Hotspot filter logic ── */
  const filteredHotspots = analysis.hotspots.filter((h) =>
    hotspotFilter === 'all' || h.priority === hotspotFilter
  );

  /* ── File filter and page size logic (rendering ALL by default) ── */
  const filteredFiles = analysis.files.filter((f) =>
    fileSearch === '' ||
    f.filename.toLowerCase().includes(fileSearch.toLowerCase()) ||
    f.language.toLowerCase().includes(fileSearch.toLowerCase())
  );

  const displayedFiles = filePageSize === 'ALL'
    ? filteredFiles
    : filteredFiles.slice(0, parseInt(filePageSize, 10));

  /* ── Activity feed entries ── */
  const feedItems = [
    { type: 'analysis', message: 'Analysis complete', time: 'just now', details: `${analysis.total_files} files scanned, ${analysis.smells.length} smells detected.` },
    { type: 'alert',    message: `${analysis.smells.filter(s => s.severity === 'high').length} high-severity smells`, time: '1s ago', details: 'Review Code Smells tab for immediate attention.' },
    { type: 'insight',  message: 'Refactor roadmap generated', time: '2s ago', details: `${analysis.refactor_actions.length} prioritized actions available.` },
  ];

  /* ── Refactor timeline items (ALL items without slice limit) ── */
  const timelineItems = analysis.refactor_actions.map((a) => ({
    title:       a.action,
    description: a.file,
    completed:   false,
    date:        `Priority: ${a.priority}`,
    tags:        [a.impact ? `Impact: ${a.impact}` : null, a.effort ? `Effort: ${a.effort}` : null].filter(Boolean),
  }));

  const PAGE_SIZE_OPTIONS = ['ALL', '25', '50', '100', '250', '500', '1000'];

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-x-hidden">
      <Navigation variant="app" />

      {/* Aurora glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-600/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* Main content wrapper shifted right of fixed 256px sidebar */}
      <main className="md:pl-64 w-full min-w-0 pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8 space-y-8 max-w-[1600px] mx-auto">

        {/* ── Breadcrumb / Back ── */}
        <div className="flex items-center justify-between flex-wrap gap-4 pt-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate('/workspace')}
              className="text-zinc-500 hover:text-zinc-200 -ml-2 mb-2 text-xs"
              data-testid="back-to-workspace-button"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Workspace
            </Button>

            <h1
              className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="dashboard-title"
            >
              {analysis.project_name}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span data-testid="analysis-timestamp">
                  {new Date(analysis.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <Layers className="w-3.5 h-3.5" />
                <span data-testid="total-files-count">{analysis.total_files} files · {analysis.total_loc?.toLocaleString()} LOC</span>
              </div>
              <StatusBadge status="healthy" />
            </div>
          </div>
        </div>

        {/* ── Health Gauge ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HealthScore score={analysis.health_index} />
        </motion.div>

        {/* ── KPI Grid ── */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <MetricsCard
            title="Total Files"
            value={analysis.total_files}
            icon={FileCode}
            subtitle={`${analysis.total_loc?.toLocaleString() ?? 0} lines of code`}
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
        </motion.div>

        {/* ── Tabbed Detail Views ── */}
        <Tabs defaultValue="overview" className="mt-2">
          <TabsList className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-1 gap-1 flex-wrap h-auto" data-testid="dashboard-tabs">
            {['overview', 'files', 'smells', 'hotspots', 'refactor'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="capitalize text-xs font-semibold px-4 py-2 rounded-lg text-zinc-400 data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-100 data-[state=active]:border data-[state=active]:border-zinc-800 transition-all"
                data-testid={`tab-${tab}`}
              >
                {tab === 'refactor' ? 'Refactor Strategy' : tab === 'files' ? `Repository Files (${analysis.files.length})` : tab.charAt(0).toUpperCase() + tab.slice(1).replace('smells', 'Code Smells').replace('hotspots', 'Hotspots')}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── OVERVIEW TAB ── */}
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Area chart: complexity per file (ALL files displayed) */}
              <ChartCard
                title="Complexity by File"
                description={`Cyclomatic complexity across all ${analysis.files.length} files`}
                data-testid="complexity-chart"
              >
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={areaData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                    <defs>
                      <linearGradient id="gradComplexity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                    <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#71717a', fontSize: 10 }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="complexity" stroke="#2563eb" fill="url(#gradComplexity)" strokeWidth={2} dot={{ fill: '#2563eb', r: 3 }} name="Complexity" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Donut: smell distribution */}
              <ChartCard
                title="Code Smell Distribution"
                description="Breakdown of smell types detected"
                data-testid="smell-distribution"
              >
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={smellsDonut}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {smellsDonut.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Radar quality metrics */}
              <ChartCard
                title="Quality Radar"
                description="Architectural quality across 5 dimensions"
              >
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart cx="50%" cy="50%" outerRadius={90} data={radarData}>
                    <PolarGrid stroke="#27272a" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#52525b', fontSize: 9 }} />
                    <Radar name="Quality" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip content={<ChartTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Activity feed */}
              <ChartCard title="Analysis Activity" description="Real-time event log from this analysis run">
                <ActivityFeed activities={feedItems} />
                <div className="mt-6 border-t border-zinc-900 pt-4">
                  <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider mb-3">Refactor Milestones</p>
                  <Timeline items={timelineItems} />
                </div>
              </ChartCard>
            </div>
          </TabsContent>

          {/* ── REPOSITORY FILES TAB (ALL files displayed, with page size selector) ── */}
          <TabsContent value="files" className="mt-6 space-y-5">
            <div className="glass-card rounded-xl border border-zinc-800/80 p-6 space-y-5" data-testid="repository-files-list">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Analyzed Repository Files</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Displaying {displayedFiles.length} of {analysis.files.length} analyzed files
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <SearchBar
                    value={fileSearch}
                    onChange={setFileSearch}
                    placeholder="Search files or language..."
                  />

                  {/* Page Size Selector (Default ALL) */}
                  <div className="flex items-center space-x-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs">
                    <span className="text-zinc-500 font-semibold uppercase text-[10px]">Show:</span>
                    <select
                      value={filePageSize}
                      onChange={(e) => setFilePageSize(e.target.value)}
                      className="bg-transparent text-zinc-200 font-bold focus:outline-none cursor-pointer"
                      data-testid="page-size-selector"
                    >
                      {PAGE_SIZE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="bg-zinc-950 text-zinc-200">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Table rendering ALL files */}
              <div className="overflow-x-auto border border-zinc-800/60 rounded-xl bg-zinc-950/60">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-900/80 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-800/80 font-mono">
                    <tr>
                      <th className="p-3.5">Filename</th>
                      <th className="p-3.5">Language</th>
                      <th className="p-3.5 text-right">LOC</th>
                      <th className="p-3.5 text-right">Complexity</th>
                      <th className="p-3.5 text-right">Functions</th>
                      <th className="p-3.5 text-right">Classes</th>
                      <th className="p-3.5 text-right">Smells</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 font-mono">
                    {displayedFiles.map((file, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/40 transition-colors" data-testid={`file-row-${idx}`}>
                        <td className="p-3.5 font-bold text-zinc-100 flex items-center gap-2 max-w-md truncate">
                          <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="truncate">{file.filename}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-semibold text-zinc-400">
                            {file.language}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-semibold text-zinc-200">{file.loc}</td>
                        <td className="p-3.5 text-right font-semibold text-amber-400">{file.complexity}</td>
                        <td className="p-3.5 text-right text-zinc-400">{file.functions}</td>
                        <td className="p-3.5 text-right text-zinc-400">{file.classes}</td>
                        <td className="p-3.5 text-right">
                          <span className={`font-bold ${file.smells?.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {file.smells?.length ?? 0}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ── CODE SMELLS TAB ── */}
          <TabsContent value="smells" className="mt-6 space-y-5">
            <div className="glass-card rounded-xl border border-zinc-800/80 p-6 space-y-5" data-testid="smells-list">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Detected Code Smells</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {analysis.smells.length} total · {filteredSmells.length} shown
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                  <SearchBar
                    value={smellSearch}
                    onChange={setSmellSearch}
                    placeholder="Search smells or files…"
                  />
                  <FilterBar
                    label=""
                    options={[
                      { label: 'All',      value: 'all' },
                      { label: 'High',     value: 'high' },
                      { label: 'Medium',   value: 'medium' },
                      { label: 'Low',      value: 'low' },
                    ]}
                    activeValue={smellFilter}
                    onChange={setSmellFilter}
                  />
                </div>
              </div>

              {filteredSmells.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="No smells match your filters"
                  description="Try adjusting the severity filter or search query."
                />
              ) : (
                <div className="space-y-3">
                  {filteredSmells.map((smell, i) => (
                    <SmellCard key={i} smell={smell} index={i} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── HOTSPOTS TAB ── */}
          <TabsContent value="hotspots" className="mt-6 space-y-5">
            <div className="glass-card rounded-xl border border-zinc-800/80 p-6 space-y-5" data-testid="hotspots-list">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-100">Code Hotspots</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Ranked by composite risk score ({analysis.hotspots.length} total)</p>
                </div>
                <FilterBar
                  label=""
                  options={[
                    { label: 'All',      value: 'all' },
                    { label: 'Critical', value: 'critical' },
                    { label: 'High',     value: 'high' },
                    { label: 'Medium',   value: 'medium' },
                  ]}
                  activeValue={hotspotFilter}
                  onChange={setHotspotFilter}
                />
              </div>

              {filteredHotspots.length === 0 ? (
                <EmptyState
                  icon={Shield}
                  title="No hotspots match your filter"
                  description="Try a different priority level."
                />
              ) : (
                <div className="space-y-3">
                  {filteredHotspots.map((h, i) => (
                    <HotspotRow key={i} hotspot={h} index={i} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── REFACTOR TAB ── */}
          <TabsContent value="refactor" className="mt-6 space-y-5">
            <div className="glass-card rounded-xl border border-zinc-800/80 p-6 space-y-5" data-testid="refactor-actions-list">
              <div>
                <h3 className="text-base font-bold text-zinc-100">Refactoring Recommendations</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {analysis.refactor_actions.length} prioritized actions
                </p>
              </div>

              {analysis.refactor_actions.length === 0 ? (
                <EmptyState
                  icon={Code}
                  title="No refactor actions generated"
                  description="Run analysis on a larger or more complex codebase to get recommendations."
                />
              ) : (
                <div className="space-y-4">
                  {analysis.refactor_actions.map((action, i) => (
                    <RefactorCard key={i} action={action} index={i} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </main>
    </div>
  );
};