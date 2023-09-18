import { RuntimeMessage } from './runtime-message.type';

export interface RuntimeSetDocumentText extends RuntimeMessage {
  documentText: string;
}
