import { RuntimeMessageStopReload } from 'src/app/types/runtime-message-stop-reload.type';
import { RuntimeMessages } from '../../app/types/runtime-messages.type';

export const isStopReloadMessage = (
  value: RuntimeMessages
): value is RuntimeMessageStopReload => {
  return value.message === 'stopReload';
};
