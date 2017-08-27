import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { SearchResult, Category } from '../../interfaces/search';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class SearchService {
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

  searchPosts(searchTerm: string, amount: number): Observable<SearchResult[]> {
    return this.http
        .get(this.config.POSTS_PAGE + '?per_page=' + amount + '&search=' + searchTerm)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castPostsTo_SearchResultType(res); });
  }

  searchPages(searchTerm: string, amount: number): Observable<SearchResult[]> {
    return this.http
        .get(this.config.PAGES_URL + '?per_page=' + amount + '&search=' + searchTerm)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castPagesTo_SearchResultType(res); });
  }

  searchFAQs(searchTerm: string, amount: number): Observable<SearchResult[]> {
    return this.http
        .get(this.config.FAQs_URL + '?per_page=' + amount + '&search=' + searchTerm)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castFAQsTo_SearchResultType(res); });
  }

  castPostsTo_SearchResultType(res) {
    const results: SearchResult[] = [];
    if (res) {
      res.forEach((p) => {
        const categories: Category[] = [];
        p.pure_taxonomies.categories.forEach((c) => {
          categories.push({
            name: c.name,
            slug: c.slug
          });
        });
        results.push({
          title: p.title.rendered,
          link: p.link,
          content: p.content.rendered,
          image: '',
          color: '',
          categories: categories,
        });
      });
    }
    return results;
  }

  castPagesTo_SearchResultType(res) {
    const results: SearchResult[] = [];
    if (res) {
      res.forEach((p) => {
        let image: string = null;
        if (p.acf.header_image) {
          image = p.acf.header_image.sizes.thumbnail;
        }
        results.push({
          title: p.title.rendered,
          link: p.link,
          content: p.content.rendered,
          image: image,
          color: p.acf.header_color,
          categories: [],
        });
      });
    }
    return results;
  }

  castFAQsTo_SearchResultType(res) {
    const results: SearchResult[] = [];
    if (res) {
      res.forEach((p) => {
        const categories: Category[] = [];
        p.pure_taxonomies.faq_category.forEach((c) => {
          categories.push({
            name: c.name,
            slug: c.slug
          });
        });
        results.push({
          title: p.title.rendered,
          link: p.link,
          content: p.content.rendered,
          image: '',
          color: '',
          categories: categories,
        });
      });
    }
    return results;
  }

}
