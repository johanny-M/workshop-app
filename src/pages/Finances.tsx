import React, { useState } from 'react';
import { Search, ChevronDown, Package, ArrowLeft, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, List, PieChart } from 'lucide-react';
import { AddExpenseForm, AddIncomeForm } from '../components/finance/FinanceForms';
import '../pages/Dashboard.css';

const transactions = [
  { id: 1, date: '2026-05-08', avatar: 'https://i.pravatar.cc/150?u=a08', recipient: 'Alex Harper', reference: 'ORD-1024', category: 'Income', amount: '+$2,000.00', positive: true },
  { id: 2, date: '2026-05-05', avatar: 'https://i.pravatar.cc/150?u=a09', recipient: 'Marcus Johnson', reference: 'PAY-9842-9374', category: 'Payout', amount: '-$4,200.00', positive: false },
  { id: 3, date: '2026-05-01', avatar: '', recipient: 'Oakwood Lumber Co.', reference: 'INV-4410-2984-0965', category: 'Expense', amount: '-$1,120.00', positive: false, icon: Package },
];

const Finances: React.FC = () => {
  const [view, setView] = useState<'kiosk' | 'transactions'>('kiosk');
  const [activeModal, setActiveModal] = useState<'expense' | 'income' | null>(null);

  const closeModal = () => setActiveModal(null);

  const renderKiosk = () => (
    <div className="fade-in kiosk-dashboard">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Financial Overview</h1>
      </div>

      <div className="kiosk-grid fade-in">
        <button className="kiosk-btn" onClick={() => setActiveModal('expense')} title="Add Expense">
          <TrendingDown color="var(--danger)" />
          <span className="kiosk-btn-label">Add Expense</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.05s' }} onClick={() => setActiveModal('income')} title="Add Income">
          <TrendingUp color="var(--success)" />
          <span className="kiosk-btn-label">Add Income</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.1s' }} onClick={() => setView('transactions')} title="Transactions">
          <List />
          <span className="kiosk-btn-label">Transactions</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.15s' }} onClick={() => alert('Reports page coming soon!')} title="Reports">
          <PieChart />
          <span className="kiosk-btn-label">Reports</span>
        </button>
      </div>

      <AddExpenseForm isOpen={activeModal === 'expense'} onClose={closeModal} />
      <AddIncomeForm isOpen={activeModal === 'income'} onClose={closeModal} />
    </div>
  );

  const renderTransactions = () => (
    <div className="fade-in" style={{ padding: '2rem' }}>
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setView('kiosk')} 
          style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
          className="hover-bg-surface-hover transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-main m-0">All Transactions</h1>
      </div>

      <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="header-search" style={{ margin: 0, border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
            <Search size={16} className="text-muted" />
            <input type="text" placeholder="Search transactions..." className="search-input" style={{ background: 'transparent', fontSize: '1.1rem', padding: '0.75rem' }} />
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1.1rem' }}>
            Filter <ChevronDown size={16} />
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Recipient</th>
                <th style={{ padding: '1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Reference</th>
                <th style={{ padding: '1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Category</th>
                <th style={{ padding: '1.5rem', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover-bg-surface-hover">
                  <td style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>
                    {txn.date}
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <div className="flex items-center gap-4">
                      {txn.avatar ? (
                        <img src={txn.avatar} alt={txn.recipient} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                          {txn.icon && <txn.icon size={24} />}
                        </div>
                      )}
                      <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '1.1rem' }}>{txn.recipient}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    {txn.reference}
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <span style={{ 
                      padding: '0.5rem 1rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      backgroundColor: txn.category === 'Income' ? 'var(--success-transparent)' : txn.category === 'Payout' ? 'var(--status-pending-transparent)' : 'var(--danger-transparent)',
                      color: txn.category === 'Income' ? 'var(--success)' : txn.category === 'Payout' ? 'var(--text-muted)' : 'var(--danger)'
                    }}>
                      {txn.category}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right', fontWeight: 700, fontSize: '1.2rem', color: txn.positive ? 'var(--success)' : 'var(--text-main)' }}>
                    {txn.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Showing 1-3 of 3 transactions</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-md transition-colors opacity-30 cursor-not-allowed text-muted border border-[var(--border-color)]" disabled>
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 rounded-md hover-bg-surface-hover text-muted transition-colors border border-[var(--border-color)]">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {view === 'kiosk' ? renderKiosk() : renderTransactions()}
    </div>
  );
};

export default Finances;
