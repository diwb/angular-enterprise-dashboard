import { DemoRepositoryService } from '../../core/data/demo-repository.service';
import { CustomersPageComponent } from './customers-page.component';

describe('CustomersPageComponent state and form', () => {
  let component: CustomersPageComponent;

  beforeEach(async () => {
    component = new CustomersPageComponent(new DemoRepositoryService());
    await component.load();
  });

  it('loads, filters and clears customer results', async () => {
    component.filters.controls.search.setValue('Northwind');
    await component.load();

    expect(component.result()?.total).toBe(1);
    expect(component.result()?.items[0]?.companyName).toContain('Northwind');

    component.clearFilters();
    await Promise.resolve();

    expect(component.filters.getRawValue()).toEqual({ search: '', status: '' });
  });

  it('validates required customer form fields', async () => {
    await component.save();

    expect(component.form.touched).toBe(true);
    expect(component.result()?.items.some((customer) => customer.companyName === '')).toBe(false);
  });

  it('edits and saves a customer without losing list state', async () => {
    const customer = component.result()?.items[0];
    expect(customer).toBeTruthy();

    component.edit(customer!);
    expect(component.editing()).toBe(true);
    component.form.controls.city.setValue('Florianópolis');
    await component.save();

    component.filters.controls.search.setValue(customer!.companyName);
    await component.load();

    expect(component.result()?.items[0]?.city).toBe('Florianópolis');
    expect(component.editing()).toBe(false);
  });
});
