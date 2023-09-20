import { RuntimeMessageStartReloadData } from './runtime-message-start-reload-data.type';

export interface TabReload extends RuntimeMessageStartReloadData {
  startReloadDate: number | null;
  interval: ReturnType<typeof setInterval> | null;
}
