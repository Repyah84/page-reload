import { IntervalCount } from 'src/app/types/interval-count.type';
import { getRandomNumberInRange } from '../utils/get-random-number-in-range';

export class HostInterval {
  private _timer: ReturnType<typeof setTimeout> | null = null;

  public constructor(public readonly intervalValue: IntervalCount) {
    this.run();
  }

  public run(): void {
    this._runTimer(this.intervalValue);
  }

  public stop(): void {
    this._clearTimer();
  }

  private _runTimer(value: IntervalCount): void {
    this._clearTimer();

    let time = 0;

    if (value[0] === value[1]) {
      time = value[0];
    } else {
      time = getRandomNumberInRange(value[0] * 0.001, value[1] * 0.001) * 1000;
    }

    console.log('INTERVAL', this._timer, time);

    this._timer = setTimeout(() => {
      this._runTimer(value);
    }, time);
  }

  private _clearTimer(): void {
    if (this._timer === null) {
      return;
    }

    clearTimeout(this._timer);

    this._timer = null;
  }
}
