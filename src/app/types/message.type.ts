export type Message =
  | 'startReload'
  | 'stopReload'
  | 'isReloading'
  | 'isReloadingFromContent'
  | 'setDocumentTexFrommContent'
  | 'stopReloadFromHost';
