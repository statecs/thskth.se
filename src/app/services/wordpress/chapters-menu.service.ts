import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { APP_CONFIG } from '../../app.config';
import {IMenuItem} from '../../interfaces-and-classes/menu';
import { CookieService } from 'ngx-cookie';
import {DataFetcherService} from '../utility/data-fetcher.service';
import {WordpressBaseDataService} from '../abstract-services/wordpress-base-data.service';

@Injectable()
export class ChaptersMenuService extends WordpressBaseDataService<ChapterMenu> {
    protected language: string;
    public chapters_menu: any;

    constructor(protected dataFetcherService: DataFetcherService,
                private injector: Injector,
                private _cookieService: CookieService) {
        super(dataFetcherService, injector.get(APP_CONFIG).CHAPTER_MENU_URL);

        if (typeof this._cookieService.get('language') === 'undefined') {
            this.language = 'en';
        } else {
            this.language = this._cookieService.get('language');
        }

    }

    // Get Footer Menu
    getMenu(lang: string): Observable<ChapterMenu[]>  {
        this.language = lang;
        if (lang === 'sv') {
            this.chapters_menu = localStorage.getItem('chapter_menu_sv');
        }else {
            this.chapters_menu = localStorage.getItem('chapter_menu_en');
        }
        if (this.chapters_menu) {
            return Observable.of(JSON.parse(this.chapters_menu));
        }
        return this.getData(null, '?order=desc&lang=' + this.language)
            .map((res: any) => {
                const items = ChapterMenu.convertMenuToChapterMenuType(res.items);
                if (lang === 'sv') {
                    localStorage.setItem('chapter_menu_sv', JSON.stringify(items));
                }else {
                    localStorage.setItem('chapter_menu_en', JSON.stringify(items));
                }
                return items;
            });
    }
}

export class ChapterMenu implements IMenuItem {
    id: number;
    object_slug: number;
    title: string;
    url: string;
    type_label: string;
    children: any;
    image: string;

    static convertMenuToChapterMenuType(res): ChapterMenu[] {
        const chapter_menu: Array<ChapterMenu> = [];
        if (res) {
            for (const item of res) {
                chapter_menu.push({
                    id: item.id,
                    object_slug : item.object_slug,
                    title : item.title,
                    url : item.url,
                    type_label : item.object,
                    children: null,
                    image: item.attr,
                });
            }
        }
        return chapter_menu;
    }
}