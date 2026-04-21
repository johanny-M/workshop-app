import React from 'react';
import { Search, ChevronDown, ArrowUpRight, ArrowDownRight, Building, Package, Wrench, DollarSign, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Finances.css';

const chartData = [
  { name: 'Jan', netProfit: 2500, crafters: 1500, materials: 800, overhead: 1200 },
  { name: 'Feb', netProfit: 3000, crafters: 1600, materials: 900, overhead: 1200 },
  { name: 'Mar', netProfit: 2800, crafters: 1550, materials: 850, overhead: 1200 },
  { name: 'Apr', netProfit: 3200, crafters: 1700, materials: 950, overhead: 1200 },
  { name: 'May', netProfit: 3500, crafters: 1800, materials: 1000, overhead: 1200 },
  { name: 'June', netProfit: 3400, crafters: 1750, materials: 950, overhead: 1200 },
  { name: 'July', netProfit: 3800, crafters: 1900, materials: 1100, overhead: 1200 },
  { name: 'Aug', netProfit: 3900, crafters: 1950, materials: 1150, overhead: 1200 },
  { name: 'Sep', netProfit: 4100, crafters: 2000, materials: 1200, overhead: 1200 },
  { name: 'Oct', netProfit: 4300, crafters: 2100, materials: 1250, overhead: 1200 },
  { name: 'Nov', netProfit: 4500, crafters: 2200, materials: 1300, overhead: 1200 },
  { name: 'Dec', netProfit: 4800, crafters: 2300, materials: 1400, overhead: 1200 },
];

const transactions = [
  { id: 1, date: 'May 8', avatar: 'https://i.pravatar.cc/150?u=a08', recipient: 'Alex Harper', reference: 'ORD-1024', category: 'Order', amount: '+$2,000.00', positive: true },
  { id: 2, date: 'May 5', avatar: 'https://i.pravatar.cc/150?u=a09', recipient: 'Marcus Johnson', reference: 'PAY-9842-9374', category: 'Crafter Payout', amount: '-$4,200.00', positive: false },
  { id: 3, date: 'May 1', avatar: '', recipient: 'Oakwood Lumber Co.', reference: 'INV-4410-2984-0965', category: 'Overhead', amount: '-$1,120.00', positive: false, icon: Package },
];

const Finances: React.FC = () => {
  return (
    <div className="finances-container fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Financial Overview</h1>
          <p className="text-muted text-sm">Track revenue, material expenses, and payments to crafters</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="search-wrapper">
            <Search size={16} className="text-muted" />
            <input type="text" placeholder="Search" className="search-input" />
          </div>
          <button className="btn btn-ghost" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)' }}>
            Last Year <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="metrics-grid mb-6">
        <div className="kpi-card">
          <h3 className="text-muted text-sm mb-2">Total Revenue</h3>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold">$99.7k</span>
            <span className="badge-trend positive"><ArrowUpRight size={12} /> +2%</span>
          </div>
        </div>
        <div className="kpi-card">
          <h3 className="text-muted text-sm mb-2">Total Expenses</h3>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold">$32.5k</span>
            <span className="badge-trend negative"><ArrowDownRight size={12} /> -4.3%</span>
          </div>
        </div>
        <div className="kpi-card">
          <h3 className="text-muted text-sm mb-2">Net Margin</h3>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold">67.4%</span>
            <span className="badge-trend positive"><ArrowUpRight size={12} /> +5.2%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Revenue Composition</h3>
            <button className="btn-ghost text-sm font-medium">View all <ArrowRight size={14} /></button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="legend-item"><span className="dot bg-purple-400"></span> Net Profit</div>
            <div className="legend-item"><span className="dot bg-yellow-400"></span> Crafters</div>
            <div className="legend-item"><span className="dot bg-green-400"></span> Materials</div>
            <div className="legend-item"><span className="dot bg-red-400"></span> Overhead</div>
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={16}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: 'var(--radius-lg)', border: 'none', boxShadow: 'var(--shadow-md)', background: 'var(--bg-surface)' }} />
                <Bar dataKey="netProfit" stackId="a" fill="#aba1f7" radius={[0, 0, 4, 4]} />
                <Bar dataKey="crafters" stackId="a" fill="#e2d67d" />
                <Bar dataKey="materials" stackId="a" fill="#9bcfa3" />
                <Bar dataKey="overhead" stackId="a" fill="#f09696" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 card p-6 flex flex-col">
          <h3 className="font-semibold mb-6">Expenses Breakdown</h3>
          
          <div className="expense-item mb-5">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2 font-medium">
                <Building size={16} className="text-muted" /> Facility & Overhead
              </div>
              <span className="font-bold">$9,100</span>
            </div>
            <p className="text-xs text-muted mb-2">Rent, utilities, maintenance • 9.13%</p>
            <div className="progress-bar-bg"><div className="progress-bar-fill bg-red-400" style={{ width: '9%' }}></div></div>
          </div>

          <div className="expense-item mb-5">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2 font-medium">
                <Package size={16} className="text-muted" /> Material Expenses
              </div>
              <span className="font-bold">$3,200</span>
            </div>
            <p className="text-xs text-muted mb-2">Wood, steel, glue • 3.21%</p>
            <div className="progress-bar-bg"><div className="progress-bar-fill bg-green-400" style={{ width: '3%' }}></div></div>
          </div>

          <div className="expense-item mb-5">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2 font-medium">
                <Wrench size={16} className="text-muted" /> Crafter Payments
              </div>
              <span className="font-bold">$23,400</span>
            </div>
            <p className="text-xs text-muted mb-2">Hourly wages & commissions • 23.47%</p>
            <div className="progress-bar-bg"><div className="progress-bar-fill bg-yellow-400" style={{ width: '23%' }}></div></div>
          </div>

          <div className="expense-item mt-auto mb-8 pt-4 border-t border-dashed" style={{ borderColor: 'var(--border-color)'}}>
            <div className="flex justify-between items-center mb-1 text-primary">
              <div className="flex items-center gap-2 font-bold">
                <DollarSign size={16} /> Net Profit
              </div>
              <span className="font-bold">$67,200</span>
            </div>
            <p className="text-xs text-muted mb-2">After all operational expenses • 67.40%</p>
            <div className="progress-bar-bg"><div className="progress-bar-fill bg-purple-400" style={{ width: '67.4%' }}></div></div>
          </div>

          <button className="btn w-full btn-ghost" style={{ border: '1px solid var(--border-color)'}}>
            View detailed expense report
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-color-light)'}}>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Recent Transactions & Payouts</h3>
            <button className="btn-ghost text-sm font-medium">View all <ArrowRight size={14} /></button>
          </div>
        </div>
        <table className="clients-table w-full">
          <thead>
            <tr>
              <th className="pl-6">Date</th>
              <th>Recipient</th>
              <th>Reference</th>
              <th>Category</th>
              <th className="pr-6 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(txn => (
              <tr key={txn.id}>
                <td className="pl-6 text-muted text-sm">{txn.date}</td>
                <td>
                  <div className="flex items-center gap-3">
                    {txn.avatar ? (
                      <img src={txn.avatar} alt={txn.recipient} className="avatar-small" />
                    ) : (
                      <div className="avatar-small flex items-center justify-center bg-gray-100 text-gray-500">
                        {txn.icon && <txn.icon size={14} />}
                      </div>
                    )}
                    <span className="font-medium text-sm">{txn.recipient}</span>
                  </div>
                </td>
                <td className="text-sm text-muted">{txn.reference}</td>
                <td>
                  <span className={`badge ${txn.category === 'Order' ? 'progress' : txn.category === 'Crafter Payout' ? 'pending' : 'error'}`}>
                    {txn.category}
                  </span>
                </td>
                <td className={`pr-6 text-right font-bold text-sm ${txn.positive ? 'text-green-500' : ''}`}>
                  {txn.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finances;
