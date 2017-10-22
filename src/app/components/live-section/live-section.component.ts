import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-live-section',
  templateUrl: './live-section.component.html',
  styleUrls: ['./live-section.component.scss']
})
export class LiveSectionComponent implements OnInit {

  private lang: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private _cookieService: CookieService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (this.lang === 'en') {
        console.log('pass: ' + this.lang);
        this.router.navigate(['live']);
      }else if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      this._cookieService.put('language', this.lang);
    });
  }

  ngOnInit() {
  }

}
