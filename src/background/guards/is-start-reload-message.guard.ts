import { RuntimeStarReloadMessage } from 'src/app/types/runtime-start-reload-message.type';
import { RuntimeMessages } from '../types/runtime-messages.type';

export const isStartReloadMessage = (
  value: RuntimeMessages
): value is RuntimeStarReloadMessage => {
  return value.message === 'startReload';
};
