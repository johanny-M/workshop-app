import React, { useState } from 'react';
import Revenue from './Revenue';
import Saving from './Saving';
import { Plus, BarChart3, ShieldCheck, X } from 'lucide-react';
import './PersonalFinance.css';

const Personal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'saving'>('revenue');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoalData, setNewGoalData] = useState({ name: '', target: '', current: '0' });

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-main">Personal Finance</h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Manage your revenue streams and savings goals</p>
        </div>
        <div className="page-view-toggles">
          <button 
            className={`page-view-toggle ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            <BarChart3 size={16} />
            Revenue
          </button>
          <button 
            className={`page-view-toggle ${activeTab === 'saving' ? 'active' : ''}`}
            onClick={() => setActiveTab('saving')}
          >
            <ShieldCheck size={16} />
            Savings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-2">
        {activeTab === 'revenue' ? <Revenue /> : <Saving />}
      </div>

      {/* Floating Action Button */}
      {activeTab === 'saving' && (
        <button 
          className="fab-btn" 
          title="New Goal"
          onClick={() => setIsGoalModalOpen(true)}
        >
          <Plus size={24} />
        </button>
      )}

      {/* New Goal Modal */}
      {isGoalModalOpen && (
        <div className="modal-overlay" onClick={() => setIsGoalModalOpen(false)}>
          <div className="dashboard-card modal-content max-w-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Goal</h2>
              <button onClick={() => setIsGoalModalOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid gap-4 mb-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Goal Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  value={newGoalData.name}
                  onChange={(e) => setNewGoalData({ ...newGoalData, name: e.target.value })}
                  className="w-full form-input"
                  placeholder="e.g. New Car Fund"
                  autoFocus
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Target Amount ($) <span className="text-danger">*</span></label>
                <input
                  type="number"
                  value={newGoalData.target}
                  onChange={(e) => setNewGoalData({ ...newGoalData, target: e.target.value })}
                  className="w-full form-input"
                  placeholder="10000"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Initial Deposit ($)</label>
                <input
                  type="number"
                  value={newGoalData.current}
                  onChange={(e) => setNewGoalData({ ...newGoalData, current: e.target.value })}
                  className="w-full form-input"
                  placeholder="0"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsGoalModalOpen(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--text-muted)' }}
                className="hover-text-main"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert('New Goal Created (Mockup)');
                  setIsGoalModalOpen(false);
                  setNewGoalData({ name: '', target: '', current: '0' });
                }}
                disabled={!newGoalData.name.trim() || !newGoalData.target}
                style={{ 
                  padding: '0.5rem 1.5rem', 
                  borderRadius: 'var(--radius-md)', 
                  fontWeight: 600, 
                  backgroundColor: (newGoalData.name.trim() && newGoalData.target) ? 'var(--text-main)' : 'var(--bg-surface-hover)', 
                  color: (newGoalData.name.trim() && newGoalData.target) ? 'var(--bg-main)' : 'var(--text-muted)',
                  cursor: (newGoalData.name.trim() && newGoalData.target) ? 'pointer' : 'not-allowed'
                }}
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Personal;
