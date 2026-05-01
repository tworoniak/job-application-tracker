import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { ProtectedRoute } from '@/features/auth/ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ApplicationsPage } from '@/features/applications/pages/ApplicationsPage'
import { ApplicationFormPage } from '@/features/applications/pages/ApplicationFormPage'
import { ApplicationDetailPage } from '@/features/applications/pages/ApplicationDetailPage'

export const AppRouter = () => (
  <Routes>
    <Route path="login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/new" element={<ApplicationFormPage />} />
        <Route path="applications/:id" element={<ApplicationDetailPage />} />
        <Route path="applications/:id/edit" element={<ApplicationFormPage />} />
      </Route>
    </Route>
  </Routes>
)
