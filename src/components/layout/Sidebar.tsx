import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, DollarSign, Settings, Hexagon, Wrench, Briefcase, Zap } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: Briefcase },
  { path: '/supplies', label: 'Supplies', icon: Package },
  { path: '/clients', label: 'Clients', icon: Users },
  { path: '/finance', label: 'Finance', icon: DollarSign },
  { path: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <aside className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActiveGroup = location.pathname.startsWith(item.path);
          
          return (
            <div key={item.path} className="nav-item-group">
              <NavLink 
                to={item.path} 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <item.icon size={20} className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
              
              {item.subItems && isActiveGroup && (
                <div className="sub-nav">
                  {item.subItems.map(subItem => (
                    <NavLink 
                      key={subItem.path} 
                      to={subItem.path}
                      className={({ isActive }) => `sub-nav-link ${isActive ? 'active' : ''}`}
                      onClick={onClose}
                    >
                      {subItem.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="upgrade-card">
          <div className="upgrade-card-header">
            <Zap size={20} className="nav-icon" />
            <h4>Pro Plan</h4>
          </div>
          <p>Unlock advanced inventory forecasting & premium features.</p>
          <button className="upgrade-btn">Upgrade Now</button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
