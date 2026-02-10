import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import {
  Code2,
  Zap,
  Shield,
  Sparkles,
  TrendingUp,
  FileSearch,
  GitBranch,
  Terminal,
  ChevronRight,
} from 'lucide-react';

export const Landing = () => {
  const features = [
    {
      icon: FileSearch,
      title: 'Multi-Language Analysis',
      description: 'Support for Python, JavaScript, Java, C++, Go, Rust, SQL, and Bash',
    },
    {
      icon: TrendingUp,
      title: 'Code Health Index',
      description: 'Real-time health scoring from 0-100 based on complexity and maintainability',
    },
    {
      icon: Zap,
      title: 'Hotspot Detection',
      description: 'Identify risky code areas and prioritize refactoring efforts',
    },
    {
      icon: GitBranch,
      title: 'Refactor Strategies',
      description: 'Automated actionable recommendations with impact analysis',
    },
    {
      icon: Terminal,
      title: 'Integrated Compiler',
      description: 'Execute and test code directly in the platform',
    },
    {
      icon: Sparkles,
      title: 'AI Insights',
      description: 'Optional AI-powered explanations and optimization suggestions',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation variant="landing" />

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1762279388956-1c098163a2a8?crop=entropy&cs=srgb&fm=jpg&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        data-testid="hero-section"
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass rounded-full mb-8" data-testid="hero-badge">
              <Shield className="w-4 h-4 text-neon-green" />
              <span className="text-sm">Production-Grade Code Intelligence</span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="hero-title"
            >
              Master Your Codebase
              <br />
              <span className="text-electric-blue">With AI-Powered Insights</span>
            </h1>

            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed" data-testid="hero-description">
              CodeAtlas AI analyzes your code across 8 programming languages, detects complexity hotspots,
              calculates health scores, and generates refactoring strategies—all without requiring AI.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/workspace">
                <Button
                  size="lg"
                  className="bg-electric-blue hover:bg-blue-600 btn-hover text-lg px-8 py-6"
                  data-testid="hero-cta-button"
                >
                  Start Analyzing
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/compiler">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-electric-blue text-electric-blue hover:bg-electric-blue/10 text-lg px-8 py-6"
                  data-testid="hero-compiler-button"
                >
                  <Terminal className="mr-2 w-5 h-5" />
                  Try Compiler
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-electric-blue mb-4" data-testid="features-label">
              Features
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="features-title"
            >
              Everything You Need for Code Excellence
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 rounded-md hover:border-electric-blue/50 border border-border transition-smooth"
                data-testid={`feature-card-${index}`}
              >
                <feature.icon className="w-12 h-12 text-electric-blue mb-4" />
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Chivo, sans-serif' }} data-testid={`feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed" data-testid={`feature-description-${index}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-24 relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1762279389006-43963a0cee55?crop=entropy&cs=srgb&fm=jpg&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        data-testid="how-it-works-section"
      >
        <div className="absolute inset-0 bg-black/85" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-electric-blue mb-4" data-testid="how-it-works-label">
              How It Works
            </p>
            <h2
              className="text-3xl sm:text-4xl font-black"
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="how-it-works-title"
            >
              Simple. Fast. Powerful.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Upload Code', desc: 'Drop a file or ZIP containing your project' },
              { step: '02', title: 'Analyze', desc: 'Get instant metrics, smells, and hotspot detection' },
              { step: '03', title: 'Refactor', desc: 'Follow prioritized strategies to improve code health' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="text-center"
                data-testid={`how-it-works-step-${i}`}
              >
                <div
                  className="text-6xl font-black text-electric-blue/20 mb-4"
                  style={{ fontFamily: 'Chivo, sans-serif' }}
                  data-testid={`step-number-${i}`}
                >
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3" data-testid={`step-title-${i}`}>
                  {item.title}
                </h3>
                <p className="text-text-secondary" data-testid={`step-description-${i}`}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-surface" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-black mb-6"
            style={{ fontFamily: 'Chivo, sans-serif' }}
            data-testid="cta-title"
          >
            Ready to Transform Your Code?
          </h2>
          <p className="text-lg text-text-secondary mb-8" data-testid="cta-description">
            Start analyzing your codebase in seconds. No API keys required.
          </p>
          <Link to="/workspace">
            <Button size="lg" className="bg-electric-blue hover:bg-blue-600 btn-hover text-lg px-8 py-6" data-testid="cta-button">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2025 CodeAtlas AI. Production-grade code intelligence platform.</p>
        </div>
      </footer>
    </div>
  );
};