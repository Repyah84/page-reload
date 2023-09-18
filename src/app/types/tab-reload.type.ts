export interface TabReload {
  tabId: number;
  startReloadDate: number;
  intervalCount: number;
  interval: ReturnType<typeof setInterval>;
}
