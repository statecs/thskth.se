import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { SearchResult, Category } from '../../interfaces/search';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class ArchiveService {
  protected config: AppConfig;
  protected language: string;

  constructor(private http: Http, private injector: Injector, private _cookieService: CookieService) {
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }

  /*searchDocuments(searchTerm: string, amount: number): Observable<SearchResult[]> {
    return this.http
        .get(this.config.ARCHIVE_URL + '?per_page=' + amount + '&search=' + searchTerm)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castPostsTo_SearchResultType(res); });
  }*/

}
