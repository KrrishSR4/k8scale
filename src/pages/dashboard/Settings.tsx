import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Plus, Trash2, Save } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Settings = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const [envVars, setEnvVars] = useState([
    { key: 'NODE_ENV', value: 'production' },
    { key: 'DATABASE_URL', value: '••••••••••••' },
    { key: 'API_SECRET', value: '••••••••••••' },
  ]);

  const addEnvVar = () => {
    setEnvVars([...envVars, { key: '', value: '' }]);
  };

  const removeEnvVar = (index: number) => {
    setEnvVars(envVars.filter((_, i) => i !== index));
  };

  const updateEnvVar = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...envVars];
    updated[index][field] = value;
    setEnvVars(updated);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground">Configure your project settings</p>
        </div>

        {/* GitHub Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
              <Github className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">GitHub Repository</h2>
              <p className="text-sm text-muted-foreground">Connect your repository for automatic deployments</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="repo-url" className="text-foreground">Repository URL</Label>
              <Input
                id="repo-url"
                type="text"
                placeholder="https://github.com/username/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="mt-1.5 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="hero" className="gap-2">
              <Github className="w-4 h-4" />
              Connect Repository
            </Button>
          </div>
        </motion.div>

        {/* Environment Variables */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-foreground">Environment Variables</h2>
              <p className="text-sm text-muted-foreground">Configure secrets and environment settings</p>
            </div>
            <Button variant="outline" size="sm" onClick={addEnvVar} className="gap-1.5">
              <Plus className="w-4 h-4" />
              Add Variable
            </Button>
          </div>

          <div className="space-y-3">
            {envVars.map((envVar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 items-center"
              >
                <Input
                  placeholder="KEY"
                  value={envVar.key}
                  onChange={(e) => updateEnvVar(index, 'key', e.target.value)}
                  className="flex-1 bg-secondary border-border font-mono text-sm text-foreground placeholder:text-muted-foreground"
                />
                <Input
                  placeholder="value"
                  value={envVar.value}
                  onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                  className="flex-[2] bg-secondary border-border font-mono text-sm text-foreground placeholder:text-muted-foreground"
                  type="password"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEnvVar(index)}
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end pt-4"
        >
          <Button variant="hero" size="lg" className="gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;