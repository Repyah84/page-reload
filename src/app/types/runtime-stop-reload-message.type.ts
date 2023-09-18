import { RuntimeMessage } from './runtime-message.type';

export interface RuntimeStopReloadMessage extends RuntimeMessage {
  tabId: number;
}
