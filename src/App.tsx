import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import KPIsPage from "./pages/KPIs";
import ActionsPage from "./pages/Actions";
import ProblemsPage from "./pages/Problems";
import WorkstationsPage from "./pages/Workstations";
import TrendsPage from "./pages/Trends";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/kpis" element={
              <ProtectedRoute>
                <KPIsPage />
              </ProtectedRoute>
            } />
            <Route path="/actions" element={
              <ProtectedRoute>
                <ActionsPage />
              </ProtectedRoute>
            } />
            <Route path="/problems" element={
              <ProtectedRoute>
                <ProblemsPage />
              </ProtectedRoute>
            } />
            <Route path="/workstations" element={
              <ProtectedRoute allowedRoles={['admin', 'manager', 'team_leader']}>
                <WorkstationsPage />
              </ProtectedRoute>
            } />
            <Route path="/trends" element={
              <ProtectedRoute>
                <TrendsPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute allowedRoles={['admin', 'manager']}>
                <ReportsPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
