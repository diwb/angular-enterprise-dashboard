import { CurrencyPipe, PercentPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';

import { DemoRepositoryService } from '../../core/data/demo-repository.service';
import { ChartCardComponent } from '../../shared/components/chart-card.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { DashboardSummary } from '../../shared/models/enterprise.models';

@Component({
  selector: 'app-dashboard-page',
  imports: [CurrencyPipe, PercentPipe, ChartCardComponent, StatusBadgeComponent],
  template: `
    <section class="page-header">
      <p class="eyebrow">Executive overview</p>
      <h1>Commercial operations dashboard</h1>
      <p class="muted">
        Track revenue, orders, pending cash collection, and recent operational activity.
      </p>
    </section>

    @if (loading()) {
      <div class="skeleton-grid" aria-label="Loading dashboard">
        <span></span><span></span><span></span><span></span>
      </div>
    } @else if (error()) {
      <article class="empty-state" role="alert">
        <h2>Dashboard unavailable</h2>
        <p>{{ error() }}</p>
        <button class="secondary-button" type="button" (click)="load()">Try again</button>
      </article>
    } @else if (summary()) {
      <div class="kpi-grid">
        <article class="card kpi">
          <span>Revenue</span><strong>{{ summary()!.revenue | currency }}</strong
          ><small>{{ summary()!.revenueDelta / 100 | percent }} vs prior period</small>
        </article>
        <article class="card kpi">
          <span>Orders</span><strong>{{ summary()!.orders }}</strong
          ><small>{{ summary()!.ordersDelta / 100 | percent }} vs prior period</small>
        </article>
        <article class="card kpi">
          <span>Pending payments</span><strong>{{ summary()!.pendingPayments }}</strong
          ><small>Requires follow-up</small>
        </article>
        <article class="card kpi">
          <span>Active customers</span><strong>{{ summary()!.activeCustomers }}</strong
          ><small>Healthy accounts</small>
        </article>
      </div>

      <div class="dashboard-grid">
        <app-chart-card
          title="Revenue trend"
          [labels]="trendLabels()"
          [values]="trendValues()"
          summary="Monthly revenue trend increased from February to July."
        />
        <app-chart-card
          title="Orders by status"
          type="pie"
          [labels]="statusLabels()"
          [values]="statusValues()"
          summary="Orders are distributed across draft, processing, shipped, completed and cancelled states."
        />
      </div>

      <div class="dashboard-grid">
        <section class="card">
          <div class="section-heading"><h2>Pending payments</h2></div>
          <div class="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (payment of summary()!.pendingPaymentList; track payment.id) {
                  <tr>
                    <td>{{ payment.customerName }}</td>
                    <td>{{ payment.amount | currency }}</td>
                    <td><app-status-badge [status]="payment.status" /></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
        <section class="card activity-list">
          <div class="section-heading"><h2>Recent activity</h2></div>
          @for (activity of summary()!.activities; track activity.id) {
            <article>
              <strong>{{ activity.actor }}</strong>
              <p>{{ activity.message }}</p>
              <small>{{ activity.createdAt }}</small>
            </article>
          }
        </section>
      </div>
    }
  `,
})
export class DashboardPageComponent {
  readonly loading = signal(true);
  readonly error = signal('');
  readonly summary = signal<DashboardSummary | null>(null);
  readonly trendLabels = computed(
    () => this.summary()?.revenueTrend.map((point) => point.label) ?? [],
  );
  readonly trendValues = computed(
    () => this.summary()?.revenueTrend.map((point) => point.value) ?? [],
  );
  readonly statusLabels = computed(
    () => this.summary()?.orderStatus.map((point) => point.label) ?? [],
  );
  readonly statusValues = computed(
    () => this.summary()?.orderStatus.map((point) => point.value) ?? [],
  );

  constructor(private readonly repository: DemoRepositoryService) {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      this.summary.set(await this.repository.dashboard());
    } catch {
      this.error.set('The dashboard service returned an unexpected error.');
    } finally {
      this.loading.set(false);
    }
  }
}
