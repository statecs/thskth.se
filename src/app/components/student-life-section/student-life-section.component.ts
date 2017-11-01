import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-student-life-section',
  templateUrl: './student-life-section.component.html',
  styleUrls: ['./student-life-section.component.scss']
})
export class StudentLifeSectionComponent implements OnInit {

  private lang: string;
  public pageNotFound: boolean;

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
