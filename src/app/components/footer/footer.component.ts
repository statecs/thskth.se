import {Component, OnDestroy, OnInit} from '@angular/core';
import {WordpressApiService} from '../../services/wordpress/wordpress-api.service';
import {MenuItem} from '../../interfaces/menu';
import { NavbarSectionsComponent } from './navbar-sections/navbar-sections.component';
import { NavbarFooterComponent } from './navbar-footer/navbar-footer.component';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  public lang: string;
  public paramsSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute) {
    this.paramsSubscription = this.activatedRoute.params.subscribe((params: Params) => {
      this.lang = params['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }else if (this.lang !== 'en' && this.lang !== 'sv') {
        this.lang = 'en';
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

}
