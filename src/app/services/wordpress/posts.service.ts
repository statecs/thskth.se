import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import { CookieService } from 'ngx-cookie';
import { Post } from '../../interfaces-and-classes/post';
import {DataFetcherService} from '../utility/data-fetcher.service';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';
import {SearchResult} from '../../interfaces-and-classes/search';

@Injectable()
export class PostsService extends WordpressBaseDataService<Post> {
  protected config: AppConfig;
  protected language: string;

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private _cookieService: CookieService) {
        super(dataFetcherService, injector.get(APP_CONFIG).POSTS_PAGE);
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get('language') === 'undefined') {
      this.language = 'en';
    }else {
      this.language = this._cookieService.get('language');
    }
  }

  getPosts(amount, lang: string): Observable<Post[]> {
    this.language = lang;
    return this.getData(null, '_embed&per_page=' + amount + '&lang=' + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => { return Post.convertToPostType(res); });
  }

  getPostsBySinceDateTime(amount, lang: string, sinceDateTime: string): Observable<Post[]> {
      this.language = lang;
      return this.getData(null, '_embed&per_page=' + amount + '&before=' + sinceDateTime + '&lang=' + this.language )
      // Cast response data to FAQ Category type
          .map((res: any) => { return Post.convertToPostType(res); });
  }

  getOffers(amount, lang: string): Observable<Post[]> {
    this.language = lang;
    return this.getDataById('_embed&sticky=true&per_page=' + amount + '&lang=' + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => { return Post.convertToPostType(res); });
  }

  getPostBySlug(slug, lang: string): Observable<Post> {
    this.language = lang;
    return this.getDataBySlug('_embed&slug=' + slug + '&lang=' + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => { return Post.convertToPostType(res)[0]; });
  }

  searchPosts(searchTerm: string, amount: number, lang: string): Observable<SearchResult[]> {
      this.language = lang;
      return this.searchData('?per_page=' + amount + '&search=' + searchTerm + '&lang=' + this.language)
          // Cast response data to FAQ Category type
          .map((res: any) => { return SearchResult.convertPostsToSearchResultType(res); });
  }
}
