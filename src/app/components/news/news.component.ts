import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  private lang: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private _cookieService: CookieService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (this.lang === 'en') {
        this.router.navigate(['news']);
      }else if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      console.log(this.lang);
      this._cookieService.put('language', this.lang);
    });
  }

  ngOnInit() {
  }

}
