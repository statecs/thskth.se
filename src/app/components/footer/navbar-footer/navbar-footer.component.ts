import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from '../../../interfaces/menu';
import {MenusService} from '../../../services/wordpress/menus.service';
import {Router, RoutesRecognized} from '@angular/router';
import {NotificationBarCommunicationService} from '../../../services/component-communicators/notification-bar-communication.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-navbar-footer',
  templateUrl: './navbar-footer.component.html',
  styleUrls: ['./navbar-footer.component.scss']
})
export class NavbarFooterComponent implements OnInit, OnDestroy {

  public footer_menu: MenuItem[];
  private lang: string;
    public paramsSubscription: Subscription;

  constructor( private menusService: MenusService, private router: Router,
               private notificationBarCommunicationService: NotificationBarCommunicationService) {
  }

  ngOnInit() {
      this.paramsSubscription = this.router.events.subscribe(val => {
          if (val instanceof RoutesRecognized) {
              console.log("test");
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
