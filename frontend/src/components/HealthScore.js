import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const HealthScore = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-neon-green/20', text: 'text-neon-green', border: 'border-neon-green' };
    if (score >= 60) return { bg: 'bg-signal-amber/20', text: 'text-signal-amber', border: 'border-signal-amber' };
    return { bg: 'bg-destructive/20', text: 'text-destructive', border: 'border-destructive' };
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle2 className="w-8 h-8" />;
    if (score >= 60) return <AlertTriangle className="w-8 h-8" />;
    return <XCircle className="w-8 h-8" />;
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const colors = getScoreColor(score);

  return (
    <div className={`glass-card p-8 rounded-md border ${colors.border}`} data-testid="health-score-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2" data-testid="health-score-label">
            Code Health Index
          </p>
          <div className="flex items-baseline space-x-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-6xl font-black ${colors.text}`}
              style={{ fontFamily: 'Chivo, sans-serif' }}
              data-testid="health-score-value"
            >
              {score.toFixed(0)}
            </motion.span>
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <p className={`mt-2 text-lg font-medium ${colors.text}`} data-testid="health-score-status">
            {getScoreLabel(score)}
          </p>
        </div>
        <div className={colors.text}>{getScoreIcon(score)}</div>
      </div>

      {/* Progress bar */}
      <div className="mt-6 h-2 bg-surface rounded-full overflow-hidden" data-testid="health-score-progress-bar">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full ${colors.bg.replace('/20', '')}`}
        />
      </div>
    </div>
  );
};