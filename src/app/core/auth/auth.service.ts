import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { demoUsers } from '../demo/demo-data';
import { Permission, Session, User } from '../../shared/models/enterprise.models';

const storageKey = 'aed.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionState = signal<Session | null>(this.restore());
  readonly session = this.sessionState.asReadonly();
  readonly user = computed(() => this.sessionState()?.user ?? null);
  readonly isAuthenticated = computed(() => {
    const session = this.sessionState();
    return Boolean(session && new Date(session.expiresAt).getTime() > Date.now());
  });

  constructor(private readonly router: Router) {}

  async login(email: string): Promise<Session> {
    const user = demoUsers.find((candidate) => candidate.email === email);
    if (!user) {
      throw new Error('Invalid demo credentials. Use one of the documented demo accounts.');
    }

    const session: Session = {
      user,
      accessToken: `demo-token-${user.id}`,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    };
    this.sessionState.set(session);
    localStorage.setItem(storageKey, JSON.stringify(session));
    return session;
  }

  logout(): void {
    this.sessionState.set(null);
    localStorage.removeItem(storageKey);
    void this.router.navigateByUrl('/login');
  }

  can(permission: Permission): boolean {
    return this.user()?.permissions.includes(permission) ?? false;
  }

  roleLabel(user: User | null = this.user()): string {
    return user?.role.replace(/([a-z])([A-Z])/g, '$1 $2') ?? 'Guest';
  }

  private restore(): Session | null {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const session = JSON.parse(raw) as Session;
      return new Date(session.expiresAt).getTime() > Date.now() ? session : null;
    } catch {
      localStorage.removeItem(storageKey);
      return null;
    }
  }
}
