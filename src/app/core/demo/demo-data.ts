import {
  Activity,
  Customer,
  DashboardSummary,
  Order,
  Payment,
  Permission,
  Role,
  User,
} from '../../shared/models/enterprise.models';

const adminPermissions: Permission[] = [
  'dashboard:read',
  'customers:write',
  'orders:write',
  'payments:read',
  'users:read',
  'profile:write',
];
const managerPermissions: Permission[] = [
  'dashboard:read',
  'customers:write',
  'orders:write',
  'payments:read',
  'profile:write',
];
const analystPermissions: Permission[] = ['dashboard:read', 'payments:read', 'profile:write'];

export const demoUsers: User[] = [
  user('u-admin', 'Avery Stone', 'admin@example.com', 'Admin', adminPermissions),
  user('u-manager', 'Maya Chen', 'manager@example.com', 'OperationsManager', managerPermissions),
  user('u-analyst', 'Noah Reed', 'analyst@example.com', 'Analyst', analystPermissions),
];

export const demoCustomers: Customer[] = [
  customer('c-001', 'Northwind Manufacturing', 'Industrial', 'Helen Carter', 'São Paulo', 184200),
  customer('c-002', 'Aster Retail Group', 'Retail', 'Bruno Lima', 'Curitiba', 92400),
  customer('c-003', 'Blue Harbor Logistics', 'Logistics', 'Iris Morgan', 'Recife', 128300),
  customer('c-004', 'Contoso Health', 'Healthcare', 'Rafael Costa', 'Campinas', 211000),
  customer(
    'c-005',
    'Fabrikam Finance',
    'Financial Services',
    'Sofia Alves',
    'Porto Alegre',
    176700,
  ),
  customer(
    'c-006',
    'Litware Labs',
    'Technology',
    'Miguel Torres',
    'Belo Horizonte',
    68800,
    'inactive',
  ),
];

export const demoOrders: Order[] = [
  order('SO-1042', 'c-001', 'Northwind Manufacturing', 'processing', 42800, '2026-07-02'),
  order('SO-1043', 'c-004', 'Contoso Health', 'completed', 78250, '2026-07-04'),
  order('SO-1044', 'c-002', 'Aster Retail Group', 'draft', 12900, '2026-07-10'),
  order('SO-1045', 'c-003', 'Blue Harbor Logistics', 'shipped', 33700, '2026-07-13'),
  order('SO-1046', 'c-005', 'Fabrikam Finance', 'processing', 58400, '2026-07-18'),
  order('SO-1047', 'c-006', 'Litware Labs', 'cancelled', 9100, '2026-07-20'),
];

export const demoPayments: Payment[] = [
  payment(
    'PAY-9001',
    'SO-1042',
    'Northwind Manufacturing',
    42800,
    'pending',
    'Invoice',
    '2026-08-02',
  ),
  payment(
    'PAY-9002',
    'SO-1043',
    'Contoso Health',
    78250,
    'approved',
    'Wire Transfer',
    '2026-07-18',
    '2026-07-15',
  ),
  payment(
    'PAY-9003',
    'SO-1044',
    'Aster Retail Group',
    12900,
    'declined',
    'Credit Card',
    '2026-07-22',
  ),
  payment(
    'PAY-9004',
    'SO-1045',
    'Blue Harbor Logistics',
    33700,
    'pending',
    'Invoice',
    '2026-08-13',
  ),
  payment(
    'PAY-9005',
    'SO-1046',
    'Fabrikam Finance',
    58400,
    'refunded',
    'Wire Transfer',
    '2026-07-28',
    '2026-07-25',
  ),
];

export const demoActivities: Activity[] = [
  {
    id: 'a1',
    actor: 'Maya Chen',
    message: 'approved pricing exception for SO-1046',
    createdAt: '2026-07-24T16:30:00Z',
  },
  {
    id: 'a2',
    actor: 'Avery Stone',
    message: 'invited an operations analyst',
    createdAt: '2026-07-24T13:05:00Z',
  },
  {
    id: 'a3',
    actor: 'Noah Reed',
    message: 'flagged PAY-9003 for follow-up',
    createdAt: '2026-07-23T19:20:00Z',
  },
  {
    id: 'a4',
    actor: 'System',
    message: 'generated monthly executive snapshot',
    createdAt: '2026-07-23T07:00:00Z',
  },
];

export function buildDashboardSummary(): DashboardSummary {
  const revenue = demoPayments
    .filter((paymentEntry) => paymentEntry.status === 'approved')
    .reduce((sum, paymentEntry) => sum + paymentEntry.amount, 0);

  return {
    revenue,
    revenueDelta: 12.8,
    orders: demoOrders.length,
    ordersDelta: 8.1,
    pendingPayments: demoPayments.filter((paymentEntry) => paymentEntry.status === 'pending')
      .length,
    activeCustomers: demoCustomers.filter((customerEntry) => customerEntry.status === 'active')
      .length,
    orderStatus: ['draft', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => ({
      label: status as DashboardSummary['orderStatus'][number]['label'],
      value: demoOrders.filter((orderEntry) => orderEntry.status === status).length,
    })),
    revenueTrend: [
      { label: 'Feb', value: 82000 },
      { label: 'Mar', value: 94000 },
      { label: 'Apr', value: 107000 },
      { label: 'May', value: 99000 },
      { label: 'Jun', value: 121000 },
      { label: 'Jul', value: 154000 },
    ],
    recentCustomers: demoCustomers.slice(0, 4),
    pendingPaymentList: demoPayments.filter((paymentEntry) => paymentEntry.status === 'pending'),
    activities: demoActivities,
  };
}

function user(
  id: string,
  name: string,
  email: string,
  role: Role,
  permissions: Permission[],
): User {
  return {
    id,
    name,
    email,
    role,
    permissions,
    avatarInitials: name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2),
  };
}

function customer(
  id: string,
  companyName: string,
  segment: string,
  contactName: string,
  city: string,
  lifetimeValue: number,
  status: Customer['status'] = 'active',
): Customer {
  return {
    id,
    companyName,
    segment,
    contactName,
    email: `${contactName.toLowerCase().replaceAll(' ', '.')}@example.com`,
    city,
    status,
    lifetimeValue,
    createdAt: `2026-0${Math.max(1, Number(id.at(-1)))}-14`,
  };
}

function order(
  id: string,
  customerId: string,
  customerName: string,
  status: Order['status'],
  total: number,
  createdAt: string,
): Order {
  return {
    id,
    customerId,
    customerName,
    status,
    total,
    createdAt,
    dueDate: '2026-08-15',
    items: [
      {
        sku: 'ENT-SUPPORT',
        name: 'Enterprise support package',
        quantity: 1,
        unitPrice: total * 0.25,
      },
      { sku: 'OPS-SEATS', name: 'Operations seats', quantity: 12, unitPrice: (total * 0.75) / 12 },
    ],
    timeline: [
      'Created',
      'Validated',
      status === 'completed' ? 'Closed' : 'Awaiting next operation',
    ],
  };
}

function payment(
  id: string,
  orderId: string,
  customerName: string,
  amount: number,
  status: Payment['status'],
  method: Payment['method'],
  dueDate: string,
  paidAt?: string,
): Payment {
  return { id, orderId, customerName, amount, status, method, dueDate, paidAt };
}
