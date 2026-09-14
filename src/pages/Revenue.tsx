import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase, Building, Code, TrendingUp, ArrowUp } from 'lucide-react';

const trendData = [
  { month: 'Jan', income: 4000 },
  { month: 'Feb', income: 4500 },
  { month: 'Mar', income: 5200 },
  { month: 'Apr', income: 4800 },
  { month: 'May', income: 6000 },
  { month: 'Jun', income: 7500 },
];

const sources = [
  { id: 1, name: 'Salary', icon: Briefcase, amount: '$8,500', percentage: '45%' },
  { id: 2, name: 'Business', icon: Building, amount: '$5,000', percentage: '30%' },
  { id: 3, name: 'Freelance', icon: Code, amount: '$5,000', percentage: '25%' },
];

const Revenue: React.FC = () => {
  return (
    <>
      {/* KPI Cards Row */}
      <div className="kpi-grid">
        <div className="dashboard-card kpi-card fade-in" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}>
          <div>
            <h3 className="kpi-title" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Income (YTD)</h3>
            <p className="kpi-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>+12.5% vs last year</p>
          </div>
          <div className="kpi-value">$18,500</div>
        </div>
        
        <div className="dashboard-card kpi-card fade-in" style={{ animationDelay: '0.05s' }}>
          <div>
            <h3 className="kpi-title text-muted">Avg. Monthly Income</h3>
            <p className="kpi-subtitle" style={{ color: 'var(--success)' }}>+5.2% vs last month</p>
          </div>
          <div className="kpi-value text-main">$5,333</div>
        </div>

        <div className="dashboard-card kpi-card fade-in" style={{ animationDelay: '0.1s' }}>
          <div>
            <h3 className="kpi-title text-muted">Top Source</h3>
            <p className="kpi-subtitle">45% of total income</p>
          </div>
          <div className="kpi-value text-main">Salary</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="pf-content-grid">
        {/* Income Trends Chart */}
        <div className="dashboard-card flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-main">Income Trends</h3>
          </div>
          <div className="chart-container flex-grow" style={{ minHeight: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color-light)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)', background: 'var(--bg-surface)' }} 
                />
                <Area type="monotone" dataKey="income" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sources List */}
        <div className="dashboard-card flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-main">Income Sources</h3>
          </div>
          <div className="sources-list space-y-4 w-full flex-grow">
            {sources.map(source => (
              <div key={source.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-hover transition-fast border border-transparent" style={{ borderBottom: '1px solid var(--border-color-light)', marginBottom: '0.5rem' }}>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-main text-md">{source.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-main">{source.amount}</p>
                  <p className="text-xs text-muted font-medium">{source.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Revenue;
