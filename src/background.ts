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

import { RuntimeStopReloadMessage } from './app/types/runtime-stop-reload-message.type';
import { RuntimeStarReloadMessage } from './app/types/runtime-start-reload-message.type';

type RuntimeMessages = RuntimeStarReloadMessage | RuntimeStopReloadMessage;

interface Tab {
  tabId: number;
  intervalCount: number;
  interval: ReturnType<typeof setInterval>;
}
/**
 * List of Tab
 */
const reloadTabList = new Map<number, Tab>();
/**
 * RuntimeMessages guard
 * @param value
 * @returns
 */
const isStartReloadMessage = (
  value: RuntimeMessages
): value is RuntimeStarReloadMessage => {
  return value.message === 'startReload';
};
/**
 * RuntimeMessages guard
 * @param value
 * @returns
 */
const isStopReloadMessage = (
  value: RuntimeMessages
): value is RuntimeStopReloadMessage => {
  return value.message === 'stopReload';
};
/**
 * Add tab to list reload event
 * @param tabId
 * @param interval
 * @returns
 */
const setTabReload = (tabId: number, interval: number): Tab => {
  let tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    tab = {
      tabId,
      intervalCount: interval,
      interval: setInterval(() => {
        chrome.tabs.reload(tabId);
      }, interval),
    };

    reloadTabList.set(tabId, tab);
  }

  return tab;
};
/**
 * Delete tab from list reload event
 * @param tabId
 * @returns
 */
const deleteTabReload = (tabId: number): void => {
  const tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    return;
  }

  clearInterval(tab.interval);

  reloadTabList.delete(tabId);
};
/**
 * Chrome runtime message
 * @type<RuntimeSetTab | RuntimeStopReloadMessage>
 */
chrome.runtime.onMessage.addListener(
  (request: RuntimeMessages, sender, sendResponse) => {
    console.log(sender);

    if (isStartReloadMessage(request)) {
      const {
        data: { tabId, interval },
      } = request;

      setTabReload(tabId, interval);

      sendResponse({ farewell: `Tab ${tabId} was dded` });
    }

    if (isStopReloadMessage(request)) {
      const { tabId } = request;

      deleteTabReload(tabId);

      sendResponse({ farewell: `Tab ${tabId} was deleted` });
    }
  }
);
