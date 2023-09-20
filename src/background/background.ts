import { TabReload } from '../app/types/tab-reload.type';
import { RuntimeMessages } from './types/runtime-messages.type';
import { isReloadingMessage } from './guards/is-reloading-message.guard';
import { getTabReloadResponse } from './utils/get-tab-reload-response.type';
import { isStartReloadMessage } from './guards/is-start-reload-message.guard';
import { isStopReloadMessage } from './guards/is-stop-reload-message.guard';
import { isTabReloadFromContentMessage } from './guards/is-tab-reload-from-content-message.tpe';
import { isSetDocumentTextFromContentMessage } from './guards/is-set-document-text-from-content-message';
import { RuntimeMessageStartReloadData } from '../app/types/runtime-message-start-reload-data.type';
import { searchTextInDocument } from './utils/search-text-in-document';
import { updateTabState } from './utils/update-tab-state';

const reloadTabList = new Map<number, TabReload>();

const sendNotification = (tabId: number, message: string): void => {
  chrome.notifications.getPermissionLevel((permission) => {
    if (permission === 'granted') {
      chrome.notifications.create(
        {
          type: 'basic',
          iconUrl: 'favicon.ico',
          title: 'Found coincidences',
          message,
        },
        (notificationId) => {
          const tabReload = reloadTabList.get(tabId);

          if (tabReload !== undefined) {
            reloadTabList.set(
              tabId,
              updateTabState(tabReload, { notificationId })
            );
          }
        }
      );
    }
  });
};

const changeReloadTabBySearchResult = (tabId: number, documentText: string) => {
  const tabReload = reloadTabList.get(tabId);

  if (tabReload === undefined) {
    throw new Error(`Tad ${tabId} is not exist`);
  }

  const { searchText } = tabReload;

  const resultSearch = searchTextInDocument(searchText, documentText);

  if (resultSearch === null) {
    return `There aren't coincidences in Tab: ${tabId}`;
  }

  stopReload(tabId);

  sendNotification(
    tabId,
    `"${tabReload.searchText}" found :${resultSearch.length} coincidences`
  );

  return `There are ${resultSearch.length} coincidences in Tab: ${tabId}`;
};

const isReloadingState = (tabId: number): TabReload | undefined => {
  return reloadTabList.get(tabId);
};

const startReload = ({
  tabId,
  intervalCount,
  searchText,
}: RuntimeMessageStartReloadData): TabReload => {
  const dataTAbReload: TabReload = {
    tabId,
    searchText,
    isReload: true,
    intervalCount,
    notificationId: null,
    startReloadDate: Date.now(),
    interval: setInterval(() => {
      chrome.tabs.reload(tabId);
    }, intervalCount),
  };

  reloadTabList.set(tabId, dataTAbReload);

  return reloadTabList.get(tabId) as TabReload;
};

const stopReload = (tabId: number): string => {
  const tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    throw new Error(`Tad ${tab} is not exist`);
  }

  if (tab.interval !== null) {
    clearInterval(tab.interval);
  }

  reloadTabList.set(
    tabId,
    updateTabState(tab, { interval: null, isReload: false })
  );

  return `Reload Tab ${tabId} stop`;
};

const deleteTabReload = (tabId: number): string => {
  const tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    throw new Error(`Tad ${tab} is not exist`);
  }

  if (tab.interval !== null) {
    clearInterval(tab.interval);
  }

  reloadTabList.delete(tabId);

  return `Tab ${tabId} was deleted`;
};

chrome.runtime.onMessage.addListener(
  (request: RuntimeMessages, sender, sendResponse) => {
    console.log('onMessage.addListener', sender);

    if (isReloadingMessage(request)) {
      sendResponse(getTabReloadResponse(isReloadingState(request.tabId)));
    }

    if (isStartReloadMessage(request)) {
      sendResponse(getTabReloadResponse(startReload(request.data)));
    }

    if (isStopReloadMessage(request)) {
      sendResponse(stopReload(request.tabId));
    }

    const tabId = sender.tab?.id;

    if (tabId === undefined) {
      return;
    }

    if (isTabReloadFromContentMessage(request)) {
      sendResponse(!!isReloadingState(tabId));
    }

    if (isSetDocumentTextFromContentMessage(request)) {
      sendResponse(changeReloadTabBySearchResult(tabId, request.documentText));
    }
  }
);

chrome.notifications.onClicked.addListener((notificationId) => {
  reloadTabList.forEach(async (tab, tabId) => {
    if (tab.notificationId === notificationId) {
      await chrome.tabs.update(tabId, { active: true });

      return;
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  deleteTabReload(tabId);
});
