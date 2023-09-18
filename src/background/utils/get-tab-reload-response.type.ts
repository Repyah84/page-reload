import { RuntimeMessageResponse } from 'src/app/types/runtime-message-response';
import { TabReload } from 'src/app/types/tab-reload.type';

/**
 * Get tab reload data ot undefine
 * @param value
 * @returns
 */
export const getTabReloadResponse = (
  value: TabReload | undefined
): RuntimeMessageResponse | null => {
  if (value === undefined) {
    return null;
  }

  const { tabId, intervalCount, startReloadDate } = value;

  return {
    tabId,
    intervalCount,
    startReloadDate,
  };
};
