import React, { useState } from 'react';
import { Search, ChevronDown, ArrowUpRight, ArrowDownRight, Building, Package, Wrench, DollarSign, ArrowRight, LayoutGrid, List, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', netProfit: 2500, expenses: 3500 },
  { name: 'Feb', netProfit: 3000, expenses: 3700 },
  { name: 'Mar', netProfit: 2800, expenses: 3600 },
  { name: 'Apr', netProfit: 3200, expenses: 3850 },
  { name: 'May', netProfit: 3500, expenses: 4000 },
  { name: 'June', netProfit: 3400, expenses: 3900 },
  { name: 'July', netProfit: 3800, expenses: 4200 },
  { name: 'Aug', netProfit: 3900, expenses: 4300 },
  { name: 'Sep', netProfit: 4100, expenses: 4400 },
  { name: 'Oct', netProfit: 4300, expenses: 4550 },
  { name: 'Nov', netProfit: 4500, expenses: 4700 },
  { name: 'Dec', netProfit: 4800, expenses: 4900 },
];

const transactions = [
  { id: 1, date: 'May 8', avatar: 'https://i.pravatar.cc/150?u=a08', recipient: 'Alex Harper', reference: 'ORD-1024', category: 'Income', amount: '+$2,000.00', positive: true },
  { id: 2, date: 'May 5', avatar: 'https://i.pravatar.cc/150?u=a09', recipient: 'Marcus Johnson', reference: 'PAY-9842-9374', category: 'Payout', amount: '-$4,200.00', positive: false },
  { id: 3, date: 'May 1', avatar: '', recipient: 'Oakwood Lumber Co.', reference: 'INV-4410-2984-0965', category: 'Expense', amount: '-$1,120.00', positive: false, icon: Package },
];

