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

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private _cookieService: CookieService) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (this.lang === 'en') {
        console.log('pass: ' + this.lang);
        this.router.navigate(['student-life']);
      }else if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
      this._cookieService.put('language', this.lang);
    });
  }

  ngOnInit() {
  }

}
