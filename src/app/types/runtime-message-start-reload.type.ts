import { RuntimeMessage } from './runtime-message.type';
import { RuntimeMessageStartReloadData } from './runtime-message-start-reload-data.type';

export interface RuntimeMessageStarReload extends RuntimeMessage {
  data: RuntimeMessageStartReloadData;
}
