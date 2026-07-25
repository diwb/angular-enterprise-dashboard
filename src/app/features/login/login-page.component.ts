import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  template: `
    <main class="login-page">
      <section class="login-card">
        <p class="eyebrow">Demo workspace</p>
        <h1>Sign in to Enterprise Operations</h1>
        <p class="muted">Use a fictitious account. No real credentials are required or stored.</p>
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <label for="email">Email</label>
          <select id="email" formControlName="email">
            <option value="admin@example.com">admin@example.com — Admin</option>
            <option value="manager@example.com">manager@example.com — Operations Manager</option>
            <option value="analyst@example.com">analyst@example.com — Analyst</option>
          </select>
          @if (error()) {
            <p class="form-error" role="alert">{{ error() }}</p>
          }
          <button class="primary-button" type="submit" [disabled]="form.invalid || loading()">
            {{ loading() ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>
      </section>
    </main>
  `,
})
export class LoginPageComponent {
  readonly loading = signal(false);
  readonly error = signal('');
  readonly form = new FormGroup({
    email: new FormControl('admin@example.com', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
  });

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  async submit(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.login(this.form.controls.email.value);
      await this.router.navigateByUrl('/');
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Unable to sign in.');
    } finally {
      this.loading.set(false);
    }
  }
}
