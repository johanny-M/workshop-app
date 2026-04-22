import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ClipboardList, ClipboardPaste, TrendingUp, TrendingDown, Users, CheckCircle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import './Dashboard.css';

const baseOverviewProjects = [
  { name: 'Pharmik MVP', percentage: 50, date: '23/10/2025' },
  { name: 'Budget Manage', percentage: 40, date: '23/10/2025' },
  { name: 'Natura Care', percentage: 80, date: '23/10/2025' },
  { name: 'BIRDEM', percentage: 34, date: '23/10/2025' },
];

const baseProjectOverviewData = [
  { month: 'Jun', value: 35 },
  { month: 'Jul', value: 42 },
  { month: 'Aug', value: 25 },
  { month: 'Sep', value: 50 }, 
  { month: 'Oct', value: 38 },
  { month: 'Nov', value: 32 },
  { month: 'Dec', value: 45 },
];

const Dashboard: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Dynamic KPIs that react to the calendar's month
  const { totalTasks, ongoingTasks, perfComplete, trendTasks, projects, chartData } = useMemo(() => {
    const m = currentDate.getMonth(); // 0-11
    
    // Simple pseudo-random variations based on the month
    const mMod = m % 6; 
    const tTasks = 110 + m * 5 + (currentDate.getDate() % 5); // Add slight day variance
    const oTasks = 20 + mMod;
    const pComplete = Math.min(100, Math.max(20, 60 + (m - 5) * 4));
    const tTrend = m > 5 ? '+4.1%' : '-1.2%';
    
    // Vary overview projects slightly
    const mappedProjects = baseOverviewProjects.map(p => ({
      ...p,
      percentage: Math.min(100, Math.max(10, p.percentage + ((m - 4) * 5)))
    }));

    // Shift bar chart values slightly
    const updatedChartData = baseProjectOverviewData.map((d, i) => ({
      ...d,
      value: Math.max(10, d.value + (m - 6) * 3 + (i % 2 === 0 ? 5 : -5))
    }));

    // Determine the highlighted month text
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    return {
      totalTasks: tTasks,
      ongoingTasks: oTasks,
      perfComplete: pComplete.toFixed(1),
      trendTasks: tTrend,
      projects: mappedProjects,
      chartData: updatedChartData
    };
  }, [currentDate]);

  const performanceData = [
    { name: 'Complete', value: parseFloat(perfComplete), color: 'var(--success)' }, // Emerald Theme
    { name: 'Remaining', value: 100 - parseFloat(perfComplete), color: 'var(--bg-surface-hover)' }
  ];

  return (
    <div className="dashboard-container fade-in flex flex-col gap-6">
      
      {/* 
        CALENDAR WIDGET ROW 
        Made prominent and full-width as requested "bigger than other KPI cards"
      */}
      <div className="calendar-row">
         <CalendarWidget currentDate={currentDate} onMonthChange={setCurrentDate} />
      </div>

      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-col-left flex flex-col gap-6">
          <div className="tasks-cards-row">
            <div className="dashboard-card primary-task-card" style={{ backgroundColor: 'var(--success)' }}>
              <div className="task-card-header">
                <span className="task-card-title">Total Tasks</span>
                <div className="task-icon-box primary-icon-box">
                  <ClipboardList size={18} />
                </div>
              </div>
              <div className="task-card-value">{totalTasks}</div>
              <div className="task-card-trend trend-up">
                <TrendingUp size={14} /> <span>{trendTasks} vs last month</span>
              </div>
            </div>

            <div className="dashboard-card secondary-task-card">
              <div className="task-card-header">
                <span className="task-card-title">Ongoing Tasks</span>
                <div className="task-icon-box secondary-icon-box">
                  <ClipboardPaste size={18} />
                </div>
              </div>
              <div className="task-card-value">{ongoingTasks}</div>
              <div className="task-card-trend trend-down">
                <TrendingDown size={14} /> <span>-3.5% vs last month</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card overview-card flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title">On Overview</h2>
              <div className="team-badge">
                <Users size={14} /> Team Alpha
              </div>
            </div>
            
            {/* FIXED LEGEND ALIGNMENTS */}
            <div className="overview-stats-row text-sm font-medium mb-4 flex items-center justify-between sm:justify-start gap-8">
              <div className="stat-item flex flex-col">
                <div className="flex items-center text-success mb-1">
                  <span className="dot bg-success mr-2"></span>On going
                </div>
                <div className="text-xl font-bold text-main">42.08%</div>
              </div>
              <div className="stat-item flex flex-col">
                <div className="flex items-center text-danger mb-1">
                  <span className="dot bg-danger mr-2"></span>Pending
                </div>
                <div className="text-xl font-bold text-main">28.08%</div>
              </div>
              <div className="stat-item flex flex-col">
                <div className="flex items-center text-warning mb-1">
                  <span className="dot bg-warning mr-2"></span>Completed
                </div>
                <div className="text-xl font-bold text-main">12.08%</div>
              </div>
            </div>

            <div className="segmented-progress-bar mb-8 overflow-hidden rounded-full">
               {Array.from({ length: 42 }).map((_, i) => <div key={`p-${i}`} className="segment seg-success"></div>)}
               <div className="segment seg-spacer"></div>
               {Array.from({ length: 28 }).map((_, i) => <div key={`d-${i}`} className="segment seg-danger"></div>)}
               <div className="segment seg-spacer"></div>
               {Array.from({ length: 12 }).map((_, i) => <div key={`w-${i}`} className="segment seg-warning"></div>)}
            </div>

            <div className="overflow-x-auto">
              <table className="overview-table w-full text-left text-sm font-medium">
                <thead>
                  <tr className="text-muted">
                    <th className="pb-4 font-medium">Project Name</th>
                    <th className="pb-4 font-medium">Project Percentage</th>
                    <th className="pb-4 font-medium text-right">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, i) => (
                    <tr key={i}>
                      <td className="py-4">{p.name}</td>
                      <td className="py-4 font-bold">{p.percentage}%</td>
                      <td className="py-4 text-right text-muted">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-col-right flex flex-col gap-6">
          <div className="dashboard-card performance-card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Performance Overview</h2>
              <span className="text-xs font-semibold text-muted">This Year</span>
            </div>
            
            <div className="gauge-chart-container relative" style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="85%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="gauge-center-text absolute inset-0 flex flex-col items-center justify-end pb-4 pointer-events-none">
                 <div className="text-4xl font-bold bg-surface p-1 rounded text-main">{perfComplete}%</div>
                 <div className="text-sm font-semibold text-muted mt-1 bg-surface px-2 rounded">Project Complete</div>
              </div>
            </div>

            <div className="performance-metrics flex gap-4 mt-6">
              <div className="perf-metric-box flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted mb-3">
                  <div className="metric-icon-sm text-success"><CheckCircle size={14}/></div> Complete
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">42,519</span>
                  <span className="pnl-badge pnl-up text-[10px]"><TrendingUp size={12}/> +8.4%</span>
                </div>
              </div>
              <div className="perf-metric-box flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted mb-3">
                  <div className="metric-icon-sm"><RefreshCw size={14}/></div> Pending
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">42,519</span>
                  <span className="pnl-badge pnl-warning text-[10px]"><TrendingUp size={12}/> +8.4%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card project-overview-card flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="card-title text-sm font-semibold mb-1">Project Overview</h2>
                <div className="text-4xl font-bold mt-2">24</div>
              </div>
              <div className="text-xs font-semibold text-muted flex items-center gap-1">
                <span className="dot bg-success mr-1"></span> This Year
              </div>
            </div>

            <div className="bar-chart-container flex-1 min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'var(--bg-surface)', boxShadow: 'var(--shadow-md)' }} />
                  <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={36}>
                    {
                      chartData.map((entry, index) => {
                        // Highlight logic for the Bar chart
                        const isHighlighted = entry.month === ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][currentDate.getMonth()];
                        return <Cell key={`cell-${index}`} fill={isHighlighted ? 'var(--success)' : 'var(--bg-surface-hover)'} />;
                      })
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
