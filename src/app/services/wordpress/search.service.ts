import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces-and-classes/appConfig';
import { SearchResult, Category } from '../../interfaces-and-classes/search';
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
        .map((res: any) => { return this.castPostsTo_SearchResultType(res); });
  }

  searchPages(searchTerm: string, amount: number, lang: string): Observable<SearchResult[]> {
    this.language = lang;
    return this.dataFetcherService
        .get(this.config.PAGES_URL + '?per_page=' + amount + '&search=' + searchTerm + '&lang=' + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => { return this.castPagesTo_SearchResultType(res); });
  }

  searchFAQs(searchTerm: string, amount: number, lang: string): Observable<SearchResult[]> {
    this.language = lang;
    return this.dataFetcherService
        .get(this.config.FAQs_URL + '?per_page=' + amount + '&search=' + searchTerm + '&lang=' + this.language)
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
          slug: p.slug,
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
          link: this.getSlug(p.link),
          slug: p.slug,
          content: p.content.rendered,
          image: image,
          color: p.acf.header_color,
          categories: [],
        });
      });
    }
    return results;
  }

  getSlug(link: string) {
    let slug = '';
    if (link.substring(link.length - 8) === '?lang=sv') {
      link = link.substring(0, link.length - 8);
      slug = this.hrefToSlugPipeFilter.transform(link);
    }else {
      slug = this.hrefToSlugPipeFilter.transform(link);
    }
    return slug;
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
          slug: p.slug,
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
