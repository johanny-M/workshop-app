import React from 'react';
import { ShieldCheck, TrendingUp, Target, Plus, ArrowUp } from 'lucide-react';

const goals = [
  { id: 1, name: 'Emergency Fund', icon: ShieldCheck, target: 15000, current: 15000, color: 'teal' },
  { id: 2, name: 'ETF Investments', icon: TrendingUp, target: 50000, current: 20000, color: 'purple' },
  { id: 3, name: 'Vacation Goal', icon: Target, target: 5000, current: 1500, color: 'blue' },
];

const Saving: React.FC = () => {
  return (
    <>
      <div className="pf-content-grid reverse">
        <div className="dashboard-card kpi-card primary-task-card flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}>
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Savings Portfolio</span>
          </div>
          <div className="flex justify-end items-end relative h-24 mb-6">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value" style={{ marginBottom: 0 }}>$36,500</div>
            </div>
            <div className="flex items-center gap-3 text-white z-10" style={{ position: 'absolute', right: '0', bottom: '0' }}>
              <div className="flex items-center justify-center rounded-md" style={{ width: '36px', height: '36px', backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <ArrowUp size={20} strokeWidth={3} />
              </div>
              <div style={{ fontSize: '2.25rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
                15%
              </div>
              <span className="flex items-center gap-1 text-sm font-medium opacity-70" style={{ alignSelf: 'flex-end', paddingBottom: '0.25rem' }}>
                Savings Rate
              </span>
            </div>
          </div>
          
          <div className="pt-6 mt-auto" style={{ borderTop: '1px dashed rgba(255,255,255,0.2)'}}>
            <p className="text-sm font-medium mb-1" style={{ color: 'white' }}>Monthly Goal Progress</p>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.7)' }}>You are on track to save $2,500 this month.</p>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.2)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: 'white', borderRadius: '99px' }}></div>
            </div>
          </div>
        </div>

        <div className="pf-savings-goals">
          {goals.map(goal => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={goal.id} className="dashboard-card flex flex-col p-6">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-sm font-bold opacity-50 text-muted">{percentage}%</span>
                </div>
                <h3 className="font-semibold mb-1 text-main">{goal.name}</h3>
                <p className="text-sm text-muted mb-8">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</p>
                
                <div className="mt-auto" style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div 
                    style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary)', borderRadius: '99px' }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Saving;
