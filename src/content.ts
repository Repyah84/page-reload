import { RuntimeMessagePinFromContent } from './app/types/runtime-message-pin-from-content.type';
import { RuntimeMessageIsTabReloadFromContent } from './app/types/runtime-message-is-tab-reload-from-content.type';
import { RuntimeMessageSetDocumentText } from './app/types/runtime-message-set-document-text.type';
import { TabReload } from './app/types/tab-reload.type';

let timer: ReturnType<typeof setTimeout> | null = null;

const clineTimer = () => {
  if (timer === null) {
    return;
  }

  clearTimeout(timer);
};

const messageIsTabReload = (
  data: RuntimeMessageIsTabReloadFromContent
): Promise<TabReload | null> =>
  chrome.runtime.sendMessage<
    RuntimeMessageIsTabReloadFromContent,
    TabReload | null
  >(data);

const messageSetDocumentText = (
  data: RuntimeMessageSetDocumentText
): Promise<string> =>
  chrome.runtime.sendMessage<RuntimeMessageSetDocumentText, string>(data);

const messagePin = (data: RuntimeMessagePinFromContent): Promise<string> =>
  chrome.runtime.sendMessage(data);

const windowEvent = () => {
  clineTimer();

  timer = setTimeout(async () => {
    const isTabReload = await messageIsTabReload({
      message: 'isReloadingFromContent',
    });

    if (isTabReload !== null) {
      let response = '';

      if (!!isTabReload.searchText) {
        const documentText = document.body.textContent;

        if (documentText !== null) {
          const formatDocumentText = documentText.replace(/\s+/g, ' ');

          response = await messageSetDocumentText({
            message: 'setDocumentTexFrommContent',
            documentText: formatDocumentText,
          });
        }
      } else {
        response = await messagePin({
          message: 'pinFromContent',
        });
      }

      console.log('CONTENT_RESPONSE', response);
    }

    window.removeEventListener('load', windowEvent);
  }, 300);
};

window.addEventListener('load', windowEvent);
