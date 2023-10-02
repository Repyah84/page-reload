import { IntervalCount } from 'src/app/types/interval-count.type';
import { getRandomNumberInRange } from '../utils/get-random-number-in-range';
import { getCountdownValue } from '../utils/get-countdown-timer-value';

export class HostInterval {
  private _timer: ReturnType<typeof setTimeout> | null = null;

  private _countdown = 0;

  public constructor(
    public readonly tabId: number,
    public readonly intervalValue: IntervalCount
  ) {}

  public run(): void {
    chrome.action.setIcon(
      { tabId: this.tabId, path: 'icons/reload-active.32.png' },
      () => {
        this._countdown =
          this.intervalValue[0] === this.intervalValue[1]
            ? (this._countdown = this.intervalValue[0])
            : getRandomNumberInRange(
                this.intervalValue[0] * 0.001,
                this.intervalValue[1] * 0.001
              ) * 1000;

        this._runTimer();
      }
    );
  }

  public stop(): void {
    chrome.action.setIcon(
      { tabId: this.tabId, path: 'icons/reload16.png' },
      () => {
        chrome.action.setBadgeText({ tabId: this.tabId, text: '' }, () => {
          this._clearTimer();
        });
      }
    );
  }

  private _runTimer(): void {
    this._clearTimer();

    chrome.action.setBadgeText(
      { tabId: this.tabId, text: getCountdownValue(this._countdown) },
      () => {
        this._countdown -= 1000;

        this._timer = setTimeout(() => {
          if (this._countdown === 0) {
            void chrome.tabs.reload(this.tabId);

            return;
          }

          this._runTimer();
        }, 1000);
      }
    );
  }

  private _clearTimer(): void {
    if (this._timer === null) {
      return;
    }

    clearTimeout(this._timer);

    this._timer = null;
  }

  public remove() {
    this._clearTimer();
  }
}
