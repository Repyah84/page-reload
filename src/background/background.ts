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
import { isPinFromContent } from './guards/is-pin-from-content';

const reloadTabList = new Map<number, TabReload>();

const notification = new Map<string, string>();

const sendNotification = (tabId: number, message: string): void => {
  chrome.notifications.getPermissionLevel((permission) => {
    if (permission === 'granted') {
      chrome.notifications.create(
        {
          type: 'basic',
          iconUrl: 'icons/reload256.png',
          title: 'Found coincidences',
          message,
        },
        (notificationId) => {
          const notificationKey = `${tabId}-${Date.now()}`;

          notification.set(notificationKey, notificationId);
        }
      );
    }
  });
};

const getTabReload = (tabId: number): TabReload => {
  const tabReload = reloadTabList.get(tabId);

  if (tabReload === undefined) {
    throw new Error(`Tad ${tabId} is not exist`);
  }

  return tabReload;
};

const getTabReloadForResponse = (tabId: number): TabReload | null =>
  reloadTabList.get(tabId) || null;

const pin = (tabId: number): string => {
  const tabReload = getTabReload(tabId);

  tabReload.interval.run();

  return `Tab is going reload`;
};

const changeReloadingStateBySearchResult = (
  tabId: number,
  documentText: string
): string => {
  const tabReload = getTabReload(tabId);

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

    tabReload.interval.run();

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

    return `There are ${resultSearch.length} coincidences in Tab: ${tabId} stop refresh`;
  }

  tabReload.interval.run();

  return `There are ${resultSearch.length} coincidences in Tab: ${tabId}`;
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
      interval: new HostInterval(tabId, intervalCount),
    };

    reloadTabList.set(tabId, tab);
  }

  tab.interval.run();

  return tab;
};

const stopReload = (tabId: number): string => {
  const tabReload = getTabReload(tabId);

  tabReload.interval.stop();

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

    if (isPinFromContent(request)) {
      sendResponse(pin(tabId));
    }

    if (isTabReloadFromContentMessage(request)) {
      sendResponse(getTabReloadForResponse(tabId));
    }

    if (isSetDocumentTextFromContentMessage(request)) {
      sendResponse(
        changeReloadingStateBySearchResult(tabId, request.documentText)
      );
    }
  }
);

chrome.notifications.onClicked.addListener((notificationId) => {
  notification.forEach((not, notKey) => {
    if (not === notificationId) {
      const tabId = Number(notKey.split('-')[0]);

      chrome.tabs.update(tabId, { active: true }, () => {
        notification.delete(notKey);
      });
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (reloadTabList.get(tabId) === undefined) {
    return;
  }

  stopReload(tabId);
});
