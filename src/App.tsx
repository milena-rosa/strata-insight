import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import NewProjectPage from './pages/NewProjectPage'
import NotFound from './pages/NotFound'
import ProjectAnalysisPage from './pages/ProjectAnalysisPage'
import ProjectsPage from './pages/ProjectsPage'
import SettingsPage from './pages/SettingsPage'
import StandardsPage from './pages/StandardsPage'

const queryClient = new QueryClient()

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
          <Route
            path="/projects"
            element={
              <AppLayout>
                <ProjectsPage />
              </AppLayout>
            }
          />
          <Route path="/projects/new" element={<NewProjectPage />} />
          <Route
            path="/projects/:id/analysis"
            element={
              <AppLayout>
                <ProjectAnalysisPage />
              </AppLayout>
            }
          />
          <Route
            path="/standards"
            element={
              <AppLayout>
                <StandardsPage />
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <SettingsPage />
              </AppLayout>
            }
          />

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
