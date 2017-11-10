import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { PagesService } from '../../../services/wordpress/pages.service';
import { MenusService } from '../../../services/wordpress/menus.service';
import {Page} from '../../../interfaces/page';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {RemoveLangParamPipe} from '../../../pipes/remove-lang-param.pipe';
import {AddLangToSlugPipe} from '../../../pipes/add-lang-to-slug.pipe';
import {NotificationBarCommunicationService} from '../../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';
import {HrefToSlugPipe} from '../../../pipes/href-to-slug.pipe';
import {TitleCommunicationService} from '../../../services/component-communicators/title-communication.service';
import {HideUICommunicationService} from '../../../services/component-communicators/hide-ui-communication.service';

@Component({
  selector: 'app-contact-subpage',
  templateUrl: './contact-subpage.component.html',
  styleUrls: ['./contact-subpage.component.scss']
})
export class ContactSubpageComponent implements OnInit, OnDestroy {

  @ViewChild('submenu_bar') submenu_bar: ElementRef;
  public page: Page;
  public subMenu: any;
  public slug: string;
  private lang: string;
  private removeLangParamPipe: any;
  private addLangToSlugPipe: AddLangToSlugPipe;
  public loading: boolean;
  public pageNotFound: boolean;
  public showSubmenuBarDropdown: boolean;
  public freeze_submenu_bar: boolean;
  private submenu_bar_pos: number;
  public paramsSubscription: Subscription;
  public parentParamsSubscription: Subscription;
  public secondarySubMenuSubscription: Subscription;
  public mainMenuSubscription: Subscription;
  public pageSubscription: Subscription;
  public hideUISubscription: Subscription;
  private hrefToSlugPipe: HrefToSlugPipe;
  public infoBoxClickCount: number;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusService: MenusService,
              private notificationBarCommunicationService: NotificationBarCommunicationService,
              private titleCommunicationService: TitleCommunicationService,
              private hideUICommunicationService: HideUICommunicationService) {
    this.loading = true;
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
    this.hrefToSlugPipe = new HrefToSlugPipe();
    this.pageNotFound = false;
    this.showSubmenuBarDropdown = false;
    this.freeze_submenu_bar = false;
    this.subMenu = [];
    this.infoBoxClickCount = 0;
  }

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
    this.infoBoxClickCount += 1;
    (this.showSubmenuBarDropdown ? this.hideDropdown() : this.showSubmenuBarDropdown = true);
  }

  hideDropdown(): void {
    this.showSubmenuBarDropdown = false;
  }

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

/*  goToPage(slug): void {
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

  getSecondarySubMenu() {
    this.secondarySubMenuSubscription = this.menusService.get_secondarySubMenu('contact', this.slug, this.lang).subscribe((submenu) => {
          this.subMenu = submenu;
        },
        (error) => {
          console.log(error);
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getSubmenu() {
    this.mainMenuSubscription = this.menusService.get_mainSubMenu(this.slug, this.lang).subscribe((submenu) => {
          this.subMenu = submenu;
        },
        (error) => {
          console.log(error);
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  getPageBySlug() {
    this.pageSubscription = this.pagesService.getPageBySlug(this.slug, this.lang).subscribe((page) => {
          this.loading = false;
          if (page) {
            this.page = page;
            this.titleCommunicationService.setTitle(page.name);
          }else {
            this.pageNotFound = true;
            if (this.lang === 'sv') {
              this.titleCommunicationService.setTitle('Sidan hittades inte!');
            }else {
              this.titleCommunicationService.setTitle('Page not found!');
            }
          }
        },
        (error) => {
          console.log(error);
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  ngOnInit() {
    const self = this;
    setTimeout(function () {
      self.submenu_bar_pos = self.submenu_bar.nativeElement.offsetTop;
      self.toggle_freeze_submenu_bar();
    }, 1000);

    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.loading = true;
      this.slug = params['slug'];
      if (typeof this.slug === 'undefined') {
        this.slug = 'contact';
      }

      this.parentParamsSubscription = this.activatedRoute.parent.params.subscribe((params2: Params) => {
        this.loading = true;
        this.lang = params2['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }
        console.log(this.lang);
        this.getPageBySlug();
        if (this.slug !== 'contact' && this.slug !== 'faq') {
          this.getSecondarySubMenu();
        }else {
          this.getSubmenu();
        }
      });
    });

    this.hideUISubscription = this.hideUICommunicationService.hideUIObservable$.subscribe(() => {
      if (this.infoBoxClickCount === 0) {
        this.hideDropdown();
        this.infoBoxClickCount += 1;
      }else {
        this.infoBoxClickCount = 0;
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
    if (this.secondarySubMenuSubscription) {
      this.secondarySubMenuSubscription.unsubscribe();
    }
    if (this.mainMenuSubscription) {
      this.mainMenuSubscription.unsubscribe();
    }
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
    if (this.hideUISubscription) {
      this.hideUISubscription.unsubscribe();
    }
  }
}
