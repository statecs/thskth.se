import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import { SearchResult } from '../../interfaces-and-classes/search';
import { CookieService } from 'ngx-cookie';
import {HrefToSlugPipe} from '../../pipes/href-to-slug.pipe';
import {DataFetcherService} from '../utility/data-fetcher.service';

@Injectable()
export class SearchService {
  protected config: AppConfig;
  protected language: string;
  private hrefToSlugPipeFilter: HrefToSlugPipe;

  constructor(protected dataFetcherService: DataFetcherService,
              private injector: Injector,
              private _cookieService: CookieService) {
    this.config = injector.get(APP_CONFIG);
    this.hrefToSlugPipeFilter = new HrefToSlugPipe();

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }




}
