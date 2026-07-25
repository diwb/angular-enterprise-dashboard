import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DemoRepositoryService } from '../../core/data/demo-repository.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { PageResult, Payment } from '../../shared/models/enterprise.models';

@Component({
  selector: 'app-payments-page',
  imports: [CurrencyPipe, ReactiveFormsModule, StatusBadgeComponent],
  template: `
    <section class="page-header">
      <p class="eyebrow">Payments</p>
      <h1>Cash collection monitor</h1>
      <p class="muted">
        Follow pending, approved, declined, and refunded payments with recoverable filters.
      </p>
    </section>

    <div class="kpi-grid">
      <article class="card kpi">
        <span>Open amount</span><strong>{{ openAmount() | currency }}</strong
        ><small>Pending invoices</small>
      </article>
      <article class="card kpi">
        <span>Approved</span><strong>{{ approvedCount() }}</strong
        ><small>Completed payments</small>
      </article>
      <article class="card kpi">
        <span>Exceptions</span><strong>{{ exceptionCount() }}</strong
        ><small>Declined or refunded</small>
      </article>
    </div>

    <section class="card toolbar" [formGroup]="filters">
      <label
        >Search
        <input
          type="search"
          formControlName="search"
          placeholder="Payment, order or customer"
          (input)="load()"
      /></label>
      <label
        >Status
        <select formControlName="status" (change)="load()">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="declined">Declined</option>
          <option value="refunded">Refunded</option>
        </select>
      </label>
    </section>

    <section class="card">
      <div class="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Payment</th>
              <th>Order</th>
              <th>Customer</th>
              <th>Method</th>
              <th>Due</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            @for (payment of result()?.items ?? []; track payment.id) {
              <tr>
                <td>
                  <strong>{{ payment.id }}</strong>
                </td>
                <td>{{ payment.orderId }}</td>
                <td>{{ payment.customerName }}</td>
                <td>{{ payment.method }}</td>
                <td>{{ payment.dueDate }}</td>
                <td>{{ payment.amount | currency }}</td>
                <td><app-status-badge [status]="payment.status" /></td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7">No payments match the current filters.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class PaymentsPageComponent {
  readonly result = signal<PageResult<Payment> | null>(null);
  readonly openAmount = computed(() =>
    (this.result()?.items ?? [])
      .filter((payment) => payment.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0),
  );
  readonly approvedCount = computed(
    () => (this.result()?.items ?? []).filter((payment) => payment.status === 'approved').length,
  );
  readonly exceptionCount = computed(
    () =>
      (this.result()?.items ?? []).filter(
        (payment) => payment.status === 'declined' || payment.status === 'refunded',
      ).length,
  );
  readonly filters = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    status: new FormControl('', { nonNullable: true }),
  });

  constructor(private readonly repository: DemoRepositoryService) {
    void this.load();
  }

  async load(): Promise<void> {
    this.result.set(
      await this.repository.listPayments({
        search: this.filters.controls.search.value,
        status: this.filters.controls.status.value,
      }),
    );
  }
}
