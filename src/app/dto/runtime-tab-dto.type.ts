import { RuntimeNotificationAction } from '../types/runtime-notification-action.type';

export interface RuntimeTabDto {
  intervalCount: [number, number];
  searchText: string;
  isReload: boolean;
  hasNotification: boolean;
  showNotificationThen: RuntimeNotificationAction;
  isSearchTriggeredStopRefresh: boolean;
}
