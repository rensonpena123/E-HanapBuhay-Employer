import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout.jsx';
import Login from './pages/login/login.jsx';
import Signup from './pages/signup/signup.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import JobVacancy from './pages/jobVacancy/jobVacancy.jsx';
import ApplicationManagement from './pages/applicationManagement/applicationManagement.jsx';
import Reports from './pages/reports/report.jsx';
import Compliance from './pages/compliance/compliance.jsx';
import Profile from './pages/userProfile/user.jsx';

const EmployerGuard = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!raw || !token) {
        // Not logged in at all — redirect to login
        navigate('/', { replace: true });
        return;
      }

      const user = JSON.parse(raw);

      // If the stored user is not an employer, forcefully log them out
      if (user.role !== 'employer' || user.role_id !== 2) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/', { replace: true });
      }
    } catch {
      // Corrupted storage — clear and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes — wrapped in EmployerGuard + Layout */}
        <Route element={
          <EmployerGuard>
            <Layout />
          </EmployerGuard>
        }>
          <Route path="/dashboard"            element={<Dashboard />} />
          <Route path="/jobVacancy"           element={<JobVacancy />} />
          <Route path="/applicationManagement"element={<ApplicationManagement />} />
          <Route path="/reports"              element={<Reports />} />
          <Route path="/compliance"           element={<Compliance />} />
          <Route path="/users"                element={<Profile />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* react-hot-toast kept for lightweight inline feedback in non-critical places */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: '1rem',
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #fbc02d',
          },
        }}
      />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;