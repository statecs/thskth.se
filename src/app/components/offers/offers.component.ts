import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit, OnDestroy {

  private lang: string;
  public pageNotFound: boolean;
  public paramsSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private _cookieService: CookieService) {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.pageNotFound = true;
        this.lang = 'en';
      }
      this._cookieService.put('language', this.lang);
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
