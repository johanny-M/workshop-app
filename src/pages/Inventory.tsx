import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore, Vendor } from '../store/useStore';
import { Package, AlertTriangle, DollarSign, LayoutGrid, FileText, ArrowRight, Trash2, Upload, Plus, ChevronDown, Users, X, UserPlus, Building, Mail, Phone, ArrowUpRight, CheckCircle2, ClipboardList } from 'lucide-react';
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
  const [view, setView] = useState<'inventory' | 'vendors' | 'requests'>('inventory');
  
  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestItems, setRequestItems] = useState<RequestItem[]>([
    { id: '1', name: '', supplier: 'Global Timbers', category: 'Wood', specs: '', qty: '' }
  ]);

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

  const handleAddItem = () => {
    setRequestItems([...requestItems, { id: Math.random().toString(), name: '', supplier: 'Global Timbers', category: categories[0] || '', specs: '', qty: '' }]);
  };

  const handleRemoveItem = (id: string) => {
    if (requestItems.length > 1) {
      setRequestItems(requestItems.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof RequestItem, value: string) => {
    setRequestItems(requestItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSubmitRequest = () => {
    // Generate a new purchase request from the items
    const newPr = {
      id: `PR-${Math.floor(Math.random() * 10000)}`,
      vendorName: requestItems[0]?.supplier || 'Unknown Vendor',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending' as const,
      totalCost: requestItems.length * 150, // rough mockup calculation
      items: requestItems.map(item => ({
        name: item.name || 'New Item',
        quantity: parseInt(item.qty) || 1,
        unit: 'unit',
        estimatedCost: 150
      })),
      notes: requestItems[0]?.specs
    };

    addPurchaseRequest(newPr);

    alert('Purchase request submitted successfully!');
    setIsRequestModalOpen(false);
    setRequestItems([{ id: '1', name: '', supplier: 'Global Timbers', category: categories[0] || '', specs: '', qty: '' }]);
    setView('requests'); // Switch to requests tab immediately to see the new item
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

  const renderInventory = () => {
    const filteredInventory = activeFilter 
      ? inventory.filter(item => item.category === activeFilter)
      : inventory;

    return (
    <div className="fade-in">
      <div className="global-kpi-grid">
        <div className="dashboard-card kpi-card secondary-task-card relative overflow-hidden">
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title text-muted">Unique Materials</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value text-main" style={{ marginBottom: 0 }}>{totalItems}</div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-card kpi-card secondary-task-card relative overflow-hidden">
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title text-muted">Low Stock Alerts</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value" style={{ marginBottom: 0, color: lowStockCount > 0 ? 'var(--warning)' : 'var(--text-main)' }}>
                {lowStockCount}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card kpi-card primary-task-card relative overflow-hidden" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}>
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title" style={{ color: 'rgba(255,255,255,0.8)' }}>Est. Inventory Value</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value" style={{ marginBottom: 0 }}>${estValue.toLocaleString()}</div>
            </div>
          </div>
        </div>
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
    <div className="fade-in">
      <div className="global-kpi-grid">
        <div className="dashboard-card kpi-card primary-task-card relative overflow-hidden" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg-main)' }}>
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title" style={{ color: 'rgba(255,255,255,0.8)' }}>Active Vendors</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value" style={{ marginBottom: 0 }}>{activeVendorsCount}</div>
            </div>
          </div>
        </div>
        <div className="dashboard-card kpi-card secondary-task-card relative overflow-hidden">
          <div className="task-card-header mb-2 relative z-10">
            <span className="task-card-title text-muted">Categories Supplied</span>
          </div>
          <div className="flex justify-end items-end relative h-24">
            <div className="tucked-value-wrapper">
              <div className="task-card-value tucked-value text-main" style={{ marginBottom: 0 }}>{allCategories.size}</div>
            </div>
          </div>
        </div>
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
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>Purchase Requests</h2>
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
    <>
      <div className="page-container fade-in">
        <div className="page-header">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-main">Supplies & Inventory</h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>Manage your workshop stock and vendors</p>
        </div>
        <div className="page-view-toggles">
          <button 
            className={`page-view-toggle ${view === 'inventory' ? 'active' : ''}`}
            onClick={() => setView('inventory')}
          >
            <LayoutGrid size={16} />
            Inventory
          </button>
          <button 
            className={`page-view-toggle ${view === 'vendors' ? 'active' : ''}`}
            onClick={() => setView('vendors')}
          >
            <Users size={16} />
            Vendors
          </button>
          <button 
            className={`page-view-toggle ${view === 'requests' ? 'active' : ''}`}
            onClick={() => setView('requests')}
          >
            <ClipboardList size={16} />
            Requests
          </button>
        </div>
      </div>

      {view === 'inventory' ? renderInventory() : view === 'vendors' ? renderVendors() : renderRequests()}
      </div>

      {/* Floating Action Button */}
      <button 
        className="fab-btn" 
        title="New Purchase Request"
        onClick={() => setIsRequestModalOpen(true)}
      >
        <Plus size={24} />
      </button>

      {/* New Request Modal */}
      {isRequestModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRequestModalOpen(false)}>
          <div className="dashboard-card modal-content p-8" style={{ width: '95%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Create Purchase Request</h2>
              <button onClick={() => setIsRequestModalOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid gap-6">
              <div style={{ background: 'var(--bg-surface-hover)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-muted" /> Line Items
                </h3>
                <div className="grid gap-4">
                  {requestItems.map((item, index) => (
                    <div key={item.id} className="flex gap-4 items-start bg-main" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                      <div className="grid grid-cols-5 gap-4" style={{ flex: 1 }}>
                        <div style={{ gridColumn: 'span 2' }}>
                          <label className="text-xs font-semibold text-muted mb-1 block">Item Name</label>
                          <input type="text" className="req-input w-full" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} placeholder="e.g. Oak Boards" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted mb-1 block">Category</label>
                          <select className="req-input w-full" value={item.category} onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}>
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted mb-1 block">Specs</label>
                          <input type="text" className="req-input w-full" value={item.specs} onChange={(e) => handleItemChange(item.id, 'specs', e.target.value)} placeholder="e.g. 2x4x8" />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-muted mb-1 block">Qty</label>
                          <input type="text" className="req-input w-full" value={item.qty} onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)} placeholder="10" />
                        </div>
                      </div>
                      <div className="pt-6">
                        <button className="btn-icon text-muted hover-text-danger" onClick={() => handleRemoveItem(item.id)} disabled={requestItems.length === 1} style={{ opacity: requestItems.length === 1 ? 0.3 : 1, padding: '0.5rem' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <button className="req-add-btn" onClick={handleAddItem} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-main)', border: '1px dashed var(--border-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
                    <Plus size={16}/> Add Line Item
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Notes to Supplier</h3>
                  <textarea 
                    className="req-input w-full" 
                    style={{ minHeight: '120px', resize: 'vertical', padding: '1rem' }}
                    placeholder="Any special instructions..."
                  ></textarea>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Supporting Docs</h3>
                  <div className="req-upload" style={{ height: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border-color)' }}>
                    <Upload size={24} className="text-muted mb-2" />
                    <p className="font-semibold text-sm mb-1 text-main">Drag and drop files</p>
                    <p className="text-xs text-muted">PDF, DOC, JPG</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsRequestModalOpen(false)} style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--text-muted)', background: 'transparent', border: '1px solid var(--border-color)' }} className="hover-text-main">
                Cancel
              </button>
              <button onClick={handleSubmitRequest} style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: 600, backgroundColor: 'var(--text-main)', color: 'var(--bg-main)' }}>
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Vendor Modal */}
      {/* Floating Action Button */}
      {view === 'vendors' && (
        <button 
          className="fab-btn" 
          title="New Vendor"
          onClick={() => setIsVendorModalOpen(true)}
        >
          <Plus size={24} />
        </button>
      )}

      {isVendorModalOpen && (
        <div className="modal-overlay" onClick={() => setIsVendorModalOpen(false)}>
          <div className="dashboard-card modal-content max-w-2xl p-6" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Add New Vendor</h2>
              <button onClick={() => setIsVendorModalOpen(false)} className="btn-icon">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div style={{ gridColumn: 'span 2' }}>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Vendor Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                <input
                  type="text"
                  value={newVendorData.name}
                  onChange={(e) => setNewVendorData({ ...newVendorData, name: e.target.value })}
                  className="w-full form-input"
                  placeholder="e.g. Lumber Yards Inc"
                  autoFocus
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Email</label>
                <input
                  type="email"
                  value={newVendorData.email}
                  onChange={(e) => setNewVendorData({ ...newVendorData, email: e.target.value })}
                  className="w-full form-input"
                  placeholder="orders@lumberyards.com"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Phone</label>
                <input
                  type="text"
                  value={newVendorData.phone}
                  onChange={(e) => setNewVendorData({ ...newVendorData, phone: e.target.value })}
                  className="w-full form-input"
                  placeholder="(555) 000-0000"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="text-sm font-semibold mb-2" style={{ display: 'block' }}>Categories Supplied (comma separated)</label>
                <input
                  type="text"
                  value={newVendorData.categories}
                  onChange={(e) => setNewVendorData({ ...newVendorData, categories: e.target.value })}
                  className="w-full form-input"
                  placeholder="Wood, Hardware"
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface-hover)' }}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsVendorModalOpen(false)}
                style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--text-muted)' }}
                className="hover-text-main"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveVendor}
                disabled={!newVendorData.name.trim()}
                style={{ 
                  padding: '0.5rem 1.5rem', 
                  borderRadius: 'var(--radius-md)', 
                  fontWeight: 600, 
                  backgroundColor: newVendorData.name.trim() ? 'var(--text-main)' : 'var(--bg-surface-hover)', 
                  color: newVendorData.name.trim() ? 'var(--bg-main)' : 'var(--text-muted)',
                  cursor: newVendorData.name.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                Add Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;
