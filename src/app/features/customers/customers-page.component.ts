import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DemoRepositoryService } from '../../core/data/demo-repository.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';
import { Customer, PageResult } from '../../shared/models/enterprise.models';

@Component({
  selector: 'app-customers-page',
  imports: [CurrencyPipe, ReactiveFormsModule, StatusBadgeComponent],
  template: `
    <section class="page-header">
      <p class="eyebrow">Customers</p>
      <h1>Customer portfolio</h1>
      <p class="muted">
        Search, filter, and maintain B2B customers without coupling UI state to transport details.
      </p>
    </section>

    <section class="card toolbar" [formGroup]="filters">
      <label
        >Search
        <input
          type="search"
          formControlName="search"
          placeholder="Company, city or contact"
          (input)="load()"
      /></label>
      <label
        >Status
        <select formControlName="status" (change)="load()">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>
      <button class="secondary-button" type="button" (click)="clearFilters()">Clear filters</button>
    </section>

    <div class="split-grid">
      <section class="card">
        <div class="section-heading">
          <h2>Customers</h2>
          <span>{{ result()?.total ?? 0 }} records</span>
        </div>
        <div class="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Segment</th>
                <th>City</th>
                <th>Status</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              @for (customer of result()?.items ?? []; track customer.id) {
                <tr>
                  <td>
                    <strong>{{ customer.companyName }}</strong
                    ><small>{{ customer.email }}</small>
                  </td>
                  <td>{{ customer.segment }}</td>
                  <td>{{ customer.city }}</td>
                  <td><app-status-badge [status]="customer.status" /></td>
                  <td>{{ customer.lifetimeValue | currency }}</td>
                  <td>
                    <button class="text-button" type="button" (click)="edit(customer)">Edit</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6">No customers match the current filters.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <div class="section-heading">
          <h2>{{ editing() ? 'Edit customer' : 'Create customer' }}</h2>
        </div>
        <form [formGroup]="form" (ngSubmit)="save()" class="stack-form">
          <label>Company <input formControlName="companyName" /></label>
          <label>Contact <input formControlName="contactName" /></label>
          <label>Email <input formControlName="email" /></label>
          <label>Segment <input formControlName="segment" /></label>
          <label>City <input formControlName="city" /></label>
          <label
            >Status
            <select formControlName="status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          @if (form.invalid && form.touched) {
            <p class="form-error">Please complete all customer fields with a valid email.</p>
          }
          <button class="primary-button" type="submit" [disabled]="form.invalid || saving()">
            {{ saving() ? 'Saving…' : 'Save customer' }}
          </button>
        </form>
      </section>
    </div>
  `,
})
export class CustomersPageComponent {
  readonly result = signal<PageResult<Customer> | null>(null);
  readonly saving = signal(false);
  readonly editing = computed(() => Boolean(this.form.controls.id.value));
  readonly filters = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    status: new FormControl('', { nonNullable: true }),
  });
  readonly form = new FormGroup({
    id: new FormControl('', { nonNullable: true }),
    companyName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    contactName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    segment: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl<Customer['status']>('active', { nonNullable: true }),
  });

  constructor(private readonly repository: DemoRepositoryService) {
    void this.load();
  }

  async load(): Promise<void> {
    this.result.set(
      await this.repository.listCustomers({
        search: this.filters.controls.search.value,
        status: this.filters.controls.status.value,
      }),
    );
  }

  edit(customer: Customer): void {
    this.form.patchValue(customer);
  }

  clearFilters(): void {
    this.filters.reset({ search: '', status: '' });
    void this.load();
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const raw = this.form.getRawValue();
    await this.repository.saveCustomer({
      ...raw,
      id: raw.id || `c-${Date.now()}`,
      lifetimeValue: 0,
      createdAt: new Date().toISOString(),
    });
    this.form.reset({
      id: '',
      companyName: '',
      contactName: '',
      email: '',
      segment: '',
      city: '',
      status: 'active',
    });
    this.saving.set(false);
    await this.load();
  }
}
