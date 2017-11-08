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
  private hrefToSlugPipe: HrefToSlugPipe;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusService: MenusService,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.loading = true;
    this.removeLangParamPipe = new RemoveLangParamPipe();
    this.addLangToSlugPipe = new AddLangToSlugPipe();
    this.hrefToSlugPipe = new HrefToSlugPipe();
    this.pageNotFound = false;
    this.showSubmenuBarDropdown = false;
    this.freeze_submenu_bar = false;
    this.subMenu = [];
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
    (this.showSubmenuBarDropdown ? this.showSubmenuBarDropdown = false : this.showSubmenuBarDropdown = true);
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
    console.log(this.lang);
    console.log(this.slug + this.lang);
    this.pageSubscription = this.pagesService.getPageBySlug(this.slug, this.lang).subscribe((page) => {
          this.loading = false;
          console.log(page);
          console.log(this.loading);
          if (page) {
            this.page = page;
          }else {
            this.pageNotFound = true;
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
        console.log(this.lang);
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
  }
}
