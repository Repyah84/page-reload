import { RuntimeMessageIsTabReloadFromContent } from 'src/app/types/runtime-message-is-tab-reload-from-content.type';
import { RuntimeMessageIsReloading } from 'src/app/types/runtime-message-is-reloading.type';
import { RuntimeSetDocumentText } from 'src/app/types/runtime-message-set-document-text.type';
import { RuntimeStarReloadMessage } from 'src/app/types/runtime-start-reload-message.type';
import { RuntimeStopReloadMessage } from 'src/app/types/runtime-stop-reload-message.type';

export type RuntimeMessages =
  | RuntimeStarReloadMessage
  | RuntimeStopReloadMessage
  | RuntimeMessageIsReloading
  | RuntimeMessageIsTabReloadFromContent
  | RuntimeSetDocumentText;
