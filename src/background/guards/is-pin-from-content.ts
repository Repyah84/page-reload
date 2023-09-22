import { RuntimeMessagePinFromContent } from 'src/app/types/runtime-message-pin-from-content.type';
import { RuntimeMessages } from 'src/app/types/runtime-messages.type';

export const isPinFromContent = (
  value: RuntimeMessages
): value is RuntimeMessagePinFromContent => {
  return value.message === 'pinFromContent';
};
