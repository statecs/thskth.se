import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {Subscription} from 'rxjs/Subscription';
import {HeaderCommunicationService} from '../../services/component-communicators/header-communication.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss']
})
export class ContactSectionComponent implements OnInit, OnDestroy {

  private lang: string;
  public pageNotFound: boolean;
  public paramsSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private _cookieService: CookieService,
              private headerCommunicationService: HeaderCommunicationService) {
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
    this.headerCommunicationService.tranparentHeader(false);
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }

  }
}
