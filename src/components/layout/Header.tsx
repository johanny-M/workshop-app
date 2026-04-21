import React from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useStore, Currency } from '../../store/useStore';
import './Header.css';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const { currency, setCurrency } = useStore();

  return (
    <header className="header glass">
      <div className="header-search">
        <Search size={18} className="text-muted" />
        <input type="text" placeholder="Search orders, materials..." className="search-input" />
      </div>
      
      <div className="header-actions">
        <div className="currency-selector">
          <select 
            className="currency-select" 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value as Currency)}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        
        <button className="btn-icon header-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <button className="btn-icon header-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
