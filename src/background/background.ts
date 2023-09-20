import { TabReload } from '../app/types/tab-reload.type';
import { RuntimeMessages } from '../app/types/runtime-messages.type';
import { isReloadingMessage } from './guards/is-reloading-message.guard';
import { getTabReloadResponse } from './utils/get-tab-reload-response.type';
import { isStartReloadMessage } from './guards/is-start-reload-message.guard';
import { isStopReloadMessage } from './guards/is-stop-reload-message.guard';
import { isTabReloadFromContentMessage } from './guards/is-tab-reload-from-content-message.tpe';
import { isSetDocumentTextFromContentMessage } from './guards/is-set-document-text-from-content-message';
import { RuntimeMessageStartReloadData } from '../app/types/runtime-message-start-reload-data.type';
import { searchTextInDocument } from './utils/search-text-in-document';
import { updateTabState as updateState } from './utils/update-tab-state';

const reloadTabList = new Map<number, TabReload>();

const notification = new Map<number, string>();

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
          notification.set(tabId, notificationId);
        }
      );
    }
  });
};

const changeReloadingStateBySearchResult = (
  tabId: number,
  documentText: string
) => {
  const tabReload = reloadTabList.get(tabId);

  if (tabReload === undefined) {
    throw new Error(`Tad ${tabId} is not exist`);
  }

  const { searchText } = tabReload;

  const resultSearch = searchTextInDocument(searchText, documentText);

  if (resultSearch === null) {
    if (
      tabReload.showNotificationThen === 'notFound' &&
      tabReload.hasNotification
    ) {
      sendNotification(
        tabId,
        `There aren't ${tabReload.searchText} coincidences in Tab: ${tabId}`
      );
    }

    return `There aren't coincidences in Tab: ${tabId}`;
  }

  if (tabReload.showNotificationThen === 'found' && tabReload.hasNotification) {
    sendNotification(
      tabId,
      `"${tabReload.searchText}" found :${resultSearch.length} coincidences`
    );
  }

  if (tabReload.isTextFoundStopRefresh) {
    stopReload(tabId);
  }

  return `There are ${resultSearch.length} coincidences in Tab: ${tabId}`;
};

const isReloadingState = (tabId: number): TabReload | undefined => {
  return reloadTabList.get(tabId);
};

const startReload = ({
  tabId,
  intervalCount,
  ...data
}: RuntimeMessageStartReloadData): TabReload => {
  let tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    tab = {
      ...data,
      tabId,
      intervalCount,
      isReload: true,
      startReloadDate: Date.now(),
      interval: setInterval(() => {
        chrome.tabs.reload(tabId);
      }, intervalCount),
    };

    reloadTabList.set(tabId, tab);
  }

  return tab;
};

const stopReload = (tabId: number): string => {
  const tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    return `Tad ${tab} is not exist`;
  }

  if (tab.interval !== null) {
    clearInterval(tab.interval);
  }

  reloadTabList.delete(tabId);

  changeStore(tabId);

  return `Reload Tab ${tabId} stop`;
};

const changeStore = (tabId: number) => {
  chrome.storage.session.get((items) => {
    const storeDAta: RuntimeMessageStartReloadData | undefined = items[tabId];

    if (storeDAta === undefined) {
      return;
    }

    const storeNewData = updateState(storeDAta, { isReload: false });

    void chrome.storage.session.set({ [tabId]: storeNewData });
  });
};

chrome.runtime.onMessage.addListener(
  (request: RuntimeMessages, sender, sendResponse) => {
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
      sendResponse(
        changeReloadingStateBySearchResult(tabId, request.documentText)
      );
    }
  }
);

chrome.notifications.onClicked.addListener((notificationId) => {
  notification.forEach((not, tabId) => {
    if (not === notificationId) {
      void chrome.tabs.update(tabId, { active: true });
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  stopReload(tabId);
});
