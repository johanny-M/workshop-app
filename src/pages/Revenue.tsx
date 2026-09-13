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
      <div className="global-kpi-grid">
        <div className="dashboard-card kpi-card primary-task-card relative overflow-hidden" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}>
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Income (YTD)</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value" style={{ marginBottom: 0 }}>$18,500</div>
            </div>
            <div className="flex items-center gap-3 text-white z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
              <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <ArrowUp size={20} strokeWidth={3} />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
                +12.5%
              </div>
              <span className="flex items-center gap-1 text-sm font-medium opacity-70" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                vs last year
              </span>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card kpi-card secondary-task-card relative overflow-hidden">
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title text-muted">Avg. Monthly Income</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value text-main" style={{ marginBottom: 0 }}>$5,333</div>
            </div>
            <div className="flex items-center gap-3 z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
              <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'var(--success-transparent)', color: 'var(--success)' }}>
                <ArrowUp size={20} strokeWidth={3} />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--success)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                +5.2%
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-muted" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                vs last month
              </span>
            </div>
          </div>
        </div>

        <div className="dashboard-card kpi-card secondary-task-card relative overflow-hidden">
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title text-muted">Top Source</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value text-main" style={{ marginBottom: 0, fontSize: '4rem' }}>Salary</div>
            </div>
            <div className="flex flex-col items-end z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
              <span className="text-sm text-muted font-medium">45% of total</span>
            </div>
          </div>
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
