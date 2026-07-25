import { Routes } from '@angular/router';

import { authGuard, permissionGuard } from './core/auth/auth.guard';
import { ShellComponent } from './core/layout/shell.component';
import { ForbiddenPageComponent } from './features/errors/forbidden-page.component';
import { NotFoundPageComponent } from './features/errors/not-found-page.component';
import { LoginPageComponent } from './features/login/login-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./features/dashboard/dashboard-page.component').then(
            (m) => m.DashboardPageComponent,
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customers-page.component').then(
            (m) => m.CustomersPageComponent,
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/orders-page.component').then((m) => m.OrdersPageComponent),
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/payments/payments-page.component').then(
            (m) => m.PaymentsPageComponent,
          ),
      },
      {
        path: 'users',
        canActivate: [permissionGuard('users:read')],
        loadComponent: () =>
          import('./features/users/users-page.component').then((m) => m.UsersPageComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/profile/profile-page.component').then((m) => m.ProfilePageComponent),
      },
      { path: '403', component: ForbiddenPageComponent },
    ],
  },
  { path: '**', component: NotFoundPageComponent },
];
