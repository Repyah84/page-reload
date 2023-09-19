import { RuntimeStopReloadMessage } from 'src/app/types/runtime-stop-reload-message.type';
import { RuntimeMessages } from '../types/runtime-messages.type';

/**
 * RuntimeMessages guard
 * @param value
 * @returns
 */
export const isStopReloadMessage = (
  value: RuntimeMessages
): value is RuntimeStopReloadMessage => {
  return value.message === 'stopReload';
};