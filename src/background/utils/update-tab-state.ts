import { TabReload } from 'src/app/types/tab-reload.type';

export const updateTabState = <T>(state: T, fieldsToUpdate: Partial<T>): T => {
  return { ...state, ...fieldsToUpdate };
};
