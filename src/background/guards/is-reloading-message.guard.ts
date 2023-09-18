import { RuntimeMessageIsReloading } from 'src/app/types/runtime-message-is-reloading.type';
import { RuntimeMessages } from '../types/runtime-messages.type';

/**
 * RuntimeMessages guard
 * @param value
 * @returns
 */
export const isReloadingMessage = (
  value: RuntimeMessages
): value is RuntimeMessageIsReloading => {
  return value.message === 'isReloading';
};
