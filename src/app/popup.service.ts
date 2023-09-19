import { Injectable } from '@angular/core';
import { ChromeActiveTabService } from './chrome/active-tab';
import { RuntimeMassageService } from './chrome/runtime-message';
import { Subject, exhaustMap, filter, switchMap } from 'rxjs';
import { RuntimeStarReloadMessage } from './types/runtime-start-reload-message.type';
import { RuntimeStopReloadMessage } from './types/runtime-stop-reload-message.type';
import { RuntimeMessageResponse } from './types/runtime-message-response';
import { RuntimeMessageIsReloading } from './types/runtime-message-is-reloading.type';
import { RuntimeTabDto } from './dto/runtime-tab-dto.type';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private readonly _startReload$ = new Subject<RuntimeTabDto>();
  private readonly _stopReload$ = new Subject<void>();

  public readonly startReload$ = this._startReload$.pipe(
    exhaustMap((dto) =>
      this._activeTab.getActiveTabId().pipe(
        switchMap((tabId) =>
          this._massage.setMessage<
            RuntimeStarReloadMessage,
            RuntimeMessageResponse
          >({
            message: 'startReload',
            data: {
              ...dto,
              tabId,
            },
          })
        )
      )
    )
  );

  public readonly stopReload$ = this._stopReload$.pipe(
    exhaustMap(() =>
      this._activeTab.getActiveTabId().pipe(
        switchMap((tabId) =>
          this._massage.setMessage<RuntimeStopReloadMessage, string>({
            message: 'stopReload',
            tabId,
          })
        )
      )
    )
  );

  public readonly isReloading$ = this._activeTab.getActiveTabId().pipe(
    switchMap((tabId) =>
      this._massage.setMessage<
        RuntimeMessageIsReloading,
        RuntimeMessageResponse | null
      >({
        message: 'isReloading',
        tabId,
      })
    ),
    filter(
      (tab): tab is RuntimeMessageResponse => tab !== undefined && tab !== null
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
    private readonly _massage: RuntimeMassageService
  ) {}
}
