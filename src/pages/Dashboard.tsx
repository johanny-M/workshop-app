import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { AddLeadForm, NewClientForm, NewProjectForm, NewOrderForm } from '../components/dashboard/KioskForms';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  
  // Track which modal is currently open
  const [activeModal, setActiveModal] = useState<'lead' | 'client' | 'project' | 'order' | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div className="fade-in kiosk-dashboard">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Welcome Back, {user?.name?.split(' ')[0] || 'User'}</h1>
      </div>

      <div className="kiosk-grid fade-in">
        <button className="kiosk-btn" onClick={() => setActiveModal('lead')}>
          <span className="kiosk-btn-label">Add Lead</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.05s' }} onClick={() => setActiveModal('order')}>
          <span className="kiosk-btn-label">New Order</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.1s' }} onClick={() => navigate('/projects')}>
          <span className="kiosk-btn-label">Projects</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.15s' }} onClick={() => navigate('/clients')}>
          <span className="kiosk-btn-label">Clients</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.2s' }} onClick={() => navigate('/finance')}>
          <span className="kiosk-btn-label">Finances</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.25s' }} onClick={() => navigate('/supplies')}>
          <span className="kiosk-btn-label">Inventory</span>
        </button>
      </div>

      {/* Modals */}
      <AddLeadForm isOpen={activeModal === 'lead'} onClose={closeModal} />
      <NewClientForm isOpen={activeModal === 'client'} onClose={closeModal} />
      <NewProjectForm isOpen={activeModal === 'project'} onClose={closeModal} />
      <NewOrderForm isOpen={activeModal === 'order'} onClose={closeModal} />
    </div>
  );
};

export default Dashboard;
