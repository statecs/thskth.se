import { Component, OnInit, Injectable, Injector } from '@angular/core';
import {WordpressApiService} from '../../../services/wordpress/wordpress-api.service';
import {MenusService} from '../../../services/wordpress/menus.service';
import {MenuItem, MenuItem2} from '../../../interfaces/menu';
import { AppConfig } from '../../../interfaces/appConfig';
import { APP_CONFIG } from '../../../app.config';
import { CookieService } from 'ngx-cookie';
import { ths_chapters } from '../../../utils/ths-chapters';

@Component({
  selector: 'app-navbar-primary',
  templateUrl: './navbar-primary.component.html',
  styleUrls: ['./navbar-primary.component.scss']
})
export class NavbarPrimaryComponent implements OnInit {
    private menu: MenuItem[];
    private topLevelMainMenu: MenuItem2[];
    public subMenu: MenuItem2[];
    public language: string;
    public language_text: string;
    public language_img: string;
    protected config: AppConfig;
    private showSubmenuIndex: number;
    public ths_chapters: object[];

    constructor( private wordpressApiService: WordpressApiService,
                 injector: Injector,
                 private _cookieService: CookieService,
                 private menusService: MenusService) {
        this.config = injector.get(APP_CONFIG);
        this.ths_chapters = ths_chapters.slice(0, 5);
    }

    showSubMenu(id, index, submenu_item) {
        this.showSubmenuIndex = index;
        const label = submenu_item.firstChild.nextSibling;
        if (id === 'chapters') {
            const dropdown = submenu_item.lastChild.previousSibling;
            dropdown.style.left = '-' + (157 - label.clientWidth  / 2) + 'px';
        }else {
            this.menusService.get_mainSubMenu(id).subscribe((subMenu) => {
                this.subMenu = subMenu;
                const dropdown = submenu_item.lastChild.previousSibling;
                dropdown.style.left = '-' + (157 - label.clientWidth  / 2) + 'px';
            });
        }
    }

    hideSubMenu() {
        this.showSubmenuIndex = null;
    }

    changeLanguage() {
        if (this._cookieService.get('language') !== 'undefined') {
            this.config.LANGUAGE = this._cookieService.get('language');
        }
        if (this.config.LANGUAGE === 'en') {
            this.config.LANGUAGE = 'sv';
        }else if (this.config.LANGUAGE === 'sv') {
            this.config.LANGUAGE = 'en';
        }
        this._cookieService.put('language', this.config.LANGUAGE);
        location.reload();
    }

    displayActualLanguage() {
        if (this._cookieService.get('language') === 'en' || typeof this._cookieService.get('language') === 'undefined') {
            this.language_text = 'THS in swedish';
            this.language_img = '../../../../assets/images/sweden_flag.png';
        }else if (this._cookieService.get('language') === 'sv') {
            this.language_text = 'THS i engelska';
            this.language_img = '../../../../assets/images/British_flag.png';
        }
    }

    ngOnInit() {
        this.menusService.getTopLevel_mainMenu()
            .subscribe(res => {
                this.topLevelMainMenu = res;
                console.log(res);
            });

        this.displayActualLanguage();
        console.log(this.config.LANGUAGE);
        console.log(this._cookieService.get('language'));
    }

}
