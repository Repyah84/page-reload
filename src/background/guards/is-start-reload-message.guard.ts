import { RuntimeStarReloadMessage } from 'src/app/types/runtime-start-reload-message.type';
import { RuntimeMessages } from '../types/runtime-messages.type';

/**
 * RuntimeMessages guard
 * @param value
 * @returns
 */
export const isStartReloadMessage = (
  value: RuntimeMessages
): value is RuntimeStarReloadMessage => {
  return value.message === 'startReload';
};
