import React from 'react';
import { ShieldCheck, TrendingUp, Target, Plus } from 'lucide-react';
import './PersonalFinance.css';

const goals = [
  { id: 1, name: 'Emergency Fund', icon: ShieldCheck, target: 15000, current: 15000, color: 'teal' },
  { id: 2, name: 'ETF Investments', icon: TrendingUp, target: 50000, current: 20000, color: 'purple' },
  { id: 3, name: 'Vacation Goal', icon: Target, target: 5000, current: 1500, color: 'blue' },
];

const Saving: React.FC = () => {
  return (
    <div className="pf-container fade-in">
      <div className="pf-header flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Savings & Investments</h1>
          <p className="text-muted text-sm">Track your emergency funds and financial goals.</p>
        </div>
        <button className="btn btn-primary" style={{backgroundColor: 'var(--pf-teal)', color: '#fff', border: 'none'}}>
          <Plus size={16} /> New Goal
        </button>
      </div>

      <div className="pf-grid mb-8">
        <div className="pf-card col-span-3 lg:col-span-1 flex flex-col justify-center">
          <h3 className="text-muted text-sm mb-2 font-medium">Total Savings Portfolio</h3>
          <div className="flex items-end gap-3 mb-6">
            <span className="text-4xl font-bold pf-text-teal">$36,500</span>
            <span className="pf-badge pf-badge-purple">15% Savings Rate</span>
          </div>
          
          <div className="pt-4 border-t border-dashed" style={{ borderColor: 'var(--border-color)'}}>
            <p className="text-sm font-medium mb-1">Monthly Goal Progress</p>
            <p className="text-xs text-muted mb-3">You are on track to save $2,500 this month.</p>
            <div className="pf-progress-bg">
              <div className="pf-progress-fill" style={{ width: '85%', backgroundColor: 'var(--pf-teal)' }}></div>
            </div>
          </div>
        </div>

        <div className="col-span-3 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {goals.map(goal => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={goal.id} className="pf-card pf-goal-card">
                <div className="flex justify-between items-start mb-6">
                  <div className={`pf-icon-square pf-color-${goal.color}`}>
                    <goal.icon size={24} />
                  </div>
                  <span className="text-sm font-bold opacity-50">{percentage}%</span>
                </div>
                <h3 className="font-semibold mb-1">{goal.name}</h3>
                <p className="text-sm text-muted mb-4">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</p>
                
                <div className="pf-progress-bg">
                  <div 
                    className={`pf-progress-fill pf-fill-${goal.color}`} 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Saving;
