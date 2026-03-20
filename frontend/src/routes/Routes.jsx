import { createBrowserRouter } from 'react-router-dom'

import App from '../App'

// Landing Page
import LandingPage from '../pages/LandingPage'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import SetPasswordPage from '../pages/auth/SetPasswordPage'
import PricingPage from '../pages/PricingPage'
import ContactPage from '../pages/ContactPage'

// Dashboard Pages
import MainDashboard from '../pages/dashboards/MainDashboard'
import TeamDashboard from '../pages/dashboards/TeamDashboard'
import TeamOverview from '../pages/dashboards/TeamOverview'
import AdminDashboard from '../pages/dashboards/AdminDashboard'
import AdminOverview from '../pages/dashboards/AdminOverview'
import PmDashboard from '../pages/dashboards/PmDashboard'
import PmOverview from '../pages/dashboards/PmOverview'

// Project Pages
import ProjectList from '../pages/projects/ProjectList'
import ProjectDetail from '../pages/projects/ProjectDetail'

// Task Pages
import TaskList from '../pages/task/TaskList'
import TaskDetail from '../pages/task/TaskDetail'

// Team Pages
import TeamList from '../pages/teams/TeamList'
import TeamDetail from '../pages/teams/TeamDetail'

// Other Pages
import Settings from '../pages/setting/Settings'
import NotFound from '../pages/NotFound'
import Reports from '../pages/reports/Reports'
import TimelineView from '../pages/timeline/TimelineView'

// Auth guard
import ProtectedRoute from '../components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/set-password',
    element: (
      <ProtectedRoute>
        <SetPasswordPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/pricing',
    element: <PricingPage />
  },
  {
    path: '/contact',
    element: <ContactPage />
  },

  // ── Role-specific dashboards ──
  {
    path: '/dashboard/admin',
    element: (
      <ProtectedRoute requiredRole="OWNER">
        <AdminDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminOverview /> },
      { path: 'projects', element: <ProjectList /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'teams', element: <TeamList /> },
      { path: 'settings', element: <Settings /> }
    ]
  },
  {
    path: '/dashboard/team',
    element: (
      <ProtectedRoute requiredRole="MEMBER">
        <TeamDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <TeamOverview /> },
      { path: 'tasks', element: <TaskList /> },
      { path: 'tasks/:id', element: <TaskDetail /> },
      { path: 'timeline', element: <TimelineView /> }
    ]
  },
  {
    path: '/dashboard/pm',
    element: (
      <ProtectedRoute requiredRole="MANAGER">
        <PmDashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <PmOverview /> },
      { path: 'projects', element: <ProjectList /> },
      { path: 'projects/:id', element: <ProjectDetail /> },
      { path: 'reports', element: <Reports /> },
      { path: 'teams', element: <TeamList /> },
      { path: 'timeline', element: <TimelineView /> },
      { path: 'tasks', element: <TaskList /> },
      { path: 'tasks/:id', element: <TaskDetail /> },
      { path: 'settings', element: <Settings /> }
    ]
  },

  // ── App routes (with default sidebar + header) ──
  {
    element: <App />,
    children: [
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        )
      },
      {
        path: '/projects',
        element: (
          <ProtectedRoute>
            <ProjectList />
          </ProtectedRoute>
        )
      },
      {
        path: '/projects/:id',
        element: (
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        )
      },
      {
        path: '/tasks',
        element: (
          <ProtectedRoute>
            <TaskList />
          </ProtectedRoute>
        )
      },
      {
        path: '/tasks/:id',
        element: (
          <ProtectedRoute>
            <TaskDetail />
          </ProtectedRoute>
        )
      },
      {
        path: '/teams',
        element: (
          <ProtectedRoute>
            <TeamList />
          </ProtectedRoute>
        )
      },
      {
        path: '/teams/:id',
        element: (
          <ProtectedRoute>
            <TeamDetail />
          </ProtectedRoute>
        )
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        )
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
])

export default router
