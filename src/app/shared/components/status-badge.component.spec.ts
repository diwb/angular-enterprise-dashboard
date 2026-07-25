import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StatusBadgeComponent] }).compileComponents();
    fixture = TestBed.createComponent(StatusBadgeComponent);
  });

  it('renders status as accessible text and data attribute', () => {
    fixture.componentRef.setInput('status', 'pending');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.status-badge') as HTMLElement;
    expect(badge.textContent?.trim()).toBe('pending');
    expect(badge.dataset['status']).toBe('pending');
  });

  it('uses an explicit label when provided', () => {
    fixture.componentRef.setInput('status', 'approved');
    fixture.componentRef.setInput('label', 'Paid');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('Paid');
  });
});
