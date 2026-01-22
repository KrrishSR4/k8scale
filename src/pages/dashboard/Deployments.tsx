import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Clock, GitBranch } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { TableRowSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { mockDeployments } from '@/data/mockData';

const Deployments = () => {
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
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Deployments</h1>
          <p className="text-muted-foreground">View deployment history and rollback if needed</p>
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
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Application</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Version</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Duration</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Timestamp</th>
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
                  mockDeployments.map((deployment, index) => (
                    <motion.tr
                      key={deployment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground">{deployment.appName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-muted-foreground" />
                          <span className="font-mono text-sm text-primary">{deployment.version}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            deployment.type === 'canary'
                              ? 'bg-warning/20 text-warning'
                              : 'bg-primary/20 text-primary'
                          }`}
                        >
                          {deployment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={deployment.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-sm">{deployment.duration}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{formatDate(deployment.timestamp)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          disabled={deployment.status === 'in-progress'}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Rollback
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

export default Deployments;