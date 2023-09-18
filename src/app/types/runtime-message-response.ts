import { TabReload } from './tab-reload.type';

export type RuntimeMessageResponse = Omit<TabReload, 'interval'>;
