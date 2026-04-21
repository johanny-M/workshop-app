import React from 'react';
import { useStore } from '../store/useStore';
import { ArrowUpRight, ArrowDownRight, Package, Truck, Box, Users, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const revenueData = [
  { month: 'Jan', income: 7000, expenses: 2000 },
  { month: 'Feb', income: 7200, expenses: 2000 },
  { month: 'Mar', income: 6000, expenses: 1000 },
  { month: 'Apr', income: 6500, expenses: 1500 },
  { month: 'May', income: 5800, expenses: 1000 },
  { month: 'June', income: 6300, expenses: 1800 },
  { month: 'July', income: 5700, expenses: 1500 },
  { month: 'Aug', income: 6500, expenses: 2500 },
  { month: 'Sep', income: 5900, expenses: 900 },
  { month: 'Oct', income: 6400, expenses: 1000 },
  { month: 'Nov', income: 6100, expenses: 1200 },
  { month: 'Dec', income: 6000, expenses: 1900 },
];

const efficiencyData = [
  { name: 'Cancelled', value: 3, color: '#ef4444' },
  { name: 'Delayed', value: 2, color: '#f59e0b' },
  { name: 'In process', value: 34, color: '#eab308' },
  { name: 'Shipping', value: 18, color: '#3b82f6' },
  { name: 'Delivered', value: 43, color: '#10b981' },
];

const activeOrdersMock = [
  { id: 'ORD-1024', client: 'Alex Harper', initial: 'A', product: 'Custom oak cupboard', dueDate: 'May 16', status: 'In production', revenue: 2000 },
  { id: 'ORD-1023', client: 'Sophie Kim', initial: 'S', product: 'Velvet Lounge Sofa', dueDate: 'May 20', status: 'Pending', revenue: 1850 },
  { id: 'ORD-1022', client: 'Noah Bennett', initial: 'N', product: 'Walnut Office Desk Set', dueDate: 'May 20', status: 'In production', revenue: 1200 },
];

const deliveriesMock = [
  { title: 'Order Delivery to Riverside', date: 'Today • 11:35', icon: Truck },
  { title: 'Order Delivery to Stone Bridge', date: 'May 4 • 14:35', icon: Truck },
  { title: 'Order Delivery to Lake District', date: 'May 4 • 12:00', icon: Truck },
  { title: 'New supplies to the Workshop', date: 'May 7 • 11:55', icon: Box },
  { title: 'Order Delivery to Mapple St.', date: 'May 11 • 10:05', icon: Truck },
];

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container fade-in">
      <div className="dashboard-header-row mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted text-sm">Key revenue, production and client activity for your business</p>
        </div>
        <div>
          <select className="btn btn-secondary text-sm">
            <option>Last Year</option>
            <option>This Year</option>
          </select>
        </div>
      </div>
      
      <div className="metrics-grid mb-6">
        <div className="kpi-card">
          <div className="kpi-header text-muted text-sm flex items-center gap-2 mb-3">
            <Package size={16} /> Total Orders
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main">925</span>
            <span className="pnl-badge pnl-down"><ArrowDownRight size={14}/> -4.3%</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header text-muted text-sm flex items-center gap-2 mb-3">
            <Users size={16} /> Active Clients
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main">742</span>
            <span className="pnl-badge pnl-up"><ArrowUpRight size={14}/> +2%</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-header text-muted text-sm flex items-center gap-2 mb-3">
            <DollarSign size={16} /> Total Revenue
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main">$99.7k</span>
            <span className="pnl-badge pnl-up"><ArrowUpRight size={14}/> +5.2%</span>
          </div>
        </div>
      </div>

      <div className="main-grid mb-6">
        <div className="card revenues-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-lg">Revenues and expenses</h2>
            <button className="btn btn-secondary text-xs">View all →</button>
          </div>
          <div className="flex gap-6 mb-6">
            <div>
              <div className="text-sm text-muted flex items-center gap-2 mb-1"><span className="dot dot-purple"></span>Net income</div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">$67,260.00</span>
                <span className="pnl-badge pnl-up"><ArrowUpRight size={12}/> +5.2%</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted flex items-center gap-2 mb-1"><span className="dot dot-green"></span>Expenses</div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">$32,523.00</span>
                <span className="pnl-badge pnl-down"><ArrowDownRight size={12}/> -1.7%</span>
              </div>
            </div>
          </div>
          <div className="chart-container" style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barSize={24}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="income" stackId="a" fill="var(--primary)" radius={[0, 0, 4, 4]} />
                <Bar dataKey="expenses" stackId="a" fill="#bbf7d0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="side-column">
          <div className="card workshop-efficiency-card">
            <h2 className="font-semibold text-base mb-1">Workshop Efficiency</h2>
            <p className="text-xs text-muted mb-4">All current processes</p>
            <div className="flex items-center">
              <div className="pie-container" style={{ width: '120px', height: '120px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={efficiencyData} innerRadius={42} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                      {efficiencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-center-label">
                  <span className="font-bold text-xl">95%</span>
                  <span className="text-xs text-muted">Overall</span>
                </div>
              </div>
              <div className="efficiency-legend ml-6 flex-1">
                {efficiencyData.map(item => (
                  <div key={item.name} className="flex justify-between text-xs mb-2">
                    <span className="flex items-center gap-2 text-muted"><span className="dot" style={{ backgroundColor: item.color }}></span> {item.name}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card deliveries-card mt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-semibold text-base">Upcoming Deliveries</h2>
                <p className="text-xs text-muted">Next scheduled drop-offs</p>
              </div>
              <button className="btn btn-secondary text-xs">View all →</button>
            </div>
            <div className="deliveries-list">
              {deliveriesMock.map((delivery, i) => (
                <div key={i} className="delivery-item mb-4 flex items-start gap-3">
                  <div className="delivery-icon-box">
                    <delivery.icon size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{delivery.title}</h4>
                    <p className="text-xs text-muted mt-1">{delivery.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card active-orders-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg">Active Orders</h2>
          <button className="btn btn-secondary text-xs">View all →</button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Product</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {activeOrdersMock.map(order => (
                <tr key={order.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar-small">{order.initial}</div>
                      <div>
                        <div className="font-medium text-sm">{order.client}</div>
                        <div className="text-xs text-muted">{order.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm">{order.product}</td>
                  <td className="text-sm">{order.dueDate}</td>
                  <td>
                    <span className={`badge ${order.status === 'Pending' ? 'pending' : 'progress'}`}>{order.status}</span>
                  </td>
                  <td className="text-sm font-medium">${order.revenue.toLocaleString()}.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
