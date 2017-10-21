import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
  public lang: string;
  constructor(private activatedRoute: ActivatedRoute,
      private router: Router) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      console.log(this.lang);
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
    });
  }

  ngOnInit() {
  }

}
