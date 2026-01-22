import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ExternalLink, Github } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { TableRowSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { mockApplications } from '@/data/mockData';

const Applications = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Applications</h1>
            <p className="text-muted-foreground">Manage your deployed applications</p>
          </div>
          <Button variant="hero" className="gap-2">
            <Plus className="w-4 h-4" />
            New Application
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">App Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">GitHub Repo</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Environment</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Pods</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Last Deployed</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td colSpan={7}>
                          <TableRowSkeleton />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  mockApplications.map((app, index) => (
                    <motion.tr
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">{app.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Github className="w-4 h-4" />
                          <span className="text-sm font-mono">{app.repo}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            app.environment === 'production'
                              ? 'bg-primary/20 text-primary'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                        >
                          {app.environment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-foreground">{app.pods}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{formatDate(app.lastDeployed)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Applications;