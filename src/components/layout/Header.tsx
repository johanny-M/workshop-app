import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, User, Settings as SettingsIcon, LogOut, Menu as MenuIcon, Hexagon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import './Header.css';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, toggleSidebar }) => {
  const { user } = useStore();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header glass" style={{ justifyContent: 'space-between', padding: '0 1.5rem' }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="btn-icon header-btn" 
          onClick={toggleSidebar} 
          title="Toggle Menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}
        >
          <MenuIcon size={24} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
          <Hexagon fill="currentColor" stroke="none" size={26} />
          <span style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Woodcrafters</span>
        </div>
      </div>
      
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button className="btn-icon header-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <div className="profile-menu-container" ref={menuRef} style={{ position: 'relative' }}>
          <button 
            className="profile-btn"
            onClick={() => setShowMenu(!showMenu)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', 
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '0.1rem', borderRadius: '50%',
              transition: 'box-shadow 0.2s ease',
              boxShadow: showMenu ? '0 0 0 2px var(--primary)' : 'none'
            }}
          >
            <img src={user?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt={user?.name || "User"} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} />
          </button>
          
          {showMenu && (
            <div className="profile-dropdown fade-in" style={{
              position: 'absolute',
              top: 'calc(100% + 0.5rem)',
              right: 0,
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-color)',
              minWidth: '220px',
              overflow: 'hidden',
              zIndex: 100
            }}>
              <div className="px-4 py-4 border-b border-color" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name || "User"}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Manager</span>
              </div>
              <div className="py-2">
                <button className="dropdown-item">
                  <User size={16} /> Profile
                </button>
                <button className="dropdown-item">
                  <SettingsIcon size={16} /> Settings
                </button>
              </div>
              <div className="py-2 border-t border-color">
                <button className="dropdown-item text-danger" style={{ color: 'var(--danger)' }}>
                  <LogOut size={16} /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
