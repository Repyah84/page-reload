// chrome.runtime.onInstalled.addListener((details) => {
//   console.log('#####################', details);

//   if (details.reason !== 'install' && details.reason !== 'update') return;

//   chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log(
//       'onMESSAGE',
//       sender.tab
//         ? 'from a content script:' + sender.tab.url
//         : 'from the extension'
//     );

//     if (request.message === 'data') {
//       console.log('DATA', request.data);

//       sendResponse({ farewell: 'data was' });
//     }
//   });
// });

// console.log('BACK', chrome);

import { TabReload } from '../app/types/tab-reload.type';
import { RuntimeMessages } from './types/runtime-messages.type';
import { isReloadingMessage } from './guards/is-reloading-message.guard';
import { getTabReloadResponse } from './utils/get-tab-reload-response.type';
import { isStartReloadMessage } from './guards/is-start-reload-message.guard';
import { isStopReloadMessage } from './guards/is-stop-reload-message.guard';
import { isTabReloadFromContentMessage } from './guards/is-tab-reload-from-content-message.tpe';
import { isSetDocumentTextMessage } from './guards/is-set-document-text-message';

const reloadTabList = new Map<number, TabReload>();

const parsDocumentText = (value: string): void => {
  console.log(value);
};

const isReloading = (tabId: number): TabReload | undefined => {
  return reloadTabList.get(tabId);
};

const setTabReload = (tabId: number, interval: number): TabReload => {
  let tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    tab = {
      tabId,
      intervalCount: interval,
      startReloadDate: Date.now(),
      interval: setInterval(() => {
        chrome.tabs.reload(tabId);
      }, interval),
    };

    reloadTabList.set(tabId, tab);
  }

  return tab;
};

const deleteTabReload = (tabId: number): void => {
  const tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    return;
  }

  clearInterval(tab.interval);

  reloadTabList.delete(tabId);
};

chrome.runtime.onMessage.addListener(
  (request: RuntimeMessages, sender, sendResponse) => {
    console.log('onMessage.addListener', sender);

    if (isReloadingMessage(request)) {
      const tab = isReloading(request.tabId);

      sendResponse(getTabReloadResponse(tab));
    }

    if (isStartReloadMessage(request)) {
      const {
        data: { tabId, interval },
      } = request;

      const tab = setTabReload(tabId, interval);

      sendResponse(getTabReloadResponse(tab));
    }

    if (isStopReloadMessage(request)) {
      const { tabId } = request;

      deleteTabReload(tabId);

      sendResponse({ farewell: `Tab ${tabId} was deleted` });
    }

    if (!sender.tab?.id) {
      return;
    }

    if (isTabReloadFromContentMessage(request)) {
      sendResponse(!!isReloading(sender.tab.id));
    }

    if (isSetDocumentTextMessage(request)) {
      const { documentText } = request;

      parsDocumentText(documentText);

      sendResponse('document parsed');
    }
  }
);
