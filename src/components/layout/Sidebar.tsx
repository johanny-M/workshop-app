import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, DollarSign, Settings, Box, Wrench, Briefcase } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projects', label: 'Projects', icon: Briefcase, subItems: [
    { path: '/projects', label: 'Overview' },
    { path: '/production', label: 'Production' }
  ]},
  { path: '/supplies', label: 'Supplies', icon: Package, subItems: [
    { path: '/supplies-manage', label: 'Manage' },
    { path: '/supplies', label: 'Request' }
  ]},
  { path: '/crafters', label: 'Crafters', icon: Wrench },
  { path: '/clients', label: 'Clients', icon: Users },
  { path: '/finance', label: 'Finance', icon: DollarSign },
  { path: '/personal', label: 'Personal', icon: Briefcase, subItems: [
    { path: '/personal/revenue', label: 'Revenue' },
    { path: '/personal/saving', label: 'Saving' }
  ]},
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Box className="logo-icon" size={24} />
        <span className="logo-text">Woodcrafters</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActiveGroup = location.pathname.startsWith(item.path);
          return (
            <div key={item.path} className="nav-group">
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link ${isActive || isActiveGroup ? 'active' : ''}`}
                end={item.subItems ? false : true}
              >
                <item.icon size={20} className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>

              {item.subItems && isActiveGroup && (
                <div className="sub-nav">
                  {item.subItems.map((sub) => (
                    <NavLink
                      key={sub.label}
                      to={sub.path}
                      className={({ isActive }) => `sub-nav-link ${isActive ? 'active' : ''}`}
                      end
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Mei Moris" className="avatar" />
          <div className="user-info">
            <span className="user-name">Mei Moris</span>
            <span className="user-role">Manager</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
