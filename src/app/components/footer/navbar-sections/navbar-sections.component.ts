import {Component, OnDestroy, OnInit} from '@angular/core';
import { ths_chapters } from '../../../utils/ths-chapters';
import {ActivatedRoute, Params, Router, RoutesRecognized} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-navbar-sections',
  templateUrl: './navbar-sections.component.html',
  styleUrls: ['./navbar-sections.component.scss']
})
export class NavbarSectionsComponent implements OnInit, OnDestroy {
  public ths_chapters: object[];
  public lang: string;
  public paramsSubscription: Subscription;

  constructor(private router: Router) {
    this.paramsSubscription = this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.lang = val.state.root.firstChild.params['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }else if (this.lang !== 'en' && this.lang !== 'sv') {
          this.lang = 'en';
        }
      }
    });
    this.ths_chapters = ths_chapters;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

}
