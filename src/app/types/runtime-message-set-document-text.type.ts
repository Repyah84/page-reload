import { RuntimeMessage } from './runtime-message.type';

export interface RuntimeMessageSetDocumentText extends RuntimeMessage {
  documentText: string;
}
