import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { Card, SubCard } from '../../interfaces/card';
import { AppConfig } from '../../interfaces/appConfig';
import {MenuItem} from '../../interfaces/menu';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class WordpressApiService {
  protected _wpBaseUrl: string;
  protected config: AppConfig;
  protected language: string;

  constructor(private http: Http, private injector: Injector, private _cookieService: CookieService) {
    this.config = injector.get(APP_CONFIG);
    this._wpBaseUrl = this.config.API_URL;

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }

  // Get Page
  getPage(slug): Observable<any[]> {
    return this.http
        .get(this.config.PAGES_URL + '?slug=' + slug + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to card type
        .map((res: Array<any>) => { return res; });
  }

}
