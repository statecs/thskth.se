import { Injectable, Injector } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG } from '../../app.config';
import { AppConfig } from '../../interfaces/appConfig';
import { CookieService } from 'ngx-cookie';
import { FAQ, FAQCategory, FAQSubMenu } from '../../interfaces/faq';

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

  getFAQs_OfEachCategories(amount, lang: string): Observable<FAQ[]> {
    this.language = lang;
    return this.getFAQParentCategories(this.language).flatMap(categories => {
          return Observable.forkJoin(categories.map((category) => {
            return this.http.get(this.config.FAQs_URL + '?order=asc&per_page=' + amount + '&faq_category=' + category.id + '&lang=' + this.language)
            .map(res => res.json())
                .map((res) => {
                  let cat_slug = '';
                  if (category.slug) {
                    cat_slug = category.slug;
                  }
                  const faq: FAQ = {
                      question: res[0].title.rendered,
                      answer: res[0].content.rendered,
                      slug: res[0].slug,
                      category_name: category.name,
                      category_slug: cat_slug,
                      faq_category: res[0].faq_category,
                  };
                  return faq;
              });
          }));
        });
  }

  searchFAQs(search_term, lang: string): Observable<FAQ[]> {
    this.language = lang;
    return this.http
        .get(this.config.FAQs_URL + '?order=asc&per_page=100&support=' + search_term + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => { return this.castSearchResultsToFAQType(res, ''); });
  }

  // Get FAQs by categories ID
  getFAQs_ByCategoryID(catID): Observable<FAQ[]> {
    return this.http
        .get(this.config.FAQs_URL + '?order=asc&per_page=100&faq_category=' + catID + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => { return this.castResFAQType(res, ''); });
  }

  // Get FAQs by slug
  getFAQs_BySlug(slug, lang): Observable<FAQ> {
    this.language = lang;
    return this.http
        .get(this.config.FAQs_URL + '?slug=' + slug + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => {
          const faq: FAQ[] = [];
          let cat_slug = '';
          if (res[0]) {
            if (res[0].pure_taxonomies) {
              cat_slug = res[0].pure_taxonomies.faq_category.slug;
            }
            faq[0] = {
              question: res[0].title.rendered,
              answer: res[0].content.rendered,
              slug: res[0].slug,
              category_name: '',
              category_slug: cat_slug,
              faq_category: res[0].faq_category,
            };
          }
          return faq[0];
        });
  }

  // Get FAQs by parent categories
  getSubMenus_ByParentCategory(catID, lang): Observable<FAQSubMenu[]> {
    this.language = lang;
    return this.getFAQChildCategories(catID).flatMap((child_categories) => {
      if (child_categories.length !== 0) {
        return this.http
            .get(this.config.FAQs_URL + '?order=asc&per_page=100&faq_category=' + catID)
            .map((res: Response) => res.json())
            // Cast response data to FAQ Category type
            .map((res: Array<any>) => { return this.castFAQsToChildCategories(res, child_categories, ''); });
      }else {
        return Observable.of([]);
      }
    });
  }

  // Get FAQ Parent Categories
  getFAQParentCategories(lang: string): Observable<FAQCategory[]> {
    this.language = lang;
    return this.http
        .get(this.config.FAQ_CATEGORIES_URL + '?order=asc&parent=0' + '&lang=' + this.language)
        .map((res: Response) => res.json())
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => { return this.castDataToFAQCategory(res); });
  }

  // Get FAQ Child Categories
  getFAQChildCategories(parentID): Observable<FAQCategory[]> {
    return this.http
        .get(this.config.FAQ_CATEGORIES_URL + '?order=asc&parent=' + parentID + '&lang=' + this.language)
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

  castResFAQType(res, category_name) {
    const faqs: FAQ[] = [];
    if (res) {
      res.forEach((item) => {
        let slug = '';
        if (item.pure_taxonomies.faq_category) {
          slug = item.pure_taxonomies.faq_category.slug;
        }
        if (item.faq_category.length === 1) {
          faqs.push({
            question: item.title.rendered,
            answer: item.content.rendered,
            slug: item.slug,
            category_name: category_name,
            category_slug: slug,
            faq_category: item.faq_category,
          });
        }
      });
    }
    return faqs;
  }

  castFAQsToChildCategories(res, child_categories, category_name) {
    const subMenus: FAQSubMenu[] = child_categories;
    res.forEach((item) => {
      let slug = '';
      if (item.pure_taxonomies.faq_category) {
        slug = item.pure_taxonomies.faq_category.slug;
      }
      for (let i = 0; i < child_categories.length; i++) {
        if (item.faq_category.indexOf(child_categories[i].id) >= 0) {
          subMenus[i].faqs.push({
            question: item.title.rendered,
            answer: item.content.rendered,
            slug: item.slug,
            category_name: category_name,
            category_slug: slug,
            faq_category: item.faq_category,
          });
        }
      }
    });
    return subMenus;
  }

  castSearchResultsToFAQType(res, category_name) {
    const faqs: FAQ[] = [];
    if (res) {
      res.forEach((item) => {
        let slug = '';
        if (item.pure_taxonomies.faq_category) {
          slug = item.pure_taxonomies.faq_category.slug;
        }
        faqs.push({
          question: item.title.rendered,
          answer: item.content.rendered,
          slug: item.slug,
          category_name: category_name,
          category_slug: slug,
          faq_category: item.faq_category,
        });
      });
    }
    return faqs;
  }

}
