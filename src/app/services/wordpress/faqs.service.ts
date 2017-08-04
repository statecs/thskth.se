import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { CookieService } from 'ngx-cookie';
import { FAQ, FAQCategory, FAQSubMenu } from '../../interfaces/faq';
import {of} from 'rxjs/observable/of';

@Injectable()
export class FaqsService {
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

  searchFAQs(search_term): Observable<FAQ[]> {
    return this.http
        .get(this.config.FAQs_URL + '?order=asc&per_page=100&search=' + search_term)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => { return this.castSearchResultsToFAQType(res); });
  }

  // Get FAQs by categories ID
  getFAQs_ByCategoryID(catID): Observable<FAQ[]> {
    return this.http
        .get(this.config.FAQs_URL + '?order=asc&per_page=100&faq_category=' + catID)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => { return this.castResFAQType(res); });
  }

  // Get FAQs by parent categories
  getSubMenus_ByParentCategory(catID): Observable<FAQSubMenu[]> {
    return this.getFAQChildCategories(catID).flatMap((child_categories) => {
      if (child_categories.length !== 0) {
        return this.http
            .get(this.config.FAQs_URL + '?order=asc&per_page=100&faq_category=' + catID)
            .map((res: Response) => res.json())
            // Cast response data to FAQ Category type
            .map((res: Array<any>) => { return this.castFAQsToChildCategories(res, child_categories); });
      }else {
        return Observable.of([]);
      }
    });
  }

  // Get FAQ Parent Categories
  getFAQParentCategories(): Observable<FAQCategory[]> {
    return this.http
        .get(this.config.FAQ_CATEGORIES_URL + '?order=asc&parent=0')
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => { return this.castDataToFAQCategory(res); });
  }

  // Get FAQ Child Categories
  getFAQChildCategories(parentID): Observable<FAQCategory[]> {
    return this.http
        .get(this.config.FAQ_CATEGORIES_URL + '?order=asc&parent=' + parentID)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => { return this.castDataToFAQSubMenuType(res); });
  }

  castDataToFAQSubMenuType(res) {
    const categories: FAQSubMenu[] = [];
    if (res) {
      res.forEach((c) => {
        categories.push({
          id: c.id,
          name: c.name,
          slug: c.slug,
          parent: c.parent,
          faqs: [],
        });
      });
    }
    return categories;
  }

  castDataToFAQCategory(res) {
    const categories: FAQCategory[] = [];
    if (res) {
      res.forEach((c) => {
        categories.push({
          id: c.id,
          name: c.name,
          slug: c.slug,
          parent: c.parent
        });
      });
    }
    return categories;
  }

  castResFAQType(res) {
    const faqs: FAQ[] = [];
    if (res) {
      res.forEach((item) => {
        if (item.faq_category.length === 1) {
          faqs.push({
            question: item.title.rendered,
            answer: item.content.rendered,
            slug: item.slug,
            faq_category: item.faq_category,
          });
        }
      });
    }
    return faqs;
  }

  castFAQsToChildCategories(res, child_categories) {
    const subMenus: FAQSubMenu[] = child_categories;
    res.forEach((item) => {
      for (let i = 0; i < child_categories.length; i++) {
        if (item.faq_category.indexOf(child_categories[i].id) >= 0) {
          subMenus[i].faqs.push({
            question: item.title.rendered,
            answer: item.content.rendered,
            slug: item.slug,
            faq_category: item.faq_category,
          });
        }
      }
    });
    return subMenus;
  }

  castSearchResultsToFAQType(res) {
    const faqs: FAQ[] = [];
    if (res) {
      res.forEach((item) => {
        faqs.push({
          question: item.title.rendered,
          answer: item.content.rendered,
          slug: item.slug,
          faq_category: item.faq_category,
        });
      });
    }
    return faqs;
  }

}
