import { Injectable } from '@angular/core';
import { Observable, defer, map, shareReplay, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChromeActiveTabService {
  public readonly activeTab$ = defer(() =>
    chrome.tabs.query({ active: true, currentWindow: true })
  ).pipe(
    map(([tab]) => tab),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  public getActiveTabId(): Observable<number> {
    return this.activeTab$.pipe(
      map((tab) => {
        const tabId = tab.id;

        if (tabId === undefined) {
          throw new Error('Tab id is undefine');
        }

        return tabId;
      })
    );
  }
}
