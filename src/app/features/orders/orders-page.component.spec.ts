import { DemoRepositoryService } from '../../core/data/demo-repository.service';
import { OrdersPageComponent } from './orders-page.component';

describe('OrdersPageComponent state', () => {
  it('loads orders and selects the first order details', async () => {
    const component = new OrdersPageComponent(new DemoRepositoryService());
    await component.load();

    expect(component.result()?.total).toBeGreaterThan(0);
    expect(component.selected()?.items.length).toBeGreaterThan(0);
    expect(component.selected()?.timeline.length).toBeGreaterThan(0);
  });

  it('filters orders by status', async () => {
    const component = new OrdersPageComponent(new DemoRepositoryService());
    component.filters.controls.status.setValue('completed');
    await component.load();

    expect(component.result()?.items.every((order) => order.status === 'completed')).toBe(true);
    expect(component.selected()?.status).toBe('completed');
  });
});
