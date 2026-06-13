import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import PageSkeleton from './components/layout/PageSkeleton';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SessionView = lazy(() => import('./pages/SessionView'));
const JoinFlow = lazy(() => import('./pages/JoinFlow'));
const SessionEnded = lazy(() => import('./pages/SessionEnded'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminSessionDetail = lazy(() => import('./pages/AdminSessionDetail'));

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token') || localStorage.getItem('socketToken');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<JoinFlow />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Route>

        <Route
          path="/session/:id"
          element={
            <ProtectedRoute>
              <SessionView />
            </ProtectedRoute>
          }
        />
        <Route path="/session/:id/ended" element={<SessionEnded />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AppShell>
                <AdminDashboard />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/sessions/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <AppShell>
                <AdminSessionDetail />
              </AppShell>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
