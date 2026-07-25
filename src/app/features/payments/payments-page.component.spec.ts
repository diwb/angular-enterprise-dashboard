import { DemoRepositoryService } from '../../core/data/demo-repository.service';
import { PaymentsPageComponent } from './payments-page.component';

describe('PaymentsPageComponent state', () => {
  it('derives payment summary values from current result set', async () => {
    const component = new PaymentsPageComponent(new DemoRepositoryService());
    await component.load();

    expect(component.openAmount()).toBeGreaterThan(0);
    expect(component.approvedCount()).toBeGreaterThan(0);
    expect(component.exceptionCount()).toBeGreaterThan(0);
  });

  it('filters pending payments and updates derived state', async () => {
    const component = new PaymentsPageComponent(new DemoRepositoryService());
    component.filters.controls.status.setValue('pending');
    await component.load();

    expect(component.result()?.items.every((payment) => payment.status === 'pending')).toBe(true);
    expect(component.approvedCount()).toBe(0);
    expect(component.exceptionCount()).toBe(0);
  });
});
