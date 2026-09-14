import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Vendor } from '../store/useStore';
import { Package, AlertTriangle, DollarSign, LayoutGrid, FileText, ArrowRight, Trash2, Upload, Plus, ChevronDown, Users, X, UserPlus, Building, Mail, Phone, ArrowUpRight, CheckCircle2, ClipboardList, ArrowLeft, PlusSquare } from 'lucide-react';
import { AddItemForm } from '../components/inventory/InventoryForms';
import './Inventory.css';

interface RequestItem {
  id: string;
  name: string;
  supplier: string;
  category: string;
  specs: string;
  qty: string;
}

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const { inventory, categories, addCategory, vendors, addVendor, purchaseRequests, addPurchaseRequest } = useStore();
  const [view, setView] = useState<'kiosk' | 'inventory' | 'vendors' | 'requests'>('kiosk');
  
  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Vendor Modal State
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    name: '',
    email: '',
    phone: '',
    categories: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  // Inventory Logic
  const totalItems = inventory.length;
  const lowStockCount = inventory.filter(item => item.quantity <= item.lowStockThreshold).length;
  const estValue = inventory.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Vendor Logic
  const activeVendorsCount = vendors.filter(v => v.status === 'Active').length;
  const allCategories = new Set(vendors.flatMap(v => v.categories));

  const handleAddNewCategory = () => {
    const name = window.prompt('Enter new category name:');
    if (name && name.trim().length > 0) {
      addCategory(name.trim());
    }
  };



  const handleSaveVendor = () => {
    if (newVendorData.name.trim()) {
      const newVendor: Vendor = {
        id: `V-${Math.floor(Math.random() * 10000)}`,
        name: newVendorData.name.trim(),
        email: newVendorData.email.trim(),
        phone: newVendorData.phone.trim(),
        categories: newVendorData.categories.split(',').map(s => s.trim()).filter(Boolean),
        status: newVendorData.status,
        rating: 5.0
      };
      addVendor(newVendor);
      setIsVendorModalOpen(false);
      setNewVendorData({ name: '', email: '', phone: '', categories: '', status: 'Active' });
    }
  };

  const renderKiosk = () => (
    <div className="fade-in kiosk-dashboard">
      <div className="kiosk-header">
        <h1 className="kiosk-title">Inventory & Supplies</h1>
      </div>

      <div className="kiosk-grid fade-in">
        <button className="kiosk-btn" onClick={() => setIsRequestModalOpen(true)} title="Add Item">
          <PlusSquare />
          <span className="kiosk-btn-label">Add Item</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.05s' }} onClick={() => setIsVendorModalOpen(true)} title="Add Vendor">
          <Building />
          <span className="kiosk-btn-label">Add Vendor</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.1s' }} onClick={() => alert('Add Consumptions coming soon!')} title="Add Consumptions">
          <ClipboardList />
          <span className="kiosk-btn-label">Add Consumptions</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.15s' }} onClick={() => setView('vendors')} title="Vendors">
          <Users />
          <span className="kiosk-btn-label">Vendors</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.2s' }} onClick={() => alert('View Fixed Asset coming soon!')} title="Fixed Assets">
          <LayoutGrid />
          <span className="kiosk-btn-label">Fixed Assets</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.25s' }} onClick={() => setView('inventory')} title="Stock">
          <Package />
          <span className="kiosk-btn-label">Stock</span>
        </button>
      </div>
    </div>
  );

  const renderInventory = () => {
    const filteredInventory = activeFilter 
      ? inventory.filter(item => item.category === activeFilter)
      : inventory;

    return (
    <div className="fade-in" style={{ padding: '2rem' }}>
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setView('kiosk')} 
          style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
          className="hover-bg-surface-hover transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-main m-0">Inventory Stock</h1>
      </div>
      
      <div className="page-view-toggles mb-6">
        <span className="text-base font-semibold text-muted mr-auto">Filter By:</span>
        <div className="flex items-center gap-6 overflow-x-auto">
          <button 
            className={`view-toggle-btn ${!activeFilter ? 'active' : ''}`} 
            style={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }}
            onClick={() => setActiveFilter(null)}
          >
            All Items
          </button>
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              className={`view-toggle-btn ${activeFilter === cat ? 'active' : ''}`}
              style={{ fontSize: '1.1rem', whiteSpace: 'nowrap' }}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ paddingLeft: '1.5rem', borderLeft: '1px solid var(--border-color)', marginLeft: '1rem' }}>
          <button 
            className="filter-pill dashed hover-text-main" 
            style={{ margin: 0 }}
            onClick={handleAddNewCategory}
          >
            <Plus size={14} /> Add Category
          </button>
        </div>
      </div>

      <div className="inv-grid">
        {filteredInventory.map(item => {
          const isLowStock = item.quantity <= item.lowStockThreshold;
          const maxStock = Math.max(item.quantity, item.lowStockThreshold * 2);
          const stockPercent = Math.round((item.quantity / maxStock) * 100);

          return (
            <div key={item.id} className="dashboard-card inv-card fade-in">
              <div className="inv-card-header">
                <div>
                  <h3 className="inv-card-title">{item.name}</h3>
                  {item.category && (
                    <span className="inv-card-supplier">
                      <Package size={12} /> {item.category}
                    </span>
                  )}
                </div>
                <span className="inv-card-price">${item.costPerUnit}/{item.unit}</span>
              </div>
              
              <div className="mt-4">
                <div className="inv-card-metrics">
                  <div>
                    <div className="inv-stock-val" style={{ color: isLowStock ? 'var(--danger)' : 'var(--text-main)' }}>
                      {item.quantity} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.unit}</span>
                    </div>
                    <div className="inv-stock-label">Current Stock</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="inv-stock-val" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                      {item.lowStockThreshold}
                    </div>
                    <div className="inv-stock-label">Min Threshold</div>
                  </div>
                </div>

                <div style={{
                  width: '100%',
                  height: '6px',
                  backgroundColor: 'var(--bg-main)',
                  borderRadius: '9999px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(stockPercent, 100)}%`,
                    background: isLowStock ? 'var(--danger)' : 'var(--success)',
                    borderRadius: '9999px',
                    transition: 'width 1s ease-out'
                  }}></div>
                </div>
                {isLowStock && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--danger)', marginTop: '8px', fontWeight: 600 }}>
                    Restock recommended soon
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
    );
  };

  const renderVendors = () => (
    <div className="fade-in" style={{ padding: '2rem' }}>
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setView('kiosk')} 
          style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
          className="hover-bg-surface-hover transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-main m-0">Vendors</h1>
      </div>

      <div className="vendors-grid">
        {vendors.map(vendor => (
          <div key={vendor.id} className="dashboard-card client-card fade-in">
            <div className="client-card-header">
              {vendor.avatar ? (
                <img src={vendor.avatar} alt={vendor.name} className="client-avatar" />
              ) : (
                <div className="client-initials" style={{ borderRadius: '12px' }}>{vendor.name.charAt(0)}</div>
              )}
              <div>
                <h3 className="client-name">{vendor.name}</h3>
                <div className="client-company flex items-center gap-1">
                  <Building size={12} /> Supplier
                </div>
              </div>
              <span className={`client-status ${vendor.status.toLowerCase()}`}>
                {vendor.status}
              </span>
            </div>

            <div className="client-contact" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
              <div className="contact-row">
                <Mail size={14} className="contact-icon" />
                {vendor.email}
              </div>
              <div className="contact-row">
                <Phone size={14} className="contact-icon" />
                {vendor.phone}
              </div>
            </div>

            <div className="client-footer" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div>
                <div className="client-spent-label">Categories</div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {vendor.categories.map(cat => (
                    <span key={cat} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'var(--bg-surface-hover)', borderRadius: '4px', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="fade-in" style={{ padding: '2rem' }}>
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => setView('kiosk')} 
          style={{ padding: '0.5rem', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}
          className="hover-bg-surface-hover transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-main m-0">Purchase Requests</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/requests')}
          className="btn-primary" 
          style={{ fontSize: '0.85rem', padding: '0.4rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          View All Details <ArrowRight size={14} />
        </button>
      </div>

      <div className="vendors-grid">
        {purchaseRequests.slice(0, 6).map(pr => (
          <div key={pr.id} className="card vendor-card" style={{ padding: '1.25rem' }}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>{pr.vendorName}</h3>
                <span className="text-sm text-muted">{pr.id} • {pr.date}</span>
              </div>
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: '9999px', 
                fontSize: '0.75rem', 
                fontWeight: 700,
                backgroundColor: pr.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : pr.status === 'Ordered' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                color: pr.status === 'Pending' ? '#d97706' : pr.status === 'Ordered' ? '#2563eb' : '#059669'
              }}>
                {pr.status}
              </span>
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-main)' }}>Items</div>
              <ul style={{ paddingLeft: '1rem', margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {pr.items.slice(0, 2).map((item, i) => (
                  <li key={i}>{item.quantity} {item.unit} x {item.name}</li>
                ))}
                {pr.items.length > 2 && <li>+ {pr.items.length - 2} more...</li>}
              </ul>
            </div>

            <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span className="text-sm font-semibold text-muted">Total Est.</span>
              <span className="text-lg font-bold" style={{ color: 'var(--primary)' }}>${pr.totalCost.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      {view === 'kiosk' && renderKiosk()}
      {view === 'inventory' && renderInventory()}
      {view === 'vendors' && renderVendors()}
      {view === 'requests' && renderRequests()}

      {/* New Request Modal */}
      <AddItemForm isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />

      {/* New Vendor Modal */}
      {isVendorModalOpen && (
        <div className="modal-overlay" onClick={() => setIsVendorModalOpen(false)}>
          <div className="modal-content scale-in" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Vendor</h2>
              <button className="btn-icon" onClick={() => setIsVendorModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSaveVendor(); }}>
                <div className="form-group">
                  <label>Vendor Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input
                    type="text"
                    value={newVendorData.name}
                    onChange={(e) => setNewVendorData({ ...newVendorData, name: e.target.value })}
                    placeholder="e.g. Lumber Yards Inc"
                    autoFocus
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={newVendorData.email}
                      onChange={(e) => setNewVendorData({ ...newVendorData, email: e.target.value })}
                      placeholder="orders@lumberyards.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      value={newVendorData.phone}
                      onChange={(e) => setNewVendorData({ ...newVendorData, phone: e.target.value })}
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Categories Supplied (comma separated)</label>
                  <input
                    type="text"
                    value={newVendorData.categories}
                    onChange={(e) => setNewVendorData({ ...newVendorData, categories: e.target.value })}
                    placeholder="Wood, Hardware"
                  />
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsVendorModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-submit" disabled={!newVendorData.name.trim()}>Add Vendor</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
