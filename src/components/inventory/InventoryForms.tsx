import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { useStore } from '../../store/useStore';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddItemForm: React.FC<FormProps> = ({ isOpen, onClose }) => {
  const { categories, addPurchaseRequest, inventory, vendors } = useStore();
  const [formData, setFormData] = useState({ 
    type: 'new', 
    existingItemId: '',
    name: '', 
    category: categories[0] || '', 
    vendorId: vendors[0]?.id || '',
    quantity: '', 
    notes: '' 
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const itemName = formData.type === 'existing' 
      ? inventory.find(i => i.id === formData.existingItemId)?.name || 'Unknown Item'
      : formData.name;

    const selectedVendor = vendors.find(v => v.id === formData.vendorId);
    const vendorName = selectedVendor ? selectedVendor.name : 'Unknown Vendor';

    const newPr = {
      id: `PR-${Math.floor(Math.random() * 10000)}`,
      vendorName: vendorName,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending' as const,
      totalCost: 0,
      items: [{
        name: itemName,
        quantity: parseInt(formData.quantity) || 1,
        unit: 'unit',
        estimatedCost: 0
      }],
      notes: formData.notes
    };

    addPurchaseRequest(newPr);
    onClose();
    setFormData({ type: 'new', existingItemId: '', name: '', category: categories[0] || '', vendorId: vendors[0]?.id || '', quantity: '', notes: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Item / Restock">
      <form onSubmit={handleSubmit} className="kiosk-form">
        
        <div className="form-group">
          <label>Action Type</label>
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="new">Add New Item</option>
            <option value="existing">Restock Existing Item</option>
          </select>
        </div>

        {formData.type === 'existing' ? (
          <div className="form-group">
            <label>Select Item</label>
            <select value={formData.existingItemId} onChange={e => setFormData({...formData, existingItemId: e.target.value})} required>
              <option value="" disabled>Choose an item to restock...</option>
              {inventory.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Item Name</label>
              <input type="text" placeholder="e.g. Oak Boards" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required autoFocus />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Quantity</label>
          <input type="number" placeholder="10" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
        </div>

        <div className="form-group">
          <label>Vendor</label>
          <select value={formData.vendorId} onChange={e => setFormData({...formData, vendorId: e.target.value})} required>
            <option value="" disabled>Select a Vendor...</option>
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Notes (Optional)</label>
          <textarea placeholder="Any special instructions..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-submit">Submit Request</button>
        </div>
      </form>
    </Modal>
  );
};
