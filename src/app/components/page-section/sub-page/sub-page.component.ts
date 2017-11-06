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
import {MenuItem2} from '../../../interfaces/menu';
import {HrefToSlugPipe} from '../../../pipes/href-to-slug.pipe';

@Component({
  selector: 'app-sub-page',
  templateUrl: './sub-page.component.html',
  styleUrls: ['./sub-page.component.scss'],
  providers: [NotificationBarComponent]
})
export class SubPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('submenu_bar') submenu_bar: ElementRef;
  public page: Page;
  public subMenu: MenuItem2[];
  public slug: string;
  private lang: string;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;
  private hrefToSlugPipe: HrefToSlugPipe;
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
  public parent_slug: string;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusService: MenusService,
              private notificationBarComponent: NotificationBarComponent,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.loading = true;
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
    this.hrefToSlugPipe = new HrefToSlugPipe();
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

/*  goToPage(slug): void {
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
  }*/

  goToPage(item): void {
    let slug = '';
    if (item.type_label === 'page') {
      slug = this.hrefToSlugPipe.transform(item.url);
      if (this.lang === 'sv') {
        slug = this.removeLangParamPipe.transform(slug);
      }
      slug = this.addLangToSlugPipe.transform(slug, this.lang);
      this.router.navigate([slug]);
    }else if (item.type_label === 'custom') {
      slug = item.url;
      if (slug.substring(0, 7) === 'http://' || slug.substring(0, 8) === 'https://') {
        window.open(slug, '_blank');
      }else {
        if (this.lang === 'sv') {
          slug = this.removeLangParamPipe.transform(slug);
        }
        slug = this.addLangToSlugPipe.transform(slug, this.lang);
        this.router.navigate([slug]);
      }
      console.log(slug.substring(0, 7));
    }else if (item.type_label === 'association') {
      this.router.navigate(['/' + this.lang + '/associations-and-chapters/' + item.object_slug]);
    }

    console.log(item.type_label);
    console.log(slug);
  }

  getSecondarySubMenu() {
    console.log(this.slug);
    this.secondaryMenuSubscription = this.menusService.get_secondarySubMenu(this.parent_slug, this.slug, this.lang).subscribe((submenu) => {
          this.subMenu = submenu;
          console.log(this.subMenu);
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getSubmenu() {
    console.log(this.slug);
    this.mainMenuSubscription = this.menusService.get_mainSubMenu(this.slug, this.lang).subscribe((submenu) => {
          this.subMenu = submenu;
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getParentPageBySlug() {
    this.pageSubscription = this.pagesService.getPageBySlug(this.parent_slug, this.lang).subscribe((page) => {
          console.log(page);
          if (page) {
            this.getPageBySlug();
          }else {
            this.loading = false;
            this.pageNotFound = true;
          }
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
      this.loading = true;
      this.slug = params['slug'];
      this.parent_slug = params['subpage'];
      if (typeof this.slug === 'undefined') {
        this.slug = this.parent_slug;
        this.lang = params['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }else if (this.lang !== 'en' && this.lang !== 'sv') {
          this.lang = 'en';
        }
        this.getSubmenu();
        this.getPageBySlug();
      }else {
        this.parentParamsSubscription = this.activatedRoute.parent.params.subscribe((params2: Params) => {
          this.loading = true;
          this.lang = params2['lang'];
          console.log(this.lang);
          this.parent_slug = params2['subpage'];
          console.log(this.parent_slug);
          if (typeof this.lang === 'undefined') {
            this.lang = 'en';
          }else if (this.lang !== 'en' && this.lang !== 'sv') {
            this.lang = 'en';
          }
          this.getSecondarySubMenu();
          this.getParentPageBySlug();
        });
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
