import { Component, signal } from '@angular/core';

import { DemoRepositoryService } from '../../core/data/demo-repository.service';
import { PageResult, User } from '../../shared/models/enterprise.models';

@Component({
  selector: 'app-users-page',
  template: `
    <section class="page-header">
      <p class="eyebrow">Access administration</p>
      <h1>Users and roles</h1>
      <p class="muted">
        Frontend route and action checks demonstrate UX protection; server-side authorization
        remains authoritative.
      </p>
    </section>

    <section class="card">
      <div class="responsive-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Permissions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of result()?.items ?? []; track user.id) {
              <tr>
                <td>
                  <strong>{{ user.name }}</strong
                  ><small>{{ user.email }}</small>
                </td>
                <td>{{ user.role }}</td>
                <td class="permission-list">
                  @for (permission of user.permissions; track permission) {
                    <span>{{ permission }}</span>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `,
})
export class UsersPageComponent {
  readonly result = signal<PageResult<User> | null>(null);

  constructor(private readonly repository: DemoRepositoryService) {
    void this.load();
  }

  async load(): Promise<void> {
    this.result.set(await this.repository.listUsers({}));
  }
}
