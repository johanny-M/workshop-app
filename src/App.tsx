import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import Finances from './pages/Finances';
import Settings from './pages/Settings';
import Clients from './pages/Clients';
import Revenue from './pages/Revenue';
import Saving from './pages/Saving';

import Login from './pages/Login';
import { useStore } from './store/useStore';

const App: React.FC = () => {
  const { isAuthenticated } = useStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="production" element={<Orders />} />
          <Route path="supplies/*" element={<Inventory />} />
          <Route path="crafters" element={<div className="fade-in p-6"><h1 className="text-2xl font-bold">Crafters Network</h1></div>} />
          <Route path="clients" element={<Clients />} />
          <Route path="finance" element={<Finances />} />
          <Route path="settings" element={<Settings />} />
          <Route path="personal/revenue" element={<Revenue />} />
          <Route path="personal/saving" element={<Saving />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
