import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { debounceTime, catchError } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { SearchResult } from '../models/subscribe';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class BackEndService {
  constructor(
    private globalService: GlobalService,
    private loader: NgxUiLoaderService) { }


  subscribeURL(url: string, channelID: string, keywords: string[]): Observable<any> {
    this.loader.start();
    return new Observable<any>(observer => {
      this.globalService.httpPost(`comments/subscribe`, {
        url,
        channelID,
        keywords
      })
        .pipe(debounceTime(500))
        .subscribe((response) => {
          observer.next(response);
          this.loader.stop();
        });
    });
  }

  unSubscribeURL(channelID: string): Observable<any> {
    this.loader.start();
    return new Observable<any>(observer => {
      this.globalService.httpPost(`comments/unsubscribe`, {
        channelID
      })
        .pipe(debounceTime(500))
        .subscribe((response) => {
          observer.next(response);
          this.loader.stop();
        });
    });

  }

}
