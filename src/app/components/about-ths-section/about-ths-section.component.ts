import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-about-ths-section',
  templateUrl: './about-ths-section.component.html',
  styleUrls: ['./about-ths-section.component.scss']
})
export class AboutThsSectionComponent implements OnInit {

  private lang: string;
  private pageNotFound: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private _cookieService: CookieService) {
    this.activatedRoute.params.subscribe((params: Params) => {
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

}
