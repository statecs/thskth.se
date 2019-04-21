import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { APP_CONFIG } from "../../app.config";
import { Other } from "../../interfaces-and-classes/chapters_associations";
import { CookieService } from "ngx-cookie";
import { WordpressBaseDataService } from "../abstract-services/wordpress-base-data.service";
import { DataFetcherService } from "../utility/data-fetcher.service";

@Injectable()
export class OthersService extends WordpressBaseDataService<Other> {
  protected language: string;

  constructor(
    protected dataFetcherService: DataFetcherService,
    private injector: Injector,
    private _cookieService: CookieService
  ) {
    super(dataFetcherService, injector.get(APP_CONFIG).OTHER_URL);

    if (typeof this._cookieService.get("language") === "undefined") {
      this.language = "en";
    } else {
      this.language = this._cookieService.get("language");
    }
  }

  getOtherBySlug(slug, lang: string): Observable<Other[]> {
    return (
      this.getDataBySlug("slug=" + slug + "&_embed" + "&lang=" + lang)
        // Cast response data to FAQ Category type
        .map((res: any) => {
          return Other.convertToOtherType(res);
        })
    );
  }

  getOthers(lang: string): Observable<Other[]> {
    return (
      this.getData(null, "per_page=100&order=asc&_embed" + "&lang=" + lang)
        // Cast response data to FAQ Category type
        .map((res: any) => {
          console.log(res);
          return Other.convertToOtherType(res);
        })
    );
  }

  searchOthers(searchTerm: string, lang: string): Observable<Other[]> {
    return (
      this.searchData(
        "per_page=100&_embed&search=" + searchTerm + "&lang=" + lang
      )
        // Cast response data to FAQ Category type
        .map((res: any) => {
          return Other.convertToOtherType(res);
        })
    );
  }
}
