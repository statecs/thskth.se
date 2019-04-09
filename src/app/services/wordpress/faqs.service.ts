import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/observable/forkJoin";
import "rxjs/add/observable/of";
import { APP_CONFIG } from "../../app.config";
import { AppConfig } from "../../interfaces-and-classes/appConfig";
import { CookieService } from "ngx-cookie";
import { FAQ, FAQCategory, FAQSubMenu } from "../../interfaces-and-classes/faq";
import { DataFetcherService } from "../utility/data-fetcher.service";
import { WordpressBaseDataService } from "../abstract-services/wordpress-base-data.service";
import { FaqCategoriesService } from "./faq-categories.service";
import { SearchResult } from "../../interfaces-and-classes/search";

@Injectable()
export class FaqsService extends WordpressBaseDataService<FAQ> {
  protected config: AppConfig;
  protected language: string;

  constructor(
    protected dataFetcherService: DataFetcherService,
    private injector: Injector,
    private _cookieService: CookieService,
    private faqCategoriesService: FaqCategoriesService
  ) {
    super(dataFetcherService, injector.get(APP_CONFIG).FAQs_URL);
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get("language") === "undefined") {
      this.language = "en";
    } else {
      this.language = this._cookieService.get("language");
    }
  }

  getFAQs_OfEachCategories(amount, lang: string): Observable<FAQ[]> {
    this.language = lang;
    return this.faqCategoriesService
      .getFAQParentCategories(this.language)
      .flatMap(categories => {
        return Observable.forkJoin(
          categories.map(category => {
            return this.dataFetcherService
              .get(
                this.config.FAQs_URL +
                  "?order=asc&per_page=" +
                  amount +
                  "&faq_category=" +
                  category.id +
                  "&lang=" +
                  this.language
              )
              .map(res => {
                let cat_slug = "";
                if (category.slug) {
                  cat_slug = category.slug;
                }
                const faq: FAQ = {
                  id: res[0].id,
                  question: res[0].title.rendered,
                  answer: res[0].content.rendered,
                  slug: res[0].slug,
                  category_name: category.name,
                  category_slug: cat_slug,
                  faq_category: res[0].faq_category
                };
                return faq;
              });
          })
        );
      });
  }

  searchFAQs(
    search_term: string,
    amount: number,
    lang: string
  ): Observable<SearchResult[]> {
    this.language = lang;
    return (
      this.searchData(
        "per_page=" +
          amount +
          "&search=" +
          search_term +
          "&lang=" +
          this.language
      )
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => {
          return SearchResult.convertPagesToSearchResultType(res);
        })
    );
  }

  // Get FAQs by categories ID
  getFAQs_ByCategoryID(catID): Observable<FAQ[]> {
    return (
      this.getDataById(
        "order=asc&per_page=100&faq_category=" +
          catID +
          "&lang=" +
          this.language
      )
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => {
          return FAQ.convertToFAQType(res, "");
        })
    );
  }

  // Get FAQs by slug
  getFAQs_BySlug(slug, lang): Observable<FAQ> {
    this.language = lang;
    return (
      this.getDataBySlug("slug=" + slug + "&lang=" + this.language)
        // Cast response data to FAQ Category type
        .map((res: Array<any>) => {
          const faq: FAQ[] = [];
          let cat_slug = "";
          if (res[0]) {
            if (res[0].pure_taxonomies) {
              cat_slug = res[0].pure_taxonomies.faq_category.slug;
            }
            faq[0] = {
              id: res[0].id,
              question: res[0].title.rendered,
              answer: res[0].content.rendered,
              slug: res[0].slug,
              category_name: "",
              category_slug: cat_slug,
              faq_category: res[0].faq_category
            };
          }
          return faq[0];
        })
    );
  }

  // Get FAQs by parent categories
  getSubMenus_ByParentCategory(catID, lang): Observable<FAQSubMenu[]> {
    this.language = lang;
    return this.faqCategoriesService
      .getFAQChildCategories(catID)
      .flatMap(child_categories => {
        if (child_categories.length !== 0) {
          return (
            this.dataFetcherService
              .get(
                this.config.FAQs_URL +
                  "?order=asc&per_page=100&faq_category=" +
                  catID +
                  "&lang=" +
                  this.language
              )
              // Cast response data to FAQ Category type
              .map((res: Array<any>) => {
                return FAQ.convertFAQsToChildCategories(
                  res,
                  child_categories,
                  ""
                );
              })
          );
        } else {
          return Observable.of([]);
        }
      });
  }
}
