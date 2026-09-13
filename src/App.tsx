import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Finances from './pages/Finances';
import Settings from './pages/Settings';
import Clients from './pages/Clients';
import Personal from './pages/Personal';
import Projects from './pages/Projects';
import Landing from './pages/Landing';
import PurchaseRequests from './pages/PurchaseRequests';

import Login from './pages/Login';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { isAuthenticated } = useStore();

  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="supplies/*" element={<Inventory />} />
          <Route path="clients" element={<Clients />} />
          <Route path="requests" element={<PurchaseRequests />} />
          <Route path="finance" element={<Finances />} />
          <Route path="settings" element={<Settings />} />
          <Route path="personal" element={<Personal />} />
          <Route path="personal/revenue" element={<Navigate to="/personal" replace />} />
          <Route path="personal/saving" element={<Navigate to="/personal" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
