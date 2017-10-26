import { Component, OnInit, Injectable, Injector } from '@angular/core';
import {WordpressApiService} from '../../../services/wordpress/wordpress-api.service';
import {MenusService} from '../../../services/wordpress/menus.service';
import {MenuItem, MenuItem2} from '../../../interfaces/menu';
import { AppConfig } from '../../../interfaces/appConfig';
import { APP_CONFIG } from '../../../app.config';
import { CookieService } from 'ngx-cookie';
import { ths_chapters } from '../../../utils/ths-chapters';
import {ActivatedRoute, Router, Params} from '@angular/router';
import {RemoveLangParamPipe} from '../../../pipes/remove-lang-param.pipe';
import {AddLangToSlugPipe} from '../../../pipes/add-lang-to-slug.pipe';

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
    public signin_text: string;
    private removeLangParamPipe: RemoveLangParamPipe;
    private addLangToSlugPipe: AddLangToSlugPipe;

    constructor( private wordpressApiService: WordpressApiService,
                 injector: Injector,
                 private _cookieService: CookieService,
                 private router: Router,
                 private menusService: MenusService,
                 private activatedRoute: ActivatedRoute) {
        this.config = injector.get(APP_CONFIG);
        this.ths_chapters = ths_chapters;
        this.removeLangParamPipe = new RemoveLangParamPipe();
        this.addLangToSlugPipe = new AddLangToSlugPipe();
    }

    openInNewTab(link): void {
        window.open(link, '_blank');
    }

    goToPage(slug): void {
        if (this.language === 'sv') {
            slug = this.removeLangParamPipe.transform(slug);
        }
        slug = this.addLangToSlugPipe.transform(slug, this.language);
        this.router.navigate([slug]);
    }

    showSubMenu(id, index, submenu_item) {
        this.showSubmenuIndex = index;
        const label = submenu_item.firstChild.nextSibling;
        if (id === 'chapters') {
            const dropdown = submenu_item.lastChild.previousSibling;
            dropdown.style.left = '-' + (157 - label.clientWidth  / 2) + 'px';
        }else {
            this.menusService.get_mainSubMenu(id, this.language).subscribe((subMenu) => {
                this.subMenu = subMenu;
                const dropdown = submenu_item.lastChild.previousSibling;
                dropdown.style.left = '-' + (157 - label.clientWidth  / 2) + 'px';
            });
        }
    }

    hideSubMenu() {
        this.showSubmenuIndex = null;
    }

    switchLanguage() {
        if (this.language === 'en') {
            this.language = 'sv';
        }else if (this.language === 'sv') {
            this.language = 'en';
        }
    }

    changeLanguage() {
        /*if (typeof this._cookieService.get('language') !== 'undefined') {
            this.config.LANGUAGE = this._cookieService.get('language');
            this.switchLanguage();
        }else {
            this.switchLanguage();
        }*/
        this.switchLanguage();
        console.log(this.router.url);
        if (this.language === 'en') {
            this.router.navigate(['/en' + this.router.url.substring(3)]);
        }else if (this.language === 'sv') {
            this.router.navigate(['/sv' + this.router.url.substring(3)]);
        }
        //location.reload();

    }

    displayActualLanguage() {
        if (this.language === 'en' || typeof this.language === 'undefined') {
            this.language_text = 'THS in swedish';
            this.language_img = '../../../../assets/images/sweden_flag.png';
            this.signin_text = 'Sign in';
        }else if (this.language === 'sv') {
            this.language_text = 'THS i engelska';
            this.language_img = '../../../../assets/images/British_flag.png';
            this.signin_text = 'Logga in';
        }
    }

    getTopLevelMenu(): void {
        console.log(this.language);
         this.menusService.getTopLevel_mainMenu(this.language).subscribe(res => {
             console.log(res);
            this.topLevelMainMenu = res;
         });
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.language = params['lang'];
            if (typeof this.language === 'undefined') {
                this.language = 'en';
            }else if (this.language !== 'en' && this.language !== 'sv') {
                this.language = 'en';
            }
            this.getTopLevelMenu();
            this.displayActualLanguage();
        });
    }

}
