import { TestBed } from '@angular/core/testing';

import { DemoRepositoryService } from './demo-repository.service';

describe('DemoRepositoryService', () => {
  it('filters customers by search and status', async () => {
    const repository = TestBed.inject(DemoRepositoryService);
    const result = await repository.listCustomers({ search: 'northwind', status: 'active' });
    expect(result.total).toBe(1);
    expect(result.items[0]?.companyName).toContain('Northwind');
  });

  it('persists saved demo customers in memory', async () => {
    const repository = TestBed.inject(DemoRepositoryService);
    await repository.saveCustomer({
      id: 'c-test',
      companyName: 'Test Customer',
      segment: 'Technology',
      contactName: 'Test User',
      email: 'test@example.com',
      city: 'São Paulo',
      status: 'active',
      lifetimeValue: 0,
      createdAt: '2026-07-25',
    });
    const result = await repository.listCustomers({ search: 'Test Customer' });
    expect(result.total).toBe(1);
  });

  it('paginates customers without loading every record into the returned page', async () => {
    const repository = TestBed.inject(DemoRepositoryService);
    const result = await repository.listCustomers({ page: 2, pageSize: 2 });

    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(2);
    expect(result.items.length).toBe(2);
    expect(result.total).toBeGreaterThan(result.items.length);
  });

  it('filters orders by status and exposes details', async () => {
    const repository = TestBed.inject(DemoRepositoryService);
    const result = await repository.listOrders({ status: 'processing' });

    expect(result.items.every((order) => order.status === 'processing')).toBe(true);
    expect(result.items[0]?.items.length).toBeGreaterThan(0);
    expect(result.items[0]?.timeline.length).toBeGreaterThan(0);
  });

  it('filters payments by status', async () => {
    const repository = TestBed.inject(DemoRepositoryService);
    const result = await repository.listPayments({ status: 'pending' });

    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((payment) => payment.status === 'pending')).toBe(true);
  });

  it('loads dashboard summary with coherent derived data', async () => {
    const repository = TestBed.inject(DemoRepositoryService);
    const summary = await repository.dashboard();

    expect(summary.orders).toBeGreaterThan(0);
    expect(summary.orderStatus.reduce((sum, item) => sum + item.value, 0)).toBe(summary.orders);
    expect(summary.pendingPaymentList.every((payment) => payment.status === 'pending')).toBe(true);
  });
});
