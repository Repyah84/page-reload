import { TabReload } from '../app/types/tab-reload.type';
import { RuntimeMessages } from '../app/types/runtime-messages.type';
import { getTabReloadResponse } from './utils/get-tab-reload-response.type';
import { isStartReloadMessage } from './guards/is-start-reload-message.guard';
import { isStopReloadMessage } from './guards/is-stop-reload-message.guard';
import { isTabReloadFromContentMessage } from './guards/is-tab-reload-from-content-message.tpe';
import { isSetDocumentTextFromContentMessage } from './guards/is-set-document-text-from-content-message';
import { RuntimeMessageStartReloadData } from '../app/types/runtime-message-start-reload-data.type';
import { searchTextInDocument } from './utils/search-text-in-document';
import { updateTabState } from './utils/update-tab-state';
import { HostInterval } from './models/host-interval';

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
  console.log('changeReloadingStateBySearchResult', documentText);

  const tabReload = reloadTabList.get(tabId);

  console.log('tabReload', tabReload);

  if (tabReload === undefined) {
    throw new Error(`Tad ${tabId} is not exist`);
  }

  const { searchText } = tabReload;

  const resultSearch = searchTextInDocument(searchText, documentText);

  console.log('resultSearch', resultSearch);

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
  console.log('startReload', data);

  let tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    tab = {
      ...data,
      tabId,
      intervalCount,
      isReload: true,
      startReloadDate: Date.now(),
      interval: new HostInterval(intervalCount),
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

  tab.interval.stop();

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

    const storeNewData = updateTabState(storeDAta, { isReload: false });

    void chrome.storage.session.set({ [tabId]: storeNewData });
  });
};

chrome.runtime.onMessage.addListener(
  (request: RuntimeMessages, sender, sendResponse) => {
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

      notification.delete(tabId);
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  stopReload(tabId);
});
