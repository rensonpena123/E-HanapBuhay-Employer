import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout.jsx';
import Login from './pages/login/login.jsx'; 
import Signup from './pages/signup/Signup.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import JobVacancy from './pages/jobVacancy/jobVacancy.jsx';
import ApplicationManagement from './pages/applicationManagement/applicationManagement.jsx';
import Reports from './pages/reports/report.jsx';
import Compliance from './pages/compliance/compliance.jsx';
import Profile from './pages/userProfile/user.jsx';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* Auth routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobVacancy" element={<JobVacancy />} />
          <Route path="/applicationManagement" element={<ApplicationManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/users" element={<Profile />} />
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;