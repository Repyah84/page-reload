import { RuntimeSetDocumentText } from 'src/app/types/runtime-message-set-document-text.type';
import { RuntimeMessages } from '../types/runtime-messages.type';

export const isSetDocumentTextFromContentMessage = (
  value: RuntimeMessages
): value is RuntimeSetDocumentText => {
  return value.message === 'setDocumentTexFrommContent';
};
