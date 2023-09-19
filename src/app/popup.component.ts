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

const MIN_INTERVAL_COUNT_VALUE = 3000;

@Component({
  selector: 'popup-root',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent implements OnInit, AfterViewInit, OnDestroy {
  public isReloading = false;

  private readonly _subscription = new Subscription();

  public intervalControl = new FormControl<number>(MIN_INTERVAL_COUNT_VALUE, [
    Validators.min(MIN_INTERVAL_COUNT_VALUE),
    Validators.required,
  ]);

  public textControl = new FormControl('', Validators.required);

  public constructor(
    private readonly _popup: PopupService,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  public get validator(): boolean {
    console.log('validator');

    return this.intervalControl.valid && this.textControl.valid;
  }

  public ngOnInit(): void {
    this._subscription.add(
      this._popup.isReloading$.subscribe({
        next: ({ tabId, intervalCount, startReloadDate, searchText }) => {
          console.log('IS_RELOADED', tabId, startReloadDate);

          this.isReloading = true;
          this.intervalControl.setValue(intervalCount);
          this.textControl.setValue(searchText);

          this._cdr.markForCheck();
        },
      })
    );

    this._subscription.add(
      this._popup.startReload$.subscribe({
        next: (value) => {
          console.log('startReload', value);

          this.isReloading = true;

          this._cdr.markForCheck();
        },
      })
    );

    this._subscription.add(
      this._popup.stopReload$.subscribe({
        next: (value) => {
          console.log('stopReload', value);

          this.isReloading = false;

          this._cdr.markForCheck();
        },
      })
    );
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

    const dto: RuntimeTabDto = {
      intervalCount: this.intervalControl.value as number,
      searchText: this.textControl.value as string,
    };

    this._popup.startReload(dto);
  }

  public onStopReload(): void {
    this._popup.stopReload();
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
