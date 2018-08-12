import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { APP_CONFIG } from '../../app.config';
import {MainMenuItem, MenuItem} from '../../interfaces-and-classes/menu';
import { CookieService } from 'ngx-cookie';
import {DataFetcherService} from '../utility/data-fetcher.service';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';

@Injectable()
export class SectionNavigationService extends WordpressBaseDataService<MenuItem> {
    protected language: string;
    public sections_menu: any;

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private _cookieService: CookieService) {
        super(dataFetcherService, injector.get(APP_CONFIG).SECTIONS_MENU_URL);

        if (typeof this._cookieService.get('language') === 'undefined') {
            this.language = 'en';
        } else {
            this.language = this._cookieService.get('language');
        }

    }

    // Get Footer Menu
    getMenu(lang: string): Observable<MainMenuItem[]>  {
        this.language = lang;
        if (lang === 'sv') {
            this.sections_menu = localStorage.getItem('sections_menu_sv');
        }else {
            this.sections_menu = localStorage.getItem('sections_menu_en');
        }
        if (this.sections_menu) {
            return Observable.of(MainMenuItem.convertToMenuItemType(JSON.parse(this.sections_menu)));
        }
        return this.getData(null, '?order=desc&lang=' + this.language)
            .map((res: Array<any>) => {
                if (lang === 'sv') {
                    localStorage.setItem('sections_menu_sv', JSON.stringify(res));
                }else {
                    localStorage.setItem('sections_menu_en', JSON.stringify(res));
                }
                return MainMenuItem.convertToMenuItemType(res);
            });
    }
}
