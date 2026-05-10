import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import PageNotFound from './lib/PageNotFound'
import { AuthProvider, useAuth } from '@/lib/AuthContext'
import { LangProvider } from '@/lib/LangContext'
import Layout from './components/Layout'
import ClientDashboard from './pages/ClientDashboard'
import ProjectsList from './pages/ProjectsList'
import ProjectDetail from './pages/ProjectDetail'
import ClientPayments from './pages/ClientPayments'
import ClientMessages from './pages/ClientMessages'
import AgentDashboard from './pages/agent/AgentDashboard'
import AgentMissions from './pages/agent/AgentMissions'
import AgentReports from './pages/agent/AgentReports'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProjects from './pages/admin/AdminProjects'
import AdminClients from './pages/admin/AdminClients'
import AdminAgents from './pages/admin/AdminAgents'
import AdminPayments from './pages/admin/AdminPayments'
import AdminReports from './pages/admin/AdminReports'
import AdminContractManager from './pages/admin/AdminContractManager'
import AdminTasks from './pages/admin/AdminTasks'
import AgentTasks from './pages/agent/AgentTasks'
import AgentPhotos from './pages/agent/AgentPhotos'
import Onboarding from './pages/Onboarding'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Settings from './pages/Settings'
import CookieBanner from './components/CookieBanner'

// Redirige vers /login si non authentifié
const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, isLoadingAuth, user } = useAuth()
  if (isLoadingAuth) return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />
  return children
}

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useAuth()

  if (isLoadingAuth) return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  )

  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/"       element={<Landing />} />
      <Route path="/login"  element={<Login />} />

      {/* Onboarding (authentifié mais pas encore complet) */}
      <Route path="/onboarding" element={
        <PrivateRoute><Onboarding /></PrivateRoute>
      } />

      {/* App principale avec Layout */}
      <Route element={<Layout />}>
        {/* Client */}
        <Route path="/dashboard"    element={<PrivateRoute roles={['client', 'admin']}><ClientDashboard /></PrivateRoute>} />
        <Route path="/projects"     element={<PrivateRoute roles={['client', 'admin']}><ProjectsList /></PrivateRoute>} />
        <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
        <Route path="/payments"     element={<PrivateRoute roles={['client', 'admin']}><ClientPayments /></PrivateRoute>} />
        <Route path="/messages"     element={<PrivateRoute><ClientMessages /></PrivateRoute>} />
        <Route path="/settings"     element={<PrivateRoute><Settings /></PrivateRoute>} />

        {/* Agent */}
        <Route path="/agent"          element={<PrivateRoute roles={['agent', 'admin']}><AgentDashboard /></PrivateRoute>} />
        <Route path="/agent/missions" element={<PrivateRoute roles={['agent', 'admin']}><AgentMissions /></PrivateRoute>} />
        <Route path="/agent/reports"  element={<PrivateRoute roles={['agent', 'admin']}><AgentReports /></PrivateRoute>} />
        <Route path="/agent/tasks"    element={<PrivateRoute roles={['agent', 'admin']}><AgentTasks /></PrivateRoute>} />
        <Route path="/agent/photos"   element={<PrivateRoute roles={['agent', 'admin']}><AgentPhotos /></PrivateRoute>} />

        {/* Admin */}
        <Route path="/admin"           element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/projects"  element={<PrivateRoute roles={['admin']}><AdminProjects /></PrivateRoute>} />
        <Route path="/admin/clients"   element={<PrivateRoute roles={['admin']}><AdminClients /></PrivateRoute>} />
        <Route path="/admin/agents"    element={<PrivateRoute roles={['admin']}><AdminAgents /></PrivateRoute>} />
        <Route path="/admin/payments"  element={<PrivateRoute roles={['admin']}><AdminPayments /></PrivateRoute>} />
        <Route path="/admin/reports"   element={<PrivateRoute roles={['admin']}><AdminReports /></PrivateRoute>} />
        <Route path="/admin/contracts" element={<PrivateRoute roles={['admin']}><AdminContractManager /></PrivateRoute>} />
        <Route path="/admin/tasks"     element={<PrivateRoute roles={['admin']}><AdminTasks /></PrivateRoute>} />

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
          <CookieBanner />
        </QueryClientProvider>
      </AuthProvider>
    </LangProvider>
  )
}

export default App
