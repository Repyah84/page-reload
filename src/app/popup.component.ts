import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

import { PopupService } from './popup.service';
import { Subscription } from 'rxjs';
import { RuntimeTabDto } from './dto/runtime-tab-dto.type';
import { RuntimeNotificationAction } from './types/runtime-notification-action.type';
import { RuntimeMessageResponse } from './types/runtime-message-response';
import { RuntimeMessageStartReloadData } from './types/runtime-message-start-reload-data.type';
import { MIN_INTERVAL_COUNT_VALUE } from './const/min-interval-count-value';
import { IntervalCount } from './types/interval-count.type';
import { MAX_INTERVAL_DEFAULT_COUNT_VALUE } from './const/max-interval-default-count-value';

interface Option {
  name: string;
  value: RuntimeNotificationAction;
}

@Component({
  selector: 'popup-root',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly _subscription = new Subscription();

  public isReloading = false;

  public readonly selectOptions: Option[] = [
    {
      name: 'Found',
      value: 'found',
    },
    {
      name: 'Not Found',
      value: 'notFound',
    },
  ];

  public intervalCount: IntervalCount = [
    MIN_INTERVAL_COUNT_VALUE,
    MAX_INTERVAL_DEFAULT_COUNT_VALUE,
  ];
  public searchText = '';
  public hasNotification = true;
  public isTextFoundStopRefresh = true;
  public notificationAction: RuntimeNotificationAction = 'found';

  public constructor(
    private readonly _popup: PopupService,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  private _updateState({
    tabId,
    intervalCount,
    searchText,
    isReload,
    hasNotification,
    showNotificationThen,
    isTextFoundStopRefresh,
  }: RuntimeMessageResponse | RuntimeMessageStartReloadData): void {
    this.isReloading = isReload;

    this.searchText = searchText;
    this.intervalCount = intervalCount;
    this.hasNotification = hasNotification;
    this.isTextFoundStopRefresh = isTextFoundStopRefresh;
    this.notificationAction = showNotificationThen;

    this._cdr.markForCheck();
  }

  public get validator(): boolean {
    return (
      Math.min(...this.intervalCount) >= MIN_INTERVAL_COUNT_VALUE &&
      !!this.searchText
    );
  }

  public ngOnInit(): void {
    this._subscription.add(
      this._popup.storeChange$.subscribe({
        next: (storeUpdate) => {
          if (storeUpdate.newValue) {
            this._updateState(storeUpdate.newValue);
          }
        },
      })
    );

    this._subscription.add(
      this._popup.storeData$.subscribe({
        next: (response) => {
          this._updateState(response);
        },
      })
    );

    this._subscription.add(this._popup.startReload$.subscribe());

    this._subscription.add(this._popup.stopReload$.subscribe());
  }

  public ngAfterViewInit(): void {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        console.log(permission);
      });
    }
  }

  public onInitEvent(): void {
    if (!this.isReloading && this.validator) {
      this.isReloading = true;

      const dto: RuntimeTabDto = {
        isReload: this.isReloading,
        intervalCount: this.intervalCount,
        searchText: this.searchText,
        showNotificationThen: this.notificationAction,
        hasNotification: this.hasNotification,
        isTextFoundStopRefresh: this.isTextFoundStopRefresh,
      };

      this._popup.startReload(dto);

      return;
    }

    this.isReloading = false;

    this._popup.stopReload();
  }

  // public setIntervalCount(value: IntervalCount): void {
  //   console.log('setIntervalCount', value);

  //   this.intervalCount = value;
  // }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }

  public onShowValue(): void {
    console.log('onShowValue', this.intervalCount);
  }
}
