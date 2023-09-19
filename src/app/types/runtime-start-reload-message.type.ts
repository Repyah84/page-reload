import { RuntimeMessage } from './runtime-message.type';
import { RuntimeStartReloadMessageData } from './runtime-start-reload-message-data.type';

export interface RuntimeStarReloadMessage extends RuntimeMessage {
  data: RuntimeStartReloadMessageData;
}
