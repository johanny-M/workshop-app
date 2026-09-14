import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useStore, OrderStatus } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, MoreVertical, DollarSign } from 'lucide-react';
import './Orders.css';

const columns: { title: OrderStatus, id: string }[] = [
  { title: 'Pending', id: 'Pending' },
  { title: 'In Progress', id: 'In Progress' },
  { title: 'Completed', id: 'Completed' },
  { title: 'Delivered', id: 'Delivered' },
];

const Orders: React.FC = () => {
  const { orders, updateOrderStatus, currency } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    useStore.getState().moveOrder(draggableId, source.droppableId, destination.droppableId, source.index, destination.index);
  };

  return (
    <div className="orders-container fade-in flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted">Manage your production pipeline.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Order
        </Button>
      </div>

      <div className="kanban-board-wrapper">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="kanban-board">
            {columns.map(column => {
              const columnOrders = orders.filter(o => o.status === column.title);
              
              return (
                <div key={column.id} className="kanban-column">
                  <div className="kanban-column-header">
                    <h3 className="font-semibold">{column.title}</h3>
                    <span className="kanban-count">{columnOrders.length}</span>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        className={`kanban-droppable ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {columnOrders.map((order, index) => (
                          <Draggable key={order.id} draggableId={order.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`kanban-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                style={{ ...provided.draggableProps.style }}
                              >
                                <div className="kanban-card-header">
                                  <span className="text-xs font-medium text-muted">{order.id}</span>
                                  <button className="btn-icon" style={{ padding: '2px' }}><MoreVertical size={16} /></button>
                                </div>
                                <h4 className="font-semibold mb-1">{order.itemName}</h4>
                                <p className="text-sm text-muted mb-3">{order.clientName}</p>
                                
                                <div className="kanban-card-footer">
                                  <div className="flex items-center gap-1 text-sm font-medium">
                                    <DollarSign size={14} className="text-success" />
                                    {order.price}
                                  </div>
                                  <div className="text-xs text-muted">
                                    Cost: {currencySymbol}{order.cost.materials + order.cost.labor + order.cost.overhead}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
      
      {/* Modal placeholder */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content scale-in" style={{ maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Purchase</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Order creation form goes here.</p>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="button" className="btn-submit" onClick={() => setIsModalOpen(false)}>Save Order</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
