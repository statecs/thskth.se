import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-join-us',
  templateUrl: './join-us.component.html',
  styleUrls: ['./join-us.component.scss']
})
export class JoinUsComponent implements OnInit {
  private lang: string;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.parent.params.subscribe((params2: Params) => {
      this.lang = params2['lang'];
      if (typeof this.lang === 'undefined') {
        this.lang = 'en';
      }
    });
  }

  goToPage(slug): void {
    this.router.navigate(['/' + slug]);
  }

  ngOnInit() {
  }

}
