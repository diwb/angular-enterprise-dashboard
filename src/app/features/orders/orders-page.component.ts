import { CurrencyPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DemoRepositoryService } from '../../core/data/demo-repository.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { Order, PageResult } from '../../shared/models/enterprise.models';

@Component({
  selector: 'app-orders-page',
  imports: [CurrencyPipe, ReactiveFormsModule, StatusBadgeComponent],
  template: `
    <section class="page-header">
      <p class="eyebrow">Orders</p>
      <h1>Sales order operations</h1>
      <p class="muted">Operational visibility into status, totals, items, and timeline events.</p>
    </section>

    <section class="card toolbar" [formGroup]="filters">
      <label
        >Search
        <input
          type="search"
          formControlName="search"
          placeholder="Order or customer"
          (input)="load()"
      /></label>
      <label
        >Status
        <select formControlName="status" (change)="load()">
          <option value="">All</option>
          <option value="draft">Draft</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </label>
    </section>

    <div class="split-grid">
      <section class="card">
        <div class="section-heading">
          <h2>Orders</h2>
          <span>{{ result()?.total ?? 0 }} records</span>
        </div>
        <div class="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
                <th>Due</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (order of result()?.items ?? []; track order.id) {
                <tr>
                  <td>
                    <strong>{{ order.id }}</strong
                    ><small>{{ order.createdAt }}</small>
                  </td>
                  <td>{{ order.customerName }}</td>
                  <td><app-status-badge [status]="order.status" /></td>
                  <td>{{ order.total | currency }}</td>
                  <td>{{ order.dueDate }}</td>
                  <td>
                    <button class="text-button" type="button" (click)="selected.set(order)">
                      Details
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6">No orders match the current filters.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        @if (selected(); as order) {
          <div class="section-heading">
            <h2>{{ order.id }}</h2>
            <app-status-badge [status]="order.status" />
          </div>
          <p class="muted">{{ order.customerName }} · {{ order.total | currency }}</p>
          <h3>Items</h3>
          @for (item of order.items; track item.sku) {
            <div class="detail-row">
              <span>{{ item.name }}</span
              ><strong>{{ item.quantity }} × {{ item.unitPrice | currency }}</strong>
            </div>
          }
          <h3>Timeline</h3>
          <ol class="timeline">
            @for (event of order.timeline; track event) {
              <li>{{ event }}</li>
            }
          </ol>
        } @else {
          <article class="empty-state compact">
            <h2>Select an order</h2>
            <p>Order details and timeline appear here.</p>
          </article>
        }
      </section>
    </div>
  `,
})
export class OrdersPageComponent {
  readonly result = signal<PageResult<Order> | null>(null);
  readonly selected = signal<Order | null>(null);
  readonly filters = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    status: new FormControl('', { nonNullable: true }),
  });

  constructor(private readonly repository: DemoRepositoryService) {
    void this.load();
  }

  async load(): Promise<void> {
    const result = await this.repository.listOrders({
      search: this.filters.controls.search.value,
      status: this.filters.controls.status.value,
    });
    this.result.set(result);
    this.selected.set(result.items[0] ?? null);
  }
}
