import { Component, OnInit } from '@angular/core';
import { ths_chapters } from '../../../utils/ths-chapters';
import {ActivatedRoute, Params, Router, RoutesRecognized} from '@angular/router';

@Component({
  selector: 'app-navbar-sections',
  templateUrl: './navbar-sections.component.html',
  styleUrls: ['./navbar-sections.component.scss']
})
export class NavbarSectionsComponent implements OnInit {
  public ths_chapters: object[];
  public lang: string;

  constructor(private router: Router) {
    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        this.lang = val.state.root.firstChild.params['lang'];
        if (typeof this.lang === 'undefined') {
          this.lang = 'en';
        }
        console.log(this.lang);
      }
    });
    this.ths_chapters = ths_chapters;
  }

  ngOnInit() {
  }

}
