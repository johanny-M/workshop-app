import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, ChevronDown, Check, X } from 'lucide-react';
import './Clients.css';

const mockClients = [
  { id: 'ODR-1000', name: 'Emily Chen', email: 'emily.c@example.com', phone: '+1 (555) 019-2033', address: '124 Maple St, Apt 4B, New York, NY 10001', product: 'Oak Dining Table', dueDate: 'May 11, 2026', status: 'In production', doc: 'ODR-1000.pdf', avatar: 'https://i.pravatar.cc/150?u=a04' },
  { id: 'ODR-1025', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '+1 (555) 332-1004', address: '45 Birch Road, House 12, Austin, TX 75001', product: '', dueDate: 'May 2, 2026', status: 'Pending', doc: '', avatar: 'https://i.pravatar.cc/150?u=a05' },
  { id: 'ODR-1040', name: 'Michael Smith', email: 'm.smith@example.com', phone: '+1 (555) 847-2991', address: '890 Pine Lane, Suite 200, Beverly Hills, CA 90210', product: 'Chesterfield Leather Sofa', dueDate: 'May 9, 2026', status: 'Delivered', doc: 'ODR-1040.pdf', avatar: 'https://i.pravatar.cc/150?u=a06' },
  { id: 'ODR-1980', name: 'David Garcia', email: 'd.garcia@example.com', phone: '+1 (555) 918-2234', address: '772 Elm Street, Chicago, IL 60614', product: 'Minimalist Bed Frame', dueDate: 'April 28, 2026', status: 'Delivered', doc: 'ODR-1980.pdf', avatar: 'https://i.pravatar.cc/150?u=a07' },
];

const Clients: React.FC = () => {
  const [showStatusDropdown, setShowStatusDropdown] = useState(true); // Default open to match mockup

  return (
    <div className="clients-container fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Clients Database</h1>
          <p className="text-muted text-sm">Manage your customers, their order details, and contacts</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="search-wrapper">
            <Search size={16} className="text-muted" />
            <input type="text" placeholder="Search" className="search-input" />
          </div>
          <button className="btn btn-primary" style={{backgroundColor: 'var(--text-main)', color: 'var(--bg-main)'}}>
            <Plus size={16} /> Add Client
          </button>
        </div>
      </div>

      <div className="filters-bar mb-6">
        <div className="flex items-center gap-3">
          <button className="filter-btn">
            <Filter size={14} /> Filters
          </button>
          
          <div className="relative">
            <button className="filter-btn active" onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
              Status <span className="close-icon"><X size={10} /></span>
            </button>
            
            {showStatusDropdown && (
              <div className="status-dropdown">
                <label className="dropdown-item">
                  <div className="checkbox checked"><Check size={12} /></div>
                  Pending
                </label>
                <label className="dropdown-item">
                  <div className="checkbox"></div>
                  Designing
                </label>
                <label className="dropdown-item">
                  <div className="checkbox checked"><Check size={12} /></div>
                  In production
                </label>
                <label className="dropdown-item">
                  <div className="checkbox"></div>
                  Shipping
                </label>
                <label className="dropdown-item">
                  <div className="checkbox checked"><Check size={12} /></div>
                  Delivered
                </label>
              </div>
            )}
          </div>
          
          <button className="filter-btn">Date</button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted cursor-pointer hover:text-main transition-fast">
          Sort by <ChevronDown size={14} />
        </div>
      </div>

      <div className="table-container p-0">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact Info</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Documents</th>
            </tr>
          </thead>
          <tbody>
            {mockClients.map(client => (
              <tr key={client.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={client.avatar} alt={client.name} className="avatar-small" />
                    <div>
                      <p className="font-semibold text-sm">{client.name}</p>
                      <p className="text-xs text-muted">{client.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-start gap-4">
                    {client.product && <p className="text-sm w-32 truncate">{client.product}</p>}
                    <div>
                      <p className="font-medium text-sm">{client.email}</p>
                      <p className="text-sm text-muted">{client.phone}</p>
                      <p className="text-xs text-muted mt-1 max-w-[200px]">{client.address}</p>
                    </div>
                  </div>
                </td>
                <td className="text-sm">{client.dueDate}</td>
                <td>
                  <span className={`badge ${client.status === 'Pending' ? 'pending' : client.status === 'Delivered' ? 'completed' : 'progress'}`}>
                    {client.status}
                  </span>
                </td>
                <td>
                  {client.doc && (
                    <button className="doc-btn">
                      <FileText size={14} /> {client.doc}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
