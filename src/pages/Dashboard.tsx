import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ClipboardList, ClipboardPaste, TrendingUp, TrendingDown, Users, CheckCircle, RefreshCw, CloudDownload, Filter, Bell, X, ArrowUpRight, ArrowDownRight, ArrowUp, ArrowDown, ChevronDown } from 'lucide-react';
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
  const { user } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeFilter, setTimeFilter] = useState<1 | 3 | 6 | 12>(1);
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const mockNotifications = [
    { id: 1, title: 'Low Stock Alert', desc: 'Oak Boards are running below threshold.', time: '10 min ago', unread: true },
    { id: 2, title: 'New Vendor Added', desc: 'Finish Line Supplies is now active.', time: '1 hr ago', unread: true },
    { id: 3, title: 'Project Completed', desc: 'Pharmik MVP is marked as delivered.', time: '3 hrs ago', unread: false },
  ];

  // Dynamic KPIs that react to the calendar's month and time filter
  const {
    totalTasks, ongoingTasks, completedTasks, pendingTasks,
    trendTasks, trendCompleted, trendPending,
    percOngoing, percPending, percCompleted,
    projects, chartData, completedProjects
  } = useMemo(() => {
    // Top KPIs react strictly to the calendar's selected month
    const selectedM = currentDate.getMonth();
    const topTTasks = 110 + selectedM * 5 + (currentDate.getDate() % 5);
    const topPOngoing = 45 + (selectedM % 5);
    const topOTasks = Math.round((topPOngoing / 100) * topTTasks);

    let aggTTasks = 0;
    let aggOTasks = 0;
    let aggCTasks = 0;
    let aggPTasks = 0;
    let aggCompletedProjects = 0;

    // Aggregated metrics use the REAL current month as their baseline, ignoring calendar clicks
    const realCurrentDate = new Date();
    const realCurrentM = realCurrentDate.getMonth();

    // Aggregate over the selected number of months, ending on real current date
    for (let i = 0; i < timeFilter; i++) {
      let m = realCurrentM - i;
      while (m < 0) m += 12; // wrap around for previous years

      const tTasks = 110 + m * 5 + (realCurrentDate.getDate() % 5);

      // Fix Math: define percentages first, then derive counts so they perfectly align
      // Subtract based on 'i' so older months have higher completion rates. 
      // This ensures the aggregated percentage noticeably shifts when timeFilter changes!
      const pOngoingM = Math.max(15, 45 + (m % 5) - (i * 3));
      const pPendingM = Math.max(10, 30 - (m % 3) - (i * 1.5));

      const oTasks = Math.round((pOngoingM / 100) * tTasks);
      const pTasks = Math.round((pPendingM / 100) * tTasks);
      const cTasks = tTasks - oTasks - pTasks;

      aggTTasks += tTasks;
      aggOTasks += oTasks;
      aggCTasks += cTasks;
      aggPTasks += pTasks;
      aggCompletedProjects += 18 + (m % 5);
    }

    // Averages/Percentages (ensure they sum to 100%)
    const pOngoing = Math.round((aggOTasks / aggTTasks) * 100);
    const pPending = Math.round((aggPTasks / aggTTasks) * 100);
    const pCompleted = 100 - pOngoing - pPending;

    // Distinct trends (based purely on current month to show current trajectory)
    const currentM = currentDate.getMonth();
    const tTrend = currentM > 5 ? '+4.1%' : '-1.2%';
    const cTrend = currentM % 2 === 0 ? '+8.4%' : '+2.1%';
    const pTrend = currentM > 3 ? '-2.5%' : '+1.1%';

    const projectNames = [
      'Website Redesign', 'Mobile App V2', 'Brand Guidelines', 'Marketing Campaign',
      'SEO Optimization', 'Cloud Migration', 'Q3 Financials', 'Team Onboarding',
      'Security Audit', 'Customer Feedback Loop', 'Analytics Dashboard', 'Social Media Strategy',
      'API Integration', 'Design System Update', 'User Research'
    ];

    // Number of projects scales with timeFilter (e.g., 1M = 4, 3M = 6, 6M = 9, 12M = 15)
    let numProjects = 4;
    if (timeFilter === 3) numProjects = 6;
    if (timeFilter === 6) numProjects = 9;
    if (timeFilter === 12) numProjects = 15;

    const mappedProjects = [];
    for (let i = 0; i < numProjects; i++) {
      // Create a pseudo-random percentage based on the project index, current month, and timeFilter
      const basePercentage = 25 + ((currentM * 7 + i * 13) % 50);
      // Give it a boost if we're looking at a longer timeframe
      const percentage = Math.min(100, basePercentage + (timeFilter * 4));

      mappedProjects.push({
        name: projectNames[i],
        percentage: percentage
      });
    }

    const updatedChartData = baseProjectOverviewData.map((d, i) => ({
      ...d,
      value: Math.max(10, d.value + (currentM - 6) * 3 + (i % 2 === 0 ? 5 : -5))
    }));

    return {
      totalTasks: topTTasks,
      ongoingTasks: topOTasks,
      completedTasks: aggCTasks,
      pendingTasks: aggPTasks,
      trendTasks: tTrend,
      trendCompleted: cTrend,
      trendPending: pTrend,
      percOngoing: pOngoing,
      percPending: pPending,
      percCompleted: pCompleted,
      projects: mappedProjects,
      chartData: updatedChartData,
      completedProjects: aggCompletedProjects
    };
  }, [currentDate, timeFilter]);

  const performanceData = [
    { name: 'Complete', value: percCompleted, color: 'var(--success)' },
    { name: 'Remaining', value: 100 - percCompleted, color: 'var(--bg-surface-hover)' }
  ];

  const projectsPerPage = 5;
  const totalPages = Math.ceil(projects.length / projectsPerPage);
  const paginatedProjects = projects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);

  return (
    <div className="fade-in">
      <div style={{ padding: '3rem 2% 0 2%', maxWidth: '100%' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 300, color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1 }}>Welcome Back, {user?.name?.split(' ')[0] || 'User'}</h1>
      </div>

      <div className="page-container flex flex-col gap-6" style={{ paddingTop: '2rem' }}>

      <div className="dashboard-grid">

        {/* TOP ROW: KPIs & Calendar */}
        <div className="top-row">

          <div className="kpi-stack">
            <div className="dashboard-card kpi-card primary-task-card" style={{ backgroundColor: 'var(--primary)' }}>
              <div className="task-card-header mb-2 relative z-10">
                <span className="task-card-title">Total Tasks</span>
              </div>
              <div className="flex justify-end items-end relative h-24">
                <div className="tucked-value-wrapper">
                  <div className="task-card-value tucked-value" style={{ marginBottom: 0 }}>{totalTasks}</div>
                </div>
                <div className="flex items-center gap-3 text-white z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
                  <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    {trendTasks.startsWith('+') ? <ArrowUp size={20} strokeWidth={3} /> : <ArrowDown size={20} strokeWidth={3} />}
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {trendTasks}
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium opacity-70" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                    Past 30 days
                  </span>
                </div>
              </div>
            </div>

            <div className="dashboard-card kpi-card secondary-task-card">
              <div className="task-card-header mb-2 relative z-10">
                <span className="task-card-title">Ongoing Tasks</span>
              </div>
              <div className="flex justify-end items-end relative h-24">
                <div className="tucked-value-wrapper">
                  <div className="task-card-value tucked-value" style={{ marginBottom: 0 }}>{ongoingTasks}</div>
                </div>
                <div className="flex items-center gap-3 z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
                  <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'var(--danger-transparent)', color: 'var(--danger)' }}>
                    <ArrowDown size={20} strokeWidth={3} />
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 600, color: 'var(--danger)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    -3.5%
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-muted" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                    Past 30 days
                  </span>
                </div>
              </div>
            </div>
          </div>

          <CalendarWidget currentDate={currentDate} onMonthChange={setCurrentDate} />

        </div>

        {/* CHARTS ROW: Performance & Project Overview */}
        <div className="charts-row">
          <div className="dashboard-card performance-card flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title">Performance Overview</h2>
              <div className="text-sm font-semibold text-muted flex items-center gap-2">
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#064e3b' }}></span>
                {timeFilter === 1 ? 'This Month' : `Last ${timeFilter} Months`}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center w-full" style={{ position: 'relative', marginTop: '1rem', paddingBottom: '1rem' }}>

              {/* Neumorphic Circular Gauge */}
              <div className="flex justify-center items-center" style={{ width: '220px', height: '220px', position: 'relative', borderRadius: '50%' }}>

                {/* SVG Ring */}
                <svg viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)', overflow: 'visible' }}>
                  {/* Background Track (indented look) */}
                  <circle cx="100" cy="100" r="85" fill="none" stroke="var(--border-color)" strokeWidth="18" />

                  {/* Progress Arc */}
                  <circle
                    cx="100" cy="100" r="85"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 85}`}
                    strokeDashoffset={`${2 * Math.PI * 85 * (1 - (percCompleted / 100))}`}
                    style={{ transition: 'all 1000ms ease-out' }}
                  />
                </svg>

                {/* Inner Raised Neumorphic Button */}
                <div style={{
                  position: 'absolute',
                  inset: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1), inset 0 1px 1px var(--border-color-light)',
                  border: '1px solid var(--border-color-light)'
                }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-main)', lineHeight: 1 }}>{percCompleted}%</div>
                </div>
              </div>

              {/* Refined Minimalist Legend - Centered */}
              <div className="flex justify-center items-center w-full px-4" style={{ gap: '3rem', marginTop: '1rem' }}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-muted mb-1" style={{ gap: '0.5rem', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <div style={{ width: '8px', height: '8px', minWidth: '8px', minHeight: '8px', borderRadius: '9999px', flexShrink: 0, backgroundColor: 'var(--primary)' }}></div> Complete
                  </div>
                  <div className="flex items-center mt-1" style={{ gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--text-main)' }}>{completedTasks}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 300, color: trendCompleted.startsWith('+') ? 'var(--success)' : 'var(--danger)', letterSpacing: '-0.02em' }}>
                      {trendCompleted}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center text-muted mb-1" style={{ gap: '0.5rem', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <div style={{ width: '8px', height: '8px', minWidth: '8px', minHeight: '8px', borderRadius: '9999px', flexShrink: 0, backgroundColor: '#9ca3af' }}></div> Pending
                  </div>
                  <div className="flex items-center mt-1" style={{ gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', lineHeight: 1, color: 'var(--text-main)' }}>{pendingTasks}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 300, color: trendPending.startsWith('+') ? 'var(--success)' : 'var(--danger)', letterSpacing: '-0.02em' }}>
                      {trendPending}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card project-overview-card flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="card-title mb-1">Project Overview</h2>
              </div>
              <div className="flex items-center gap-2 relative">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  overflow: 'hidden',
                  maxWidth: showTimeFilter ? '200px' : '0px',
                  opacity: showTimeFilter ? 1 : 0,
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  whiteSpace: 'nowrap',
                  paddingRight: showTimeFilter ? '0.5rem' : '0'
                }}>
                  {[1, 3, 6, 12].map(months => (
                    <button
                      key={months}
                      onClick={() => {
                        setTimeFilter(months as 1 | 3 | 6 | 12);
                        setCurrentPage(1);
                      }}
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: timeFilter === months ? 'var(--text-main)' : 'var(--bg-surface-hover)',
                        color: timeFilter === months ? 'var(--bg-main)' : 'var(--text-muted)',
                        border: '1px solid',
                        borderColor: timeFilter === months ? 'var(--text-main)' : 'var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {months}M
                    </button>
                  ))}
                </div>

                <button
                  className="btn-icon"
                  onClick={() => setShowTimeFilter(!showTimeFilter)}
                  style={{
                    backgroundColor: showTimeFilter ? 'var(--bg-surface-hover)' : 'transparent',
                    width: '28px',
                    height: '28px',
                    minWidth: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    borderRadius: '50%',
                    transition: 'all 0.2s ease',
                    border: showTimeFilter ? '1px solid var(--border-color)' : '1px solid transparent'
                  }}
                  title="Filter Time Range"
                >
                  <Filter size={14} style={{ color: showTimeFilter ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.2s ease' }} />
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-1 mt-2">
              <div className="flex flex-col gap-6 flex-1 pr-2">
                {paginatedProjects.map((project, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span>{project.name}</span>
                      <span className="text-muted">{project.percentage}%</span>
                    </div>
                    {/* Neumorphic 3D Progress Bar */}
                    <div style={{
                      width: '100%',
                      height: '14px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: '9999px',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), inset 0 4px 8px rgba(0,0,0,0.05)',
                      position: 'relative',
                      border: '1px solid var(--border-color-light)'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${project.percentage}%`,
                        background: 'linear-gradient(90deg, var(--primary-hover), #34d399)',
                        borderRadius: '9999px',
                        boxShadow: '0 2px 4px rgba(16, 185, 129, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-color">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-xs font-semibold text-muted hover:text-main"
                    style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1, background: 'none', border: 'none' }}
                  >
                    Previous
                  </button>
                  <div className="text-xs font-semibold text-muted">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="text-xs font-semibold text-muted hover:text-main"
                    style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1, background: 'none', border: 'none' }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Notification Overlay Panel */}
      {isNotificationsOpen && (
        <>
          {/* Invisible Overlay for click-away to close */}
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 48 }}
            onClick={() => setIsNotificationsOpen(false)}
          ></div>
          
          <div style={{
            position: 'fixed',
            bottom: '6rem',
            right: '2.5rem',
            width: '340px',
            backgroundColor: 'var(--bg-surface)',
            borderRadius: '24px 24px 4px 24px', /* Chat bubble shape */
            boxShadow: '0 20px 40px -10px rgba(6, 78, 59, 0.15), 0 0 20px rgba(0,0,0,0.05)',
            border: '1px solid var(--border-color)',
            zIndex: 49,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'scaleIn 0.2s ease-out',
            transformOrigin: 'bottom right'
          }}>
            <div style={{ padding: '1.25rem 1.25rem 1rem 1.25rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)' }}></div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>Notifications</h3>
                </div>
                <button 
                  onClick={() => setIsNotificationsOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  className="hover-text-main"
                >
                  <X size={18} />
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                You have <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{mockNotifications.filter(n => n.unread).length} unread</span> messages
              </p>
            </div>
            
            <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
              {mockNotifications.map(notif => (
                <div key={notif.id} style={{ 
                  padding: '1rem', 
                  marginBottom: '0.5rem',
                  borderRadius: '16px',
                  backgroundColor: notif.unread ? 'var(--primary-transparent)' : 'transparent',
                  border: notif.unread ? '1px solid rgba(6, 78, 59, 0.1)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className={notif.unread ? '' : 'hover-bg-surface-hover'}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: notif.unread ? 'var(--primary)' : 'var(--text-main)' }}>{notif.title}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{notif.time}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{notif.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }} className="hover-text-main">
                Mark all as read
              </button>
            </div>
          </div>
        </>
      )}

      {/* Floating Notification Bell */}
      <button 
        className="fab-btn" 
        title="Notifications"
        style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}
        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
      >
        <Bell size={24} />
        <span 
          style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            width: '10px', 
            height: '10px', 
            backgroundColor: 'var(--danger, #ef4444)', 
            borderRadius: '50%',
            border: '2px solid var(--primary)'
          }}
        ></span>
      </button>
    </div>
  );
};

export default Dashboard;
