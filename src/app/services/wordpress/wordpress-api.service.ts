import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import {Notification} from '../../interfaces-and-classes/notification';
import {DataFetcherService} from '../utility/data-fetcher.service';

@Injectable()
export class WordpressApiService {
  protected _wpBaseUrl: string;
  protected config: AppConfig;
  protected language: string;

  constructor(protected dataFetcherService: DataFetcherService,
              private injector: Injector) {
    this.config = injector.get(APP_CONFIG);
    this._wpBaseUrl = this.config.API_URL;
  }

  getNotification(lang: string): Observable<Notification> {
    return this.dataFetcherService
        .get(this.config.NOTIFICATION_URL + '?lang=' + lang)
        // Cast response data to card type
        .map((res: Array<any>) => {
          return {
            message: res[0].content.rendered,
            bg_color: res[0].acf['background-color']
          };
        });
  }

}
