import {Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { NavbarPrimaryComponent } from './navbar-primary/navbar-primary.component';
import { NavbarSectionsComponent } from '../footer/navbar-sections/navbar-sections.component';
import { HeaderCommunicationService } from '../../services/component-communicators/header-communication.service';
import { SearchMenubarCommunicationService } from '../../services/component-communicators/search-menubar-communication.service';
import {MenusService} from '../../services/wordpress/menus.service';
import {MenuItem2} from '../../interfaces/menu';
import { ths_chapters } from '../../utils/ths-chapters';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RemoveLangParamPipe} from '../../pipes/remove-lang-param.pipe';
import {AddLangToSlugPipe} from '../../pipes/add-lang-to-slug.pipe';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('app_header') app_header: ElementRef;
  private topLevelMainMenu: MenuItem2[];
  public showMenuMobile: boolean;
  public showChaptersMobile: boolean;
  public ths_chapters: object[];
  public placeholder: string;
  public lang: string;
  public subMenu: MenuItem2[];
  private showSubmenuIndex: number;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;
  public paramsSubscription: Subscription;
  public mainMenuSubscription: Subscription;
  public topLevelMenuSubscription: Subscription;
  public headerSubscription: Subscription;
  public searchTerm: string;
  public language_img: string;
  public signin_text: string;
  public language_text: string;

  constructor(private headerCommunicationService: HeaderCommunicationService,
              private searchMenubarCommunicationService: SearchMenubarCommunicationService,
              private menusService: MenusService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.showMenuMobile = false;
    this.showChaptersMobile = false;
    this.ths_chapters = ths_chapters;
    this.subMenu = [];
    this.searchTerm = '';
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
  }

  toggleChaptersMobile(event): void {
    (this.showChaptersMobile === true ? this.showChaptersMobile = false : this.showChaptersMobile = true);
    if (this.showChaptersMobile) {
      event.target.style.transform = 'rotate(90deg)';
    }else {
      event.target.style.transform = 'rotate(0deg)';
    }
  }

  toggleMenuMobile(): void {
    (this.showMenuMobile === true ? this.showMenuMobile = false : this.showMenuMobile = true);
  }

  showSearchMenubar(): void {
    this.searchMenubarCommunicationService.showSearchMenubar();
  }

  expendHeader() {
    this.app_header.nativeElement.style.top = '0';
  }

  collapseHeader() {
    this.app_header.nativeElement.style.top = '-150px';
  }

  setPlaceholder(): void {
    console.log(this.lang);
    if (this.lang === 'sv') {
      this.placeholder = 'Sök THS';
    }else {
      this.placeholder = 'Search THS and beyond';
    }
  }

  showSubMenu(id, index) {
    this.subMenu = [];
    this.showSubmenuIndex = index;
    this.mainMenuSubscription = this.menusService.get_mainSubMenu(id, this.lang).subscribe((subMenu) => {
      this.subMenu = subMenu;
      console.log(this.subMenu);
      //const dropdown = submenu_item.lastChild.previousSibling;
      //dropdown.style.left = '-' + (157 - label.clientWidth  / 2) + 'px';
    },
    (error) => {
      this.notificationBarCommunicationService.send_data(error);
    });
  }

  navToSearchPage(url): void {
    if (this.lang === 'en') {
      this.router.navigateByUrl('/en' + url + '?q=' + this.searchTerm);
    }else if (this.lang === 'sv') {
      this.router.navigateByUrl('/sv' + url + '?q=' + this.searchTerm);
    }
  }

  hideSubMenu(i): void {
    this.showSubmenuIndex = -1;
  }

  switchLanguage() {
    if (this.lang === 'en') {
      this.lang = 'sv';
    }else if (this.lang === 'sv') {
      this.lang = 'en';
    }
  }

  changeLanguage() {
    this.switchLanguage();
    this.displayActualLanguage();
    if (this.lang === 'en') {
      this.router.navigateByUrl('/en' + this.router.url.substring(3));
    }else if (this.lang === 'sv') {
      this.router.navigateByUrl('/sv' + this.router.url.substring(3));
    }
  }

  goToPage(slug): void {
    if (this.lang === 'sv') {
      slug = this.removeLangParamPipe.transform(slug);
    }
    slug = this.addLangToSlugPipe.transform(slug, this.lang);
    this.router.navigate([slug]);
  }

  displayActualLanguage() {
    if (this.lang === 'en' || typeof this.lang === 'undefined') {
      this.language_text = 'THS in swedish';
      this.language_img = '../../../assets/images/sweden_flag.png';
      this.signin_text = 'Sign in';
    }else if (this.lang === 'sv') {
      this.language_text = 'THS i engelska';
      this.language_img = '../../../assets/images/British_flag.png';
      this.signin_text = 'Logga in';
    }
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.lang = 'en';
      }
      this.setPlaceholder();
      this.topLevelMenuSubscription = this.menusService.getTopLevel_mainMenu(this.lang).subscribe(res => {
        this.topLevelMainMenu = res;
      },
      (error) => {
        this.notificationBarCommunicationService.send_data(error);
      });
    });
    this.displayActualLanguage();
    this.headerSubscription = this.headerCommunicationService.notifyObservable$.subscribe((arg) => {
      if (arg === 'expend') {
        this.expendHeader();
      }else if (arg === 'collapse') {
        this.collapseHeader();
      }
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
    if (this.headerSubscription) {
      this.headerSubscription.unsubscribe();
    }
  }

}
