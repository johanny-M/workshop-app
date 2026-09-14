import { create } from 'zustand';
import { supabase } from '../lib/supabase';

// Types
export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Delivered';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'ETB';
export type ProjectPriority = 'Low' | 'Normal' | 'High';

export interface ProjectColumn {
  id: string;
  title: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assigneeAvatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  priority: ProjectPriority;
  dueDate: string;
  columnId: string;
  assignees: string[];
  attachmentsCount: number;
  commentsCount: number;
  clientName?: string;
  price?: number | string;
  materialSpec?: string;
  deletedAt?: string;
  subtasks?: Subtask[];
}

export interface Order {
  id: string;
  clientName: string;
  itemName: string;
  status: OrderStatus;
  date: string;
  cost: {
    materials: number;
    labor: number;
    overhead: number;
  };
  price: number;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  costPerUnit: number;
  category?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'Active' | 'Inactive' | 'Lead';
  totalSpent: number;
  avatar?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  categories: string[];
  status: 'Active' | 'Inactive';
  rating: number;
  avatar?: string;
}

export interface PurchaseRequestItem {
  name: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
}

export interface PurchaseRequest {
  id: string;
  vendorName: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Ordered' | 'Delivered' | 'Cancelled';
  totalCost: number;
  items: PurchaseRequestItem[];
  notes?: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  category: 'equipment' | 'expansion' | 'emergency';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface AppState {
  isInitialized: boolean;
  init: () => Promise<void>;
  
  currency: Currency;
  setCurrency: (c: Currency) => void;
  // Orders
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addOrder: (order: Order) => void;
  // Clients
  clients: Client[];
  addClient: (client: Client) => void;
  // Vendors
  vendors: Vendor[];
  addVendor: (vendor: Vendor) => void;
  // Purchase Requests
  purchaseRequests: PurchaseRequest[];
  addPurchaseRequest: (request: PurchaseRequest) => void;
  updatePurchaseRequestStatus: (id: string, status: PurchaseRequest['status']) => void;
  // Inventory
  inventory: Material[];
  updateInventory: (id: string, quantityChange: number) => void;
  categories: string[];
  addCategory: (category: string) => void;
  // Finances
  goals: Goal[];
  updateGoalProgress: (id: string, amount: number) => void;
  // Auth
  user: { name: string; avatar?: string } | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  // Projects
  projectColumns: ProjectColumn[];
  projects: Project[];
  addProjectColumn: (column: ProjectColumn) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  softDeleteProject: (projectId: string) => void;
  updateProjectColumn: (projectId: string, columnId: string) => void;
  moveProject: (projectId: string, sourceCol: string, destCol: string, sourceIdx: number, destIdx: number) => void;
  moveOrder: (orderId: string, sourceStatus: string, destStatus: string, sourceIdx: number, destIdx: number) => void;
  addSubtask: (projectId: string, title: string) => void;
  toggleSubtask: (projectId: string, subtaskId: string) => void;
  deleteSubtask: (projectId: string, subtaskId: string) => void;
  // Notifications
  notifications: AppNotification[];
  addNotification: (notification: Omit<AppNotification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  isInitialized: false,
  currency: 'USD',
  setCurrency: (c) => set({ currency: c }),

  orders: [],
  clients: [],
  vendors: [],
  purchaseRequests: [],
  inventory: [],
  categories: ['Wood', 'Hardware', 'Finish', 'Fabric'],
  goals: [],
  projectColumns: [],
  projects: [],
  notifications: [],
  
  user: { name: 'Mei Moris', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',

  login: () => {
    localStorage.setItem('isAuthenticated', 'true');
    set({ isAuthenticated: true, user: { name: 'Mei Moris', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' } });
  },
  logout: () => {
    localStorage.removeItem('isAuthenticated');
    set({ isAuthenticated: false, user: null });
  },

  init: async () => {
    if (get().isInitialized) return;

    try {
      // Fetch all core data in parallel
      const [
        { data: colsData },
        { data: projData },
        { data: subtasksData },
        { data: ordersData },
        { data: clientsData },
        { data: vendorsData },
        { data: invData },
        { data: prData },
        { data: goalsData },
        { data: notifData }
      ] = await Promise.all([
        supabase.from('project_columns').select('*'),
        supabase.from('projects').select('*').is('deleted_at', null),
        supabase.from('subtasks').select('*'),
        supabase.from('orders').select('*'),
        supabase.from('clients').select('*'),
        supabase.from('vendors').select('*'),
        supabase.from('inventory').select('*'),
        supabase.from('purchase_requests').select('*'),
        supabase.from('goals').select('*'),
        supabase.from('notifications').select('*').order('date', { ascending: false })
      ]);

      // Map Supabase project columns
      const projectColumns = colsData || [];

      // Map Supabase subtasks
      const subtasksByProject = (subtasksData || []).reduce((acc: any, st: any) => {
        if (!acc[st.project_id]) acc[st.project_id] = [];
        acc[st.project_id].push({
          id: st.id,
          title: st.title,
          completed: st.completed,
          assigneeAvatar: st.assignee_avatar
        });
        return acc;
      }, {});

      // Map Supabase projects
      const projects = (projData || []).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        priority: p.priority,
        dueDate: p.due_date,
        columnId: p.column_id,
        assignees: p.assignees || [],
        attachmentsCount: p.attachments_count,
        commentsCount: p.comments_count,
        clientName: p.client_name,
        price: p.price,
        materialSpec: p.material_spec,
        deletedAt: p.deleted_at,
        subtasks: subtasksByProject[p.id] || []
      }));

      // Map Supabase orders
      const orders = (ordersData || []).map(o => ({
        id: o.id,
        clientName: o.client_name,
        itemName: o.item_name,
        status: o.status,
        date: o.date,
        cost: { materials: Number(o.cost_materials), labor: Number(o.cost_labor), overhead: Number(o.cost_overhead) },
        price: Number(o.price)
      }));

      // Map Supabase inventory
      const inventory = (invData || []).map(i => ({
        id: i.id,
        name: i.name,
        quantity: Number(i.quantity),
        unit: i.unit,
        lowStockThreshold: Number(i.low_stock_threshold),
        costPerUnit: Number(i.cost_per_unit),
        category: i.category
      }));

      // Map Supabase PRs
      const purchaseRequests = (prData || []).map(pr => ({
        id: pr.id,
        vendorName: pr.vendor_name,
        date: pr.date,
        status: pr.status,
        totalCost: Number(pr.total_cost),
        notes: pr.notes,
        items: pr.items || []
      }));

      set({
        isInitialized: true,
        projectColumns,
        projects,
        orders,
        clients: clientsData || [],
        vendors: vendorsData || [],
        inventory,
        purchaseRequests,
        goals: goalsData || [],
        notifications: notifData || []
      });
    } catch (err) {
      console.error('Failed to initialize app state from Supabase:', err);
    }
  },

  addProjectColumn: async (column) => {
    set(state => ({ projectColumns: [...state.projectColumns, column] }));
    await supabase.from('project_columns').insert([column]);
  },

  addProject: async (project) => {
    const { subtasks, ...projectData } = project;
    
    // Optimistic UI update
    const newNotification: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'New Project Started',
      message: `Project "${project.title}" has been created.`,
      date: new Date().toISOString(),
      read: false,
      type: 'success'
    };
    
    set(state => ({ 
      projects: [...state.projects, project],
      notifications: [newNotification, ...state.notifications]
    }));

    // Supabase update
    await supabase.from('projects').insert([{
      id: projectData.id,
      title: projectData.title,
      description: projectData.description,
      priority: projectData.priority,
      due_date: projectData.dueDate,
      client_name: projectData.clientName,
      price: projectData.price,
      material_spec: projectData.materialSpec,
      column_id: projectData.columnId,
      assignees: projectData.assignees,
      attachments_count: projectData.attachmentsCount,
      comments_count: projectData.commentsCount
    }]);
    
    if (subtasks && subtasks.length > 0) {
      const stRecords = subtasks.map(st => ({
        id: st.id, project_id: projectData.id, title: st.title, completed: st.completed, assignee_avatar: st.assigneeAvatar
      }));
      await supabase.from('subtasks').insert(stRecords);
    }
    
    await supabase.from('notifications').insert([{
      id: newNotification.id, title: newNotification.title, message: newNotification.message, date: newNotification.date, read: newNotification.read, type: newNotification.type
    }]);
  },

  updateProject: async (updatedProject) => {
    set(state => ({
      projects: state.projects.map(p => p.id === updatedProject.id ? updatedProject : p)
    }));
    const { subtasks, ...p } = updatedProject;
    await supabase.from('projects').update({
      title: p.title, description: p.description, priority: p.priority, due_date: p.dueDate, client_name: p.clientName,
      price: p.price, material_spec: p.materialSpec, column_id: p.columnId, assignees: p.assignees,
      attachments_count: p.attachmentsCount, comments_count: p.commentsCount
    }).eq('id', p.id);
  },

  softDeleteProject: async (projectId) => {
    const deletedAt = new Date().toISOString();
    set(state => ({
      projects: state.projects.map(p => p.id === projectId ? { ...p, deletedAt } : p)
    }));
    await supabase.from('projects').update({ deleted_at: deletedAt }).eq('id', projectId);
  },

  updateProjectColumn: async (projectId, columnId) => {
    set(state => ({
      projects: state.projects.map(p => p.id === projectId ? { ...p, columnId } : p),
    }));
    await supabase.from('projects').update({ column_id: columnId }).eq('id', projectId);
  },

  moveProject: async (projectId, sourceCol, destCol, sourceIdx, destIdx) => {
    // Note: To keep things simple without complex ordering logic in SQL for now,
    // we only update the column_id and auto-complete subtasks in Supabase.
    // The exact visual index ordering isn't persisted securely in this schema yet.
    
    set(state => {
      const destProjects = state.projects.filter(p => p.columnId === destCol && p.id !== projectId);
      const projectToMove = state.projects.find(p => p.id === projectId);
      if (!projectToMove) return state;

      const destColumn = state.projectColumns.find(c => c.id === destCol);
      const destTitle = destColumn ? destColumn.title : '';

      let updatedSubtasks = projectToMove.subtasks ? [...projectToMove.subtasks] : [];
      if (destTitle === 'Completed' || destTitle === 'Delivered') {
        updatedSubtasks = updatedSubtasks.map(st => ({ ...st, completed: true }));
        // Async Supabase update for subtasks
        supabase.from('subtasks').update({ completed: true }).eq('project_id', projectId).then();
      } else if (destTitle === 'In Progress') {
        const anyCompleted = updatedSubtasks.some(st => st.completed);
        if (!anyCompleted && updatedSubtasks.length > 0) {
          updatedSubtasks[0] = { ...updatedSubtasks[0], completed: true };
          supabase.from('subtasks').update({ completed: true }).eq('id', updatedSubtasks[0].id).then();
        }
      }

      const updatedProject = { ...projectToMove, columnId: destCol, subtasks: updatedSubtasks };
      destProjects.splice(destIdx, 0, updatedProject);
      const otherProjects = state.projects.filter(p => p.columnId !== destCol && p.id !== projectId);
      
      // Async Supabase update for project column
      supabase.from('projects').update({ column_id: destCol }).eq('id', projectId).then();

      return { projects: [...otherProjects, ...destProjects] };
    });
  },

  moveOrder: async (orderId, sourceStatus, destStatus, sourceIdx, destIdx) => {
    set(state => {
      const destOrders = state.orders.filter(o => o.status === destStatus && o.id !== orderId);
      const orderToMove = state.orders.find(o => o.id === orderId);
      if (!orderToMove) return state;

      const updatedOrder = { ...orderToMove, status: destStatus as OrderStatus };
      destOrders.splice(destIdx, 0, updatedOrder);
      const otherOrders = state.orders.filter(o => o.status !== destStatus && o.id !== orderId);
      
      supabase.from('orders').update({ status: destStatus }).eq('id', orderId).then();

      return { orders: [...otherOrders, ...destOrders] };
    });
  },

  addSubtask: async (projectId, title) => {
    const newSt = { id: `st-${Date.now()}`, title, completed: false };
    set(state => ({
      projects: state.projects.map(p =>
        p.id === projectId ? { ...p, subtasks: [...(p.subtasks || []), newSt] } : p
      )
    }));
    await supabase.from('subtasks').insert([{ id: newSt.id, project_id: projectId, title: newSt.title, completed: false }]);
  },

  toggleSubtask: async (projectId, subtaskId) => {
    let newStatus = false;
    set(state => ({
      projects: state.projects.map(p =>
        p.id === projectId ? {
          ...p,
          subtasks: p.subtasks?.map(st => {
            if (st.id === subtaskId) {
              newStatus = !st.completed;
              return { ...st, completed: newStatus };
            }
            return st;
          })
        } : p
      )
    }));
    await supabase.from('subtasks').update({ completed: newStatus }).eq('id', subtaskId);
  },

  deleteSubtask: async (projectId, subtaskId) => {
    set(state => ({
      projects: state.projects.map(p => p.id === projectId ? { ...p, subtasks: p.subtasks?.filter(st => st.id !== subtaskId) } : p)
    }));
    await supabase.from('subtasks').delete().eq('id', subtaskId);
  },

  updateOrderStatus: async (id, status) => {
    set(state => ({ orders: state.orders.map(o => o.id === id ? { ...o, status } : o) }));
    await supabase.from('orders').update({ status }).eq('id', id);
  },

  addOrder: async (order) => {
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`, title: 'New Order Created', message: `Order ${order.id} for ${order.itemName} added.`, date: new Date().toISOString(), read: false, type: 'success'
    };
    set(state => ({ orders: [...state.orders, order], notifications: [newNotif, ...state.notifications] }));
    
    await supabase.from('orders').insert([{
      id: order.id, client_name: order.clientName, item_name: order.itemName, status: order.status, date: order.date,
      cost_materials: order.cost.materials, cost_labor: order.cost.labor, cost_overhead: order.cost.overhead, price: order.price
    }]);
    await supabase.from('notifications').insert([{ id: newNotif.id, title: newNotif.title, message: newNotif.message, date: newNotif.date, read: newNotif.read, type: newNotif.type }]);
  },

  addClient: async (client) => {
    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`, title: 'New Client Added', message: `${client.name} has been added to the directory.`, date: new Date().toISOString(), read: false, type: 'info'
    };
    set(state => ({ clients: [...state.clients, client], notifications: [newNotif, ...state.notifications] }));
    await supabase.from('clients').insert([client]);
    await supabase.from('notifications').insert([{ id: newNotif.id, title: newNotif.title, message: newNotif.message, date: newNotif.date, read: newNotif.read, type: newNotif.type }]);
  },

  addVendor: async (vendor) => {
    set(state => ({ vendors: [...state.vendors, vendor] }));
    await supabase.from('vendors').insert([vendor]);
  },

  addPurchaseRequest: async (request) => {
    set(state => ({ purchaseRequests: [request, ...state.purchaseRequests] }));
    await supabase.from('purchase_requests').insert([{
      id: request.id, vendor_name: request.vendorName, date: request.date, status: request.status,
      total_cost: request.totalCost, notes: request.notes, items: request.items
    }]);
  },

  updatePurchaseRequestStatus: async (id, status) => {
    set(state => ({ purchaseRequests: state.purchaseRequests.map(pr => pr.id === id ? { ...pr, status } : pr) }));
    await supabase.from('purchase_requests').update({ status }).eq('id', id);
  },

  updateInventory: async (id, change) => {
    let newQ = 0;
    set(state => ({
      inventory: state.inventory.map(m => {
        if (m.id === id) {
          newQ = m.quantity + change;
          return { ...m, quantity: newQ };
        }
        return m;
      })
    }));
    await supabase.from('inventory').update({ quantity: newQ }).eq('id', id);
  },

  addCategory: (category) => {
    set(state => ({ categories: [...state.categories, category] }));
    // Categories are just a local string array for now, unless we want a table for them.
  },

  updateGoalProgress: async (id, amount) => {
    let newCurrent = 0;
    set(state => ({
      goals: state.goals.map(g => {
        if (g.id === id) {
          newCurrent = Math.min(g.target, g.current + amount);
          return { ...g, current: newCurrent };
        }
        return g;
      })
    }));
    await supabase.from('goals').update({ current: newCurrent }).eq('id', id);
  },

  addNotification: async (notification) => {
    const newNotif = { ...notification, id: `NOTIF-${Date.now()}`, date: new Date().toISOString(), read: false };
    set(state => ({ notifications: [newNotif, ...state.notifications] }));
    await supabase.from('notifications').insert([{ id: newNotif.id, title: newNotif.title, message: newNotif.message, date: newNotif.date, read: newNotif.read, type: newNotif.type }]);
  },

  markAsRead: async (id) => {
    set(state => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) }));
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  },

  markAllAsRead: async () => {
    set(state => ({ notifications: state.notifications.map(n => ({ ...n, read: true })) }));
    await supabase.from('notifications').update({ read: true }).eq('read', false);
  }
}));
