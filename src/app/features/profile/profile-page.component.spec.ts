import { ProfilePageComponent } from './profile-page.component';

describe('ProfilePageComponent preferences', () => {
  const auth = {
    user: () => ({ name: 'Avery Stone', email: 'admin@example.com' }),
    roleLabel: () => 'Admin',
    logout: vi.fn(),
  };

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-density');
  });

  it('loads and persists non-sensitive theme and density preferences', () => {
    const component = new ProfilePageComponent(auth as never);

    component.form.controls.theme.setValue('dark');
    component.form.controls.density.setValue('compact');
    component.save();

    expect(localStorage.getItem('aed.theme')).toBe('dark');
    expect(localStorage.getItem('aed.density')).toBe('compact');
    expect(document.documentElement.dataset['theme']).toBe('dark');
    expect(document.documentElement.dataset['density']).toBe('compact');
    expect(component.saved()).toBe('Saved');
  });
});
