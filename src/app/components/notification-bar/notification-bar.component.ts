import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import {Router, RoutesRecognized} from '@angular/router';
import {Notification} from '../../interfaces/notification';
import {NotificationBarCommunicationService} from '../../services/component-communicators/notification-bar-communication.service';
import {notificationMessages} from '../../utils/notification-messages';
import {Subscription} from 'rxjs/Subscription';
import {HeaderCommunicationService} from '../../services/component-communicators/header-communication.service';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit, OnDestroy{

  @ViewChild('bar') bar: ElementRef;
  public notification: Notification;
  private lang: string;
  public notificationMessages: object;
  public paramsSubscription: Subscription;
  public notificationSubscription: Subscription;
  public errorSubscription: Subscription;
  public closeBarSubscription: Subscription;

  constructor(private wordpressApiService: WordpressApiService,
              private router: Router,
              private notificationBarCommunicationService: NotificationBarCommunicationService,
              private headerCommunicationService: HeaderCommunicationService) {
    this.notificationMessages = notificationMessages;
  }

  closeBar(): void {
    this.notification = null;
    this.headerCommunicationService.positionHeader(0);
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
    this.notificationSubscription = this.wordpressApiService.getNotification(this.lang).subscribe(
        (res) => {
          console.log(res);
          this.notification = res;
          const self = this;
          setTimeout(function () {
            const barHeight = self.bar.nativeElement.clientHeight;
            console.log(barHeight);
            self.bar.nativeElement.style.top = 0;
            self.headerCommunicationService.positionHeader(barHeight);
          }, 200);
        },
        (error) => {
          this.notifyError(error);
        });
  }

  ngOnInit() {
    this.paramsSubscription = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.lang = val.state.root.firstChild.data['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = val.state.root.firstChild.params['lang'];
          if (typeof this.lang === 'undefined') {
            this.lang = 'en';
          }else if (this.lang !== 'en' && this.lang !== 'sv') {
            this.lang = 'en';
          }
        }
        this.getNotification();
      }
    });

    this.errorSubscription =  this.notificationBarCommunicationService.notifyObservable$.subscribe((error) => {
      this.notifyError(error);
    });
    this.closeBarSubscription = this.notificationBarCommunicationService.closeNotifyObservable$.subscribe(() => {
      this.closeBar();
    });
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.errorSubscription) {
      this.errorSubscription.unsubscribe();
    }
    if (this.closeBarSubscription) {
      this.closeBarSubscription.unsubscribe();
    }
  }
}
