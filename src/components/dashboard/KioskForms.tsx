import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import Modal from '../ui/Modal';
import { DatePicker } from '../ui/DatePicker';

// Shared Props
interface FormProps {
  isOpen: boolean;
  onClose: () => void;
}

// -----------------------------
// Add Lead Form
// -----------------------------
export const AddLeadForm: React.FC<FormProps> = ({ isOpen, onClose }) => {
  // Since we don't have a specific leads array in useStore, we'll simulate adding it or add it to clients with a status
  const { addClient } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    // Simulating adding a lead as a client with 'Lead' status (if supported, else just as a client)
    addClient({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      totalOrders: 0,
      totalSpent: 0,
      status: 'Active', // Ideally 'Lead'
      joinDate: new Date().toISOString().split('T')[0],
      recentOrders: []
    });
    
    onClose();
    setFormData({ name: '', email: '', phone: '', notes: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Lead">
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Lead Name / Company</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Acme Corp" />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contact@acme.com" />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(555) 123-4567" />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Initial inquiry details..."></textarea>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-submit">Save Lead</button>
        </div>
      </form>
    </Modal>
  );
};

// -----------------------------
// New Client Form
// -----------------------------
export const NewClientForm: React.FC<FormProps> = ({ isOpen, onClose }) => {
  const { addClient } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    addClient({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      totalOrders: 0,
      totalSpent: 0,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      recentOrders: []
    });
    
    onClose();
    setFormData({ name: '', email: '', phone: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Client">
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Client Name</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. John Doe" />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="(555) 000-0000" />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-submit">Create Client</button>
        </div>
      </form>
    </Modal>
  );
};

// -----------------------------
// New Project Form
// -----------------------------
export const NewProjectForm: React.FC<FormProps> = ({ isOpen, onClose }) => {
  const { clients, addProject } = useStore();
  const [formData, setFormData] = useState({ name: '', clientId: '', value: '', deadline: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.clientId) return;
    
    const client = clients.find(c => c.id === formData.clientId);
    
    addProject({
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      clientId: formData.clientId,
      clientName: client ? client.name : 'Unknown Client',
      status: 'Planning',
      progress: 0,
      value: parseFloat(formData.value) || 0,
      deadline: formData.deadline || new Date().toISOString().split('T')[0],
      tasks: { total: 0, completed: 0 }
    });
    
    onClose();
    setFormData({ name: '', clientId: '', value: '', deadline: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start New Project">
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Name</label>
          <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Website Redesign" />
        </div>
        <div className="form-group">
          <label>Select Client</label>
          <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
            <option value="">-- Choose Client --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Budget / Value ($)</label>
          <input type="number" min="0" step="0.01" value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} placeholder="5000.00" />
        </div>
        <div className="form-group">
          <label>Deadline</label>
          <DatePicker 
            className="kiosk-date-input"
            value={formData.deadline} 
            onChange={date => setFormData({...formData, deadline: date})} 
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-submit">Create Project</button>
        </div>
      </form>
    </Modal>
  );
};

// -----------------------------
// New Order Form
// -----------------------------
export const NewOrderForm: React.FC<FormProps> = ({ isOpen, onClose }) => {
  const { clients, addOrder } = useStore();
  const [formData, setFormData] = useState({ title: '', clientId: '', amount: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.clientId) return;
    
    const client = clients.find(c => c.id === formData.clientId);
    
    addOrder({
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      clientId: formData.clientId,
      clientName: client ? client.name : 'Unknown Client',
      amount: parseFloat(formData.amount) || 0,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    });
    
    onClose();
    setFormData({ title: '', clientId: '', amount: '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Order">
      <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order Title</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Bulk Material Purchase" />
        </div>
        <div className="form-group">
          <label>Select Client</label>
          <select required value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
            <option value="">-- Choose Client --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Total Amount ($)</label>
          <input required type="number" min="0" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="150.00" />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-submit">Process Order</button>
        </div>
      </form>
    </Modal>
  );
};
