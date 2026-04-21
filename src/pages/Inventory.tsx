import React from 'react';
import { ArrowRight, Trash2, Upload, FileText, Plus, ChevronDown } from 'lucide-react';
import './Inventory.css';

const Inventory: React.FC = () => {
  return (
    <div className="request-container fade-in">
      <div className="request-header mb-8">
        <h1 className="text-2xl font-bold mb-1">New Request</h1>
        <p className="text-muted text-sm">Verify and finalise purchase order details</p>
      </div>

      <div className="stepper-container mb-8">
        <div className="step active">
          <div className="step-circle">1</div>
          <span className="step-label">Fill the Form</span>
        </div>
        <div className="step-line"></div>
        <div className="step pending">
          <div className="step-circle">2</div>
          <span className="step-label">Shipping Information</span>
        </div>
        <div className="step-line"></div>
        <div className="step pending">
          <div className="step-circle">3</div>
          <span className="step-label">Summary</span>
        </div>
      </div>

      <div className="card request-section mb-6">
        <div className="section-header flex items-center gap-2 mb-6">
          <FileText size={18} className="text-muted" />
          <h2 className="font-semibold">Request Specifications</h2>
        </div>

        <div className="request-group mb-6">
          <div className="category-select mb-4">
            <span className="text-sm font-semibold">Category</span>
            <button className="select-badge">Wood <ChevronDown size={14} /></button>
          </div>
          
          <div className="item-row mb-4">
            <input type="text" className="form-input item-name" defaultValue="Teak Boards" />
            <div className="select-wrapper item-supplier">
              <select className="form-input">
                <option>Global Timbers</option>
              </select>
            </div>
            <input type="text" className="form-input item-specs" defaultValue="200x20x2 m" />
            <input type="text" className="form-input item-qty" defaultValue="150" />
            <input type="text" className="form-input item-total" defaultValue="$6,750.00" />
            <input type="text" className="form-input item-sku" defaultValue="TK-BRD-200" />
            <button className="btn-icon text-muted"><Trash2 size={16} /></button>
          </div>
          
          <button className="btn-ghost text-sm text-muted mb-2"><Plus size={14}/> Add Item</button>
        </div>

        <div className="request-group mb-6 divider-top">
          <div className="category-select mb-4">
            <span className="text-sm font-semibold">Category</span>
            <button className="select-badge">Fabrics <ChevronDown size={14} /></button>
          </div>
          
          <div className="item-row mb-4">
            <input type="text" className="form-input item-name" placeholder="Material" />
            <div className="select-wrapper item-supplier">
              <select className="form-input text-muted">
                <option>Supplier</option>
              </select>
            </div>
            <input type="text" className="form-input item-specs" placeholder="Specs" />
            <input type="text" className="form-input item-qty" placeholder="Qty" />
            <input type="text" className="form-input item-total" placeholder="Total" />
            <input type="text" className="form-input item-sku" placeholder="SKU" />
            <button className="btn-icon text-muted"><Trash2 size={16} /></button>
          </div>
          
          <button className="btn-ghost text-sm text-muted mb-2"><Plus size={14}/> Add Item</button>
        </div>

        <div className="divider-top pt-4">
          <button className="btn-ghost text-sm text-muted"><Plus size={14}/> Add category</button>
        </div>
      </div>

      <div className="card request-section mb-6">
        <div className="section-header flex items-center gap-2 mb-4">
          <FileText size={18} className="text-muted" />
          <h2 className="font-semibold">Additional Notes</h2>
        </div>
        <textarea 
          className="form-input w-full notes-area" 
          rows={3} 
          defaultValue="Please ensure the Teak Boards are from the latest premium batch. We need them urgently for the Smith's custom dining table order. For the linen fabric, verify that the dye lot matches our previous order (PO-9921)."
        ></textarea>
      </div>

      <div className="card request-section mb-20">
        <div className="section-header flex items-center gap-2 mb-4">
          <FileText size={18} className="text-muted" />
          <h2 className="font-semibold">Documents</h2>
        </div>
        <div className="upload-area">
          <div className="upload-icon-circle mb-3"><Upload size={20} /></div>
          <p className="font-semibold text-sm mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-muted">PDF, DOC, or image files for measurements</p>
        </div>
      </div>

      <div className="action-bar glass">
        <div className="flex justify-end items-center h-full max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <button className="btn text-sm font-medium">Cancel</button>
            <button className="btn btn-primary" style={{backgroundColor: 'var(--text-main)', color: 'var(--bg-main)'}}>
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
