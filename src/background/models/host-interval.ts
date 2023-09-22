import { IntervalCount } from 'src/app/types/interval-count.type';
import { getRandomNumberInRange } from '../utils/get-random-number-in-range';

export class HostInterval {
  private _timer: ReturnType<typeof setTimeout> | null = null;

  public constructor(
    public readonly tabId: number,
    public readonly intervalValue: IntervalCount
  ) {
    this.run();
  }

  public run(): void {
    this._runTimer(this.intervalValue);
    // chrome.action.setIcon(
    //   { tabId: this.tabId, path: 'icons/reload-active.32.png' },
    //   () => {
    //   }
    // );
  }

  public stop(): void {
    this._clearTimer();
    // chrome.action.setIcon(
    //   { tabId: this.tabId, path: 'icons/reload16.png' },
    //   () => {
    //   }
    // );
  }

  private _runTimer(value: IntervalCount): void {
    // chrome.action.setBadgeBackgroundColor(
    //   { tabId: this.tabId, color: '#17eb3a' },
    //   () => {
    //     chrome.action.setBadgeText(
    //       { tabId: this.tabId, text: 'Is run' },
    //       () => {
    //         chrome.action.getBadgeText({ tabId: this.tabId }, (result) => {
    //           console.log('BADGE_TEXS', result);
    //         });
    //       }
    //     );
    //   }
    // );

    this._clearTimer();

    let time = 0;

    if (value[0] === value[1]) {
      time = value[0];
    } else {
      time = getRandomNumberInRange(value[0] * 0.001, value[1] * 0.001) * 1000;
    }

    console.log('INTERVAL', this._timer, time);

    this._timer = setTimeout(() => {
      chrome.tabs.reload(this.tabId);
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
