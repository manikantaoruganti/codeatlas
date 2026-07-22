import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedCounter } from './dashboard/AnimatedCounter';
import { motion } from 'framer-motion';

export const MetricsCard = ({ title, value, subtitle, icon: Icon, trend }) => {
  // Generate random data points for the mini sparkline
  const sparklinePoints = React.useMemo(() => {
    const points = [];
    for (let i = 0; i < 8; i++) {
      points.push(20 + Math.floor(Math.random() * 60));
    }
    return points;
  }, []);

  // Format SVG path for sparkline
  const svgPath = React.useMemo(() => {
    const width = 80;
    const height = 24;
    const step = width / (sparklinePoints.length - 1);
    return sparklinePoints
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${height - (p / 100) * height}`)
      .join(' ');
  }, [sparklinePoints]);

  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const isNumeric = !isNaN(numericValue) && isFinite(value);

  return (
    <Card 
      className="glass-card border-zinc-800/80 hover:border-blue-500/35 overflow-hidden transition-all duration-300 group" 
      data-testid="metrics-card"
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle 
          className="text-xs font-semibold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors" 
          data-testid="metrics-card-title"
        >
          {title}
        </CardTitle>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-blue-400 group-hover:border-blue-500/25 transition-all">
            <Icon className="w-4 h-4" data-testid="metrics-card-icon" />
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-2 relative">
        <div className="flex items-end justify-between">
          <div>
            <div 
              className="text-3.5xl font-black text-zinc-100 tracking-tight" 
              style={{ fontFamily: 'Chivo, sans-serif' }} 
              data-testid="metrics-card-value"
            >
              {isNumeric ? (
                <AnimatedCounter value={numericValue} decimals={numericValue % 1 === 0 ? 0 : 1} />
              ) : (
                value
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-zinc-500 font-medium mt-1" data-testid="metrics-card-subtitle">
                {subtitle}
              </p>
            )}
          </div>

          {/* Mini Sparkline Chart */}
          <div className="h-6 w-20 opacity-40 group-hover:opacity-85 transition-opacity pointer-events-none mb-1">
            <svg className="w-full h-full" viewBox="0 0 80 24">
              <path
                d={svgPath}
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {trend && (
          <div 
            className={`text-xs mt-3 flex items-center font-semibold ${
              trend.positive ? 'text-emerald-400' : 'text-red-400'
            }`} 
            data-testid="metrics-card-trend"
          >
            <span className="mr-1">{trend.positive ? '↑' : '↓'}</span>
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
};