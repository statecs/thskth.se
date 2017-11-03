import {Component, OnDestroy, OnInit} from '@angular/core';
import { PagesService } from '../../../services/wordpress/pages.service';
import { MenusService } from '../../../services/wordpress/menus.service';
import {Page} from '../../../interfaces/page';
import { Router, ActivatedRoute, Params} from '@angular/router';
import {NotificationBarCommunicationService} from '../../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit, OnDestroy {

  public page: Page;
  public subMenu: any;
  public slug: string;
  private lang: string;
  public paramsSubscription: Subscription;
  public parentParamsSubscription: Subscription;
  public pageSubscription: Subscription;
  public secondaryMenuSubscription: Subscription;
  public mainMenuSubscription: Subscription;

  constructor(private pagesService: PagesService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private menusService: MenusService,
              private notificationBarCommunicationService: NotificationBarCommunicationService) { }

  goToPage(slug): void {
    console.log(slug);
    if (slug.indexOf('http://') === 0 || slug.indexOf('https://') === 0 || slug.indexOf('www.') === 0) {
      window.open(slug, '_black');
    }else {
      this.router.navigate([slug]);
    }
  }

  getSecondarySubMenu() {
    this.secondaryMenuSubscription = this.menusService.get_secondarySubMenu('live', this.slug, this.lang).subscribe((submenu) => {
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
    this.pageSubscription = this.pagesService.getPageBySlug(this.slug, this.lang).subscribe((page) => {
          this.page = page;
        },
        (error) => {
          this.notificationBarCommunicationService.send_data(error);
        });
  }

  ngOnInit() {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      console.log(params['lang']);
      this.slug = params['slug'];
      if (typeof this.slug === 'undefined') {
        this.slug = 'live';
      }

      if (this.slug !== 'live') {
        this.parentParamsSubscription = this.activatedRoute.parent.params.subscribe((params2: Params) => {
          this.lang = params2['lang'];
          console.log(this.lang);
          if (typeof this.lang === 'undefined') {
            this.lang = 'en';
          }
          this.getSecondarySubMenu();
          this.getPageBySlug();
        });
      }else {
        this.lang = params['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }
        this.getSubmenu();
        this.getPageBySlug();
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.parentParamsSubscription.unsubscribe();
    this.pageSubscription.unsubscribe();
    this.mainMenuSubscription.unsubscribe();
    this.secondaryMenuSubscription.unsubscribe();
  }
}
