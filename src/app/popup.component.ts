import {
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

const MIN_INTERVAL_COUNT_VALUE = 1000;

@Component({
  selector: 'popup-root',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent implements OnInit, OnDestroy {
  title = 'text-search';

  public isReloading = false;

  private readonly _subscription = new Subscription();

  public intervalControl = new FormControl<number>(MIN_INTERVAL_COUNT_VALUE, [
    Validators.min(MIN_INTERVAL_COUNT_VALUE),
    Validators.nullValidator,
  ]);

  public constructor(
    private readonly _popup: PopupService,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this._subscription.add(
      this._popup.isReloading$.subscribe({
        next: ({ tabId, intervalCount, startReloadDate }) => {
          console.log('IS_RELOADED', tabId, startReloadDate);

          this.isReloading = true;
          this.intervalControl.setValue(intervalCount);

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

  public onStartReload(): void {
    if (!this.intervalControl.valid) {
      return;
    }

    this._popup.startReload(this.intervalControl.value as number);
  }

  public onStopReload(): void {
    this._popup.stopReload();
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
