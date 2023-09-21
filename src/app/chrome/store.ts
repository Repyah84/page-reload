import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject, defer, map } from 'rxjs';
import { RuntimeMessageStartReloadData } from '../types/runtime-message-start-reload-data.type';

@Injectable({ providedIn: 'root' })
export class StoreService {
  public readonly storeChange$ = new Subject<{
    [key: string]: {
      newValue?: RuntimeMessageStartReloadData;
      oldValue?: RuntimeMessageStartReloadData;
    };
  }>();

  public constructor(private readonly _zone: NgZone) {
    chrome.storage.session.onChanged.addListener((changes) => {
      this._zone.run(() => {
        this.storeChange$.next(changes);
      });
    });
  }

  public storeSet(
    storeKey: number,
    storeData: RuntimeMessageStartReloadData
  ): Observable<void> {
    return defer(() => chrome.storage.session.set({ [storeKey]: storeData }));
  }

  public storeGet(
    storeKey: string
  ): Observable<RuntimeMessageStartReloadData | null> {
    return defer(() => chrome.storage.session.get(storeKey)).pipe(
      map((store) => (store[storeKey] === undefined ? null : store[storeKey]))
    );
  }
}
