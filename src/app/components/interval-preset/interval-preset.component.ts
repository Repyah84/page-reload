import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IntervalCount } from 'src/app/types/interval-count.type';

interface IntervalPreset {
  title: string;
  value: number;
}

function transformIntervalCount(value: IntervalCount): number {
  return value[0] === value[1] ? value[0] : 0;
}

@Component({
  selector: 'popup-interval-preset',
  templateUrl: './interval-preset.component.html',
  styleUrls: ['./interval-preset.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntervalPresetComponent {
  public readonly intervalPresets: IntervalPreset[] = [
    {
      title: '3 seconds',
      value: 3000,
    },
    {
      title: '5 seconds',
      value: 5000,
    },
    {
      title: '10 seconds',
      value: 10000,
    },
    {
      title: '15 seconds',
      value: 15000,
    },
    {
      title: '30 seconds',
      value: 30000,
    },
    {
      title: '45 seconds',
      value: 45000,
    },
    {
      title: '1 minute',
      value: 60000,
    },
    {
      title: '2 minutes',
      value: 120000,
    },
    {
      title: '3 minutes',
      value: 180000,
    },
    {
      title: '5 minutes',
      value: 300000,
    },
    {
      title: '8 minutes',
      value: 480000,
    },
    {
      title: '10 minutes',
      value: 600000,
    },
    {
      title: '15 minutes',
      value: 900000,
    },
    {
      title: '30 minutes',
      value: 1800000,
    },
    {
      title: '45 minutes',
      value: 2700000,
    },
    {
      title: '1 hour',
      value: 3600000,
    },
  ];

  @Input()
  public disabled = false;

  @Input({ transform: transformIntervalCount, required: true })
  public intervalCount!: number;

  @Output()
  public readonly intervalCountChange = new EventEmitter<IntervalCount>();

  public onPresetClick(value: number): void {
    this.intervalCountChange.emit([value, value]);
  }
}
