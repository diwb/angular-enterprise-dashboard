import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule],
  template: `
    <section class="page-header">
      <p class="eyebrow">Profile</p>
      <h1>Preferences</h1>
      <p class="muted">Only non-sensitive display preferences are persisted locally.</p>
    </section>

    <div class="split-grid">
      <section class="card">
        <div class="section-heading"><h2>Signed-in user</h2></div>
        <p>
          <strong>{{ auth.user()?.name }}</strong>
        </p>
        <p class="muted">{{ auth.user()?.email }} · {{ auth.roleLabel() }}</p>
        <button class="danger-button" type="button" (click)="auth.logout()">Sign out</button>
      </section>
      <section class="card">
        <div class="section-heading">
          <h2>Display</h2>
          <span aria-live="polite">{{ saved() }}</span>
        </div>
        <form [formGroup]="form" class="stack-form">
          <label
            >Theme
            <select formControlName="theme" (change)="save()">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label
            >Density
            <select formControlName="density" (change)="save()">
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </label>
        </form>
      </section>
    </div>
  `,
})
export class ProfilePageComponent {
  readonly saved = signal('');
  readonly form = new FormGroup({
    theme: new FormControl(localStorage.getItem('aed.theme') || 'light', { nonNullable: true }),
    density: new FormControl(localStorage.getItem('aed.density') || 'comfortable', {
      nonNullable: true,
    }),
  });

  constructor(public readonly auth: AuthService) {
    this.applyTheme();
  }

  save(): void {
    localStorage.setItem('aed.theme', this.form.controls.theme.value);
    localStorage.setItem('aed.density', this.form.controls.density.value);
    this.applyTheme();
    this.saved.set('Saved');
    setTimeout(() => this.saved.set(''), 1400);
  }

  private applyTheme(): void {
    document.documentElement.dataset['theme'] = this.form.controls.theme.value;
    document.documentElement.dataset['density'] = this.form.controls.density.value;
  }
}
