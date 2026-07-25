import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden-page',
  imports: [RouterLink],
  template: `
    <article class="empty-state">
      <p class="eyebrow">403</p>
      <h1>Access denied</h1>
      <p>
        Your current role cannot access this area. The API remains responsible for final
        authorization.
      </p>
      <a class="primary-button" routerLink="/">Return to dashboard</a>
    </article>
  `,
})
export class ForbiddenPageComponent {}
