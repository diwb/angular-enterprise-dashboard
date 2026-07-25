import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { APP_CONFIG } from '../config/app-config';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell" [class.nav-open]="navOpen()">
      <aside class="sidebar" aria-label="Primary navigation">
        <a class="brand" routerLink="/">
          <span class="brand-mark" aria-hidden="true">EO</span>
          <span>
            <strong>Enterprise Ops</strong>
            <small>Angular dashboard</small>
          </span>
        </a>
        <nav>
          @for (item of navItems(); track item.href) {
            <a
              [routerLink]="item.href"
              routerLinkActive="active"
              [routerLinkActiveOptions]="item.exact ? { exact: true } : { exact: false }"
            >
              <span aria-hidden="true">{{ item.icon }}</span
              >{{ item.label }}
            </a>
          }
        </nav>
      </aside>
      <div class="content-frame">
        <header class="topbar">
          <button
            class="icon-button"
            type="button"
            (click)="navOpen.set(!navOpen())"
            aria-label="Toggle navigation"
          >
            ☰
          </button>
          @if (config.dataMode === 'demo') {
            <span class="demo-pill">Demo mode</span>
          }
          <div class="user-chip">
            <span class="avatar">{{ auth.user()?.avatarInitials }}</span>
            <span>
              <strong>{{ auth.user()?.name }}</strong>
              <small>{{ auth.roleLabel() }}</small>
            </span>
          </div>
        </header>
        <main id="main-content" tabindex="-1">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class ShellComponent {
  readonly navOpen = signal(false);
  readonly config = inject(APP_CONFIG);

  constructor(public readonly auth: AuthService) {}

  readonly navItems = computed(() => [
    { href: '/', label: 'Dashboard', icon: '◇', exact: true },
    { href: '/customers', label: 'Customers', icon: '◌' },
    { href: '/orders', label: 'Orders', icon: '▤' },
    { href: '/payments', label: 'Payments', icon: '◍' },
    ...(this.auth.can('users:read') ? [{ href: '/users', label: 'Users', icon: '◎' }] : []),
    { href: '/profile', label: 'Profile', icon: '◒' },
  ]);
}
