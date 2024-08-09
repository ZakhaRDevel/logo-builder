import {inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  public isBrowser = signal(isPlatformBrowser(inject(PLATFORM_ID)));
}
