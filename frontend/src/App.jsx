import { Routes, Route, Navigate } from 'react-router-dom'

// ── Providers / Context ─────────────────────────────────────────────────────
import { AuthProvider }  from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { NotifProvider } from './context/NotifContext'

// ── Route Guards ────────────────────────────────────────────────────────────
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminRoute     from './components/layout/AdminRoute'

// ── Auth Pages ──────────────────────────────────────────────────────────────
import Login    from './pages/auth/Login'
import Register from './pages/auth/Register'

// ── User Pages ──────────────────────────────────────────────────────────────
import UserLayout    from './components/layout/UserLayout'
import Home          from './pages/user/Home'
import Help          from './pages/user/Help'
import About         from './pages/user/About'
import Account       from './pages/user/Account'
import ServiceDetail from './pages/user/ServiceDetail'
import OrderForm     from './pages/user/OrderForm'
import OrderHistory  from './pages/user/OrderHistory'

// ── Admin Pages ─────────────────────────────────────────────────────────────
import AdminLayout        from './components/layout/AdminLayout'
import AdminDashboard     from './pages/admin/AdminDashboard'
import AdminOrders        from './pages/admin/AdminOrders'
import AdminServices      from './pages/admin/AdminServices'
import AdminUsers         from './pages/admin/AdminUsers'
import AdminSettings      from './pages/admin/AdminSettings'
import AdminCertificates  from './pages/admin/AdminCertificates'
import AdminNotifications from './pages/admin/AdminNotifications'

// ────────────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotifProvider>
          <Routes>

            {/* ── Auth ─────────────────────────────────────── */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ── User App (protected) ─────────────────────── */}
            <Route element={<ProtectedRoute />}>
              <Route element={<UserLayout />}>
                <Route index               element={<Home />} />
                <Route path="help"         element={<Help />} />
                <Route path="about"        element={<About />} />
                <Route path="account"      element={<Account />} />
                <Route path="service/:id"  element={<ServiceDetail />} />
                <Route path="order/:id"    element={<OrderForm />} />
                <Route path="orders"       element={<OrderHistory />} />
              </Route>
            </Route>

            {/* ── Admin Panel (admin only) ──────────────────── */}
            <Route path="admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index                        element={<AdminDashboard />} />
                <Route path="orders"                element={<AdminOrders />} />
                <Route path="services"              element={<AdminServices />} />
                <Route path="users"                 element={<AdminUsers />} />
                <Route path="settings"              element={<AdminSettings />} />
                <Route path="certificates"          element={<AdminCertificates />} />
                <Route path="notifications"         element={<AdminNotifications />} />
              </Route>
            </Route>

            {/* ── Fallback ──────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </NotifProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
