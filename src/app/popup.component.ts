import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { PopupService } from './popup.service';

@Component({
  selector: 'popup-root',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopupComponent implements OnInit, OnDestroy {
  title = 'text-search';

  public intervalControl = new FormControl<number>(0);

  public constructor(private readonly _popup: PopupService) {}

  public ngOnInit(): void {
    this._popup.startReload$.subscribe({
      next: (value) => {
        console.log(value);
      },
    });

    this._popup.stopReload$.subscribe({
      next: (value) => {
        console.log(value);
      },
    });
  }

  async onStartReload(): Promise<void> {
    const value = this.intervalControl.value || 0;

    this._popup.startReload(value);
  }

  public onStopReload(): void {
    this._popup.stopReload();
  }

  public ngOnDestroy(): void {
    console.log('DESTROY');
  }
}
