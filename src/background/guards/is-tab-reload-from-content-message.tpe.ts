import { RuntimeMessageIsTabReloadFromContent } from 'src/app/types/runtime-message-is-tab-reload-from-content.type';
import { RuntimeMessages } from '../types/runtime-messages.type';

export const isTabReloadFromContentMessage = (
  value: RuntimeMessages
): value is RuntimeMessageIsTabReloadFromContent => {
  return value.message === 'isReloadingFromContent';
};
