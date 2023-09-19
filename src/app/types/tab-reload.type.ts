import { RuntimeStartReloadMessageData } from './runtime-start-reload-message-data.type';

export interface TabReload extends RuntimeStartReloadMessageData {
  startReloadDate: number;
  interval: ReturnType<typeof setInterval>;
}
