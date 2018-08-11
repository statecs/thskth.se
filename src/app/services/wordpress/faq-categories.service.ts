import {Injectable, Injector} from '@angular/core';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';
import {AppConfig} from '../../interfaces-and-classes/appConfig';
import {FAQ, FAQCategory} from '../../interfaces-and-classes/faq';
import {DataFetcherService} from '../utility/data-fetcher.service';
import {CookieService} from 'ngx-cookie';
import {APP_CONFIG} from '../../app.config';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FaqCategoriesService extends WordpressBaseDataService<FAQ> {
    protected config: AppConfig;
    protected language: string;

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private _cookieService: CookieService) {
        super(dataFetcherService, injector.get(APP_CONFIG).FAQ_CATEGORIES_URL);
        this.config = injector.get(APP_CONFIG);

        if (typeof this._cookieService.get('language') === 'undefined') {
            this.language = 'en';
        }else {
            this.language = this._cookieService.get('language');
        }
    }

    // Get FAQ Parent Categories
    getFAQParentCategories(lang: string): Observable<FAQCategory[]> {
        this.language = lang;
        return this.getData(null, '?order=asc&parent=0' + '&lang=' + this.language)
            // Cast response data to FAQ Category type
            .map((res: Array<any>) => { return FAQ.castDataToFAQCategory(res); });
    }

    // Get FAQ Child Categories
    getFAQChildCategories(parentID): Observable<FAQCategory[]> {
        return this.getDataById(this.config.FAQ_CATEGORIES_URL + '?order=asc&parent=' + parentID + '&lang=' + this.language)
            // Cast response data to FAQ Category type
            .map((res: Array<any>) => { return FAQ.convertToFAQSubMenuType(res); });
    }
}
