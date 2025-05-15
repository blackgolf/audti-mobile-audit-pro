
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SupportPortal from "./pages/SupportPortal";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import AuditsList from "./pages/audits/AuditsList";
import UnitsList from "./pages/units/UnitsList";
import ChecklistsManager from "./pages/checklists/ChecklistsManager";
import ReportsList from "./pages/reports/ReportsList";
import Settings from "./pages/settings/Settings";
import AuditForm from "./pages/audits/AuditForm";
import AuditReport from "./pages/reports/AuditReport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/support" element={<SupportPortal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/audits" element={<AuditsList />} />
          <Route path="/audits/new" element={<AuditForm />} />
          <Route path="/audits/:id" element={<AuditForm />} />
          <Route path="/units" element={<UnitsList />} />
          <Route path="/checklists" element={<ChecklistsManager />} />
          <Route path="/reports" element={<ReportsList />} />
          <Route path="/reports/:id" element={<AuditReport />} />
          <Route path="/reports/new" element={<Navigate to="/reports" replace />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
