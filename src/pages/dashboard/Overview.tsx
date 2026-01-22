import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Rocket, Server, Cpu, HardDrive, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import { CardSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { mockOverviewStats, mockApplications } from '@/data/mockData';
import StatusBadge from '@/components/dashboard/StatusBadge';

const Overview = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor your infrastructure at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {loading ? (
            <>
              {[...Array(5)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </>
          ) : (
            <>
              <StatCard
                title="Total Applications"
                value={mockOverviewStats.totalApps}
                icon={Box}
                trend={{ value: 12, positive: true }}
              />
              <StatCard
                title="Active Deployments"
                value={mockOverviewStats.activeDeployments}
                icon={Rocket}
              />
              <StatCard
                title="Running Pods"
                value={mockOverviewStats.runningPods}
                icon={Server}
              />
              <StatCard
                title="CPU Usage"
                value={mockOverviewStats.cpuUsage}
                suffix="%"
                icon={Cpu}
              />
              <StatCard
                title="Memory Usage"
                value={mockOverviewStats.memoryUsage}
                suffix="%"
                icon={HardDrive}
              />
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Recent Applications</h2>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="divide-y divide-border">
              {mockApplications.slice(0, 4).map((app) => (
                <div key={app.id} className="px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium text-foreground">{app.name}</p>
                    <p className="text-sm text-muted-foreground">{app.repo}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card"
          >
            <div className="px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Quick Stats</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">CPU Utilization</span>
                  <span className="text-sm font-medium text-foreground">{mockOverviewStats.cpuUsage}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mockOverviewStats.cpuUsage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Memory Utilization</span>
                  <span className="text-sm font-medium text-foreground">{mockOverviewStats.memoryUsage}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mockOverviewStats.memoryUsage}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Cluster Health</span>
                  <span className="text-sm font-medium text-success">Healthy</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '98%' }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;