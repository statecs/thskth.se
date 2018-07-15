import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from '../../../interfaces-and-classes/menu';
import {MenusService} from '../../../services/wordpress/menus.service';
import {Router, RoutesRecognized} from '@angular/router';
import {NotificationBarCommunicationService} from '../../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';
import {HrefToSlugPipe} from '../../../pipes/href-to-slug.pipe';
import {RemoveLangParamPipe} from '../../../pipes/remove-lang-param.pipe';
import {AddLangToSlugPipe} from '../../../pipes/add-lang-to-slug.pipe';
import {HeaderCommunicationService} from '../../../services/component-communicators/header-communication.service';

@Component({
  selector: 'app-navbar-footer',
  templateUrl: './navbar-footer.component.html',
  styleUrls: ['./navbar-footer.component.scss']
})
export class NavbarFooterComponent implements OnInit, OnDestroy {

  public footer_menu: MenuItem[];
  private lang: string;
  public paramsSubscription: Subscription;
  private removeLangParamPipe: RemoveLangParamPipe;
  private addLangToSlugPipe: AddLangToSlugPipe;
  private hrefToSlugPipe: HrefToSlugPipe;

  constructor( private menusService: MenusService, private router: Router,
               private notificationBarCommunicationService: NotificationBarCommunicationService,
               private headerCommunicationService: HeaderCommunicationService) {
      this.removeLangParamPipe = new RemoveLangParamPipe();
      this.addLangToSlugPipe = new AddLangToSlugPipe();
      this.hrefToSlugPipe = new HrefToSlugPipe();
  }

    goToPage(item): void {
        let slug = item.url;
        if (slug.substring(slug.length - 9) === '/?lang=en' || slug.substring(slug.length - 9) === '/?lang=sv') {
            slug = this.removeLangParamPipe.transform(slug);
        }
        if (slug.substring(slug.length - 8) === '?lang=en' || slug.substring(slug.length - 8) === '?lang=sv') {
            slug = this.removeLangParamPipe.transform(slug);
        }
        slug = this.addLangToSlugPipe.transform(slug, this.lang);
        this.router.navigate([slug]);
        this.headerCommunicationService.hideMenu();
    }

  ngOnInit() {
      this.paramsSubscription = this.router.events.subscribe(val => {
          if (val instanceof RoutesRecognized) {
              this.lang = val.state.root.firstChild.params['lang'];
              if (typeof this.lang === 'undefined') {
                  this.lang = 'en';
              }else if (this.lang !== 'en' && this.lang !== 'sv') {
                  this.lang = 'en';
              }
              this.menusService.getMenu('footer', this.lang).subscribe(res => {
                      this.footer_menu = res;
                  },
                  (error) => {
                      this.footer_menu = [];
                      this.notificationBarCommunicationService.send_data(error);
                  });
          }
      });
  }

    ngOnDestroy() {
        if (this.paramsSubscription) {
            this.paramsSubscription.unsubscribe();
        }
    }
}
