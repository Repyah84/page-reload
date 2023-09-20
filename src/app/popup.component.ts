import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { PopupService } from './popup.service';
import { Subscription } from 'rxjs';
import { RuntimeTabDto } from './dto/runtime-tab-dto.type';
import { RuntimeNotificationAction } from './types/runtime-notification-action.type';
import { RuntimeMessageResponse } from './types/runtime-message-response';
import { RuntimeMessageStartReloadData } from './types/runtime-message-start-reload-data.type';

const MIN_INTERVAL_COUNT_VALUE = 3000;

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

  public hasNotification = true;
  public isRefresh = true;
  public notificationAction: RuntimeNotificationAction = 'found';

  public readonly intervalControl = new FormControl<number>(
    MIN_INTERVAL_COUNT_VALUE,
    {
      nonNullable: true,
      validators: [
        Validators.min(MIN_INTERVAL_COUNT_VALUE),
        Validators.required,
      ],
    }
  );

  public readonly textControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

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

    this.intervalControl.setValue(intervalCount);
    this.textControl.setValue(searchText);
    this.hasNotification = hasNotification;
    this.isRefresh = isTextFoundStopRefresh;
    this.notificationAction = showNotificationThen;

    this._cdr.markForCheck();
  }

  public get validator(): boolean {
    return this.intervalControl.valid && this.textControl.valid;
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
      this._popup.defaultState$.subscribe({
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

  public onStartReload(): void {
    if (!this.validator) {
      return;
    }

    this.isReloading = true;

    const dto: RuntimeTabDto = {
      isReload: this.isReloading,
      intervalCount: this.intervalControl.value,
      searchText: this.textControl.value,
      showNotificationThen: this.notificationAction,
      hasNotification: this.hasNotification,
      isTextFoundStopRefresh: this.isRefresh,
    };

    this._popup.startReload(dto);
  }

  public onStopReload(): void {
    if (!this.isReloading) {
      return;
    }

    this._popup.stopReload();
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
