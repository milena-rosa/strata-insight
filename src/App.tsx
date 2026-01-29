import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectAnalysisPage from "./pages/ProjectAnalysisPage";
import NewProjectPage from "./pages/NewProjectPage";
import StandardsPage from "./pages/StandardsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to projects */}
          <Route path="/" element={<Navigate to="/projects" replace />} />
          
          {/* Main app routes with layout */}
          <Route path="/projects" element={<AppLayout><ProjectsPage /></AppLayout>} />
          <Route path="/projects/new" element={<NewProjectPage />} />
          <Route path="/projects/:id/analysis" element={<AppLayout><ProjectAnalysisPage /></AppLayout>} />
          <Route path="/standards" element={<AppLayout><StandardsPage /></AppLayout>} />
          <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
