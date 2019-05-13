import { Injectable, Injector } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { APP_CONFIG } from "../../app.config";
import { AppConfig } from "../../interfaces-and-classes/appConfig";
import { Restriction } from "../../interfaces-and-classes/restriction";
import { CookieService } from "ngx-cookie";
import { WordpressBaseDataService } from "../abstract-services/wordpress-base-data.service";
import { DataFetcherService } from "../utility/data-fetcher.service";

@Injectable()
export class RestrictionService extends WordpressBaseDataService<Restriction> {
  protected config: AppConfig;
  protected language: string;

  constructor(
    protected dataFetcherService: DataFetcherService,
    private injector: Injector,
    private _cookieService: CookieService
  ) {
    super(dataFetcherService, injector.get(APP_CONFIG).RESTRICTION_URL);
    this.config = injector.get(APP_CONFIG);

    if (typeof this._cookieService.get("language") === "undefined") {
      this.language = "en";
    } else {
      this.language = this._cookieService.get("language");
    }
  }

  getSingleRestriction(slug: string, lang: string): Observable<Restriction> {
    this.language = lang;
    return (
      this.getDataBySlug("_embed&slug=" + slug + "&lang=" + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => {
          return Restriction.convertToRestrictionType(res)[0];
        })
    );
  }

  getRestrictions(lang: string): Observable<Restriction[]> {
    this.language = lang;
    return (
      this.getData(null, "_embed&lang=" + this.language)
        // Cast response data to FAQ Category type
        .map((res: any) => {
          return Restriction.convertToRestrictionType(res);
        })
    );
  }
}
