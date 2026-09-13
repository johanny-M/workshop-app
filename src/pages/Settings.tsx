import React, { useState } from 'react';
import { useStore, Currency } from '../store/useStore';
import { User, Bell, Palette, Globe, Shield, CreditCard } from 'lucide-react';
import './Settings.css';

const Settings: React.FC = () => {
  const { currency, setCurrency } = useStore();
  const [activeTab, setActiveTab] = useState('Workspace');

  const tabs = [
    { id: 'Profile', icon: User },
    { id: 'Workspace', icon: Globe },
    { id: 'Notifications', icon: Bell },
    { id: 'Appearance', icon: Palette },
    { id: 'Security', icon: Shield },
    { id: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-main">Settings</h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Manage your account and workspace preferences.</p>
        </div>
        <div className="page-view-toggles">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`page-view-toggle ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} /> {tab.id}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-content">
        {activeTab === 'Workspace' && (
          <div className="fade-in">
            <div className="settings-section mb-6">
              <div className="mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-main">Localization & Currency</h2>
                <p className="text-sm text-muted mt-1">Configure your region-specific formatting.</p>
              </div>
              
              <div className="form-group max-w-md">
                <label className="form-label">Default Currency</label>
                <p className="text-sm text-muted mb-3">This currency will be used across all reports and cost calculations.</p>
                <div className="relative">
                  <select 
                    className="form-select"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="ETB">ETB (Br) - Ethiopian Birr</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="settings-section mb-6">
              <div className="mb-6 border-b pb-4 flex justify-between items-end">
                <div>
                  <h2 className="text-xl font-bold text-main">User Roles</h2>
                  <p className="text-sm text-muted mt-1">Manage team members and permissions.</p>
                </div>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--text-main)', color: 'var(--bg-main)' }}>
                  Invite User
                </button>
              </div>
              
              <div className="role-list">
                <div className="role-item">
                  <div className="flex items-center gap-4">
                    <div className="avatar">A</div>
                    <div>
                      <p className="font-semibold text-main">Admin User</p>
                      <p className="text-sm text-muted">admin@workshop.os</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge" style={{ backgroundColor: 'var(--primary-transparent)', color: 'var(--primary)', padding: '0.35rem 0.75rem' }}>Administrator</span>
                  </div>
                </div>
                <div className="role-item">
                  <div className="flex items-center gap-4">
                    <div className="avatar bg-secondary">S</div>
                    <div>
                      <p className="font-semibold text-main">Staff Member</p>
                      <p className="text-sm text-muted">staff@workshop.os</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge" style={{ backgroundColor: 'var(--status-pending-transparent)', color: 'var(--status-pending)', padding: '0.35rem 0.75rem' }}>Staff</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab !== 'Workspace' && (
          <div className="fade-in settings-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: 'var(--text-muted)' }}>
            <Globe size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <h3 className="text-lg font-bold text-main">Coming Soon</h3>
            <p className="text-sm mt-2">The {activeTab} panel is currently under construction.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
