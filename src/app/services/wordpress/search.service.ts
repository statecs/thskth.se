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

  searchPosts(searchTerm: string, amount: number, lang: string): Observable<SearchResult[]> {
    this.language = lang;
    return this.dataFetcherService
        .get(this.config.POSTS_PAGE + '?per_page=' + amount + '&search=' + searchTerm + '&lang=' + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => { return SearchResult.convertPostsToSearchResultType(res); });
  }

  searchPages(searchTerm: string, amount: number, lang: string): Observable<SearchResult[]> {
    this.language = lang;
    return this.dataFetcherService
        .get(this.config.PAGES_URL + '?per_page=' + amount + '&search=' + searchTerm + '&lang=' + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => { return SearchResult.convertPagesToSearchResultType(res); });
  }

  searchFAQs(searchTerm: string, amount: number, lang: string): Observable<SearchResult[]> {
    this.language = lang;
    return this.dataFetcherService
        .get(this.config.FAQs_URL + '?per_page=' + amount + '&search=' + searchTerm + '&lang=' + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => { return SearchResult.convertFAQsToSearchResultType(res); });
  }

}
