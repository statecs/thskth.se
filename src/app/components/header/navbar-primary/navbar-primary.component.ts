import {Component, OnInit, Injectable, Injector, OnDestroy} from '@angular/core';
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
import {NotificationBarCommunicationService} from '../../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';
import {HrefToSlugPipe} from '../../../pipes/href-to-slug.pipe';

@Component({
  selector: 'app-navbar-primary',
  templateUrl: './navbar-primary.component.html',
  styleUrls: ['./navbar-primary.component.scss']
})
export class NavbarPrimaryComponent implements OnInit, OnDestroy {
    private menu: MenuItem[];
    public topLevelMainMenu: MenuItem2[];
    public subMenu: MenuItem2[];
    public language: string;
    public language_text: string;
    public language_img: string;
    protected config: AppConfig;
    public showSubmenuIndex: number;
    public ths_chapters: object[];
    public signin_text: string;
    private removeLangParamPipe: RemoveLangParamPipe;
    private addLangToSlugPipe: AddLangToSlugPipe;
    private hrefToSlugPipe: HrefToSlugPipe;
    public paramsSubscription: Subscription;
    public topLevelMenuSubscription: Subscription;
    public mainMenuSubscription: Subscription;

    constructor( private wordpressApiService: WordpressApiService,
                 injector: Injector,
                 private _cookieService: CookieService,
                 private router: Router,
                 private menusService: MenusService,
                 private activatedRoute: ActivatedRoute,
                 private notificationBarCommunicationService: NotificationBarCommunicationService) {
        this.config = injector.get(APP_CONFIG);
        this.ths_chapters = ths_chapters;
        this.removeLangParamPipe = new RemoveLangParamPipe();
        this.addLangToSlugPipe = new AddLangToSlugPipe();
        this.hrefToSlugPipe = new HrefToSlugPipe();
    }

    openInNewTab(link): void {
        window.open(link, '_blank');
    }

    goToPage(item): void {
        this.showSubmenuIndex = null;
        let slug = '';
        if (item.type_label === 'page') {
            slug = this.hrefToSlugPipe.transform(item.url);
            if (this.language === 'sv') {
                slug = this.removeLangParamPipe.transform(slug);
            }
            slug = this.addLangToSlugPipe.transform(slug, this.language);
            this.router.navigate([slug]);
        }else if (item.type_label === 'custom') {
            slug = item.url;
            if (slug.substring(0, 7) === 'http://' || slug.substring(0, 8) === 'https://') {
                window.open(slug, '_blank');
            }else {
                if (this.language === 'sv') {
                    slug = this.removeLangParamPipe.transform(slug);
                }
                slug = this.addLangToSlugPipe.transform(slug, this.language);
                this.router.navigate([slug]);
            }
            console.log(slug.substring(0, 7));
        }else if (item.type_label === 'association') {
            this.router.navigate(['/' + this.language + '/associations-and-chapters/' + item.object_slug]);
        }

        console.log(item.type_label);
        console.log(slug);
    }

    showSubMenu(id, index, submenu_item) {
        this.subMenu = [];
        const label = submenu_item.firstChild.nextSibling;
        if (id === 'chapters') {
            const dropdown = submenu_item.lastChild.previousSibling;
            dropdown.style.left = '-' + (157 - label.clientWidth  / 2) + 'px';
            this.showSubmenuIndex = index;
        }else {
            const dropdown = submenu_item.lastChild.previousSibling;
            dropdown.style.left = '-' + (157 - label.clientWidth  / 2) + 'px';
            this.showSubmenuIndex = index;
            this.mainMenuSubscription = this.menusService.get_mainSubMenu(id, this.language).subscribe((subMenu) => {
                console.log(subMenu);
                    this.subMenu = subMenu;
                },
                (error) => {
                    this.notificationBarCommunicationService.send_data(error);
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
        console.log(this.router);
        console.log(this.router.url);
        this.displayActualLanguage();
        this.getTopLevelMenu();
        if (this.language === 'en') {
            this.router.navigateByUrl('/en' + this.router.url.substring(3));
        }else if (this.language === 'sv') {
            this.router.navigateByUrl('/sv' + this.router.url.substring(3));
        }
        //location.reload();
    }

    displayActualLanguage() {
        console.log(this.language);
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
        this.topLevelMenuSubscription = this.menusService.getTopLevel_mainMenu(this.language).subscribe(res => {
                 console.log(res);
                this.topLevelMainMenu = res;
             },
             (error) => {
                 this.notificationBarCommunicationService.send_data(error);
             });
    }

    ngOnInit() {
        this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
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

    ngOnDestroy() {
        if (this.paramsSubscription) {
            this.paramsSubscription.unsubscribe();
        }
        if (this.mainMenuSubscription) {
            this.mainMenuSubscription.unsubscribe();
        }
        if (this.topLevelMenuSubscription) {
            this.topLevelMenuSubscription.unsubscribe();
        }
    }

}
