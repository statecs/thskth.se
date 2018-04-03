import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {Subscription} from 'rxjs/Subscription';
import {Router, RoutesRecognized} from '@angular/router';

@Component({
  selector: 'app-cookie-notification-bar',
  templateUrl: './cookie-notification-bar.component.html',
  styleUrls: ['./cookie-notification-bar.component.scss']
})
export class CookieNotificationBarComponent implements OnInit {
  private lang: string;
  public paramsSubscription: Subscription;
  public en_text: string;
  public sv_text: string;
  public showNotification: boolean;

  constructor(private cookieService: CookieService,
              private router: Router) {
    this.en_text = 'At scb.se, we use cookies (cookies) to make your website work well for you. By browsing further, you agree that we use cookies.';
    this.sv_text = 'På scb.se använder vi kakor (cookies) för att webbplatsen ska fungera på ett bra sätt för dig. Genom att surfa vidare godkänner du att vi använder kakor.';
    //this.showNotification = true;
  }

  closeBar(): void {
    this.showNotification = false;
    this.cookieService.put('turnOffCNB', 'true');
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
        if (this.cookieService.get('turnOffCNB') === 'true') {
          this.showNotification = false;
        }else {
          this.showNotification = true;
        }
      }
    });
  }

}
