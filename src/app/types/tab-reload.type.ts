import { RuntimeMessageStartReloadData } from './runtime-message-start-reload-data.type';

export interface TabReload extends RuntimeMessageStartReloadData {
  startReloadDate: number;
  interval: ReturnType<typeof setInterval> | null;
  isReload: boolean;
  notificationId: string | null;
}
