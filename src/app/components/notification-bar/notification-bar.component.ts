import { Component, OnInit } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import {CookieService} from 'ngx-cookie';
import {ActivatedRoute, Router, RoutesRecognized} from '@angular/router';
import {Notification} from '../../interfaces/notification';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {notificationMessages} from '../../utils/notification-messages';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {

  public notification: Notification;
  private lang: string;
  public notificationMessages: object;

  constructor(private wordpressApiService: WordpressApiService,
              private router: Router,
              private notificationBarCommunicationService: NotificationBarCommunicationService) {
    this.notificationMessages = notificationMessages;
  }

  closeBar(): void {
    this.notification = null;
  }

  notifyError(error: any): void {
    let message = '';
    let color = '';
    if (error.status === 400) {
      if (this.lang === 'en') {
        message = this.notificationMessages['error400'].en;
      }else {
        message = this.notificationMessages['error400'].sv;
      }
      color = 'red';
    }else if (error.status === 500) {
      if (this.lang === 'en') {
        message = this.notificationMessages['error500'].en;
      }else {
        message = this.notificationMessages['error500'].sv;
      }
      color = 'red';
    }
    this.notification = {
      message: message,
      bg_color: color
    };
  }

  getNotification() {
    this.wordpressApiService.getNotification(this.lang).subscribe(
        (res) => {
          this.notification = res;
          console.log(this.notification);
        },
        (error) => {
          this.notifyError(error);
        });
  }

  ngOnInit() {
    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.lang = val.state.root.firstChild.params['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }else if (this.lang !== 'en' && this.lang !== 'sv') {
          this.lang = 'en';
        }
        this.getNotification();
      }
    });

    this.notificationBarCommunicationService.notifyObservable$.subscribe((error) => {
      this.notifyError(error);
    });
    this.notificationBarCommunicationService.closeNotifyObservable$.subscribe(() => {
      this.closeBar();
    });
  }

}
