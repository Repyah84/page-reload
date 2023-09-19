import { TabReload } from '../app/types/tab-reload.type';
import { RuntimeMessages } from './types/runtime-messages.type';
import { isReloadingMessage } from './guards/is-reloading-message.guard';
import { getTabReloadResponse } from './utils/get-tab-reload-response.type';
import { isStartReloadMessage } from './guards/is-start-reload-message.guard';
import { isStopReloadMessage } from './guards/is-stop-reload-message.guard';
import { isTabReloadFromContentMessage } from './guards/is-tab-reload-from-content-message.tpe';
import { isSetDocumentTextFromContentMessage } from './guards/is-set-document-text-from-content-message';
import { RuntimeStartReloadMessageData } from '../app/types/runtime-start-reload-message-data.type';

const reloadTabList = new Map<number, TabReload>();

const changeReloadTabDataBySearchResult = (
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
    return `There aren't coincidences in Tab: ${tabId}`;
  }

  deleteTabReload(tabId);

  sendNotification(
    `"${tabReload.searchText}" found :${resultSearch.length} coincidences`
  );

  return `There are ${resultSearch.length} coincidences in Tab: ${tabId}`;
};

const sendNotification = (message: string): void => {
  chrome.notifications.getPermissionLevel((permission) => {
    if (permission === 'granted') {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'favicon.ico',
        title: 'Found coincidences',
        message,
      });
    }
  });
};

const searchTextInDocument = (
  searchText: string,
  documentText: string
): null | string[] => {
  return documentText.match(new RegExp(searchText, 'gi'));
};

const isReloading = (tabId: number): TabReload | undefined => {
  return reloadTabList.get(tabId);
};

const setTabReload = ({
  tabId,
  intervalCount,
  searchText,
}: RuntimeStartReloadMessageData): TabReload => {
  let tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    tab = {
      tabId,
      searchText,
      intervalCount,
      startReloadDate: Date.now(),
      interval: setInterval(() => {
        chrome.tabs.reload(tabId);
      }, intervalCount),
    };

    reloadTabList.set(tabId, tab);
  }

  return tab;
};

const deleteTabReload = (tabId: number): string => {
  const tab = reloadTabList.get(tabId);

  if (tab === undefined) {
    throw new Error(`Tad ${tab} is not exist`);
  }

  clearInterval(tab.interval);

  reloadTabList.delete(tabId);

  return `Tab ${tabId} was deleted`;
};

chrome.runtime.onMessage.addListener(
  (request: RuntimeMessages, sender, sendResponse) => {
    console.log('onMessage.addListener', sender);

    if (isReloadingMessage(request)) {
      sendResponse(getTabReloadResponse(isReloading(request.tabId)));
    }

    if (isStartReloadMessage(request)) {
      sendResponse(getTabReloadResponse(setTabReload(request.data)));
    }

    if (isStopReloadMessage(request)) {
      sendResponse(deleteTabReload(request.tabId));
    }

    const tabId = sender.tab?.id;

    if (tabId === undefined) {
      return;
    }

    if (isTabReloadFromContentMessage(request)) {
      sendResponse(!!isReloading(tabId));
    }

    if (isSetDocumentTextFromContentMessage(request)) {
      sendResponse(
        changeReloadTabDataBySearchResult(tabId, request.documentText)
      );
    }
  }
);