const Finances: React.FC = () => {
  const [view, setView] = useState<'overview' | 'transactions'>('overview');

  const renderOverview = () => (
    <>
      <div className="flex justify-end mb-4">
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
          Last Year <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* KPI Row */}
        <div className="global-kpi-grid">
            
            <div className="dashboard-card kpi-card secondary-task-card relative overflow-hidden">
              <div className="task-card-header mb-2 relative z-10">
                <span className="task-card-title text-muted">Total Revenue</span>
              </div>
              <div className="flex justify-end items-end relative h-24">
                <div className="tucked-value-wrapper">
                  <div className="task-card-value tucked-value text-main" style={{ marginBottom: 0 }}>$99.7k</div>
                </div>
                <div className="flex items-center gap-3 z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
                  <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'var(--success-transparent)', color: 'var(--success)' }}>
                    <ArrowUp size={20} strokeWidth={3} />
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--success)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    +2.0%
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-muted" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                    vs last month
                  </span>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card kpi-card secondary-task-card relative overflow-hidden">
              <div className="task-card-header mb-2 relative z-10">
                <span className="task-card-title text-muted">Total Expenses</span>
              </div>
              <div className="flex justify-end items-end relative h-24">
                <div className="tucked-value-wrapper">
                  <div className="task-card-value tucked-value text-main" style={{ marginBottom: 0 }}>$32.5k</div>
                </div>
                <div className="flex items-center gap-3 z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
                  <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'var(--danger-transparent)', color: 'var(--danger)' }}>
                    <ArrowDown size={20} strokeWidth={3} />
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--danger)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    -4.3%
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-muted" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                    vs last month
                  </span>
                </div>
              </div>
            </div>
            
            <div className="dashboard-card kpi-card primary-task-card relative overflow-hidden" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}>
              <div className="task-card-header mb-2 relative z-10">
                <span className="task-card-title" style={{ color: 'rgba(255,255,255,0.8)' }}>Net Margin</span>
              </div>
              <div className="flex justify-end items-end relative h-24">
                <div className="tucked-value-wrapper">
                  <div className="task-card-value tucked-value" style={{ marginBottom: 0 }}>$67.2k</div>
                </div>
                <div className="flex items-center gap-3 text-white z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
                  <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <ArrowUp size={20} strokeWidth={3} />
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
                    +5.2%
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium opacity-70" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                    vs last month
                  </span>
                </div>
              </div>
            </div>
            
        </div>

        {/* Area Chart Full Width */}
          <div className="dashboard-card project-overview-card flex-1 flex flex-col" style={{ padding: '2rem' }}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-main">Revenue vs Expenses</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium"><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--primary)' }}></div> Profit</div>
                <div className="flex items-center gap-2 text-sm font-medium"><div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--text-muted)' }}></div> Expenses</div>
              </div>
            </div>
            <div style={{ width: '100%', flex: 1, height: '400px' }}>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--text-muted)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--text-muted)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color-light)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', background: 'var(--bg-surface)' }} 
                  />
                  <Area type="monotone" dataKey="netProfit" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                  <Area type="monotone" dataKey="expenses" stroke="var(--text-muted)" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      {/* Expense Breakdown Section */}
      <div className="dashboard-grid" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div>
          <h2 className="text-3xl font-bold text-main mb-8">Expense Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="dashboard-card flex flex-col" style={{ padding: '2rem', background: 'var(--bg-surface)' }}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 font-semibold text-main">
                  <Wrench size={18} className="text-muted" /> Crafter Payouts
                </div>
                <span className="font-bold text-lg text-main">$23,400</span>
              </div>
              <p className="text-sm text-muted mb-8">Contractor services • 72%</p>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden', marginTop: 'auto' }}>
                <div style={{ width: '72%', height: '100%', background: 'var(--primary)', borderRadius: '99px' }}></div>
              </div>
            </div>

            <div className="dashboard-card flex flex-col" style={{ padding: '2rem', background: 'var(--bg-surface)' }}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3 font-semibold text-main text-lg">
                  <Building size={24} className="text-muted" /> Overhead
                </div>
                <span className="font-bold text-2xl text-main">$9,100</span>
              </div>
              <p className="text-sm text-muted mb-8">Rent, utilities, maintenance • 28%</p>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden', marginTop: 'auto' }}>
                <div style={{ width: '28%', height: '100%', background: 'var(--text-muted)', borderRadius: '99px' }}></div>
              </div>
            </div>
            
            <div className="dashboard-card flex flex-col" style={{ padding: '2rem', background: 'var(--bg-surface)' }}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3 font-semibold text-main text-lg">
                  <Package size={24} className="text-muted" /> Materials
                </div>
                <span className="font-bold text-2xl text-main">$3,200</span>
              </div>
              <p className="text-sm text-muted mb-8">Wood, steel, glue • 10%</p>
              <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden', marginTop: 'auto' }}>
                <div style={{ width: '10%', height: '100%', background: 'var(--text-main)', borderRadius: '99px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderTransactions = () => (
    <div className="dashboard-card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className="font-bold text-lg text-main">All Transactions</h3>
        <div className="header-search" style={{ margin: 0, border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
          <Search size={16} className="text-muted" />
          <input type="text" placeholder="Search transactions..." className="search-input" style={{ background: 'transparent' }} />
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Recipient</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Reference</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Category</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover-bg-surface-hover">
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                  {txn.date}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div className="flex items-center gap-3">
                    {txn.avatar ? (
                      <img src={txn.avatar} alt={txn.recipient} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        {txn.icon && <txn.icon size={16} />}
                      </div>
                    )}
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{txn.recipient}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  {txn.reference}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{ 
                    padding: '0.35rem 0.85rem', 
                    borderRadius: '9999px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    backgroundColor: txn.category === 'Income' ? 'var(--success-transparent)' : txn.category === 'Payout' ? 'var(--status-pending-transparent)' : 'var(--danger-transparent)',
                    color: txn.category === 'Income' ? 'var(--success)' : txn.category === 'Payout' ? 'var(--text-muted)' : 'var(--danger)'
                  }}>
                    {txn.category}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 700, color: txn.positive ? 'var(--success)' : 'var(--text-main)' }}>
                  {txn.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      <div className="page-container fade-in flex flex-col gap-6">
        
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 className="text-2xl font-bold mb-2 text-main">Financial Overview</h1>
            <p className="text-muted text-sm">Track revenue, material expenses, and payments to crafters</p>
          </div>
          
          <div className="page-view-toggles">
            <button 
              className={`page-view-toggle ${view === 'overview' ? 'active' : ''}`}
              onClick={() => setView('overview')}
            >
              <LayoutGrid size={16} />
              Overview
            </button>
            <button 
              className={`page-view-toggle ${view === 'transactions' ? 'active' : ''}`}
              onClick={() => setView('transactions')}
            >
              <List size={16} />
              Transactions
            </button>
          </div>
        </div>

        {view === 'overview' ? renderOverview() : renderTransactions()}

      </div>
    </>
  );
};

export default Finances;
