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
export class FooterNavigationService extends WordpressBaseDataService<MenuItem> {
    protected language: string;
    public footer_menu: any;

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private _cookieService: CookieService) {
        super(dataFetcherService, injector.get(APP_CONFIG).FOOTER_MENU_URL);

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
            this.footer_menu = localStorage.getItem('footer_menu_sv');
        }else {
            this.footer_menu = localStorage.getItem('footer_menu_en');
        }
        if (this.footer_menu) {
            return Observable.of(MainMenuItem.convertToMenuItemType(JSON.parse(this.footer_menu)));
        }
        return this.getData(null, '?order=desc&lang=' + this.language)
            .map((res: Array<any>) => {
                if (lang === 'sv') {
                    localStorage.setItem('footer_menu_sv', JSON.stringify(res));
                }else {
                    localStorage.setItem('footer_menu_en', JSON.stringify(res));
                }
                return MainMenuItem.convertToMenuItemType(res);
            });
    }
}
