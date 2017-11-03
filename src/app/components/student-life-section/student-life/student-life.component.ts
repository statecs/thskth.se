import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { PagesService } from '../../../services/wordpress/pages.service';
import { MenusService } from '../../../services/wordpress/menus.service';
import {Page} from '../../../interfaces/page';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {RemoveLangParamPipe} from '../../../pipes/remove-lang-param.pipe';
import {AddLangToSlugPipe} from '../../../pipes/add-lang-to-slug.pipe';
import {NotificationBarComponent} from '../../notification-bar/notification-bar.component';
import {NotificationBarCommunicationService} from '../../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-student-life',
  templateUrl: './student-life.component.html',
  styleUrls: ['./student-life.component.scss'],
  providers: [NotificationBarComponent]
})
export class StudentLifeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('submenu_bar') submenu_bar: ElementRef;
  public page: Page;
  public subMenu: any;
  public slug: string;
  private lang: string;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;
  public loading: boolean;
  public pageNotFound: boolean;
  public showSubmenuBarDropdown: boolean;
  public freeze_submenu_bar: boolean;
  private submenu_bar_pos: number;
  public paramsSubscription: Subscription;
  public parentParamsSubscription: Subscription;
  public secondaryMenuSubscription: Subscription;
  public mainMenuSubscription: Subscription;
  public pageSubscription: Subscription;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusService: MenusService,
              private notificationBarComponent: NotificationBarComponent,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.loading = true;
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
    this.showSubmenuBarDropdown = false;
    this.freeze_submenu_bar = false;
  }
/*
  getOffsetTop(elem): number {
    let offsetTop = 0;
    do {
      if ( !isNaN( elem.offsetTop ) ) {
        offsetTop += elem.offsetTop;
      }
    } while ( elem = elem.offsetParent );
    return offsetTop;
  }*/

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.toggle_freeze_submenu_bar();
  }

  toggle_freeze_submenu_bar() {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop);
    console.log('pos: ' + pos);
    console.log('pos_bar: ' + this.submenu_bar_pos);
    if (pos >= this.submenu_bar_pos) {
      if (!this.freeze_submenu_bar) {
        console.log('pass');
        this.freeze_submenu_bar = true;
      }
    } else {
      if (this.freeze_submenu_bar) {
        console.log('pass');
        this.freeze_submenu_bar = false;
      }
    }
  }

  toggleSubmenuBarDropdown(): void {
    (this.showSubmenuBarDropdown ? this.showSubmenuBarDropdown = false : this.showSubmenuBarDropdown = true);
  }

  goToPage(slug): void {
    console.log(slug);
    if (slug.indexOf('http://') === 0 || slug.indexOf('https://') === 0 || slug.indexOf('www.') === 0) {
      window.open(slug, '_black');
    }else {
      if (this.lang === 'sv') {
        slug = this.removeLangParamPipe.transform(slug);
      }
      slug = this.addLangToSlugPipe.transform(slug, this.lang);
      this.router.navigate([slug]);
    }
  }

  getSecondarySubMenu() {
    console.log(this.slug);
    this.secondaryMenuSubscription = this.menusService.get_secondarySubMenu('student-life', this.slug, this.lang).subscribe((submenu) => {
          this.subMenu = submenu;
          console.log(this.subMenu);
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getSubmenu() {
    this.mainMenuSubscription = this.menusService.get_mainSubMenu(this.slug, this.lang).subscribe((submenu) => {
          this.subMenu = submenu;
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getPageBySlug() {
    console.log(this.slug + this.lang);
    this.pageSubscription = this.pagesService.getPageBySlug(this.slug, this.lang).subscribe((page) => {
          this.loading = false;
          console.log(page);
          if (page) {
            this.page = page;
          }else {
            this.pageNotFound = true;
          }
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  ngAfterViewInit() {
    const self = this;
    setTimeout(function () {
      self.submenu_bar_pos = self.submenu_bar.nativeElement.offsetTop;
      self.toggle_freeze_submenu_bar();
    }, 1000);

    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      console.log(params['lang']);
      this.slug = params['slug'];
      if (typeof this.slug === 'undefined') {
        this.slug = 'student-life';
      }

      if (this.slug !== 'student-life') {
        this.parentParamsSubscription = this.activatedRoute.parent.params.subscribe((params2: Params) => {
          this.lang = params2['lang'];
          console.log(this.lang);
          if (typeof this.lang === 'undefined') {
            this.lang = 'en';
          }else if (this.lang !== 'en' && this.lang !== 'sv') {
            this.lang = 'en';
          }
          this.getSecondarySubMenu();
          this.getPageBySlug();
        });
      }else {
        this.lang = params['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }else if (this.lang !== 'en' && this.lang !== 'sv') {
          this.lang = 'en';
        }
        this.getSubmenu();
        this.getPageBySlug();
      }
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.parentParamsSubscription) {
      this.parentParamsSubscription.unsubscribe();
    }
    if (this.secondaryMenuSubscription) {
      this.secondaryMenuSubscription.unsubscribe();
    }
    if (this.mainMenuSubscription) {
      this.mainMenuSubscription.unsubscribe();
    }
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  }
}
