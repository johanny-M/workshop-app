import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ShoppingCart, FolderKanban, Users, DollarSign, Package } from 'lucide-react';
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
        <button className="kiosk-btn" onClick={() => setActiveModal('lead')} title="Add Lead">
          <UserPlus />
          <span className="kiosk-btn-label">Add Lead</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.05s' }} onClick={() => setActiveModal('order')} title="Add Order">
          <ShoppingCart />
          <span className="kiosk-btn-label">Add Order</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.1s' }} onClick={() => navigate('/projects')} title="Projects">
          <FolderKanban />
          <span className="kiosk-btn-label">Projects</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.15s' }} onClick={() => navigate('/clients')} title="Clients">
          <Users />
          <span className="kiosk-btn-label">Clients</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.2s' }} onClick={() => navigate('/finance')} title="Finances">
          <DollarSign />
          <span className="kiosk-btn-label">Finances</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.25s' }} onClick={() => navigate('/supplies')} title="Inventory">
          <Package />
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
