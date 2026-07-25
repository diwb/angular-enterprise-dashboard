import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { ChartCardComponent } from './chart-card.component';

describe('ChartCardComponent', () => {
  let fixture: ComponentFixture<ChartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartCardComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    }).compileComponents();
    fixture = TestBed.createComponent(ChartCardComponent);
  });

  it('renders chart title and text alternative', () => {
    fixture.componentRef.setInput('title', 'Revenue trend');
    fixture.componentRef.setInput('labels', ['Jan', 'Feb']);
    fixture.componentRef.setInput('values', [10, 20]);
    fixture.componentRef.setInput('summary', 'Revenue increased from January to February.');
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h2')?.textContent).toContain('Revenue trend');
    expect(element.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe(
      'Revenue increased from January to February.',
    );
    expect(element.textContent).toContain('Revenue increased from January to February.');
  });
});
