export type Role = 'Admin' | 'OperationsManager' | 'Analyst';
export type Permission =
  | 'dashboard:read'
  | 'customers:write'
  | 'orders:write'
  | 'payments:read'
  | 'users:read'
  | 'profile:write';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  avatarInitials: string;
}

export interface Session {
  accessToken: string;
  expiresAt: string;
  user: User;
}

export type CustomerStatus = 'active' | 'inactive';
export type OrderStatus = 'draft' | 'processing' | 'shipped' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'approved' | 'declined' | 'refunded';

export interface Customer {
  id: string;
  companyName: string;
  segment: string;
  contactName: string;
  email: string;
  city: string;
  status: CustomerStatus;
  lifetimeValue: number;
  createdAt: string;
}

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  dueDate: string;
  items: OrderItem[];
  timeline: string[];
}

export interface Payment {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  status: PaymentStatus;
  method: 'Invoice' | 'Credit Card' | 'Wire Transfer';
  dueDate: string;
  paidAt?: string;
}

export interface Activity {
  id: string;
  actor: string;
  message: string;
  createdAt: string;
}

export interface DashboardSummary {
  revenue: number;
  revenueDelta: number;
  orders: number;
  ordersDelta: number;
  pendingPayments: number;
  activeCustomers: number;
  orderStatus: Array<{ label: OrderStatus; value: number }>;
  revenueTrend: Array<{ label: string; value: number }>;
  recentCustomers: Customer[];
  pendingPaymentList: Payment[];
  activities: Activity[];
}

export interface PageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
