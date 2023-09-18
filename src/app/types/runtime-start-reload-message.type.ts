import { RuntimeMessage } from './runtime-message.type';

export interface RuntimeStarReloadMessage extends RuntimeMessage {
  data: {
    tabId: number;
    interval: number;
  };
}
