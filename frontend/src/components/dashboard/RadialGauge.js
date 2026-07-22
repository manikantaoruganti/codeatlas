import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from './AnimatedCounter';
import { ShieldCheck } from 'lucide-react';

export const RadialGauge = ({ score }) => {
  const [animatedAngle, setAnimatedAngle] = useState(-135); // Start at minimum angle

  // Gauge parameters
  // Min score = 0 -> -135 degrees (pointing left-down)
  // Max score = 100 -> 135 degrees (pointing right-down)
  const minAngle = -135;
  const maxAngle = 135;
  const targetAngle = minAngle + ((score / 100) * (maxAngle - minAngle));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedAngle(targetAngle);
    }, 150);
    return () => clearTimeout(timer);
  }, [targetAngle]);

  const getScoreColor = (val) => {
    if (val >= 80) return { hex: '#10b981', text: 'text-emerald-400', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' };
    if (val >= 60) return { hex: '#f59e0b', text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/10' };
    return { hex: '#ef4444', text: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/10' };
  };

  const colors = getScoreColor(score);

  return (
    <div className="glass-card rounded-xl border border-zinc-800/80 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
      {/* Background glow mesh */}
      <div 
        className="absolute w-64 h-64 rounded-full filter blur-[80px] -bottom-32 -left-32 opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: colors.hex }}
      />
      
      {/* Left: Gauge Graphics */}
      <div className="relative flex items-center justify-center w-60 h-60">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor={colors.hex} />
              <stop offset="100%" stopColor={colors.hex} stopOpacity={0.8} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Outer Confidence Track */}
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="transparent"
            stroke="#18181b"
            strokeWidth="2"
          />
          
          {/* Gauge Background Arc (180 to 90 degrees offset -> 270 degrees total) */}
          <path
            d="M 40 160 A 80 80 0 1 1 160 160"
            fill="transparent"
            stroke="#1f1f23"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active progress arc */}
          <path
            d="M 40 160 A 80 80 0 1 1 160 160"
            fill="transparent"
            stroke="url(#gaugeGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={377} // Circumference of radius 80 over 270deg is ~377
            strokeDashoffset={377 - ((score / 100) * 377)}
            className="transition-all duration-1000 ease-out"
            filter="url(#glow)"
          />

          {/* Gauge Ticks */}
          {[0, 25, 50, 75, 100].map((t) => {
            const angle = minAngle + ((t / 100) * (maxAngle - minAngle));
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 70 * Math.cos(rad);
            const y1 = 100 + 70 * Math.sin(rad);
            const x2 = 100 + 78 * Math.cos(rad);
            const y2 = 100 + 78 * Math.sin(rad);
            return (
              <line
                key={t}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#3f3f46"
                strokeWidth="2"
                transform="rotate(90 100 100)"
              />
            );
          })}
        </svg>

        {/* Center Needle & Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="flex items-baseline justify-center">
            <AnimatedCounter
              value={score}
              decimals={1}
              className="text-5xl font-black tracking-tight font-sans glow-text-blue"
              style={{ color: colors.hex }}
            />
            <span className="text-zinc-500 text-sm ml-1">/100</span>
          </div>
          
          <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mt-1">
            Health Index
          </div>
        </div>

        {/* Needle pointer */}
        <div 
          className="absolute w-2 h-24 bottom-[100px] left-[116px] origin-bottom transition-all duration-1000 ease-out"
          style={{ 
            transform: `rotate(${animatedAngle}deg)`,
            transformOrigin: '50% 100%'
          }}
        >
          {/* Draw a subtle sleek needle */}
          <div className="w-1 h-14 bg-gradient-to-t from-blue-500 to-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] mx-auto" />
          <div className="w-3 h-3 bg-zinc-800 border-2 border-zinc-500 rounded-full mx-auto -mt-1.5 shadow-lg" />
        </div>
      </div>

      {/* Right: Confidence Metric details */}
      <div className="flex-1 flex flex-col justify-center space-y-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-300 mb-3 w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            Static Analysis Confidence Ring
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 leading-tight">
            Codebase Health: <span className={colors.text}>{score >= 80 ? 'Excellent' : score >= 60 ? 'Optimal' : 'Needs attention'}</span>
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
            This repository is rated based on complexity hotspots, structural smells, code density, and refactoring efforts.
          </p>
        </div>
      </div>
    </div>
  );
};
