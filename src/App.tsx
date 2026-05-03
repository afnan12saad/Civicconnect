/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/src/components/Layout';
import Dashboard from '@/src/pages/Dashboard';
import Queue from '@/src/pages/Queue';
import ReportForm from '@/src/pages/ReportForm';
import TicketDetail from '@/src/pages/TicketDetail';
import Profile from '@/src/pages/Profile';
import Auth from '@/src/pages/Auth';

import { LanguageProvider } from './LanguageContext';
import { NotificationProvider } from './NotificationContext';
import { ThemeProvider } from './ThemeContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem('civic_auth');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = () => {
    localStorage.setItem('civic_auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('civic_auth');
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) return null;

  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <BrowserRouter>
      <Routes>
        <Route 
          path="/auth" 
          element={!isAuthenticated ? <Auth onLogin={handleLogin} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout /> : <Navigate to="/auth" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="queue" element={<Queue />} />
          <Route path="queue/:id" element={<TicketDetail />} />
          <Route path="report" element={<ReportForm />} />
          <Route path="profile" element={<Profile onLogout={handleLogout} />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </NotificationProvider>
    </LanguageProvider>
    </ThemeProvider>
  );
}
