import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Search, Calendar, ArrowLeft } from 'lucide-react';
import './Inventory.css';

const PurchaseRequests: React.FC = () => {
  const navigate = useNavigate();
  const { purchaseRequests } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRequests = purchaseRequests.filter(pr => 
    pr.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', height: '100%' }}>
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => navigate(-1)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)', padding: 0 }}
              className="hover-text-muted"
              title="Go Back"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-main" style={{ margin: 0 }}>Purchase Requests History</h1>
          </div>
          <p className="text-muted text-sm">Detailed view of all requested supplies and orders</p>
        </div>
      </div>

      <div className="dashboard-card mb-6" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <div className="header-search" style={{ margin: 0, flex: 1, maxWidth: '400px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search by vendor or ID..." 
              className="search-input" 
              style={{ background: 'transparent' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>ID / Date</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Vendor</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Items Summary</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Cost</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((pr) => (
                <tr key={pr.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover-bg-surface-hover">
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{pr.id}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {pr.date}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{pr.vendorName}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {pr.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      ${pr.totalCost.toLocaleString()}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.35rem 0.85rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      backgroundColor: pr.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : pr.status === 'Ordered' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: pr.status === 'Pending' ? '#d97706' : pr.status === 'Ordered' ? '#2563eb' : '#059669'
                    }}>
                      {pr.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No purchase requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchaseRequests;
