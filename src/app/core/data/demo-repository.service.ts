import { Injectable, signal } from '@angular/core';

import {
  buildDashboardSummary,
  demoCustomers,
  demoOrders,
  demoPayments,
  demoUsers,
} from '../demo/demo-data';
import {
  Customer,
  DashboardSummary,
  Order,
  PageResult,
  Payment,
  User,
} from '../../shared/models/enterprise.models';

export interface Query {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

@Injectable({ providedIn: 'root' })
export class DemoRepositoryService {
  readonly demoBanner = signal(true);
  readonly customers = signal([...demoCustomers]);
  readonly orders = signal([...demoOrders]);
  readonly payments = signal([...demoPayments]);
  readonly users = signal([...demoUsers]);

  async dashboard(): Promise<DashboardSummary> {
    await this.latency();
    return buildDashboardSummary();
  }

  async listCustomers(query: Query): Promise<PageResult<Customer>> {
    await this.latency();
    return this.page(this.filter(this.customers(), query), query);
  }

  async saveCustomer(customer: Customer): Promise<Customer> {
    await this.latency();
    const existing = this.customers().some((item) => item.id === customer.id);
    this.customers.update((items) =>
      existing
        ? items.map((item) => (item.id === customer.id ? customer : item))
        : [customer, ...items],
    );
    return customer;
  }

  async listOrders(query: Query): Promise<PageResult<Order>> {
    await this.latency();
    return this.page(this.filter(this.orders(), query), query);
  }

  async listPayments(query: Query): Promise<PageResult<Payment>> {
    await this.latency();
    return this.page(this.filter(this.payments(), query), query);
  }

  async listUsers(query: Query): Promise<PageResult<User>> {
    await this.latency();
    return this.page(this.filter(this.users(), query), query);
  }

  private filter<T>(items: T[], query: Query): T[] {
    const search = query.search?.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch = search ? JSON.stringify(item).toLowerCase().includes(search) : true;
      const matchesStatus = query.status
        ? typeof item === 'object' &&
          item !== null &&
          'status' in item &&
          item.status === query.status
        : true;
      return matchesSearch && matchesStatus;
    });
  }

  private page<T>(items: T[], query: Query): PageResult<T> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    return {
      items: items.slice((page - 1) * pageSize, page * pageSize),
      page,
      pageSize,
      total: items.length,
    };
  }

  private latency(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 220));
  }
}
