import { Injectable } from '@angular/core';
import { ChromeActiveTabService } from './chrome/get-active-tab';
import { RuntimeMassageService } from './chrome/runtime-message';
import { Subject, exhaustMap, switchMap } from 'rxjs';
import { RuntimeStarReloadMessage } from './types/runtime-start-reload-message.type';
import { RuntimeStopReloadMessage } from './types/runtime-stop-reload-message.type';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private readonly _startReload$ = new Subject<number>();

  private readonly _stopReload$ = new Subject<void>();

  public readonly startReload$ = this._startReload$.pipe(
    exhaustMap((value) =>
      this._activeTab.activeTab$.pipe(
        switchMap((tab) =>
          this._massage.setMessage<
            RuntimeStarReloadMessage,
            { [key: string]: unknown }
          >({
            message: 'startReload',
            data: {
              tabId: tab.id || 0,
              interval: value,
            },
          })
        )
      )
    )
  );

  public readonly stopReload$ = this._stopReload$.pipe(
    exhaustMap(() =>
      this._activeTab.activeTab$.pipe(
        switchMap((tab) =>
          this._massage.setMessage<RuntimeStopReloadMessage, unknown>({
            message: 'stopReload',
            tabId: tab.id || 0,
          })
        )
      )
    )
  );

  public startReload(value: number): void {
    this._startReload$.next(value);
  }

  public stopReload(): void {
    this._stopReload$.next();
  }

  public constructor(
    private readonly _activeTab: ChromeActiveTabService,
    private readonly _massage: RuntimeMassageService
  ) {}
}
