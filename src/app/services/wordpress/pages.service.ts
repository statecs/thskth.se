import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { CookieService } from 'ngx-cookie';
import { Page } from '../../interfaces/page';

@Injectable()
export class PagesService {
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

  getPageBySlug(slug): Observable<Page> {
    return this.http
        .get(this.config.PAGES_URL + '?slug=' + slug)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castResTo_PageType(res[0]); });
  }

  castResTo_PageType(res) {
    console.log(res);
    let page: Page;
    page = {
      name: res.title.rendered,
      slug: res.slug,
      content: res.content.rendered,
      header_image: '',
    };
    return page;
  }

}
