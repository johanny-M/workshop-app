import React from 'react';
import { useStore, Currency } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, Bell, Palette, Globe, Shield } from 'lucide-react';
import './Settings.css';

const Settings: React.FC = () => {
  const { currency, setCurrency } = useStore();

  return (
    <div className="settings-container fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted">Manage your account and workspace preferences.</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            <button className="settings-tab active"><User size={18}/> Profile</button>
            <button className="settings-tab"><Globe size={18}/> Workspace & Localization</button>
            <button className="settings-tab"><Bell size={18}/> Notifications</button>
            <button className="settings-tab"><Palette size={18}/> Appearance</button>
            <button className="settings-tab"><Shield size={18}/> Security & Roles</button>
          </nav>
        </div>

        <div className="settings-content">
          <Card className="settings-section mb-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-4">Localization & Currency</h2>
            
            <div className="form-group max-w-md">
              <label className="form-label">Default Currency</label>
              <p className="text-sm text-muted mb-2">This currency will be used across all reports and cost calculations.</p>
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
          </Card>

          <Card className="settings-section mb-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-4">User Roles</h2>
            <div className="role-list">
              <div className="role-item">
                <div className="flex items-center gap-4">
                  <div className="avatar">A</div>
                  <div>
                    <p className="font-semibold">Admin User</p>
                    <p className="text-sm text-muted">admin@workshop.os</p>
                  </div>
                </div>
                <span className="badge progress">Administrator</span>
              </div>
              <div className="role-item">
                <div className="flex items-center gap-4">
                  <div className="avatar bg-secondary">S</div>
                  <div>
                    <p className="font-semibold">Staff Member</p>
                    <p className="text-sm text-muted">staff@workshop.os</p>
                  </div>
                </div>
                <span className="badge pending">Staff</span>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="secondary">Invite User</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
