import { RuntimeMessageStarReload } from 'src/app/types/runtime-message-start-reload.type';
import { RuntimeMessages } from '../../app/types/runtime-messages.type';

export const isStartReloadMessage = (
  value: RuntimeMessages
): value is RuntimeMessageStarReload => {
  return value.message === 'startReload';
};
