import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const MetricsCard = ({ title, value, subtitle, icon: Icon, trend }) => {
  return (
    <Card className="glass-card border-border hover:border-electric-blue/50 transition-smooth" data-testid="metrics-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest" data-testid="metrics-card-title">
          {title}
        </CardTitle>
        {Icon && <Icon className="w-4 h-4 text-muted-foreground" data-testid="metrics-card-icon" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black" style={{ fontFamily: 'Chivo, sans-serif' }} data-testid="metrics-card-value">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1" data-testid="metrics-card-subtitle">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className={`text-xs mt-2 ${trend.positive ? 'text-neon-green' : 'text-destructive'}`} data-testid="metrics-card-trend">
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
};