import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Overview from './pages/dashboard/Overview';
import Applications from './pages/dashboard/Applications';
import Deployments from './pages/dashboard/Deployments';
import Monitoring from './pages/dashboard/Monitoring';
import AuditLog from './pages/dashboard/AuditLog';
import Settings from './pages/dashboard/Settings';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 15_000, refetchOnWindowFocus: false } },
});

const guarded = (element: JSX.Element) => <ProtectedRoute>{element}</ProtectedRoute>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="bottom-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={guarded(<Overview />)} />
            <Route path="/dashboard/applications" element={guarded(<Applications />)} />
            <Route path="/dashboard/deployments" element={guarded(<Deployments />)} />
            <Route path="/dashboard/monitoring" element={guarded(<Monitoring />)} />
            <Route path="/dashboard/audit" element={guarded(<AuditLog />)} />
            <Route path="/dashboard/settings" element={guarded(<Settings />)} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
