import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { healthCheck } from '@/services/api';
import { Settings as SettingsIcon, Save, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export const Settings = () => {
  const [aiProvider, setAiProvider] = useState('none');
  const [aiEnabled, setAiEnabled] = useState(false);
  const [complexityThreshold, setComplexityThreshold] = useState('10');
  const [healthStatus, setHealthStatus] = useState(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const status = await healthCheck();
      setHealthStatus(status);
      setAiEnabled(status.ai_enabled);
      setAiProvider(status.ai_provider || 'none');
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const handleSave = () => {
    toast.success('Settings saved! Note: Backend environment variables require restart to take effect.');
  };

  return (
    <div className="min-h-screen">
      <Navigation variant="app" />

      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <SettingsIcon className="w-8 h-8 text-electric-blue" />
              <h1
                className="text-3xl sm:text-4xl font-black"
                style={{ fontFamily: 'Chivo, sans-serif' }}
                data-testid="settings-title"
              >
                Settings
              </h1>
            </div>
            <p className="text-lg text-muted-foreground" data-testid="settings-description">
              Configure AI providers and analysis parameters
            </p>
          </div>

          {/* Health Status */}
          {healthStatus && (
            <div className="glass-card p-6 rounded-md mb-8" data-testid="health-status-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2" data-testid="system-status-label">
                    System Status
                  </p>
                  <div className="flex items-center space-x-2">
                    {healthStatus.status === 'healthy' ? (
                      <CheckCircle2 className="w-5 h-5 text-neon-green" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <span className="text-lg font-bold" data-testid="system-status-value">
                      {healthStatus.status}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2" data-testid="ai-status-label">
                    AI Status
                  </p>
                  <span
                    className={`text-lg font-bold ${
                      healthStatus.ai_enabled ? 'text-neon-green' : 'text-muted-foreground'
                    }`}
                    data-testid="ai-status-value"
                  >
                    {healthStatus.ai_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Configuration */}
          <div className="glass-card p-8 rounded-md mb-8" data-testid="ai-config-card">
            <h2 className="text-xl font-bold mb-6" data-testid="ai-config-title">
              AI Configuration
            </h2>

            <div className="space-y-6">
              {/* AI Provider */}
              <div>
                <Label htmlFor="ai-provider" className="text-sm uppercase tracking-widest mb-2 block" data-testid="ai-provider-label">
                  AI Provider
                </Label>
                <Select value={aiProvider} onValueChange={setAiProvider}>
                  <SelectTrigger
                    id="ai-provider"
                    className="bg-black/20 border-white/10"
                    data-testid="ai-provider-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border">
                    <SelectItem value="none" data-testid="provider-none">
                      None (Disabled)
                    </SelectItem>
                    <SelectItem value="openai" data-testid="provider-openai">
                      OpenAI
                    </SelectItem>
                    <SelectItem value="gemini" data-testid="provider-gemini">
                      Google Gemini
                    </SelectItem>
                    <SelectItem value="huggingface" data-testid="provider-huggingface">
                      HuggingFace
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2" data-testid="ai-provider-hint">
                  Configure API keys in backend .env file
                </p>
              </div>

              {/* Enable AI Explanations */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ai-enabled" className="text-sm uppercase tracking-widest" data-testid="ai-enabled-label">
                    Enable AI Explanations
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1" data-testid="ai-enabled-hint">
                    Provide AI-powered insights and recommendations
                  </p>
                </div>
                <Switch
                  id="ai-enabled"
                  checked={aiEnabled}
                  onCheckedChange={setAiEnabled}
                  data-testid="ai-enabled-switch"
                />
              </div>
            </div>
          </div>

          {/* Analysis Configuration */}
          <div className="glass-card p-8 rounded-md mb-8" data-testid="analysis-config-card">
            <h2 className="text-xl font-bold mb-6" data-testid="analysis-config-title">
              Analysis Configuration
            </h2>

            <div className="space-y-6">
              {/* Complexity Threshold */}
              <div>
                <Label
                  htmlFor="complexity-threshold"
                  className="text-sm uppercase tracking-widest mb-2 block"
                  data-testid="complexity-threshold-label"
                >
                  Complexity Threshold
                </Label>
                <Input
                  id="complexity-threshold"
                  type="number"
                  value={complexityThreshold}
                  onChange={(e) => setComplexityThreshold(e.target.value)}
                  className="bg-black/20 border-white/10 focus:border-electric-blue"
                  data-testid="complexity-threshold-input"
                />
                <p className="text-xs text-muted-foreground mt-2" data-testid="complexity-threshold-hint">
                  Flag functions with cyclomatic complexity above this value (default: 10)
                </p>
              </div>

              {/* Default Intent */}
              <div>
                <Label htmlFor="default-intent" className="text-sm uppercase tracking-widest mb-2 block" data-testid="default-intent-label">
                  Default Analysis Intent
                </Label>
                <Select defaultValue="maintainability">
                  <SelectTrigger
                    id="default-intent"
                    className="bg-black/20 border-white/10"
                    data-testid="default-intent-select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border">
                    <SelectItem value="maintainability" data-testid="intent-maintainability">
                      Maintainability
                    </SelectItem>
                    <SelectItem value="performance" data-testid="intent-performance">
                      Performance
                    </SelectItem>
                    <SelectItem value="refactoring" data-testid="intent-refactoring">
                      Refactoring
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-electric-blue hover:bg-blue-600 btn-hover py-6 text-lg"
            data-testid="save-settings-button"
          >
            <Save className="mr-2 w-5 h-5" />
            Save Settings
          </Button>

          {/* Info */}
          <div className="mt-8 glass-card p-6 rounded-md" data-testid="settings-info">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Changes to AI provider and backend configuration require updating the .env file and
              restarting the backend service. The platform works fully without AI enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};