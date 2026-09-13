import React, { useState } from 'react';
import { useStore, Client } from '../store/useStore';
import { Users, UserPlus, Plus, Building, Mail, Phone, ArrowUpRight, CheckCircle2, TrendingUp, TrendingDown, X, ArrowUp, ArrowDown } from 'lucide-react';
import './Clients.css';

const Clients: React.FC = () => {
  const { clients, addClient } = useStore();
  const [filter, setFilter] = useState<'All' | 'Active' | 'Lead'>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClientData, setNewClientData] = useState<Partial<Client>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active',
    totalSpent: 0
  });

  const handleSaveClient = () => {
    if (!newClientData.name) return;
    
    addClient({
      ...newClientData,
      id: `CLI-${Math.floor(Math.random() * 10000)}`,
    } as Client);
    
    setIsModalOpen(false);
    setNewClientData({
      name: '', email: '', phone: '', company: '', status: 'Active', totalSpent: 0
    });
  };

  const activeClientsCount = clients.filter(c => c.status === 'Active').length;
  const leadClientsCount = clients.filter(c => c.status === 'Lead').length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);

  const displayedClients = clients.filter(c => filter === 'All' ? true : c.status === filter);

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-main">Client Network</h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Manage your relationships, leads, and client revenue</p>
        </div>
      </div>

      <div className="global-kpi-grid">
        <div className="dashboard-card kpi-card secondary-task-card relative overflow-hidden">
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title text-muted">Total Clients</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value text-main" style={{ marginBottom: 0 }}>{activeClientsCount}</div>
            </div>
            <div className="flex items-center gap-3 z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
              <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'var(--success-transparent)', color: 'var(--success)' }}>
                <ArrowUp size={20} strokeWidth={3} />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--success)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                +12%
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-muted" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                this year
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-card kpi-card secondary-task-card relative overflow-hidden">
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title text-muted">New Leads</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value text-main" style={{ marginBottom: 0 }}>{leadClientsCount}</div>
            </div>
            <div className="flex items-center gap-3 z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
              <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'var(--danger-transparent)', color: 'var(--danger)' }}>
                <ArrowDown size={20} strokeWidth={3} />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--danger)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                -2%
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-muted" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                this month
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-card kpi-card primary-task-card relative overflow-hidden" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}>
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Client Revenue</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value" style={{ marginBottom: 0 }}>${totalRevenue.toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-3 text-white z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
              <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <ArrowUp size={20} strokeWidth={3} />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
                +8%
              </div>
              <span className="flex items-center gap-1 text-sm font-medium opacity-70" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                this month
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-view-toggles mb-6">
        <span className="text-base font-semibold text-muted mr-auto">Filter By Status:</span>
        <div className="flex items-center gap-6">
          {['All', 'Active', 'Lead'].map((status) => (
            <button 
              key={status} 
              className={`view-toggle-btn ${filter === status ? 'active' : ''}`}
              style={{ fontSize: '1.1rem' }}
              onClick={() => setFilter(status as any)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="clients-grid">
        {displayedClients.map(client => (
          <div key={client.id} className="dashboard-card client-card fade-in">
            <div className="client-card-header">
              <div>
                <h3 className="client-name">{client.name}</h3>
                {client.company && (
                  <div className="client-company flex items-center gap-1">
                    <Building size={12} /> {client.company}
                  </div>
                )}
              </div>
              <div className={`client-status ${client.status.toLowerCase()}`}>
                {client.status}
              </div>
            </div>

            <div className="client-contact">
              <div className="contact-row">
                <Mail size={14} className="contact-icon" /> {client.email}
              </div>
              <div className="contact-row">
                <Phone size={14} className="contact-icon" /> {client.phone}
              </div>
            </div>

            <div className="client-footer">
              <div>
                <div className="client-spent-label">Lifetime Value</div>
                <div className="client-spent-val">${client.totalSpent.toLocaleString()}</div>
              </div>
              <button className="btn-icon" style={{ background: 'var(--bg-surface-hover)', borderRadius: '50%', padding: '0.5rem' }}>
                <ArrowUpRight size={18} className="text-muted" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        className="fab-btn" 
        title="New Client"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus size={24} />
      </button>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="dashboard-card modal-content max-w-2xl p-6" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Add New Client</h2>
              <button onClick={() => setIsModalOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div style={{ gridColumn: 'span 2' }}>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  value={newClientData.name}
                  onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                  className="w-full form-input"
                  placeholder="e.g. Jane Doe"
                  autoFocus
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Email</label>
                <input
                  type="email"
                  value={newClientData.email}
                  onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                  className="w-full form-input"
                  placeholder="jane@example.com"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Phone</label>
                <input
                  type="text"
                  value={newClientData.phone}
                  onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                  className="w-full form-input"
                  placeholder="(555) 000-0000"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Company (Optional)</label>
                <input
                  type="text"
                  value={newClientData.company}
                  onChange={(e) => setNewClientData({ ...newClientData, company: e.target.value })}
                  className="w-full form-input"
                  placeholder="Acme Corp"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Status</label>
                <select
                  value={newClientData.status}
                  onChange={(e) => setNewClientData({ ...newClientData, status: e.target.value as any })}
                  className="w-full form-input"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                >
                  <option value="Active">Active</option>
                  <option value="Lead">Lead</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--text-muted)' }}
                className="hover-text-main"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveClient}
                disabled={!newClientData.name?.trim()}
                style={{ 
                  padding: '0.5rem 1.5rem', 
                  borderRadius: 'var(--radius-md)', 
                  fontWeight: 600, 
                  backgroundColor: newClientData.name?.trim() ? 'var(--text-main)' : 'var(--bg-surface-hover)', 
                  color: newClientData.name?.trim() ? 'var(--bg-main)' : 'var(--text-muted)',
                  cursor: newClientData.name?.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
