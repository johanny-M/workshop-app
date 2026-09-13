import { create } from 'zustand';

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
  price?: number;
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

interface AppState {
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
}

// Mock Data
const initialClients: Client[] = [
  { id: 'C-001', name: 'Alice Smith', email: 'alice@smithbros.com', phone: '(555) 123-4567', company: 'Smith Bros', status: 'Active', totalSpent: 250, avatar: 'https://i.pravatar.cc/150?u=alice' },
  { id: 'C-002', name: 'John Doe', email: 'john.doe@acmecorp.com', phone: '(555) 987-6543', company: 'Acme Corp', status: 'Active', totalSpent: 1250, avatar: 'https://i.pravatar.cc/150?u=john' },
  { id: 'C-003', name: 'Sarah Jane', email: 'sarah.j@example.com', phone: '(555) 456-7890', status: 'Lead', totalSpent: 0, avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 'C-004', name: 'Michael Tech', email: 'mike@globaltech.com', phone: '(555) 222-3333', company: 'Global Tech', status: 'Active', totalSpent: 3500, avatar: 'https://i.pravatar.cc/150?u=mike' },
  { id: 'C-005', name: 'Emily White', email: 'emily.w@shopifypartners.com', phone: '(555) 888-9999', company: 'Shopify Partners', status: 'Active', totalSpent: 6700, avatar: 'https://i.pravatar.cc/150?u=emily' },
];

const initialVendors: Vendor[] = [
  { id: 'V-001', name: 'Lumber Yards Inc', email: 'orders@lumberyards.com', phone: '(555) 111-2222', categories: ['Wood'], status: 'Active', rating: 4.8 },
  { id: 'V-002', name: 'Steel & Hardware Co', email: 'sales@steelhard.com', phone: '(555) 333-4444', categories: ['Hardware', 'Metals'], status: 'Active', rating: 4.5 },
  { id: 'V-003', name: 'Finish Line Supplies', email: 'info@finishline.com', phone: '(555) 555-6666', categories: ['Finish', 'Paint'], status: 'Active', rating: 4.2 },
];

const initialOrders: Order[] = [
  { id: 'ORD-001', clientName: 'Acme Corp', itemName: 'Custom Desk', status: 'Pending', date: '2026-04-18', cost: { materials: 120, labor: 80, overhead: 20 }, price: 450 },
  { id: 'ORD-002', clientName: 'Jane Doe', itemName: 'Dining Table', status: 'In Progress', date: '2026-04-17', cost: { materials: 200, labor: 150, overhead: 30 }, price: 800 },
  { id: 'ORD-003', clientName: 'Smith Bros', itemName: 'Shelving Unit', status: 'Completed', date: '2026-04-15', cost: { materials: 80, labor: 40, overhead: 10 }, price: 250 },
];

const initialInventory: Material[] = [
  { id: 'MAT-001', name: 'Oak Wood', quantity: 45, unit: 'm', lowStockThreshold: 10, costPerUnit: 15, category: 'Wood' },
  { id: 'MAT-002', name: 'Steel Screws', quantity: 800, unit: 'pcs', lowStockThreshold: 200, costPerUnit: 0.1, category: 'Hardware' },
  { id: 'MAT-003', name: 'Varnish', quantity: 5, unit: 'L', lowStockThreshold: 10, costPerUnit: 25, category: 'Finish' },
  { id: 'MAT-004', name: 'Teak Boards', quantity: 8, unit: 'm', lowStockThreshold: 15, costPerUnit: 45, category: 'Wood' },
];

const initialPurchaseRequests: PurchaseRequest[] = [
  { id: 'PR-001', vendorName: 'Lumber Yards Inc', date: '2026-09-12', status: 'Pending', totalCost: 1250, items: [{ name: 'Premium Oak Boards', quantity: 50, unit: 'm', estimatedCost: 25 }], notes: 'Need this expedited for the Stripe project.' },
  { id: 'PR-002', vendorName: 'Finish Line Supplies', date: '2026-09-10', status: 'Ordered', totalCost: 450, items: [{ name: 'Matte Varnish', quantity: 10, unit: 'L', estimatedCost: 45 }], notes: 'Standard delivery.' },
  { id: 'PR-003', vendorName: 'Steel & Hardware Co', date: '2026-09-05', status: 'Delivered', totalCost: 85, items: [{ name: 'Screws Pack', quantity: 10, unit: 'boxes', estimatedCost: 8.5 }] },
];

