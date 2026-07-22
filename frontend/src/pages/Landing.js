import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import {
  Zap,
  Shield,
  Sparkles,
  TrendingUp,
  FileSearch,
  GitBranch,
  Terminal,
  ChevronRight,
  Code,
  ShieldCheck,
  Eye,
  GitPullRequest
} from 'lucide-react';
import { GlassCard } from '@/components/dashboard/GlassCard';

export const Landing = () => {
  const features = [
    {
      icon: FileSearch,
      title: 'Multi-Language Analysis',
      description: 'Instant parsing support for Python, JavaScript, Java, C++, Go, Rust, SQL, and Bash.',
      color: 'text-blue-400'
    },
    {
      icon: TrendingUp,
      title: 'Code Health Index',
      description: 'Real-time health grading (0-100) computed from cyclomatic complexity and clean code guidelines.',
      color: 'text-emerald-400'
    },
    {
      icon: Zap,
      title: 'Hotspot Detection',
      description: 'Isolate complex hotspots, prioritize refactoring, and reduce code regressions.',
      color: 'text-amber-400'
    },
    {
      icon: GitBranch,
      title: 'Refactor Strategies',
      description: 'Prioritized technical debt remediation strategies mapping execution effort vs potential impact.',
      color: 'text-purple-400'
    },
    {
      icon: Terminal,
      title: 'Integrated Compiler',
      description: 'Execute scripts in an isolated code compiler sandbox with active debugging.',
      color: 'text-cyan-400'
    },
    {
      icon: Sparkles,
      title: 'AI Explainers',
      description: 'AI-assisted code explainers to simplify complicated legacy logic blocks instantly.',
      color: 'text-pink-400'
    },
  ];

  // Tech list for tech wall
  const languages = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'Bash', 'SQL', 'Kotlin', 'Swift'
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden relative">
      <Navigation variant="landing" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none z-0" />

      {/* Aurora glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none z-0" />

      {/* Cinematic Hero */}
      <section
        className="relative pt-36 pb-24 overflow-hidden z-10"
        data-testid="hero-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8">
            {/* Glowing Hero Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 glow-text-blue" data-testid="hero-badge">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Production-Grade Code Intelligence Hub</span>
            </div>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-white"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="hero-title"
            >
              Master Your Codebase
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                With AI-Powered Insights
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-400 max-w-3xl mx-auto leading-relaxed" data-testid="hero-description">
              CodeAtlas AI parses code repositories, maps hot structural metrics, computes maintainability benchmarks, and flags smells across 8 programming languages—all packaged in a dark mode SaaS interface.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/workspace">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-6 text-sm shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.45)] transition-all"
                  data-testid="hero-cta-button"
                >
                  Start Analyzing
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/compiler">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900 px-8 py-6 text-sm transition-all"
                  data-testid="hero-compiler-button"
                >
                  <Terminal className="mr-2 w-4.5 h-4.5 text-blue-500" />
                  Try Compiler IDE
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Wall Section */}
      <section className="py-10 border-y border-zinc-900 bg-zinc-950/60 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-6">
            Supported Engineering Ecosystems
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {languages.map((lang, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-850 text-xs font-mono text-zinc-400 select-none hover:border-zinc-700 transition-colors"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Feature Section */}
      <section id="features" className="py-24 relative z-10" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-blue-500" data-testid="features-label">
              Platform Features
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-white"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="features-title"
            >
              Advanced Static Observability
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => (
              <GlassCard
                key={index}
                delay={index * 0.05}
                hoverEffect={true}
                className="border border-zinc-900 bg-zinc-950/30 p-6 flex flex-col justify-between min-h-[220px]"
                data-testid={`feature-card-${index}`}
              >
                <div className="space-y-4">
                  <div className={`p-2.5 rounded-lg bg-zinc-900 border border-zinc-850 w-fit ${feat.color}`}>
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-200" style={{ fontFamily: 'Chivo, sans-serif' }} data-testid={`feature-title-${index}`}>
                    {feat.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed" data-testid={`feature-description-${index}`}>
                    {feat.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Flow */}
      <section
        id="how-it-works"
        className="py-24 border-t border-zinc-900 relative z-10"
        data-testid="how-it-works-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-blue-500" data-testid="how-it-works-label">
              Workflows
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-white"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="how-it-works-title"
            >
              Analyze Repositories in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Drop Repositories', desc: 'Drag-and-drop source files or code zip archives.', icon: Code },
              { step: '02', title: 'Compile Metrics', desc: 'Trace health index ratings, cyclomatic complex charts, and smells.', icon: Eye },
              { step: '03', title: 'Refactor Roadmaps', desc: 'Execute recommended tasks to resolve technical debt.', icon: GitPullRequest },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center space-y-4 p-6 rounded-xl bg-zinc-900/10 border border-zinc-900/40 relative group"
                data-testid={`how-it-works-step-${i}`}
              >
                <div
                  className="text-5xl font-black text-zinc-800/40 group-hover:text-blue-500/10 transition-colors font-mono"
                  data-testid={`step-number-${i}`}
                >
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-zinc-200" data-testid={`step-title-${i}`}>
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed" data-testid={`step-description-${i}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-24 border-t border-zinc-900 bg-zinc-900/10 relative z-10" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white"
            style={{ fontFamily: 'Chivo, sans-serif' }}
            data-testid="cta-title"
          >
            Ready to Analyze Your Projects?
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto" data-testid="cta-description">
            Drop your code ZIP archive and start compiling diagnostic health indexes in seconds.
          </p>
          <div className="pt-2">
            <Link to="/workspace">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-6 text-sm shadow-[0_4px_20px_rgba(37,99,235,0.3)]" data-testid="cta-button">
                Start Workspace Session
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-zinc-900 bg-zinc-950 relative z-10" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-600">
          <p>© 2026 CodeAtlas AI. All rights reserved. Enterprise Code Observability platform.</p>
        </div>
      </footer>
    </div>
  );
};