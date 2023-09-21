import { RuntimeMessageIsTabReloadFromContent } from 'src/app/types/runtime-message-is-tab-reload-from-content.type';
import { RuntimeMessageSetDocumentText } from 'src/app/types/runtime-message-set-document-text.type';
import { RuntimeMessageStarReload } from 'src/app/types/runtime-message-start-reload.type';
import { RuntimeMessageStopReload } from 'src/app/types/runtime-message-stop-reload.type';

export type RuntimeMessages =
  | RuntimeMessageStarReload
  | RuntimeMessageStopReload
  | RuntimeMessageIsTabReloadFromContent
  | RuntimeMessageSetDocumentText;