const initialGoals: Goal[] = [
  { id: 'G-001', name: 'New CNC Machine', target: 5000, current: 1200, category: 'equipment' },
  { id: 'G-002', name: 'Emergency Fund', target: 10000, current: 8500, category: 'emergency' },
];

const initialProjectColumns: ProjectColumn[] = [
  { id: 'c-interested', title: 'Interested' },
  { id: 'c-pending', title: 'Pending' },
  { id: 'c-inprogress', title: 'In Progress' },
  { id: 'c-completed', title: 'Completed' },
  { id: 'c-delivered', title: 'Delivered' }
];

const initialProjects: Project[] = [
  { id: 'p-1', title: 'Onboard Screens', description: 'Increase conversion on our landing', priority: 'High', dueDate: 'March 21, 2025', clientName: 'Stripe Inc.', price: '1200', materialSpec: 'Digital', columnId: 'c-pending', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026701d', 'https://i.pravatar.cc/150?u=a042581f4e29026702d', 'https://i.pravatar.cc/150?u=a042581f4e29026703d'], attachmentsCount: 3, commentsCount: 3 },
  { id: 'p-2', title: 'Splash Screen', description: 'Increase conversion on our landing', priority: 'Low', dueDate: 'March 25, 2025', clientName: 'Acme Corp', price: '800', materialSpec: 'Digital', columnId: 'c-pending', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026704d', 'https://i.pravatar.cc/150?u=a042581f4e29026705d'], attachmentsCount: 3, commentsCount: 3 },
  { id: 'p-3', title: 'Homepage', description: 'Increase conversion on our landing', priority: 'Medium', dueDate: 'April 02, 2025', clientName: 'Global Tech', price: '3500', materialSpec: 'Web Dev', columnId: 'c-pending', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026706d'], attachmentsCount: 3, commentsCount: 3 },
  { id: 'p-4', title: 'Mini Cart', description: 'Increase conversion on our landing', priority: 'High', dueDate: 'March 15, 2025', clientName: 'Shopify Partners', price: '2200', materialSpec: 'E-commerce', columnId: 'c-inprogress', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026701d', 'https://i.pravatar.cc/150?u=a042581f4e29026707d'], attachmentsCount: 3, commentsCount: 3 },
  { id: 'p-5', title: 'Checkout Screens', description: 'Increase conversion on our landing', priority: 'High', dueDate: 'March 10, 2025', clientName: 'Shopify Partners', price: '4500', materialSpec: 'E-commerce', columnId: 'c-inprogress', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026708d', 'https://i.pravatar.cc/150?u=a042581f4e29026709d'], attachmentsCount: 3, commentsCount: 3 },
  { id: 'p-6', title: 'Pharmik ERP MVP', description: 'Increase conversion on our landing', priority: 'High', dueDate: 'Feb 28, 2025', clientName: 'Pharmik Health', price: '15000', materialSpec: 'Full Stack', columnId: 'c-completed', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026710d'], attachmentsCount: 3, commentsCount: 3 },
];

export const useStore = create<AppState>((set) => ({
  currency: 'USD',
  setCurrency: (c) => set({ currency: c }),

  orders: initialOrders,
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),

  clients: initialClients,
  addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),

  vendors: initialVendors,
  addVendor: (vendor) => set((state) => ({ vendors: [...state.vendors, vendor] })),

  purchaseRequests: initialPurchaseRequests,
  addPurchaseRequest: (request) => set((state) => ({ purchaseRequests: [request, ...state.purchaseRequests] })),
  updatePurchaseRequestStatus: (id, status) => set((state) => ({
    purchaseRequests: state.purchaseRequests.map(pr => pr.id === id ? { ...pr, status } : pr)
  })),

  inventory: initialInventory,
  updateInventory: (id, change) => set((state) => ({
    inventory: state.inventory.map(m => m.id === id ? { ...m, quantity: m.quantity + change } : m)
  })),
  categories: ['Wood', 'Hardware', 'Finish', 'Fabric'],
  addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),

  goals: initialGoals,
  updateGoalProgress: (id, amount) => set((state) => ({
    goals: state.goals.map(g => g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g)
  })),

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

  projectColumns: initialProjectColumns,
  projects: initialProjects,
  addProjectColumn: (column) => set((state) => ({ projectColumns: [...state.projectColumns, column] })),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (updatedProject) => set((state) => ({
    projects: state.projects.map(p => p.id === updatedProject.id ? updatedProject : p)
  })),
  softDeleteProject: (projectId) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? { ...p, deletedAt: new Date().toISOString() } : p)
  })),
  updateProjectColumn: (projectId, columnId) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, columnId } : p
      ),
    })),
  moveProject: (projectId, sourceCol, destCol, sourceIdx, destIdx) => set((state) => {
    // Get all projects in destination column except the one moving
    const destProjects = state.projects.filter(p => p.columnId === destCol && p.id !== projectId);

    // Find the project to move
    const projectToMove = state.projects.find(p => p.id === projectId);
    if (!projectToMove) return state;

    // Get column title to apply business logic
    const destColumn = state.projectColumns.find(c => c.id === destCol);
    const destTitle = destColumn ? destColumn.title : '';

    let updatedSubtasks = projectToMove.subtasks ? [...projectToMove.subtasks] : [];

    if (destTitle === 'Completed' || destTitle === 'Delivered') {
      // Auto-complete all subtasks
      updatedSubtasks = updatedSubtasks.map(st => ({ ...st, completed: true }));
    } else if (destTitle === 'In Progress') {
      // If moving to In Progress and no subtasks are done, mark the first one done to show progress
      const anyCompleted = updatedSubtasks.some(st => st.completed);
      if (!anyCompleted && updatedSubtasks.length > 0) {
        updatedSubtasks[0] = { ...updatedSubtasks[0], completed: true };
      }
    }

    // Update its column and subtasks
    const updatedProject = { 
      ...projectToMove, 
      columnId: destCol,
      subtasks: updatedSubtasks
    };

    // Insert at new index
    destProjects.splice(destIdx, 0, updatedProject);

    // Keep all other projects in their original order
    const otherProjects = state.projects.filter(p => p.columnId !== destCol && p.id !== projectId);

    return {
      projects: [...otherProjects, ...destProjects]
    };
  }),
  moveOrder: (orderId, sourceStatus, destStatus, sourceIdx, destIdx) => set((state) => {
    // Same logic for orders
    const destOrders = state.orders.filter(o => o.status === destStatus && o.id !== orderId);
    const orderToMove = state.orders.find(o => o.id === orderId);
    if (!orderToMove) return state;

    const updatedOrder = { ...orderToMove, status: destStatus as OrderStatus };
    destOrders.splice(destIdx, 0, updatedOrder);

    const otherOrders = state.orders.filter(o => o.status !== destStatus && o.id !== orderId);
    return {
      orders: [...otherOrders, ...destOrders]
    };
  }),
  addSubtask: (projectId, title) => set((state) => ({
  projects: state.projects.map(p =>
    p.id === projectId ? {
      ...p,
      subtasks: [...(p.subtasks || []), { id: `st-${Date.now()}`, title, completed: false }]
    } : p
  )
})),

  toggleSubtask: (projectId, subtaskId) => set((state) => ({
    projects: state.projects.map(p =>
      p.id === projectId ? {
        ...p,
        subtasks: p.subtasks?.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
      } : p
    )
  })),

    deleteSubtask: (projectId, subtaskId) => set((state) => ({
      projects: state.projects.map(p =>
        p.id === projectId ? {
          ...p,
          subtasks: p.subtasks?.filter(st => st.id !== subtaskId)
        } : p
      )
    }))
}));
