import { create } from 'zustand';

// Types
export type OrderStatus = 'Pending' | 'In Progress' | 'Completed' | 'Delivered';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'ETB';
export type ProjectPriority = 'Low' | 'Normal' | 'High';

export interface ProjectColumn {
  id: string;
  title: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  priority: ProjectPriority;
  dueDate: string;
  columnId: string;
  assignees: string[]; // array of avatar URLs
  attachmentsCount: number;
  commentsCount: number;
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
  // Inventory
  inventory: Material[];
  updateInventory: (id: string, quantityChange: number) => void;
  // Finances
  goals: Goal[];
  updateGoalProgress: (id: string, amount: number) => void;
  // Auth
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  // Projects
  projectColumns: ProjectColumn[];
  projects: Project[];
  addProjectColumn: (column: ProjectColumn) => void;
  addProject: (project: Project) => void;
  updateProjectColumn: (projectId: string, columnId: string) => void;
}

// Mock Data
const initialOrders: Order[] = [
  { id: 'ORD-001', clientName: 'Acme Corp', itemName: 'Custom Desk', status: 'Pending', date: '2026-04-18', cost: { materials: 120, labor: 80, overhead: 20 }, price: 450 },
  { id: 'ORD-002', clientName: 'Jane Doe', itemName: 'Dining Table', status: 'In Progress', date: '2026-04-17', cost: { materials: 200, labor: 150, overhead: 30 }, price: 800 },
  { id: 'ORD-003', clientName: 'Smith Bros', itemName: 'Shelving Unit', status: 'Completed', date: '2026-04-15', cost: { materials: 80, labor: 40, overhead: 10 }, price: 250 },
];

const initialInventory: Material[] = [
  { id: 'MAT-001', name: 'Oak Wood', quantity: 45, unit: 'm', lowStockThreshold: 10, costPerUnit: 15 },
  { id: 'MAT-002', name: 'Steel Screws', quantity: 800, unit: 'pcs', lowStockThreshold: 200, costPerUnit: 0.1 },
  { id: 'MAT-003', name: 'Varnish', quantity: 5, unit: 'L', lowStockThreshold: 10, costPerUnit: 25 },
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
  { id: 'p-1', title: 'Onboard Screens', description: 'Increase conversion on our landing', priority: 'High', dueDate: 'March 21, 2025', columnId: 'c-pending', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026701d', 'https://i.pravatar.cc/150?u=a042581f4e29026702d', 'https://i.pravatar.cc/150?u=a042581f4e29026703d'], attachmentsCount: 3, commentsCount: 3 },
  { id: 'p-2', title: 'Splash Screen', description: 'Increase conversion on our landing', priority: 'Low', dueDate: 'March 21, 2025', columnId: 'c-pending', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026704d', 'https://i.pravatar.cc/150?u=a042581f4e29026705d'], attachmentsCount: 3, commentsCount: 3 },
  { id: 'p-3', title: 'Homepage', description: 'Increase conversion on our landing', priority: 'Low', dueDate: 'March 21, 2025', columnId: 'c-pending', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026706d'], attachmentsCount: 3, commentsCount: 3 },
  { id: 'p-4', title: 'Mini Cart', description: 'Increase conversion on our landing', priority: 'Low', dueDate: 'March 21, 2025', columnId: 'c-inprogress', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026701d', 'https://i.pravatar.cc/150?u=a042581f4e29026707d'], attachmentsCount: 3, commentsCount: 3 },
  { id: 'p-5', title: 'Checkout Screens', description: 'Increase conversion on our landing', priority: 'Low', dueDate: 'March 21, 2025', columnId: 'c-inprogress', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026708d', 'https://i.pravatar.cc/150?u=a042581f4e29026709d'], attachmentsCount: 3, commentsCount: 3 },
  { id: 'p-6', title: 'Pharmik ERP MVP', description: 'Increase conversion on our landing', priority: 'Low', dueDate: 'March 21, 2025', columnId: 'c-completed', assignees: ['https://i.pravatar.cc/150?u=a042581f4e29026710d'], attachmentsCount: 3, commentsCount: 3 },
];

export const useStore = create<AppState>((set) => ({
  currency: 'USD',
  setCurrency: (c) => set({ currency: c }),

  orders: initialOrders,
  updateOrderStatus: (id, status) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
  })),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),

  inventory: initialInventory,
  updateInventory: (id, change) => set((state) => ({
    inventory: state.inventory.map(m => m.id === id ? { ...m, quantity: m.quantity + change } : m)
  })),

  goals: initialGoals,
  updateGoalProgress: (id, amount) => set((state) => ({
    goals: state.goals.map(g => g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g)
  })),

  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  login: () => {
    localStorage.setItem('isAuthenticated', 'true');
    set({ isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('isAuthenticated');
    set({ isAuthenticated: false });
  },

  projectColumns: initialProjectColumns,
  projects: initialProjects,
  addProjectColumn: (column) => set((state) => ({ projectColumns: [...state.projectColumns, column] })),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProjectColumn: (projectId, columnId) => set((state) => ({
    projects: state.projects.map(p => p.id === projectId ? { ...p, columnId } : p)
  }))
}));
