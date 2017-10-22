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

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private _cookieService: CookieService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (this.lang === 'en') {
        console.log('pass: ' + this.lang);
        this.router.navigate(['about-ths']);
      }else if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      this._cookieService.put('language', this.lang);
    });
  }

  ngOnInit() {
  }

}
