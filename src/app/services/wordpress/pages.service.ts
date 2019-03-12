import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { APP_CONFIG } from "../../app.config";
import { AppConfig } from "../../interfaces-and-classes/appConfig";
import { CookieService } from "ngx-cookie";
import { Page } from "../../interfaces-and-classes/page";
import { WordpressBaseDataService } from "../abstract-services/wordpress-base-data.service";
import { DataFetcherService } from "../utility/data-fetcher.service";
import { SearchResult } from "../../interfaces-and-classes/search";

@Injectable()
export class PagesService extends WordpressBaseDataService<Page> {
  protected config: AppConfig;
  protected language: string;

  constructor(
    protected dataFetcherService: DataFetcherService,
    private injector: Injector,
    private _cookieService: CookieService
  ) {
    super(dataFetcherService, injector.get(APP_CONFIG).PAGES_URL);
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get("language") === "undefined") {
      this.language = "en";
    } else {
      this.language = this._cookieService.get("language");
    }
  }

  getPageBySlug(slug, lang): Observable<Page> {
    console.log("getPage", lang);
    return this.getDataBySlug("slug=" + slug + "&lang=" + lang).map(
      (res: any) => {
        return Page.convertToPageType(res[0]);
      }
    );
  }

  searchPages(
    searchTerm: string,
    amount: number,
    lang: string
  ): Observable<SearchResult[]> {
    this.language = lang;
    return (
      this.searchData(
        "?per_page=" +
          amount +
          "&search=" +
          searchTerm +
          "&lang=" +
          this.language
      )
        // Cast response data to FAQ Category type
        .map((res: any) => {
          return SearchResult.convertPagesToSearchResultType(res);
        })
    );
  }
}
