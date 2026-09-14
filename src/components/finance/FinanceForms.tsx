import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { DatePicker } from '../ui/DatePicker';

interface FormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseForm: React.FC<FormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ date: '', recipient: '', reference: '', amount: '', category: 'Payout' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Recipient / Vendor</label>
          <input type="text" placeholder="e.g. Oakwood Lumber Co." value={formData.recipient} onChange={e => setFormData({...formData, recipient: e.target.value})} autoFocus />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input type="number" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
            <option value="Expense">Materials (Expense)</option>
            <option value="Payout">Crafter Payout</option>
            <option value="Overhead">Overhead</option>
          </select>
        </div>
        <div className="form-group">
          <label>Reference #</label>
          <input type="text" placeholder="e.g. INV-1002" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Date</label>
          <DatePicker 
            className="kiosk-date-input"
            value={formData.date} 
            onChange={date => setFormData({...formData, date: date})} 
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-submit">Add Expense</button>
        </div>
      </form>
    </Modal>
  );
};

export const AddIncomeForm: React.FC<FormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ date: '', sender: '', reference: '', amount: '' });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Income">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label>Client / Sender</label>
          <input type="text" placeholder="e.g. Alex Harper" value={formData.sender} onChange={e => setFormData({...formData, sender: e.target.value})} autoFocus />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input type="number" placeholder="0.00" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Reference / Invoice #</label>
          <input type="text" placeholder="e.g. ORD-1024" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Date</label>
          <DatePicker 
            className="kiosk-date-input"
            value={formData.date} 
            onChange={date => setFormData({...formData, date: date})} 
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-submit">Add Income</button>
        </div>
      </form>
    </Modal>
  );
};
