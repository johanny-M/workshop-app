import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Briefcase, Building, Code, TrendingUp } from 'lucide-react';
import './PersonalFinance.css';

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
    <div className="pf-container fade-in">
      <div className="pf-header">
        <div>
          <h1 className="text-2xl font-bold mb-1">Revenue Dashboard</h1>
          <p className="text-muted text-sm">Your personal income streams and trends over time.</p>
        </div>
      </div>

      <div className="pf-grid mb-8">
        <div className="pf-card col-span-1 flex flex-col justify-center">
          <h3 className="text-muted text-sm mb-2 font-medium">Total Income (YTD)</h3>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold pf-text-blue">$18,500</span>
            <span className="pf-badge pf-badge-green"><TrendingUp size={12} /> +12.5%</span>
          </div>
          <div className="sources-list space-y-4 w-full">
            {sources.map(source => (
              <div key={source.id} className="source-item">
                <div className="flex items-center gap-3">
                  <div className="pf-icon-circle bg-blue-100 text-blue-600">
                    <source.icon size={18} />
                  </div>
                  <span className="font-medium text-sm">{source.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold">{source.amount}</p>
                  <p className="text-xs text-muted">{source.percentage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pf-card col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Income Trends</h3>
          </div>
          <div className="chart-container flex-grow" style={{ minHeight: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{stroke: 'var(--border-color)', strokeWidth: 1, strokeDasharray: '3 3'}} 
                  contentStyle={{ borderRadius: 'var(--radius-lg)', border: 'none', boxShadow: 'var(--shadow-md)', background: 'var(--bg-surface)' }} 
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
