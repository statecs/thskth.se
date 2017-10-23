import { Component, OnInit } from '@angular/core';
import { WordpressApiService } from '../../services/wordpress/wordpress-api.service';
import {CookieService} from 'ngx-cookie';
import {ActivatedRoute, Router, RoutesRecognized} from '@angular/router';

@Component({
  selector: 'app-notification-bar',
  templateUrl: './notification-bar.component.html',
  styleUrls: ['./notification-bar.component.scss']
})
export class NotificationBarComponent implements OnInit {

  public warning: boolean;
  public notification: object;
  private lang: string;

  constructor(private wordpressApiService: WordpressApiService,
              private router: Router) {
    this.warning = false;
  }

  closeBar(): void {
    this.notification = null;
  }

  getNotification() {
    this.wordpressApiService.getNotification(this.lang).subscribe((res) => {
      this.notification = res;
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
  }

}
