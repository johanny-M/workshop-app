import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Vendor } from '../store/useStore';
import { Package, AlertTriangle, DollarSign, LayoutGrid, FileText, ArrowRight, Trash2, Upload, Plus, ChevronDown, Users, X, UserPlus, Building, Mail, Phone, ArrowUpRight, CheckCircle2, ClipboardList, ArrowLeft, PlusSquare, FolderPlus, BatteryWarning } from 'lucide-react';
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
  const { inventory, categories, addCategory, vendors, addVendor, purchaseRequests, addPurchaseRequest, updateInventory } = useStore();
  const [view, setView] = useState<'kiosk' | 'inventory' | 'vendors' | 'requests'>('kiosk');

  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Consumption Modal State
  const [isConsumptionModalOpen, setIsConsumptionModalOpen] = useState(false);
  const [consumptionData, setConsumptionData] = useState({ itemId: '', quantity: 1, notes: '' });

  // Vendor Modal State
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [newVendorData, setNewVendorData] = useState({
    name: '',
    email: '',
    countryCode: '+',
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

  const handleSaveCategory = () => {
    if (newCategoryName.trim().length > 0) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setIsCategoryModalOpen(false);
    }
  };



  const handleSaveVendor = () => {
    if (newVendorData.name.trim()) {
      const newVendor: Vendor = {
        id: `V-${Math.floor(Math.random() * 10000)}`,
        name: newVendorData.name.trim(),
        email: newVendorData.email.trim(),
        phone: `${newVendorData.countryCode} ${newVendorData.phone.trim()}`,
        categories: newVendorData.categories.split(',').map(s => s.trim()).filter(Boolean),
        status: newVendorData.status,
        rating: 5.0
      };
      addVendor(newVendor);
      setIsVendorModalOpen(false);
      setNewVendorData({ name: '', email: '', countryCode: '+', phone: '', categories: '', status: 'Active' });
    }
  };

  const handleSaveConsumption = () => {
    if (consumptionData.itemId && consumptionData.quantity > 0) {
      updateInventory(consumptionData.itemId, -consumptionData.quantity);
      setIsConsumptionModalOpen(false);
      setConsumptionData({ itemId: '', quantity: 1, notes: '' });
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
        <button className="kiosk-btn" style={{ animationDelay: '0.1s' }} onClick={() => setIsCategoryModalOpen(true)} title="Add Category">
          <FolderPlus />
          <span className="kiosk-btn-label">Add Category</span>
        </button>
        <button className="kiosk-btn" style={{ animationDelay: '0.15s' }} onClick={() => setIsConsumptionModalOpen(true)} title="Add Consumptions">
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
          <h1 className="kiosk-title">Inventory Stock</h1>
        </div>

        <div className="kpi-grid">
          <div className="dashboard-card kpi-card fade-in">
            <div>
              <h3 className="kpi-title">Total items</h3>
            </div>
            <div className="kpi-value">{totalItems}</div>
          </div>
          <div className="dashboard-card kpi-card fade-in" style={{ animationDelay: '0.05s' }}>
            <div>
              <h3 className="kpi-title">Low stock</h3>
            </div>
            <div className="kpi-value" style={{ color: lowStockCount > 0 ? 'var(--danger)' : 'var(--text-main)' }}>{lowStockCount}</div>
          </div>
          <div className="dashboard-card kpi-card fade-in" style={{ animationDelay: '0.1s' }}>
            <div>
              <h3 className="kpi-title">Est. value</h3>
            </div>
            <div className="kpi-value">${estValue >= 1000 ? (estValue / 1000).toFixed(1) + 'k' : estValue}</div>
          </div>
        </div>

        <div className="page-view-toggles mb-6">
          <span className="text-base font-semibold text-muted mr-auto">Filter By:</span>
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              className={`view-toggle-btn ${!activeFilter ? 'active' : ''}`}
              onClick={() => setActiveFilter(null)}
            >
              All Items
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className={`view-toggle-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="inv-grid">
          {filteredInventory.map(item => {
            const isLowStock = item.quantity <= item.lowStockThreshold;
            const maxStock = Math.max(item.quantity, item.lowStockThreshold * 2);
            const stockPercent = Math.round((item.quantity / maxStock) * 100);

            return (
              <div key={item.id} className="dashboard-card inv-card fade-in">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <h3 className="inv-card-title">{item.name}</h3>
                    {item.category && (
                      <span className="inv-card-supplier">
                        {item.category}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col items-center">
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MIN</span>
                    <span style={{ fontSize: '3rem', fontWeight: 400, color: 'var(--text-main)', lineHeight: 1, marginTop: '2px', letterSpacing: '-0.03em' }}>{item.lowStockThreshold}</span>
                  </div>
                </div>

                <div className="inv-stock-massive" style={{ color: isLowStock ? 'var(--danger)' : 'var(--text-main)' }}>
                  {item.quantity} <span className="inv-stock-unit">{item.unit}</span>
                </div>

                <div>
                  <div className="flex justify-end items-end mb-3" style={{ minHeight: '1.5rem' }}>
                    {isLowStock && (
                      <div style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', opacity: 0.9 }}>
                        <BatteryWarning size={28} strokeWidth={2.5} />
                      </div>
                    )}
                  </div>

                  <div style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <div style={{
                      width: `${Math.min(100, stockPercent)}%`,
                      height: '100%',
                      backgroundColor: isLowStock ? 'var(--danger)' : 'var(--primary)',
                      transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </div>

                  {/* Massive Price Watermark */}
                  <div style={{
                    position: 'absolute',
                    bottom: '3.5rem',
                    right: '1rem',
                    fontSize: '6rem',
                    fontWeight: 400,
                    color: 'var(--primary)',
                    opacity: 0.06,
                    pointerEvents: 'none',
                    lineHeight: 1,
                    letterSpacing: '-0.05em',
                    whiteSpace: 'nowrap',
                    zIndex: 0
                  }}>
                    ${item.costPerUnit}
                  </div>
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
        <h1 className="kiosk-title">Vendors</h1>
      </div>

      <div className="vendors-grid">
        {vendors.map(vendor => (
          <div key={vendor.id} className="dashboard-card client-card fade-in">
            {/* Top Section */}
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Vendor</div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                    {vendor.name}
                  </h3>
                </div>
                <div className="flex gap-2 flex-wrap justify-end" style={{ maxWidth: '60%' }}>
                  {vendor.categories.map(cat => (
                    <span key={cat} style={{ fontSize: '0.7rem', padding: '0.25rem 0', background: 'transparent', border: 'none', borderRadius: '0', color: 'var(--text-main)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: 'none' }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'inline-block', padding: '0.25rem 0.5rem', background: vendor.status === 'Active' ? '#10b981' : 'var(--text-muted)', color: 'var(--bg-main)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                {vendor.status}
              </div>
            </div>

            {/* Middle Section (Phone Number) */}
            <div style={{ color: 'var(--text-main)', marginTop: 'auto', paddingTop: '1rem', paddingBottom: '1rem' }}>
              <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Phone</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {vendor.phone}
              </div>
            </div>

            {/* Bottom Row (Email) */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end', position: 'relative', zIndex: 1, minHeight: '3rem' }}>
              {vendor.email && (
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '3px' }}>Email</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                    {vendor.email}
                  </div>
                </div>
              )}
            </div>

            {/* Massive Total Paid Watermark (Matches Stock Price Watermark) */}
            <div style={{
              position: 'absolute',
              bottom: '2.5rem',
              right: '1rem',
              fontSize: '6rem',
              fontWeight: 400,
              color: 'var(--primary)',
              opacity: 0.06,
              pointerEvents: 'none',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              whiteSpace: 'nowrap',
              zIndex: 0
            }}>
              ${purchaseRequests.filter(pr => pr.vendorName === vendor.name).reduce((sum, pr) => sum + pr.totalCost, 0).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsVendorModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'var(--bg-main)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)',
          cursor: 'pointer',
          zIndex: 50,
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        className="hover-scale"
      >
        <Plus size={28} strokeWidth={3} />
      </button>
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
        <h1 className="kiosk-title">Purchase Requests</h1>
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        style={{ width: '80px', textAlign: 'center' }}
                        value={newVendorData.countryCode}
                        onChange={(e) => setNewVendorData({ ...newVendorData, countryCode: e.target.value })}
                        placeholder="+234"
                      />
                      <input
                        type="text"
                        style={{ flex: 1 }}
                        value={newVendorData.phone}
                        onChange={(e) => setNewVendorData({ ...newVendorData, phone: e.target.value })}
                        placeholder="(555) 000-0000"
                      />
                    </div>
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
      {/* New Category Modal */}
      {isCategoryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="modal-content scale-in" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Category</h2>
              <button className="btn-icon" onClick={() => setIsCategoryModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSaveCategory(); }}>
                <div className="form-group">
                  <label>Category Name</label>
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Hardware"
                    autoFocus
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsCategoryModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-submit" disabled={!newCategoryName.trim()}>Add Category</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Consumptions Modal */}
      {isConsumptionModalOpen && (
        <div className="modal-overlay" onClick={() => setIsConsumptionModalOpen(false)}>
          <div className="modal-content scale-in" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Record Consumption</h2>
              <button className="btn-icon" onClick={() => setIsConsumptionModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <form className="modal-form" onSubmit={(e) => { e.preventDefault(); handleSaveConsumption(); }}>
                <div className="form-group">
                  <label>Item Consumed <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <select
                    value={consumptionData.itemId}
                    onChange={(e) => setConsumptionData({ ...consumptionData, itemId: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select an item</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} (Available: {item.quantity} {item.unit})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity Consumed <span style={{ color: 'var(--danger)' }}>*</span></label>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={consumptionData.quantity}
                    onChange={(e) => setConsumptionData({ ...consumptionData, quantity: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Notes (Optional)</label>
                  <input
                    type="text"
                    value={consumptionData.notes}
                    onChange={(e) => setConsumptionData({ ...consumptionData, notes: e.target.value })}
                    placeholder="e.g. Used for Project A"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setIsConsumptionModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-submit" disabled={!consumptionData.itemId || consumptionData.quantity <= 0}>Record Consumption</button>
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
