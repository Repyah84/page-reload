import { Injectable } from '@angular/core';
import { Observable, defer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RuntimeMassageService {
  public setMessage<T, R>(data: T): Observable<R> {
    return defer(() => chrome.runtime.sendMessage<T, R>(data));
  }
}
