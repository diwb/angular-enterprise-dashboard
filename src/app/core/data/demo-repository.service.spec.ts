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
});
