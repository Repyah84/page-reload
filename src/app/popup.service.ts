import { Injectable } from '@angular/core';
import { ChromeActiveTabService } from './chrome/active-tab';
import { RuntimeMassageService } from './chrome/runtime-message';
import {
  Observable,
  Subject,
  exhaustMap,
  filter,
  map,
  of,
  switchMap,
} from 'rxjs';
import { RuntimeMessageStarReload } from './types/runtime-message-start-reload.type';
import { RuntimeMessageStopReload } from './types/runtime-message-stop-reload.type';
import { RuntimeMessageResponse } from './types/runtime-message-response';
import { RuntimeMessageIsReloading } from './types/runtime-message-is-reloading.type';
import { RuntimeTabDto } from './dto/runtime-tab-dto.type';
import { StoreService } from './chrome/store';
import { RuntimeMessageStartReloadData } from './types/runtime-message-start-reload-data.type';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private readonly _startReload$ = new Subject<RuntimeTabDto>();
  private readonly _stopReload$ = new Subject<void>();

  public readonly startReload$ = this._startReload$.pipe(
    exhaustMap((dto) =>
      this._activeTab.getActiveTabId().pipe(
        switchMap((tabId) => {
          const messageData: RuntimeMessageStarReload = {
            message: 'startReload',
            data: {
              ...dto,
              tabId,
            },
          };

          return this._store
            .storeSet(tabId, messageData.data)
            .pipe(
              switchMap(() =>
                this._massage.setMessage<
                  RuntimeMessageStarReload,
                  RuntimeMessageResponse
                >(messageData)
              )
            );
        })
      )
    )
  );

  public readonly stopReload$ = this._stopReload$.pipe(
    exhaustMap(() =>
      this._activeTab.getActiveTabId().pipe(
        switchMap((tabId) =>
          this._massage.setMessage<RuntimeMessageStopReload, string>({
            message: 'stopReload',
            tabId,
          })
        )
      )
    )
  );

  public readonly storeData$ = this._activeTab.getActiveTabId().pipe(
    switchMap((tabId) => this._store.storeGet(tabId.toString())),
    filter(
      (tab): tab is RuntimeMessageStartReloadData =>
        tab !== undefined && tab !== null
    )
  );

  public readonly storeChange$ = this._activeTab
    .getActiveTabId()
    .pipe(
      switchMap((tabId) =>
        this._store.storeChange$.pipe(map((store) => store[tabId]))
      )
    );

  public startReload(dto: RuntimeTabDto): void {
    this._startReload$.next(dto);
  }

  public stopReload(): void {
    this._stopReload$.next();
  }

  public constructor(
    private readonly _activeTab: ChromeActiveTabService,
    private readonly _massage: RuntimeMassageService,
    private readonly _store: StoreService
  ) {}
}
