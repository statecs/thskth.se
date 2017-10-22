import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  private lang: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private _cookieService: CookieService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (this.lang === 'en') {
        this.router.navigate(['offers']);
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
