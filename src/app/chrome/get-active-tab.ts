import { Injectable } from '@angular/core';
import { defer, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChromeActiveTabService {
  public readonly activeTab$ = defer(() =>
    chrome.tabs.query({ active: true })
  ).pipe(map(([tab]) => tab));
}
