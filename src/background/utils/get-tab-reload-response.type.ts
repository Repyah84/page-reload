import { RuntimeMessageResponse } from 'src/app/types/runtime-message-response';
import { TabReload } from 'src/app/types/tab-reload.type';

export const getTabReloadResponse = (
  value: TabReload | undefined
): RuntimeMessageResponse | null => {
  if (value === undefined) {
    return null;
  }

  const { tabId, intervalCount, startReloadDate, searchText, isReload } = value;

  return {
    tabId,
    intervalCount,
    startReloadDate,
    searchText,
    isReload,
  };
};
