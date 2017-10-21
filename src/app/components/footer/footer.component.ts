import { Component, OnInit } from '@angular/core';
import {WordpressApiService} from '../../services/wordpress/wordpress-api.service';
import {MenuItem} from '../../interfaces/menu';
import { NavbarSectionsComponent } from './navbar-sections/navbar-sections.component';
import { NavbarFooterComponent } from './navbar-footer/navbar-footer.component';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public lang: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
    });
  }

  ngOnInit() {
  }

}
