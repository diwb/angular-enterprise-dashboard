import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <main class="login-page">
      <article class="empty-state">
        <p class="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The route does not exist or was moved.</p>
        <a class="primary-button" routerLink="/">Return home</a>
      </article>
    </main>
  `,
})
export class NotFoundPageComponent {}
