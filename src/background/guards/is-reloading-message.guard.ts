import { RuntimeMessageIsReloading } from 'src/app/types/runtime-message-is-reloading.type';
import { RuntimeMessages } from '../../app/types/runtime-messages.type';

export const isReloadingMessage = (
  value: RuntimeMessages
): value is RuntimeMessageIsReloading => {
  return value.message === 'isReloading';
};
