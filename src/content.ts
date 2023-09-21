import { RuntimeMessageIsTabReloadFromContent } from './app/types/runtime-message-is-tab-reload-from-content.type';
import { RuntimeMessageSetDocumentText } from './app/types/runtime-message-set-document-text.type';

const messageIsTabReload = async (
  data: RuntimeMessageIsTabReloadFromContent
): Promise<boolean> => {
  return chrome.runtime.sendMessage<
    RuntimeMessageIsTabReloadFromContent,
    boolean
  >(data);
};

const messageSetDOcumentText = async (
  data: RuntimeMessageSetDocumentText
): Promise<string> => {
  return chrome.runtime.sendMessage<RuntimeMessageSetDocumentText, string>(
    data
  );
};

const windowEvent = async () => {
  const isTabReload = await messageIsTabReload({
    message: 'isReloadingFromContent',
  });

  if (!isTabReload) {
    console.log('Tab is slip');
  }

  if (isTabReload) {
    const documentText = document.body.textContent;
    console.log('CONTENT', documentText);

    if (documentText !== null) {
      const formatDocumentText = documentText.replace(/\s+/g, ' ');

      const response = await messageSetDOcumentText({
        message: 'setDocumentTexFrommContent',
        documentText: formatDocumentText,
      });

      console.log('CONTENT_RESPONSE', response);
    }
  }

  window.removeEventListener('load', windowEvent);
};

window.addEventListener('load', windowEvent);
