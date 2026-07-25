import { DashboardPageComponent } from './dashboard-page.component';
import { buildDashboardSummary } from '../../core/demo/demo-data';

describe('DashboardPageComponent state', () => {
  it('loads summary and derives chart series', async () => {
    const component = new DashboardPageComponent({
      dashboard: () => Promise.resolve(buildDashboardSummary()),
    } as never);

    await component.load();

    expect(component.loading()).toBe(false);
    expect(component.error()).toBe('');
    expect(component.trendLabels()).toContain('Jul');
    expect(component.trendValues().length).toBe(component.trendLabels().length);
    expect(component.statusValues().reduce((sum, value) => sum + value, 0)).toBe(
      component.summary()?.orders,
    );
  });

  it('stores recoverable error state when summary loading fails', async () => {
    const component = new DashboardPageComponent({
      dashboard: () => Promise.reject(new Error('offline')),
    } as never);

    await component.load();

    expect(component.loading()).toBe(false);
    expect(component.summary()).toBeNull();
    expect(component.error()).toContain('unexpected error');
  });
});
