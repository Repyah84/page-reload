import { TabReload } from 'src/app/types/tab-reload.type';

export const updateTabState = (
  state: TabReload,
  fieldsToUpdate: Partial<TabReload>
): TabReload => {
  return { ...state, ...fieldsToUpdate };
};
