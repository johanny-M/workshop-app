import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ShoppingCart, FolderKanban, Users, DollarSign, Package, Bell, X, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AddLeadForm, NewClientForm, NewProjectForm, NewOrderForm } from '../components/dashboard/KioskForms';
import './Dashboard.css';
import './Notifications.css';

const Dashboard: React.FC = () => {
  const { user, notifications, markAsRead, markAllAsRead } = useStore();
  const navigate = useNavigate();
  
  // Track which modal is currently open
  const [activeModal, setActiveModal] = useState<'lead' | 'client' | 'project' | 'order' | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const closeModal = () => setActiveModal(null);

  return (
    <div className="fade-in kiosk-dashboard">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Welcome Back, {user?.name?.split(' ')[0] || 'User'}</h1>
      </div>

      <div className="kiosk-grid fade-in">
        <button className="kiosk-btn" onClick={() => setActiveModal('lead')} title="Add Lead">
          <UserPlus />
          <span className="kiosk-btn-label">Add Lead</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.05s' }} onClick={() => setActiveModal('order')} title="Add Order">
          <ShoppingCart />
          <span className="kiosk-btn-label">Add Order</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.1s' }} onClick={() => navigate('/projects')} title="Projects">
          <FolderKanban />
          <span className="kiosk-btn-label">Projects</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.15s' }} onClick={() => navigate('/clients')} title="Clients">
          <Users />
          <span className="kiosk-btn-label">Clients</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.2s' }} onClick={() => navigate('/finance')} title="Finances">
          <DollarSign />
          <span className="kiosk-btn-label">Finances</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.25s' }} onClick={() => navigate('/supplies')} title="Inventory">
          <Package />
          <span className="kiosk-btn-label">Inventory</span>
        </button>
      </div>

      {/* Modals */}
      <AddLeadForm isOpen={activeModal === 'lead'} onClose={closeModal} />
      <NewClientForm isOpen={activeModal === 'client'} onClose={closeModal} />
      <NewProjectForm isOpen={activeModal === 'project'} onClose={closeModal} />
      <NewOrderForm isOpen={activeModal === 'order'} onClose={closeModal} />

      {/* Notification Overlay Panel */}
      {showNotifications && (
        <>
          {/* Invisible Overlay for click-away to close */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 48 }}
            onClick={() => setShowNotifications(false)}
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
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.3px', margin: 0 }}>Notifications</h3>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  className="hover-text-main"
                >
                  <X size={18} />
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '4px' }}>
                You have <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{unreadCount} unread</span> messages
              </p>
            </div>

            <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '0.5rem' }}>
              {notifications.map(notif => (
                <div key={notif.id} style={{
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '16px',
                  backgroundColor: !notif.read ? 'var(--primary-transparent)' : 'transparent',
                  border: !notif.read ? '1px solid rgba(6, 78, 59, 0.1)' : '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className={!notif.read ? '' : 'hover-bg-surface-hover'}
                onClick={() => markAsRead(notif.id)}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, color: !notif.read ? 'var(--primary)' : 'var(--text-main)' }}>{notif.title}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>{new Date(notif.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-muted)', lineHeight: 1.5 }}>{notif.message}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
              <button 
                onClick={markAllAsRead}
                style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }} 
                className="hover-text-main"
              >
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
        style={{ 
          backgroundColor: 'var(--primary)', 
          color: 'var(--bg-main)',
          position: 'fixed',
          bottom: '2rem',
          right: '2.5rem',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 47,
          transition: 'transform 0.2s ease'
        }}
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell size={36} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '24px',
              height: '24px',
              backgroundColor: 'var(--danger, #ef4444)',
              borderRadius: '50%',
              border: '2px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: 'white'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default Dashboard;
