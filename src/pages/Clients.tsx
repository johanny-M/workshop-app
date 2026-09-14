import React, { useState } from 'react';
import { useStore, Client } from '../store/useStore';
import { Users, UserPlus, Plus, Building, Mail, Phone, ArrowUpRight, CheckCircle2, TrendingUp, TrendingDown, X, ArrowUp, ArrowDown, Contact, LineChart } from 'lucide-react';
import './Clients.css';

const Clients: React.FC = () => {
  const { clients, addClient } = useStore();
  const [view, setView] = useState<'kiosk' | 'directory'>('kiosk');
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

  const openAddClient = (status: 'Active' | 'Lead') => {
    setNewClientData({ ...newClientData, status });
    setIsModalOpen(true);
  };

  const renderKiosk = () => (
    <div className="fade-in kiosk-dashboard">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Clients</h1>
      </div>

      <div className="kiosk-grid fade-in">
        <button className="kiosk-btn" onClick={() => openAddClient('Active')} title="Add Client">
          <UserPlus />
          <span className="kiosk-btn-label">Add Client</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.05s' }} onClick={() => setView('directory')} title="Directory">
          <Contact />
          <span className="kiosk-btn-label">Directory</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.1s' }} onClick={() => alert('View Analytics coming soon!')} title="Analytics">
          <LineChart />
          <span className="kiosk-btn-label">Analytics</span>
        </button>
      </div>
    </div>
  );

  const renderDirectory = () => (
    <div className="fade-in" style={{ padding: '2rem' }}>
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setView('kiosk')} 
          style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
          className="hover-bg-surface-hover transition-colors"
        >
          <ArrowUpRight size={24} style={{ transform: 'rotate(225deg)' }} />
        </button>
        <h1 className="text-3xl font-bold text-main m-0">Client Directory</h1>
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

            <div className="client-footer" style={{ borderTop: 'none', paddingTop: '0.5rem', marginTop: 0 }}>
              <div>
                <div className="client-spent-label">Projects Ordered</div>
                <div className="client-spent-val" style={{ color: 'var(--text-main)', fontSize: '1.2rem' }}>{client.totalOrders || 0}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="client-spent-label">Lifetime Value</div>
                <div className="client-spent-val">${client.totalSpent.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {view === 'kiosk' && renderKiosk()}
      {view === 'directory' && renderDirectory()}

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
