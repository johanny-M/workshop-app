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
        <div className="dashboard-card kpi-card fade-in" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}>
          <div>
            <h3 className="kpi-title" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Savings Portfolio</h3>
            <p className="kpi-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>15% Savings Rate • On track to save $2,500 this month</p>
          </div>
          <div className="kpi-value">$36,500</div>
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
