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
        <div className="flex items-center gap-3">
          {['All', 'Active', 'Lead'].map((status) => (
            <button 
              key={status} 
              className={`view-toggle-btn ${filter === status ? 'active' : ''}`}
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
          <div className="modal-content scale-in" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Client</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSaveClient(); }}>
                <div className="form-group">
                  <label>Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input
                    type="text"
                    value={newClientData.name}
                    onChange={(e) => setNewClientData({ ...newClientData, name: e.target.value })}
                    placeholder="e.g. Jane Doe"
                    autoFocus
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={newClientData.email}
                      onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={newClientData.phone}
                      onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Company (Optional)</label>
                    <input
                      type="text"
                      value={newClientData.company}
                      onChange={(e) => setNewClientData({ ...newClientData, company: e.target.value })}
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={newClientData.status}
                      onChange={(e) => setNewClientData({ ...newClientData, status: e.target.value as any })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-submit" disabled={!newClientData.name?.trim()}>Add Client</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
