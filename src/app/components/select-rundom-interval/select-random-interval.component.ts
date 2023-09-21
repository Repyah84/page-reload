import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IntervalCount } from 'src/app/types/interval-count.type';

@Component({
  selector: 'popup-select-random-interval',
  templateUrl: './select-random-interval.component.html',
  styleUrls: ['./select-random-interval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectRandomInterval implements OnChanges, OnInit, OnDestroy {
  private readonly _subscription = new Subscription();

  public readonly intervalCountGroup = new FormGroup({
    min: new FormControl(0, { nonNullable: true }),
    max: new FormControl(0, { nonNullable: true }),
  });

  @Input({ required: true })
  public intervalCount!: IntervalCount;

  @Output()
  public readonly intervalCountChange = new EventEmitter<IntervalCount>();

  public ngOnChanges(): void {
    this.intervalCountGroup.patchValue({
      min: this.intervalCount[0] * 0.001,
      max: this.intervalCount[1] * 0.001,
    });
  }

  public ngOnInit(): void {
    this._subscription.add(
      this.intervalCountGroup.valueChanges.subscribe({
        next: (value) => {
          this.intervalCountChange.emit(
            Object.values(value).map((item) => item * 1000) as IntervalCount
          );
        },
      })
    );
  }

  public ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
