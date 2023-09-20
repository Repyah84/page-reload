import { RuntimeMessage } from './runtime-message.type';

export interface RuntimeMessageStopReload extends RuntimeMessage {
  tabId: number;
}
