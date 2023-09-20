import { RuntimeMessageSetDocumentText } from 'src/app/types/runtime-message-set-document-text.type';
import { RuntimeMessages } from '../../app/types/runtime-messages.type';

export const isSetDocumentTextFromContentMessage = (
  value: RuntimeMessages
): value is RuntimeMessageSetDocumentText => {
  return value.message === 'setDocumentTexFrommContent';
};
