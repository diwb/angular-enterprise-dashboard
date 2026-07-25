import { InjectionToken } from '@angular/core';

export type DataMode = 'demo' | 'api';

export interface RuntimeConfig {
  apiBaseUrl: string;
  dataMode: DataMode;
  appName: string;
  version: string;
}

export const APP_CONFIG = new InjectionToken<RuntimeConfig>('APP_CONFIG', {
  factory: () => ({
    apiBaseUrl: '/api',
    dataMode: 'demo',
    appName: 'Enterprise Operations',
    version: '1.0.0',
  }),
});
